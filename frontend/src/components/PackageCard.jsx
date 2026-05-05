import { useApp } from '../context/AppContext';
import { fmt, idOf, isPopular, lower } from '../utils';

export default function PackageCard({ pkg, featured = false }) {
  const { addToCart } = useApp();
  const popular = isPopular(pkg);
  return <div className={`card relative p-6 transition hover:-translate-y-1 hover:shadow-2xl ${featured ? 'border-unitel-red shadow-red' : ''}`}>
    {featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-unitel-red px-4 py-1 text-xs font-black text-white">Best Seller</div>}
    <div className="mb-3 flex items-center justify-between">
      <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-500">{lower(pkg.type).toUpperCase()}</span>
      {popular && <span className="text-xs font-extrabold text-unitel-amber">Popular</span>}
    </div>
    <h3 className="font-display text-xl font-extrabold">{pkg.name}</h3>
    <div className="mt-3 font-display text-5xl font-black">{pkg.data}<span className="text-lg font-medium text-slate-400">{pkg.unit}</span></div>
    <p className="mt-1 text-sm text-slate-500">{pkg.days} days validity</p>
    <p className="mt-5 font-display text-3xl font-extrabold text-unitel-red">{fmt(pkg.price)}</p>
    <ul className="my-5 space-y-2 text-sm text-slate-600">
      {(pkg.bestFor || []).map(x => <li key={x}>✓ {x}</li>)}
      <li>✓ {pkg.speed} speed</li>
    </ul>
    <button className="btn btn-red w-full" onClick={() => addToCart({ itemType:'PACKAGE', id:idOf(pkg), name:pkg.name, price:pkg.price })}>Subscribe Now</button>
  </div>;
}
