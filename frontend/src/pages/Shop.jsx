import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import SimCard from '../components/SimCard';
import { idOf } from '../utils';

export default function Shop() {
  const [params] = useSearchParams();
  const [sims, setSims] = useState([]);
  const [q, setQ] = useState(params.get('q') || '');
  const [type, setType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [sort, setSort] = useState('popular');

  useEffect(() => {
    api.get('/sims', { params: { q, type, maxPrice, status: 'all' } })
      .then(r => {
        const data = [...r.data];
        if (sort === 'asc') data.sort((a,b)=>a.price-b.price);
        if (sort === 'desc') data.sort((a,b)=>b.price-a.price);
        setSims(data);
      }).catch(() => setSims([]));
  }, [q, type, maxPrice, sort]);

  return <section className="px-4 py-12"><div className="mx-auto max-w-7xl">
    <p className="mb-2 inline-block rounded-lg bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-unitel-red">Shop</p>
    <h1 className="font-display text-4xl font-black">ເລືອກເບີທີ່ເໝາະກັບທ່ານ</h1>
    <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="card h-fit p-5 lg:sticky lg:top-24">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400">ຄົ້ນຫາ</label>
        <input className="input mt-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="888, 999, 020..."/>
        <label className="mt-5 block text-xs font-black uppercase tracking-widest text-slate-400">ປະເພດເບີ</label>
        <select className="input mt-2" value={type} onChange={e=>setType(e.target.value)}><option value="all">All Types</option><option value="vip">VIP</option><option value="lucky">Lucky</option><option value="easy">Easy</option><option value="premium">Premium</option><option value="hot">Hot Deal</option></select>
        <label className="mt-5 block text-xs font-black uppercase tracking-widest text-slate-400">ລາຄາສູງສຸດ: ₭{Number(maxPrice).toLocaleString()}</label>
        <input className="mt-3 w-full accent-unitel-red" type="range" min="0" max="2000000" step="50000" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)}/>
      </aside>
      <div>
        <div className="mb-5 flex items-center justify-between"><p className="text-sm text-slate-500">Showing {sims.length} numbers</p><select className="input max-w-52" value={sort} onChange={e=>setSort(e.target.value)}><option value="popular">Most Popular</option><option value="asc">Price low to high</option><option value="desc">Price high to low</option></select></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{sims.map(sim => <SimCard sim={sim} key={idOf(sim)}/>)}{sims.length === 0 && <div className="card col-span-full p-12 text-center text-slate-500">ບໍ່ພົບເບີ</div>}</div>
      </div>
    </div>
  </div></section>;
}
