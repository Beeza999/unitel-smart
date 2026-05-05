import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../src/utils/prisma.js';

async function upsertPackageByName(data) {
  const existing = await prisma.package.findFirst({
    where: {
      name: data.name
    }
  });

  if (existing) {
    return prisma.package.update({
      where: {
        id: existing.id
      },
      data
    });
  }

  return prisma.package.create({
    data
  });
}

async function upsertPromotionByTitle(data) {
  const existing = await prisma.promotion.findFirst({
    where: {
      title: data.title
    }
  });

  if (existing) {
    return prisma.promotion.update({
      where: {
        id: existing.id
      },
      data
    });
  }

  return prisma.promotion.create({
    data
  });
}

async function main() {
  console.log('Seeding database safely...');

  /**
   * ສຳຄັນ:
   * ไฟล์นี้จะไม่ลบข้อมูลจริงแล้ว
   * ห้ามใช้ deleteMany() ใน production/ข้อมูลจริง
   */

  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const userPassword = process.env.SEED_USER_PASSWORD;

  if (!adminPassword || adminPassword.length < 8) {
    throw new Error('SEED_ADMIN_PASSWORD must be set and at least 8 characters long');
  }

  if (!userPassword || userPassword.length < 8) {
    throw new Error('SEED_USER_PASSWORD must be set and at least 8 characters long');
  }

  const adminPass = await bcrypt.hash(adminPassword, 12);
  const userPass = await bcrypt.hash(userPassword, 12);

  const admin = await prisma.user.upsert({
    where: {
      phone: '02000000000'
    },
    update: {
      name: 'Unitel Admin',
      email: 'admin@unitel.la',
      password: adminPass,
      role: 'ADMIN'
    },
    create: {
      name: 'Unitel Admin',
      phone: '02000000000',
      email: 'admin@unitel.la',
      password: adminPass,
      role: 'ADMIN'
    }
  });

  const user = await prisma.user.upsert({
    where: {
      phone: '02055551234'
    },
    update: {
      name: 'Somchai V.',
      email: 'somchai@email.com',
      password: userPass,
      role: 'USER'
    },
    create: {
      name: 'Somchai V.',
      phone: '02055551234',
      email: 'somchai@email.com',
      password: userPass,
      role: 'USER'
    }
  });

  const simNumbers = [
    {
      number: '02088889999',
      type: 'VIP',
      pattern: 'Quad 8 + 9',
      price: 450000,
      oldPrice: 900000,
      desc: 'ເລກ 8 ເສີມໂຊກລາບ',
      status: 'AVAILABLE'
    },
    {
      number: '02055555555',
      type: 'VIP',
      pattern: 'Full repeating',
      price: 1200000,
      oldPrice: 2000000,
      desc: 'ເບີຊ້ຳທັງໝົດ ຫາຍາກ',
      status: 'AVAILABLE'
    },
    {
      number: '02099990000',
      type: 'PREMIUM',
      pattern: 'Full 9 + Zero',
      price: 800000,
      oldPrice: 1200000,
      desc: 'ເລກ 9 ແທນຄວາມສຳເລັດ',
      status: 'AVAILABLE'
    },
    {
      number: '02012345678',
      type: 'EASY',
      pattern: 'Sequential',
      price: 50000,
      oldPrice: 80000,
      desc: 'ຈື່ງ່າຍ ລຽງຕົວເລກ',
      status: 'AVAILABLE'
    },
    {
      number: '02077777777',
      type: 'LUCKY',
      pattern: 'Full 7',
      price: 600000,
      oldPrice: 1000000,
      desc: 'ເລກນຳໂຊກ',
      status: 'AVAILABLE'
    },
    {
      number: '02009900990',
      type: 'LUCKY',
      pattern: 'Mirror',
      price: 180000,
      oldPrice: 300000,
      desc: 'ຮູບແບບກະຈົກ',
      status: 'AVAILABLE'
    },
    {
      number: '02011111111',
      type: 'PREMIUM',
      pattern: 'Full 1',
      price: 1500000,
      oldPrice: 2500000,
      desc: 'ເລກຜູ້ນຳ',
      status: 'RESERVED'
    },
    {
      number: '02066888866',
      type: 'HOT',
      pattern: 'Six Eight Mix',
      price: 280000,
      oldPrice: 450000,
      desc: 'ເບີ hot deal',
      status: 'AVAILABLE'
    }
  ];

  for (const sim of simNumbers) {
    await prisma.simNumber.upsert({
      where: {
        number: sim.number
      },
      update: sim,
      create: sim
    });
  }

  const packageData = [
    {
      name: '5G300',
      type: 'MONTHLY',
      data: '140',
      unit: 'GB',
      days: 30,
      price: 300000,
      speed: '5G',
      bestFor: ['ໃຊ້ເນັດຫຼາຍ', 'ເບິ່ງວິດີໂອ', 'ແຊຮ໌ Hotspot', 'ແພັກເກດລາຍເດືອນ'],
      isPopular: true,
      status: 'ACTIVE'
    },
    {
      name: '3K2',
      type: 'DAILY',
      data: '1',
      unit: 'GB',
      days: 2,
      price: 3000,
      speed: '4G/5G',
      bestFor: ['ໃຊ້ງານພື້ນຖານ', 'ໂຊເຊຍມີເດຍ', 'ປະຢັດງົບ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '5G200',
      type: 'MONTHLY',
      data: '90',
      unit: 'GB',
      days: 30,
      price: 200000,
      speed: '5G',
      bestFor: ['ເບິ່ງວິດີໂອ', 'ໃຊ້ເຮັດວຽກ', 'ແພັກເກດລາຍເດືອນ'],
      isPopular: true,
      status: 'ACTIVE'
    },
    {
      name: '10K3',
      type: 'DAILY',
      data: '4',
      unit: 'GB',
      days: 3,
      price: 10000,
      speed: '4G/5G',
      bestFor: ['ໃຊ້ໄລຍະສັ້ນ', 'ໂຊເຊຍມີເດຍ', 'ເບິ່ງວິດີໂອ'],
      isPopular: true,
      status: 'ACTIVE'
    },
    {
      name: '5G150',
      type: 'MONTHLY',
      data: '60',
      unit: 'GB',
      days: 30,
      price: 150000,
      speed: '5G',
      bestFor: ['ເນັດລາຍເດືອນ', 'ເບິ່ງວິດີໂອ', 'ໂຊເຊຍມີເດຍ'],
      isPopular: true,
      status: 'ACTIVE'
    },
    {
      name: 'CN95',
      type: 'MONTHLY',
      data: '30',
      unit: 'GB',
      days: 30,
      price: 95000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດລາຍເດືອນ', 'ໂຊເຊຍມີເດຍ', 'ໃຊ້ງານທົ່ວໄປ'],
      isPopular: true,
      status: 'ACTIVE'
    },
    {
      name: '150K12M',
      type: 'MONTHLY',
      data: '840',
      unit: 'GB',
      days: 360,
      price: 1440000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 12 ເດືອນ', 'ໃຊ້ເນັດຫຼາຍ', 'ໃຊ້ລະຍະຍາວ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '12MS150',
      type: 'MONTHLY',
      data: '720',
      unit: 'GB',
      days: 360,
      price: 1575000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 12 ເດືອນ', 'ໃຊ້ລະຍະຍາວ', 'ໃຊ້ເນັດຫຼາຍ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '150K6M',
      type: 'MONTHLY',
      data: '420',
      unit: 'GB',
      days: 180,
      price: 765000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 6 ເດືອນ', 'ໃຊ້ເນັດຫຼາຍ', 'ໃຊ້ລະຍະຍາວ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '150K3M',
      type: 'MONTHLY',
      data: '210',
      unit: 'GB',
      days: 90,
      price: 405000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 3 ເດືອນ', 'ໃຊ້ເນັດຫຼາຍ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '120K12M',
      type: 'MONTHLY',
      data: '660',
      unit: 'GB',
      days: 360,
      price: 1152000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 12 ເດືອນ', 'ໃຊ້ລະຍະຍາວ', 'ດາຕ້າຫຼາຍ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '120K6M',
      type: 'MONTHLY',
      data: '330',
      unit: 'GB',
      days: 180,
      price: 612000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 6 ເດືອນ', 'ດາຕ້າຫຼາຍ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '120K3M',
      type: 'MONTHLY',
      data: '165',
      unit: 'GB',
      days: 90,
      price: 324000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 3 ເດືອນ', 'ໃຊ້ງານທົ່ວໄປ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '95K12M',
      type: 'MONTHLY',
      data: '480',
      unit: 'GB',
      days: 360,
      price: 912000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 12 ເດືອນ', 'ໃຊ້ລະຍະຍາວ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '95K6M',
      type: 'MONTHLY',
      data: '240',
      unit: 'GB',
      days: 180,
      price: 484500,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 6 ເດືອນ', 'ໃຊ້ງານທົ່ວໄປ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '95K3M',
      type: 'MONTHLY',
      data: '120',
      unit: 'GB',
      days: 90,
      price: 256500,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 3 ເດືອນ', 'ໃຊ້ງານທົ່ວໄປ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '12MS45',
      type: 'MONTHLY',
      data: '120',
      unit: 'GB',
      days: 360,
      price: 529000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 12 ເດືອນ', 'ແພັກເກດປະຢັດລະຍະຍາວ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '75K12M',
      type: 'MONTHLY',
      data: '360',
      unit: 'GB',
      days: 360,
      price: 720000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 12 ເດືອນ', 'ໃຊ້ລະຍະຍາວ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '75K6M',
      type: 'MONTHLY',
      data: '180',
      unit: 'GB',
      days: 180,
      price: 382500,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 6 ເດືອນ', 'ໃຊ້ງານທົ່ວໄປ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '75K3M',
      type: 'MONTHLY',
      data: '90',
      unit: 'GB',
      days: 90,
      price: 202500,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 3 ເດືອນ', 'ໃຊ້ງານທົ່ວໄປ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '60K12M',
      type: 'MONTHLY',
      data: '240',
      unit: 'GB',
      days: 360,
      price: 576000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 12 ເດືອນ', 'ແພັກເກດປະຢັດລະຍະຍາວ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '60K6M',
      type: 'MONTHLY',
      data: '120',
      unit: 'GB',
      days: 180,
      price: 306000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 6 ເດືອນ', 'ແພັກເກດປະຢັດ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '60K3M',
      type: 'MONTHLY',
      data: '60',
      unit: 'GB',
      days: 90,
      price: 162000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 3 ເດືອນ', 'ແພັກເກດປະຢັດ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '50K12M',
      type: 'MONTHLY',
      data: '180',
      unit: 'GB',
      days: 360,
      price: 480000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 12 ເດືອນ', 'ງົບປະຢັດ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '50K6M',
      type: 'MONTHLY',
      data: '90',
      unit: 'GB',
      days: 180,
      price: 255000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 6 ເດືອນ', 'ງົບປະຢັດ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '50K3M',
      type: 'MONTHLY',
      data: '45',
      unit: 'GB',
      days: 90,
      price: 135000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 3 ເດືອນ', 'ງົບປະຢັດ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '150K',
      type: 'MONTHLY',
      data: '70',
      unit: 'GB',
      days: 30,
      price: 150000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດລາຍເດືອນ', 'ດາຕ້າຫຼາຍ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: 'MS150',
      type: 'MONTHLY',
      data: '60',
      unit: 'GB',
      days: 30,
      price: 150000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດລາຍເດືອນ', 'ໃຊ້ງານທົ່ວໄປ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '120K',
      type: 'MONTHLY',
      data: '55',
      unit: 'GB',
      days: 30,
      price: 120000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດລາຍເດືອນ', 'ໂຊເຊຍມີເດຍ', 'ເບິ່ງວິດີໂອ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '95K',
      type: 'MONTHLY',
      data: '40',
      unit: 'GB',
      days: 30,
      price: 95000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດລາຍເດືອນ', 'ໃຊ້ງານທົ່ວໄປ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '75K',
      type: 'MONTHLY',
      data: '30',
      unit: 'GB',
      days: 30,
      price: 75000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດລາຍເດືອນ', 'ໂຊເຊຍມີເດຍ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '60K',
      type: 'MONTHLY',
      data: '20',
      unit: 'GB',
      days: 30,
      price: 60000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດລາຍເດືອນ', 'ແພັກເກດປະຢັດ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '50K',
      type: 'MONTHLY',
      data: '15',
      unit: 'GB',
      days: 30,
      price: 50000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດລາຍເດືອນ', 'ແພັກເກດປະຢັດ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: 'MS45',
      type: 'MONTHLY',
      data: '10',
      unit: 'GB',
      days: 30,
      price: 45000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດລາຍເດືອນ', 'ງົບປະຢັດ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '40K',
      type: 'WEEKLY',
      data: '15',
      unit: 'GB',
      days: 15,
      price: 40000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 15 ວັນ', 'ໂຊເຊຍມີເດຍ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: 'CN35',
      type: 'WEEKLY',
      data: '10',
      unit: 'GB',
      days: 10,
      price: 35000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 10 ວັນ', 'ໂຊເຊຍມີເດຍ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: 'CN25',
      type: 'WEEKLY',
      data: '7',
      unit: 'GB',
      days: 7,
      price: 25000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດລາຍອາທິດ', 'ແພັກເກດປະຢັດ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '25K',
      type: 'WEEKLY',
      data: '8',
      unit: 'GB',
      days: 10,
      price: 25000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດ 10 ວັນ', 'ແພັກເກດປະຢັດ'],
      isPopular: false,
      status: 'ACTIVE'
    },
    {
      name: '10K7',
      type: 'WEEKLY',
      data: '3',
      unit: 'GB',
      days: 7,
      price: 10000,
      speed: '4G/5G',
      bestFor: ['ແພັກເກດລາຍອາທິດ', 'ງົບປະຢັດ'],
      isPopular: false,
      status: 'ACTIVE'
    }
  ];

  for (const pkg of packageData) {
    await upsertPackageByName(pkg);
  }

  const promotions = [
    {
      title: 'ຫຼຸດ 50% ເບີ VIP',
      discount: '50%',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-05-31'),
      used: 1240,
      status: 'ACTIVE'
    },
    {
      title: 'ສົ່ງ SIM ຟຣີ',
      discount: 'Free Delivery',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-05-20'),
      used: 890,
      status: 'ACTIVE'
    }
  ];

  for (const promotion of promotions) {
    await upsertPromotionByTitle(promotion);
  }

  const existingOrder = await prisma.order.findUnique({
    where: {
      code: '#USC-1045'
    }
  });

  if (!existingOrder) {
    const sim = await prisma.simNumber.findUnique({
      where: {
        number: '02088889999'
      }
    });

    const pkg = await prisma.package.findFirst({
      where: {
        name: '5G300'
      }
    });

    if (sim && pkg) {
      await prisma.order.create({
        data: {
          code: '#USC-1045',
          userId: user.id,
          customerName: user.name,
          customerPhone: user.phone,
          address: 'Vientiane Capital',
          deliveryType: 'HOME_DELIVERY',
          paymentType: 'COD',
          status: 'PENDING',
          totalAmount: sim.price + pkg.price,
          items: {
            create: [
              {
                itemType: 'SIM',
                simId: sim.id,
                name: sim.number,
                price: sim.price
              },
              {
                itemType: 'PACKAGE',
                packageId: pkg.id,
                name: pkg.name,
                price: pkg.price
              }
            ]
          }
        }
      });

      await prisma.simNumber.update({
        where: {
          id: sim.id
        },
        data: {
          status: 'RESERVED'
        }
      });
    }
  }

  console.log('Seed completed safely. No existing data was deleted.');
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });