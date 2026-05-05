import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import { displayPhone, fmt, idOf } from '../utils';

export default function Dashboard() {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/orders/my-orders').then(r => setOrders(r.data)).catch(()=>setOrders([])); }, []);
  const total = orders.reduce((s,o)=>s + Number(o.totalAmount || 0), 0);
  return <section className="px-4 py-12"><div className="mx-auto max-w-7xl"><h1 className="font-display text-4xl font-black">Welcome back, {user?.name || 'Customer'}!</h1><div className="mt-8 grid gap-5 md:grid-cols-3"><div className="card p-6"><p className="text-slate-500">Orders</p><b className="font-display text-4xl">{orders.length}</b></div><div className="card p-6"><p className="text-slate-500">Total Spent</p><b className="font-display text-4xl">{fmt(total)}</b></div><div className="card p-6"><p className="text-slate-500">Account</p><b className="font-display text-4xl">Active</b></div></div><div className="card mt-8 overflow-hidden"><div className="border-b p-6"><h2 className="font-display text-2xl font-black">My Orders</h2></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="p-3">Order</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map(o => <tr className="border-t" key={idOf(o)}><td className="p-3 font-bold text-unitel-red">{o.code}</td><td>{(o.items || []).map(i=>displayPhone(i.name)).join(', ')}</td><td>{fmt(o.totalAmount)}</td><td><span className="tag bg-red-50 text-unitel-red">{o.status}</span></td></tr>)}</tbody></table>{orders.length === 0 && <div className="p-10 text-center text-slate-500">No orders yet.</div>}</div></div></div></section>;
}
