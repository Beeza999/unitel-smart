import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ESIM_PLANS = [
  {
    planId: 'TOURIST_7D',
    name: 'Tourist eSIM 7 Days',
    price: 50000,
    description: 'Laos coverage, instant activation, 7 days'
  },
  {
    planId: 'TOURIST_15D',
    name: 'Tourist eSIM 15 Days',
    price: 90000,
    description: 'Laos coverage, instant activation, 15 days'
  },
  {
    planId: 'TOURIST_30D',
    name: 'Tourist eSIM 30 Days',
    price: 150000,
    description: 'Laos coverage, instant activation, 30 days'
  }
];

export function Esim() {
  const { addToCart, notify } = useApp();
  const navigate = useNavigate();

  const buyPlan = plan => {
    addToCart({
      itemType: 'ESIM',
      planId: plan.planId,
      name: plan.name,
      price: plan.price
    });

    notify(`${plan.name} added to cart`);
    navigate('/cart');
  };

  return (
    <section className="bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl text-center">
        <p className="mb-3 inline-block rounded-lg bg-orange-500/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-unitel-orange">
          eSIM for Tourist
        </p>

        <h1 className="font-display text-5xl font-black">
          Traveling to Laos? Get Connected{' '}
          <span className="text-unitel-orange">Instantly</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-white/60">
          No physical SIM needed. Scan QR Code and start using within minutes.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Step n="1" t="Choose Plan" />
          <Step n="2" t="Pay & Get QR" />
          <Step n="3" t="Scan & Connect" />
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ESIM_PLANS.map(plan => (
            <div
              className="rounded-3xl bg-white p-6 text-left text-slate-900"
              key={plan.planId}
            >
              <b className="font-display text-xl">{plan.name}</b>

              <p className="mt-2 text-slate-500">
                {plan.description}
              </p>

              <p className="mt-4 font-display text-3xl font-black text-unitel-red">
                ₭{plan.price.toLocaleString()}
              </p>

              <button
                type="button"
                className="btn btn-red mt-5 w-full"
                onClick={() => buyPlan(plan)}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Step({ n, t }) {
  return (
    <div className="rounded-3xl bg-white/10 p-6">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/10 font-display text-xl font-black">
        {n}
      </span>
      <b className="mt-3 block">{t}</b>
    </div>
  );
}

export function Support() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-black">Help & FAQ</h1>

        {[
          'How do I reserve a SIM number?',
          'How long does SIM delivery take?',
          'How does AI Package Finder work?',
          'What payment methods are accepted?'
        ].map(q => (
          <details className="mt-4 rounded-2xl border bg-white p-5" key={q}>
            <summary className="cursor-pointer font-bold">{q}</summary>
            <p className="mt-3 text-slate-500">
              This feature is ready to connect with the backend support module.
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Success() {
  const { state } = useLocation();

  return (
    <section className="px-4 py-20 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-unitel-red to-unitel-orange text-4xl text-white">
          ✓
        </div>

        <h1 className="mt-6 font-display text-4xl font-black">
          Order Placed!
        </h1>

        <p className="mt-3 text-slate-500">
          Thank you for your order. We'll process it right away.
        </p>

        <div className="mt-6 rounded-2xl bg-slate-100 p-5 font-display text-2xl font-black text-unitel-red">
          {state?.orderNo || '#USC-000000'}
        </div>
      </div>
    </section>
  );
}