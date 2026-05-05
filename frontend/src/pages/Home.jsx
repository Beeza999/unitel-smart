import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import SimCard from '../components/SimCard';
import PackageCard from '../components/PackageCard';
import { idOf, isPopular } from '../utils';

export default function Home() {
  const navigate = useNavigate();
  const [sims, setSims] = useState([]);
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/sims', { params: { status: 'available' } }).then(r => setSims(r.data.slice(0, 8))).catch(() => setSims([]));
    api.get('/packages').then(r => setPackages(r.data.filter(isPopular).slice(0, 3))).catch(() => setPackages([]));
  }, []);

  const doSearch = () => navigate(`/shop?q=${encodeURIComponent(search)}`);
  return <main>
    <section className="overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_480px]">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-black text-unitel-red">ໃໝ່ - AI Package Finder</div>
          <h1 className="font-display text-5xl font-black leading-tight tracking-tight md:text-7xl">ຄົ້ນຫາ <span className="text-unitel-red">SIM, eSIM</span> ແລະແພັກເກດໄດ້ສະຫຼາດກວ່າ</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">ຄົ້ນຫາເບີສວຍ, ສະໝັກແພັກເກດເນັດ ແລະໃຫ້ AI ແນະນຳແພັກເກດທີ່ເໝາະກັບທ່ານ.</p>
          <div className="mt-9 flex flex-wrap gap-3"><button className="btn btn-red px-7 py-4" onClick={() => navigate('/shop')}>ຄົ້ນຫາເບີ</button><button className="btn btn-ghost px-7 py-4" onClick={() => navigate('/ai-finder')}>ລອງໃຊ້ AI</button></div>
          <div className="mt-10 grid max-w-xl grid-cols-4 gap-4 text-center"><b className="font-display text-2xl">5M+</b><b className="font-display text-2xl">18</b><b className="font-display text-2xl">5G</b><b className="font-display text-2xl">AI</b><span className="text-xs text-slate-500">ລູກຄ້າ</span><span className="text-xs text-slate-500">ແຂວງ</span><span className="text-xs text-slate-500">ເຄືອຂ່າຍ</span><span className="text-xs text-slate-500">ແນະນຳ</span></div>
        </div>
        <div className="relative mx-auto grid h-[420px] w-full max-w-md place-items-center">
          <div className="absolute right-2 top-8 rounded-2xl bg-white p-4 shadow-2xl"><p className="text-xs font-bold text-slate-400">Just Reserved</p><p className="font-display font-black text-unitel-red">020 5555 5555</p></div>
          <div className="h-96 w-52 rounded-[34px] bg-slate-950 p-3 shadow-2xl"><div className="flex h-full flex-col items-center justify-center gap-5 rounded-[26px] bg-gradient-to-br from-unitel-red to-unitel-orange text-white"><b className="font-display tracking-widest">UNITEL</b><b className="font-display text-2xl tracking-widest">020 8888 9999</b><span className="rounded-full bg-white/20 px-4 py-2 text-xs font-black">VIP Premium</span><div className="rounded-2xl bg-black/20 p-4 text-center"><p className="text-xs opacity-70">Current Package</p><b>5G Unlimited</b></div></div></div>
          <div className="absolute bottom-10 left-2 rounded-2xl bg-white p-4 shadow-2xl"><p className="text-sm font-black">AI Recommends</p><p className="text-xs text-slate-500">Social Max 30GB - 94% match</p></div>
        </div>
      </div>
    </section>
    <section className="border-y border-black/10 bg-white px-4 py-5"><div className="mx-auto flex max-w-7xl gap-3"><input className="input" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter' && doSearch()} placeholder="ຄົ້ນຫາເບີ: 888, 999, 456, 020..."/><button className="btn btn-red px-8" onClick={doSearch}>ຄົ້ນຫາ</button></div></section>
    <Section title="ເບີ SIM ຍອດນິຍົມ" tag="Hot Numbers" action={() => navigate('/shop')}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{sims.map(sim => <SimCard sim={sim} key={idOf(sim)}/>)}</div></Section>
    <Section title="ແພັກເກດອິນເຕີເນັດ" tag="Internet" alt action={() => navigate('/packages')}><div className="grid gap-5 md:grid-cols-3">{packages.map((pkg, i) => <PackageCard pkg={pkg} featured={i===1} key={idOf(pkg)}/>)}</div></Section>
  </main>;
}

function Section({ title, tag, action, alt, children }) {
  return <section className={`${alt ? 'bg-slate-100' : 'bg-white'} px-4 py-16`}><div className="mx-auto max-w-7xl"><div className="mb-9 flex items-end justify-between"><div><p className="mb-2 inline-block rounded-lg bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-unitel-red">{tag}</p><h2 className="font-display text-4xl font-black">{title}</h2></div>{action && <button className="btn btn-ghost" onClick={action}>ເບິ່ງທັງໝົດ</button>}</div>{children}</div></section>;
}
