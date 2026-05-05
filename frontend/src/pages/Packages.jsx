import { useEffect, useState } from 'react';
import { api } from '../api/client';
import PackageCard from '../components/PackageCard';
import { idOf, isPopular } from '../utils';

const tabs = ['all','daily','weekly','monthly','unlimited','social','gaming','tourist'];
export default function Packages() {
  const [type, setType] = useState('all');
  const [packages, setPackages] = useState([]);
  useEffect(() => { api.get('/packages', { params: { type } }).then(r => setPackages(r.data)).catch(()=>setPackages([])); }, [type]);
  return <section className="px-4 py-12"><div className="mx-auto max-w-7xl">
    <p className="mb-2 inline-block rounded-lg bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-unitel-red">Packages</p>
    <h1 className="font-display text-4xl font-black">ແພັກເກດອິນເຕີເນັດ</h1>
    <div className="my-8 flex flex-wrap gap-2">{tabs.map(t => <button key={t} onClick={()=>setType(t)} className={`rounded-xl px-4 py-2 text-sm font-bold ${type===t ? 'bg-white text-unitel-red shadow-soft' : 'bg-slate-100 text-slate-500'}`}>{t.toUpperCase()}</button>)}</div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{packages.map((pkg, i) => <PackageCard pkg={pkg} featured={isPopular(pkg) && i < 2} key={idOf(pkg)}/>)}</div>
  </div></section>;
}
