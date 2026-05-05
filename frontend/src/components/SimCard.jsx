import { useApp } from '../context/AppContext';
import { displayPhone, fmt, idOf, lower, simDesc } from '../utils';

const tagMap = { vip:'VIP', lucky:'Lucky', easy:'Easy', premium:'Premium', hot:'Hot Deal' };
const tagColor = { vip:'bg-red-50 text-unitel-red', lucky:'bg-amber-50 text-amber-700', easy:'bg-emerald-50 text-emerald-700', premium:'bg-purple-50 text-purple-700', hot:'bg-orange-50 text-orange-700' };

export default function SimCard({ sim }) {
  const { addToCart, notify } = useApp();
  const type = lower(sim.type);
  const status = lower(sim.status);
  const add = () => {
    if (status !== 'available') return notify('ເບີນີ້ບໍ່ພ້ອມຂາຍ');
    addToCart({ itemType: 'SIM', id: idOf(sim), name: displayPhone(sim.number), price: sim.price });
  };
  return <div className="card group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-2xl">
    <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-unitel-red to-unitel-orange transition group-hover:scale-x-100" />
    <div className="flex items-start justify-between gap-3">
      <span className={`tag ${tagColor[type] || 'bg-slate-100 text-slate-600'}`}>{tagMap[type] || sim.type}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${status === 'available' ? 'bg-emerald-50 text-emerald-700' : status === 'reserved' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{status || 'available'}</span>
    </div>
    <h3 className="mt-3 font-display text-2xl font-extrabold tracking-widest">{displayPhone(sim.number)}</h3>
    <p className="mt-1 text-sm text-slate-500">{sim.pattern}</p>
    <div className="mt-4">
      {sim.oldPrice > sim.price && <p className="text-xs text-slate-400 line-through">{fmt(sim.oldPrice)}</p>}
      <p className="font-display text-2xl font-extrabold text-unitel-red">{fmt(sim.price)}</p>
    </div>
    <p className="mt-3 min-h-10 text-sm text-slate-500">{simDesc(sim)}</p>
    <div className="mt-4 grid grid-cols-2 gap-2">
      <button className="btn btn-ghost" onClick={() => notify(simDesc(sim) || 'SIM details')}>ລາຍລະອຽດ</button>
      <button className="btn btn-red" onClick={add}>ຈອງເບີ</button>
    </div>
  </div>;
}
