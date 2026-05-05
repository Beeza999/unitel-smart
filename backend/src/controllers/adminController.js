import prisma from '../utils/prisma.js';

function mapSimType(v='EASY') { return String(v).toUpperCase(); }
function mapPkgType(v='MONTHLY') { return String(v).toUpperCase(); }
function toStatus(v='ACTIVE') { return String(v).toUpperCase(); }

export async function dashboard(req, res, next) {
  try {
    const [users, sims, packagesCount, orders, promos] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.simNumber.count(),
      prisma.package.count(),
      prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } }),
      prisma.promotion.count()
    ]);
    const revenue = orders.reduce((s, o) => s + o.totalAmount, 0);
    const pending = orders.filter(o => o.status === 'PENDING').length;
    res.json({ stats: { users, sims, packages: packagesCount, orders: orders.length, promos, revenue, pending }, recentOrders: orders.slice(0, 6) });
  } catch (e) { next(e); }
}

export async function listSims(req, res, next) {
  try { res.json(await prisma.simNumber.findMany({ orderBy: { createdAt: 'desc' } })); } catch(e){ next(e); }
}
export async function createSim(req, res, next) {
  try {
    const d = req.body;
    const item = await prisma.simNumber.create({ data: { number: d.number, type: mapSimType(d.type), pattern: d.pattern || '', price: Number(d.price), oldPrice: d.oldPrice ? Number(d.oldPrice) : null, desc: d.desc || '', status: d.status ? toStatus(d.status) : 'AVAILABLE' } });
    res.status(201).json(item);
  } catch(e){ next(e); }
}
export async function updateSim(req, res, next) {
  try {
    const d = req.body;
    const data = {};
    ['number','pattern','desc'].forEach(k => d[k] !== undefined && (data[k] = d[k]));
    if (d.type !== undefined) data.type = mapSimType(d.type);
    if (d.status !== undefined) data.status = toStatus(d.status);
    if (d.price !== undefined) data.price = Number(d.price);
    if (d.oldPrice !== undefined) data.oldPrice = d.oldPrice ? Number(d.oldPrice) : null;
    res.json(await prisma.simNumber.update({ where: { id: req.params.id }, data }));
  } catch(e){ next(e); }
}
export async function deleteSim(req, res, next) {
  try { await prisma.simNumber.delete({ where: { id: req.params.id } }); res.json({ message: 'deleted' }); } catch(e){ next(e); }
}

export async function listPackages(req, res, next) {
  try { res.json(await prisma.package.findMany({ orderBy: { createdAt: 'desc' } })); } catch(e){ next(e); }
}
export async function createPackage(req, res, next) {
  try {
    const d = req.body;
    const item = await prisma.package.create({ data: { name: d.name, type: mapPkgType(d.type), data: String(d.data), unit: d.unit || 'GB', days: Number(d.days || 30), price: Number(d.price), speed: d.speed || '100 Mbps', bestFor: Array.isArray(d.bestFor) ? d.bestFor : String(d.bestFor || '').split(',').map(x=>x.trim()).filter(Boolean), isPopular: Boolean(d.isPopular), status: d.status ? toStatus(d.status) : 'ACTIVE' } });
    res.status(201).json(item);
  } catch(e){ next(e); }
}
export async function updatePackage(req, res, next) {
  try {
    const d = req.body; const data = {};
    ['name','data','unit','speed'].forEach(k => d[k] !== undefined && (data[k] = String(d[k])));
    if (d.type !== undefined) data.type = mapPkgType(d.type);
    if (d.days !== undefined) data.days = Number(d.days);
    if (d.price !== undefined) data.price = Number(d.price);
    if (d.bestFor !== undefined) data.bestFor = Array.isArray(d.bestFor) ? d.bestFor : String(d.bestFor).split(',').map(x=>x.trim()).filter(Boolean);
    if (d.isPopular !== undefined) data.isPopular = Boolean(d.isPopular);
    if (d.status !== undefined) data.status = toStatus(d.status);
    res.json(await prisma.package.update({ where: { id: req.params.id }, data }));
  } catch(e){ next(e); }
}
export async function deletePackage(req, res, next) {
  try { await prisma.package.delete({ where: { id: req.params.id } }); res.json({ message: 'deleted' }); } catch(e){ next(e); }
}

export async function listOrders(req, res, next) {
  try { res.json(await prisma.order.findMany({ include: { user: { select: { id:true, name:true, phone:true, email:true } }, items: true }, orderBy: { createdAt: 'desc' } })); } catch(e){ next(e); }
}
export async function updateOrderStatus(req, res, next) {
  try {
    const status = toStatus(req.body.status || 'PENDING');
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status }, include: { items: true } });
    if (status === 'COMPLETED') {
      for (const item of order.items) if (item.simId) await prisma.simNumber.update({ where: { id: item.simId }, data: { status: 'SOLD' } });
    }
    res.json(order);
  } catch(e){ next(e); }
}

export async function listCustomers(req, res, next) {
  try { res.json(await prisma.user.findMany({ where: { role: 'USER' }, select: { id:true, name:true, phone:true, email:true, createdAt:true, orders:true } })); } catch(e){ next(e); }
}

export async function listPromotions(req, res, next) {
  try { res.json(await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } })); } catch(e){ next(e); }
}
export async function createPromotion(req, res, next) {
  try { const d=req.body; res.status(201).json(await prisma.promotion.create({ data: { title:d.title, discount:d.discount, startDate:new Date(d.startDate), endDate:new Date(d.endDate), used:Number(d.used||0), status:d.status?toStatus(d.status):'ACTIVE' } })); } catch(e){ next(e); }
}
export async function updatePromotion(req, res, next) {
  try { const d=req.body; const data={}; ['title','discount'].forEach(k=>d[k]!==undefined&&(data[k]=d[k])); if(d.startDate)data.startDate=new Date(d.startDate); if(d.endDate)data.endDate=new Date(d.endDate); if(d.used!==undefined)data.used=Number(d.used); if(d.status)data.status=toStatus(d.status); res.json(await prisma.promotion.update({ where:{id:req.params.id}, data })); } catch(e){ next(e); }
}
export async function deletePromotion(req, res, next) {
  try { await prisma.promotion.delete({ where:{id:req.params.id} }); res.json({message:'deleted'}); } catch(e){ next(e); }
}

export async function reports(req, res, next) {
  try {
    const [orders, sims, packagesList] = await Promise.all([prisma.order.findMany(), prisma.simNumber.findMany(), prisma.package.findMany()]);
    res.json({
      revenue: orders.reduce((s,o)=>s+o.totalAmount,0),
      orderCount: orders.length,
      simInventory: {
        total: sims.length,
        available: sims.filter(s=>s.status==='AVAILABLE').length,
        reserved: sims.filter(s=>s.status==='RESERVED').length,
        sold: sims.filter(s=>s.status==='SOLD').length
      },
      activePackages: packagesList.filter(p=>p.status==='ACTIVE').length
    });
  } catch(e){ next(e); }
}
