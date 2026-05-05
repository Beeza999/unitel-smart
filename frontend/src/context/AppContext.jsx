import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client';

const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (!value || value === 'undefined') return fallback;
    return JSON.parse(value);
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => readJson('user', null));
  const [cart, setCart] = useState(() => readJson('cart', []));
  const [toast, setToast] = useState('');

  const notify = message => {
    setToast(message);
    setTimeout(() => setToast(''), 2600);
  };

  const saveCart = next => {
    setCart(next);
    localStorage.setItem('cart', JSON.stringify(next));
  };

  const addToCart = item => {
    const next = [...cart, item];
    saveCart(next);
    notify(`✅ ${item.name} added to cart`);
  };

  const removeCart = index => {
    saveCart(cart.filter((_, i) => i !== index));
  };

  const login = async (phone, password) => {
    const { data } = await api.post('/auth/login', {
      phone,
      password
    });

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    setUser(data.user);
    return data.user;
  };

  const register = async ({ name, phone, email, password }) => {
    const { data } = await api.post('/auth/register', {
      name,
      phone,
      email,
      password
    });

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    cart,
    toast,
    notify,
    addToCart,
    removeCart,
    saveCart,
    login,
    register,
    logout
  }), [user, cart, toast]);

  return (
    <AppContext.Provider value={value}>
      {children}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl">
          {toast}
        </div>
      )}
    </AppContext.Provider>
  );
}