import prisma from '../utils/prisma.js';
import { z } from 'zod';

function orderCode() {
  return '#USC-' + Math.floor(100000 + Math.random() * 900000);
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid id');

// ລາຄາ eSIM ຕ້ອງກຳນົດຢູ່ backend ເທົ່ານັ້ນ
// ห้ามเชื่อ price ที่มาจาก frontend
const ESIM_PLANS = {
  TOURIST_7D: {
    name: 'Tourist eSIM 7 Days',
    price: 50000
  },
  TOURIST_15D: {
    name: 'Tourist eSIM 15 Days',
    price: 90000
  },
  TOURIST_30D: {
    name: 'Tourist eSIM 30 Days',
    price: 150000
  }
};

const orderItemSchema = z.object({
  itemType: z.enum(['SIM', 'PACKAGE', 'ESIM']),
  id: z.string().optional(),
  planId: z.string().optional()
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),

  customerName: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .optional(),

  customerPhone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .optional(),

  address: z
    .string()
    .trim()
    .max(300)
    .optional(),

  deliveryType: z
    .enum(['PICKUP', 'HOME_DELIVERY', 'ESIM_EMAIL'])
    .default('HOME_DELIVERY'),

  paymentType: z
    .enum(['COD', 'BANK_TRANSFER', 'QR_PAYMENT', 'PAY_AT_STORE'])
    .default('COD')
});

export async function createOrder(req, res, next) {
  try {
    const result = createOrderSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: 'ຂໍ້ມູນຄຳສັ່ງຊື້ບໍ່ຖືກຕ້ອງ'
      });
    }

    const {
      items,
      customerName,
      customerPhone,
      address,
      deliveryType,
      paymentType
    } = result.data;

    const order = await prisma.$transaction(async tx => {
      let totalAmount = 0;
      const prepared = [];

      for (const item of items) {
        if (item.itemType === 'SIM') {
          if (!item.id || !objectIdSchema.safeParse(item.id).success) {
            throw httpError(400, 'SIM id ບໍ່ຖືກຕ້ອງ');
          }

          const sim = await tx.simNumber.findUnique({
            where: {
              id: item.id
            }
          });

          if (!sim) {
            throw httpError(404, 'ບໍ່ພົບ SIM');
          }

          if (sim.status !== 'AVAILABLE') {
            throw httpError(400, `SIM ${sim.number} ບໍ່ພ້ອມຂາຍ`);
          }

          // ຈອງ SIM ແບບ atomic
          // ถ้ามีคนอื่นจองไปก่อน count จะไม่เท่ากับ 1
          const reserved = await tx.simNumber.updateMany({
            where: {
              id: sim.id,
              status: 'AVAILABLE'
            },
            data: {
              status: 'RESERVED'
            }
          });

          if (reserved.count !== 1) {
            throw httpError(400, `SIM ${sim.number} ຖືກຈອງແລ້ວ`);
          }

          totalAmount += sim.price;

          prepared.push({
            itemType: 'SIM',
            simId: sim.id,
            name: sim.number,
            price: sim.price
          });
        }

        else if (item.itemType === 'PACKAGE') {
          if (!item.id || !objectIdSchema.safeParse(item.id).success) {
            throw httpError(400, 'Package id ບໍ່ຖືກຕ້ອງ');
          }

          const pkg = await tx.package.findUnique({
            where: {
              id: item.id
            }
          });

          if (!pkg) {
            throw httpError(404, 'ບໍ່ພົບ Package');
          }

          if (pkg.status !== 'ACTIVE') {
            throw httpError(400, `Package ${pkg.name} ບໍ່ພ້ອມຂາຍ`);
          }

          totalAmount += pkg.price;

          prepared.push({
            itemType: 'PACKAGE',
            packageId: pkg.id,
            name: pkg.name,
            price: pkg.price
          });
        }

        else if (item.itemType === 'ESIM') {
          // สำคัญ:
          // frontend ส่งมาได้แค่ planId
          // backend เป็นคนหาราคาเองจาก ESIM_PLANS
          if (!item.planId) {
            throw httpError(400, 'ກະລຸນາເລືອກ eSIM plan');
          }

          const plan = ESIM_PLANS[item.planId];

          if (!plan) {
            throw httpError(400, 'eSIM plan ບໍ່ຖືກຕ້ອງ');
          }

          totalAmount += plan.price;

          prepared.push({
            itemType: 'ESIM',
            name: plan.name,
            price: plan.price
          });
        }

        else {
          throw httpError(400, 'ປະເພດສິນຄ້າບໍ່ຖືກຕ້ອງ');
        }
      }

      if (prepared.length === 0) {
        throw httpError(400, 'ກະຕ່າວ່າງ');
      }

      return tx.order.create({
        data: {
          code: orderCode(),
          userId: req.user.id,
          customerName: customerName || req.user.name,
          customerPhone: customerPhone || req.user.phone,
          address: address || '',
          deliveryType,
          paymentType,
          totalAmount,
          items: {
            create: prepared
          }
        },
        include: {
          items: true
        }
      });
    });

    return res.status(201).json(order);
  } catch (e) {
    next(e);
  }
}

export async function myOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json(orders);
  } catch (e) {
    next(e);
  }
}

export async function getOrder(req, res, next) {
  try {
    const idResult = objectIdSchema.safeParse(req.params.id);

    if (!idResult.success) {
      return res.status(400).json({
        message: 'Order id ບໍ່ຖືກຕ້ອງ'
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        items: true
      }
    });

    if (!order) {
      return res.status(404).json({
        message: 'ບໍ່ພົບຄຳສັ່ງຊື້'
      });
    }

    return res.json(order);
  } catch (e) {
    next(e);
  }
}