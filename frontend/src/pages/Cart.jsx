import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
const fmt = n => '₭' + Number(n || 0).toLocaleString();
const kind = item => String(item.itemType || '').toUpperCase() === 'SIM' ? 'SIM' : 'PKG';

export default function Cart() {
  const { cart, removeCart } = useApp();
  const navigate = useNavigate();
  const total = cart.reduce((s, i) => s + Number(i.price), 0);
  return <section className="px-4 py-12"><div className="mx-auto max-w-7xl"><h1 className="font-display text-4xl font-black">Your Cart</h1>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="card overflow-hidden">{cart.length === 0 ? <div className="p-12 text-center text-slate-500"><p className="text-5xl">🛒</p><p className="mt-3">Your cart is empty</p><button className="btn btn-red mt-6" onClick={()=>navigate('/shop')}>Browse Numbers</button></div> : cart.map((item, i) => <div key={i} className="flex items-center gap-4 border-b border-black/10 p-5 last:border-0"><div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-unitel-red to-unitel-orange text-white">{kind(item)}</div><div className="flex-1"><b>{item.name}</b><p className="text-xs uppercase text-slate-400">{item.itemType}</p></div><b className="font-display text-unitel-red">{fmt(item.price)}</b><button className="text-slate-400 hover:text-unitel-red" onClick={()=>removeCart(i)}>✕</button></div>)}</div>
      <div className="card h-fit p-6"><h2 className="font-display text-xl font-black">Order Summary</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span>Subtotal</span><b>{fmt(total)}</b></div><div className="flex justify-between text-emerald-600"><span>Delivery</span><b>Free</b></div><div className="border-t pt-4 flex justify-between text-lg"><b>Total</b><b className="font-display text-2xl text-unitel-red">{fmt(total)}</b></div></div><button className="btn btn-red mt-6 w-full py-3" disabled={!cart.length} onClick={()=>navigate('/checkout')}>Proceed to Checkout</button><button className="btn btn-ghost mt-2 w-full" onClick={()=>navigate('/shop')}>Continue Shopping</button></div>
    </div>
  </div></section>;
}
