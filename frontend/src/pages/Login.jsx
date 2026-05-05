import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { isAdminRole } from '../utils';

export default function Login() {
  const { login, notify } = useApp();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const submit = async e => {
    e.preventDefault();

    try {
      const u = await login(phone.trim(), password);
      notify('Logged in');
      navigate(isAdminRole(u.role) ? '/admin' : '/dashboard');
    } catch (err) {
      notify(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="px-4 py-16">
      <form onSubmit={submit} className="card mx-auto max-w-md p-8">
        <div className="mb-7 flex justify-center gap-2 font-display text-xl font-black text-unitel-red">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-unitel-red text-white">
            U
          </span>
          Unitel Smart Connect
        </div>

        <label className="text-sm font-bold">Phone Number</label>
        <input
          className="input mt-2"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="02099990001"
        />

        <label className="mt-4 block text-sm font-bold">Password</label>
        <input
          className="input mt-2"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button className="btn btn-red mt-6 w-full py-3">
          Login
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-unitel-red">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
}