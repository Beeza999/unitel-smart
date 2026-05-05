import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { displayPhone, fmt, idOf, lower } from '../utils';

const tabs = [
  ['dashboard','ພາບລວມ'], ['sims','SIM'], ['packages','Packages'], ['orders','Orders'], ['customers','Customers'], ['promotions','Promotions'], ['reports','Reports']
];
const emptySim = { number:'', type:'VIP', pattern:'', price:0, oldPrice:'', desc:'', status:'AVAILABLE' };
const emptyPkg = { name:'', type:'MONTHLY', data:'10', unit:'GB', days:30, price:0, speed:'100 Mbps', bestFor:'Social media, YouTube', isPopular:false, status:'ACTIVE' };
const emptyPromo = { title:'', discount:'10%', startDate:'2026-05-01', endDate:'2026-05-31', used:0, status:'ACTIVE' };

export default function Admin() {
  const [tab, setTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [sims, setSims] = useState([]);
  const [packages, setPackages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [promos, setPromos] = useState([]);
  const [reports, setReports] = useState(null);
  const [simForm, setSimForm] = useState(emptySim);
  const [pkgForm, setPkgForm] = useState(emptyPkg);
  const [promoForm, setPromoForm] = useState(emptyPromo);
  const [editing, setEditing] = useState(null);

  const loadAll = async () => {
    const [d,s,p,o,c,pr,r] = await Promise.all([
      api.get('/admin/dashboard'), api.get('/admin/sims'), api.get('/admin/packages'), api.get('/admin/orders'), api.get('/admin/customers'), api.get('/admin/promotions'), api.get('/admin/reports')
    ]);
    setDashboard(d.data); setSims(s.data); setPackages(p.data); setOrders(o.data); setCustomers(c.data); setPromos(pr.data); setReports(r.data);
  };
  useEffect(() => { loadAll().catch(()=>{}); }, []);

  const saveSim = async e => {
    e.preventDefault();
    const body = { ...simForm, price:Number(simForm.price), oldPrice: simForm.oldPrice ? Number(simForm.oldPrice) : null };
    if (editing?.type === 'sim') await api.put(`/admin/sims/${editing.id}`, body); else await api.post('/admin/sims', body);
    setSimForm(emptySim); setEditing(null); const { data } = await api.get('/admin/sims'); setSims(data);
  };
  const editSim = sim => { setEditing({ type:'sim', id:idOf(sim) }); setSimForm({ ...emptySim, ...sim, type:String(sim.type).toUpperCase(), status:String(sim.status).toUpperCase(), oldPrice: sim.oldPrice || '' }); setTab('sims'); };
  const deleteSim = async id => { if (!confirm('Delete SIM?')) return; await api.delete(`/admin/sims/${id}`); setSims(sims.filter(x=>idOf(x)!==id)); };

  const savePkg = async e => {
    e.preventDefault();
    const body = { ...pkgForm, days:Number(pkgForm.days), price:Number(pkgForm.price), bestFor: String(pkgForm.bestFor).split(',').map(x=>x.trim()).filter(Boolean) };
    if (editing?.type === 'pkg') await api.put(`/admin/packages/${editing.id}`, body); else await api.post('/admin/packages', body);
    setPkgForm(emptyPkg); setEditing(null); const { data } = await api.get('/admin/packages'); setPackages(data);
  };
  const editPkg = p => { setEditing({ type:'pkg', id:idOf(p) }); setPkgForm({ ...emptyPkg, ...p, type:String(p.type).toUpperCase(), status:String(p.status).toUpperCase(), bestFor:(p.bestFor||[]).join(', '), isPopular:Boolean(p.isPopular) }); setTab('packages'); };
  const deletePkg = async id => { if (!confirm('Delete Package?')) return; await api.delete(`/admin/packages/${id}`); setPackages(packages.filter(x=>idOf(x)!==id)); };

  const changeOrder = async (id, status) => { await api.put(`/admin/orders/${id}/status`, { status }); const { data } = await api.get('/admin/orders'); setOrders(data); };

  const savePromo = async e => {
    e.preventDefault();
    const body = { ...promoForm, used:Number(promoForm.used) };
    if (editing?.type === 'promo') await api.put(`/admin/promotions/${editing.id}`, body); else await api.post('/admin/promotions', body);
    setPromoForm(emptyPromo); setEditing(null); const { data } = await api.get('/admin/promotions'); setPromos(data);
  };
  const editPromo = p => { setEditing({ type:'promo', id:idOf(p) }); setPromoForm({ ...emptyPromo, ...p, startDate:String(p.startDate).slice(0,10), endDate:String(p.endDate).slice(0,10), status:String(p.status).toUpperCase() }); setTab('promotions'); };
  const deletePromo = async id => { if (!confirm('Delete Promotion?')) return; await api.delete(`/admin/promotions/${id}`); setPromos(promos.filter(x=>idOf(x)!==id)); };

  return <section className="min-h-[calc(100vh-64px)] bg-slate-100"><div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[240px_1fr]">
    <aside className="card h-fit p-4 lg:sticky lg:top-24"><div className="mb-4 px-2 font-display text-xl font-black text-unitel-red">Admin Panel</div>{tabs.map(([k,l]) => <button key={k} onClick={()=>setTab(k)} className={`mb-1 w-full rounded-xl px-4 py-3 text-left text-sm font-bold ${tab===k?'bg-red-50 text-unitel-red':'text-slate-600 hover:bg-white'}`}>{l}</button>)}</aside>
    <main>{tab === 'dashboard' && <DashboardView dashboard={dashboard} orders={orders} packages={packages}/>} {tab === 'sims' && <SimsView sims={sims} form={simForm} setForm={setSimForm} save={saveSim} edit={editSim} del={deleteSim} editing={editing}/>} {tab === 'packages' && <PackagesView packages={packages} form={pkgForm} setForm={setPkgForm} save={savePkg} edit={editPkg} del={deletePkg} editing={editing}/>} {tab === 'orders' && <OrdersView orders={orders} changeOrder={changeOrder}/>} {tab === 'customers' && <CustomersView customers={customers}/>} {tab === 'promotions' && <PromosView promos={promos} form={promoForm} setForm={setPromoForm} save={savePromo} edit={editPromo} del={deletePromo} editing={editing}/>} {tab === 'reports' && <ReportsView reports={reports}/>}</main>
  </div></section>;
}

function DashboardView({ dashboard, orders, packages: pkgs }) {
  const st = dashboard?.stats || {};
  return <><h1 className="font-display text-4xl font-black">ພາບລວມລະບົບ</h1><div className="mt-7 grid gap-4 md:grid-cols-4"><Tile label="Revenue" value={fmt(st.revenue || 0)}/><Tile label="Pending Orders" value={st.pending || 0}/><Tile label="Customers" value={st.users || 0}/><Tile label="Packages" value={st.packages || pkgs.length}/></div><div className="card mt-8 overflow-hidden"><div className="border-b p-5"><h2 className="font-display text-xl font-black">Recent Orders</h2></div><OrderTable orders={orders.slice(0,6)} /></div></>;
}
function Tile({ label, value }) { return <div className="card p-5"><p className="text-sm text-slate-500">{label}</p><b className="font-display text-3xl font-black">{value}</b></div> }

function SimsView({ sims, form, setForm, save, edit, del, editing }) {
  return <><div className="flex items-center justify-between"><h1 className="font-display text-4xl font-black">ຈັດການເບີ SIM</h1></div><form onSubmit={save} className="card mt-6 grid gap-3 p-5 md:grid-cols-6"><input className="input md:col-span-2" placeholder="02088889999" value={form.number} onChange={e=>setForm({...form,number:e.target.value})} required/><select className="input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{['VIP','LUCKY','EASY','PREMIUM','HOT'].map(x=><option key={x}>{x}</option>)}</select><input className="input" placeholder="Pattern" value={form.pattern} onChange={e=>setForm({...form,pattern:e.target.value})}/><input className="input" type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/><select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{['AVAILABLE','RESERVED','SOLD'].map(x=><option key={x}>{x}</option>)}</select><input className="input md:col-span-3" placeholder="Description" value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})}/><input className="input" type="number" placeholder="Old price" value={form.oldPrice} onChange={e=>setForm({...form,oldPrice:e.target.value})}/><button className="btn btn-red md:col-span-2">{editing?.type==='sim'?'Update SIM':'Add SIM'}</button></form><div className="card mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="p-3">Number</th><th>Type</th><th>Price</th><th>Status</th><th>Action</th></tr></thead><tbody>{sims.map(s => <tr className="border-t" key={idOf(s)}><td className="p-3 font-bold">{displayPhone(s.number)}</td><td>{s.type}</td><td>{fmt(s.price)}</td><td><span className="tag bg-red-50 text-unitel-red">{s.status}</span></td><td><button className="text-unitel-red font-bold" onClick={()=>edit(s)}>Edit</button><button className="ml-3 text-slate-400 font-bold" onClick={()=>del(idOf(s))}>Delete</button></td></tr>)}</tbody></table></div></>;
}

function PackagesView({ packages, form, setForm, save, edit, del, editing }) {
  return <><h1 className="font-display text-4xl font-black">ຈັດການແພັກເກດ</h1><form onSubmit={save} className="card mt-6 grid gap-3 p-5 md:grid-cols-6"><input className="input md:col-span-2" placeholder="Package name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><select className="input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{['DAILY','WEEKLY','MONTHLY','UNLIMITED','SOCIAL','GAMING','TOURIST'].map(x=><option key={x}>{x}</option>)}</select><input className="input" placeholder="Data" value={form.data} onChange={e=>setForm({...form,data:e.target.value})}/><input className="input" type="number" placeholder="Days" value={form.days} onChange={e=>setForm({...form,days:e.target.value})}/><input className="input" type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/><input className="input" placeholder="Speed" value={form.speed} onChange={e=>setForm({...form,speed:e.target.value})}/><input className="input md:col-span-3" placeholder="Best for comma separated" value={form.bestFor} onChange={e=>setForm({...form,bestFor:e.target.value})}/><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.isPopular} onChange={e=>setForm({...form,isPopular:e.target.checked})}/> Popular</label><select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{['ACTIVE','INACTIVE'].map(x=><option key={x}>{x}</option>)}</select><button className="btn btn-red md:col-span-2">{editing?.type==='pkg'?'Update Package':'Add Package'}</button></form><div className="card mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="p-3">Name</th><th>Type</th><th>Data</th><th>Price</th><th>Status</th><th>Action</th></tr></thead><tbody>{packages.map(p => <tr className="border-t" key={idOf(p)}><td className="p-3 font-bold">{p.name}</td><td>{lower(p.type)}</td><td>{p.data}{p.unit}</td><td>{fmt(p.price)}</td><td>{p.status}</td><td><button className="text-unitel-red font-bold" onClick={()=>edit(p)}>Edit</button><button className="ml-3 text-slate-400 font-bold" onClick={()=>del(idOf(p))}>Delete</button></td></tr>)}</tbody></table></div></>;
}

function OrdersView({ orders, changeOrder }) { return <><h1 className="font-display text-4xl font-black">ຈັດການຄຳສັ່ງຊື້</h1><div className="card mt-6 overflow-hidden"><OrderTable orders={orders} changeOrder={changeOrder}/></div></>; }
function OrderTable({ orders, changeOrder }) { return <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="p-3">Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map(o => <tr className="border-t" key={idOf(o)}><td className="p-3 font-bold text-unitel-red">{o.code}</td><td>{o.customerName || o.user?.name}</td><td>{(o.items||[]).map(i=>displayPhone(i.name)).join(', ')}</td><td>{fmt(o.totalAmount)}</td><td>{changeOrder ? <select className="input max-w-44" value={o.status} onChange={e=>changeOrder(idOf(o), e.target.value)}>{['PENDING','PROCESSING','COMPLETED','CANCELLED'].map(x=><option key={x}>{x}</option>)}</select> : o.status}</td></tr>)}</tbody></table>{orders.length === 0 && <div className="p-10 text-center text-slate-500">No orders.</div>}</div>; }

