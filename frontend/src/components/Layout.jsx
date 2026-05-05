import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isAdminRole } from '../utils';

export default function Layout() {
  const { cart, user, logout } = useApp();
  const navigate = useNavigate();
  return <>
    <nav className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 font-display text-lg font-extrabold text-unitel-red">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-unitel-red text-white">U</span>
          Unitel Smart Connect
        </button>
        <div className="hidden flex-1 items-center gap-1 md:flex">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/shop" className="nav-link">SIM Numbers</NavLink>
          <NavLink to="/packages" className="nav-link">Packages</NavLink>
          <NavLink to="/ai-finder" className="nav-link">✦ AI Finder</NavLink>
          <NavLink to="/esim" className="nav-link">eSIM Tourist</NavLink>
          <NavLink to="/support" className="nav-link">Support</NavLink>
        </div>
        <button onClick={() => navigate('/cart')} className="relative grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-slate-100">
          <ShoppingCart size={18}/>{cart.length > 0 && <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-unitel-red text-[10px] font-black text-white">{cart.length}</span>}
        </button>
        {user ? <>
          <button className="btn btn-ghost" onClick={() => navigate(isAdminRole(user.role) ? '/admin' : '/dashboard')}>{isAdminRole(user.role) ? 'Admin' : 'Account'}</button>
          <button className="btn btn-red" onClick={logout}>Logout</button>
        </> : <button className="btn btn-red" onClick={() => navigate('/login')}>Login</button>}
      </div>
    </nav>
    <Outlet />
  </>;
}
