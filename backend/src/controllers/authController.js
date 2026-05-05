import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import { signToken } from '../utils/jwt.js';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  email: z
    .preprocess(
      value => {
        if (typeof value !== 'string') return undefined;
        const trimmed = value.trim();
        return trimmed === '' ? undefined : trimmed;
      },
      z.string().email().max(120).optional()
    ),
  password: z.string().min(8).max(128)
});

const loginSchema = z.object({
  phone: z.string().trim().min(8).max(20),
  password: z.string().min(1).max(128)
});

export async function register(req, res, next) {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: 'ຂໍ້ມູນລົງທະບຽນບໍ່ຖືກຕ້ອງ'
      });
    }

    const { name, phone, email, password } = result.data;
    const cleanEmail = email || null;

    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          ...(cleanEmail ? [{ email: cleanEmail }] : [])
        ]
      }
    });

    if (exists) {
      return res.status(409).json({
        message: 'ເບີໂທ ຫຼື email ນີ້ຖືກໃຊ້ແລ້ວ'
      });
    }

    const hash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email: cleanEmail,
        password: hash,
        role: 'USER'
      }
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: publicUser(user)
    });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: 'ເບີໂທ ຫຼື password ບໍ່ຖືກຕ້ອງ'
      });
    }

    const { phone, password } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        phone
      }
    });

    if (!user) {
      return res.status(401).json({
        message: 'ເບີໂທ ຫຼື password ບໍ່ຖືກຕ້ອງ'
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({
        message: 'ເບີໂທ ຫຼື password ບໍ່ຖືກຕ້ອງ'
      });
    }

    const token = signToken(user);

    res.json({
      token,
      user: publicUser(user)
    });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res) {
  res.json({
    user: req.user
  });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role
  };
}