function CustomersView({ customers }) { return <><h1 className="font-display text-4xl font-black">ຈັດການລູກຄ້າ</h1><div className="card mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="p-3">Name</th><th>Phone</th><th>Email</th><th>Orders</th></tr></thead><tbody>{customers.map(c => <tr className="border-t" key={idOf(c)}><td className="p-3 font-bold">{c.name}</td><td>{c.phone}</td><td>{c.email}</td><td>{c.orders?.length || 0}</td></tr>)}</tbody></table></div></>; }

function PromosView({ promos, form, setForm, save, edit, del, editing }) { return <><h1 className="font-display text-4xl font-black">ຈັດການໂປຣໂມຊັນ</h1><form onSubmit={save} className="card mt-6 grid gap-3 p-5 md:grid-cols-6"><input className="input md:col-span-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/><input className="input" placeholder="Discount" value={form.discount} onChange={e=>setForm({...form,discount:e.target.value})}/><input className="input" type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}/><input className="input" type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})}/><select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{['ACTIVE','INACTIVE'].map(x=><option key={x}>{x}</option>)}</select><input className="input" type="number" placeholder="Used" value={form.used} onChange={e=>setForm({...form,used:e.target.value})}/><button className="btn btn-red md:col-span-2">{editing?.type==='promo'?'Update Promotion':'Add Promotion'}</button></form><div className="card mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="p-3">Title</th><th>Discount</th><th>Used</th><th>Status</th><th>Action</th></tr></thead><tbody>{promos.map(p => <tr className="border-t" key={idOf(p)}><td className="p-3 font-bold">{p.title}</td><td>{p.discount}</td><td>{p.used}</td><td>{p.status}</td><td><button className="text-unitel-red font-bold" onClick={()=>edit(p)}>Edit</button><button className="ml-3 text-slate-400 font-bold" onClick={()=>del(idOf(p))}>Delete</button></td></tr>)}</tbody></table></div></>; }

function ReportsView({ reports }) { return <><h1 className="font-display text-4xl font-black">ລາຍງານ</h1><div className="mt-7 grid gap-4 md:grid-cols-4"><Tile label="Revenue" value={fmt(reports?.revenue || 0)}/><Tile label="Orders" value={reports?.orderCount || 0}/><Tile label="Available SIMs" value={reports?.simInventory?.available || 0}/><Tile label="Active Packages" value={reports?.activePackages || 0}/></div></>; }
