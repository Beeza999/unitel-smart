import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Register() {
  const { register, notify } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submit = async e => {
    e.preventDefault();

    if (!form.name.trim()) {
      notify('ກະລຸນາປ້ອນຊື່');
      return;
    }

    if (!form.phone.trim()) {
      notify('ກະລຸນາປ້ອນເບີໂທ');
      return;
    }

    if (form.phone.trim().length < 8 || form.phone.trim().length > 20) {
      notify('ເບີໂທຕ້ອງມີ 8-20 ຕົວອັກສອນ');
      return;
    }

    if (form.email.trim() && !form.email.includes('@')) {
      notify('Email ບໍ່ຖືກຕ້ອງ');
      return;
    }

    if (form.password.length < 8) {
      notify('Password ຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ');
      return;
    }

    if (form.password.length > 128) {
      notify('Password ຍາວເກີນໄປ');
      return;
    }

    if (form.password !== form.confirmPassword) {
      notify('Password ບໍ່ກົງກັນ');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        password: form.password
      };

      if (form.email.trim()) {
        payload.email = form.email.trim();
      }

      await register(payload);

      notify('ລົງທະບຽນສຳເລັດ');
      navigate('/dashboard');
    } catch (err) {
      notify(err?.response?.data?.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-12">
      <form onSubmit={submit} className="card mx-auto max-w-md p-8">
        <div className="mb-7 flex justify-center gap-2 font-display text-xl font-black text-unitel-red">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-unitel-red text-white">
            U
          </span>
          Create Account
        </div>

        <label className="text-sm font-bold">Full Name</label>
        <input
          className="input mt-2"
          value={form.name}
          onChange={e => updateField('name', e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />

        <label className="mt-4 block text-sm font-bold">Phone Number</label>
        <input
          className="input mt-2"
          value={form.phone}
          onChange={e => updateField('phone', e.target.value)}
          placeholder="02099990001"
          autoComplete="tel"
        />

        <label className="mt-4 block text-sm font-bold">Email optional</label>
        <input
          className="input mt-2"
          type="email"
          value={form.email}
          onChange={e => updateField('email', e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <label className="mt-4 block text-sm font-bold">Password</label>
        <input
          className="input mt-2"
          type="password"
          value={form.password}
          onChange={e => updateField('password', e.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />

        <label className="mt-4 block text-sm font-bold">Confirm Password</label>
        <input
          className="input mt-2"
          type="password"
          value={form.confirmPassword}
          onChange={e => updateField('confirmPassword', e.target.value)}
          placeholder="Confirm password"
          autoComplete="new-password"
        />

        <button
          className="btn btn-red mt-6 w-full py-3 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-unitel-red">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}