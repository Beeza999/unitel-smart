import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'ກະລຸນາເຂົ້າລະບົບ' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ message: 'ບໍ່ພົບຜູ້ໃຊ້' });

    req.user = { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token ບໍ່ຖືກຕ້ອງ' });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'Admin ເທົ່ານັ້ນ' });
  next();
}
