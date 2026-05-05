import prisma from '../utils/prisma.js';

const simTypeMap = { vip:'VIP', lucky:'LUCKY', easy:'EASY', premium:'PREMIUM', hot:'HOT' };
const pkgTypeMap = { daily:'DAILY', weekly:'WEEKLY', monthly:'MONTHLY', unlimited:'UNLIMITED', social:'SOCIAL', gaming:'GAMING', tourist:'TOURIST' };

export async function getSims(req, res, next) {
  try {
    const { q, type, status, maxPrice } = req.query;
    const where = {};
    if (q) where.number = { contains: String(q).replace(/\s/g, '') };
    if (type && type !== 'all') where.type = simTypeMap[String(type).toLowerCase()] || String(type).toUpperCase();
    if (status && status !== 'all') where.status = String(status).toUpperCase();
    if (maxPrice) where.price = { lte: Number(maxPrice) };
    const sims = await prisma.simNumber.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(sims);
  } catch (e) { next(e); }
}

export async function getSim(req, res, next) {
  try {
    const sim = await prisma.simNumber.findUnique({ where: { id: req.params.id } });
    if (!sim) return res.status(404).json({ message: 'ບໍ່ພົບເບີ SIM' });
    res.json(sim);
  } catch (e) { next(e); }
}

export async function getPackages(req, res, next) {
  try {
    const { type } = req.query;
    const where = { status: 'ACTIVE' };
    if (type && type !== 'all') where.type = pkgTypeMap[String(type).toLowerCase()] || String(type).toUpperCase();
    const packages = await prisma.package.findMany({ where, orderBy: [{ isPopular: 'desc' }, { price: 'asc' }] });
    res.json(packages);
  } catch (e) { next(e); }
}

export async function getPackage(req, res, next) {
  try {
    const item = await prisma.package.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ message: 'ບໍ່ພົບແພັກເກດ' });
    res.json(item);
  } catch (e) { next(e); }
}

export async function getPromotions(req, res, next) {
  try {
    const promos = await prisma.promotion.findMany({ where: { status: 'ACTIVE' }, orderBy: { createdAt: 'desc' } });
    res.json(promos);
  } catch (e) { next(e); }
}
