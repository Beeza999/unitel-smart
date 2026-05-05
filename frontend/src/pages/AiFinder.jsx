import { useEffect, useState } from 'react';
import { api } from '../api/client';
import PackageCard from '../components/PackageCard';
import { idOf, isPopular, lower } from '../utils';

const questions = [
  { q:'ທ່ານໃຊ້ອິນເຕີເນັດເຮັດຫຍັງ?', choices:['Social Media','Video Streaming','Gaming','Work & Meeting','Travel'] },
  { q:'ປະລິມານການໃຊ້ງານ?', choices:['Light','Normal','Heavy','Unlimited'] },
  { q:'ງົບປະມານຂອງທ່ານ?', choices:['Save Money','Balanced','Best Performance'] },
  { q:'ຕ້ອງການໃຊ້ຈັກມື້?', choices:['1 Day','7 Days','30 Days'] }
];

export default function AiFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [packages, setPackages] = useState([]);
  useEffect(() => { api.get('/packages').then(r => setPackages(r.data)).catch(()=>setPackages([])); }, []);
  const done = answers.length === questions.length;
  const score = pkg => {
    const type = lower(pkg.type);
    let s = 45;
    if (answers[0] === 'Social Media' && type === 'social') s += 25;
    if (answers[0] === 'Gaming' && type === 'gaming') s += 30;
    if (answers[1] === 'Unlimited' && type === 'unlimited') s += 35;
    if (answers[1] === 'Heavy' && (pkg.data === '∞' || Number(pkg.data) >= 30)) s += 25;
    if (answers[2] === 'Save Money' && pkg.price <= 50000) s += 25;
    if (answers[2] === 'Balanced' && pkg.price <= 100000) s += 15;
    if (answers[3] === '1 Day' && type === 'daily') s += 25;
    if (answers[3] === '7 Days' && type === 'weekly') s += 25;
    if (answers[3] === '30 Days' && pkg.days === 30) s += 20;
    if (isPopular(pkg)) s += 8;
    return Math.min(99, s);
  };
  const results = [...packages].map(p => ({...p, score:score(p)})).sort((a,b)=>b.score-a.score).slice(0,3);
  const choose = choice => { const next = [...answers]; next[step] = choice; setAnswers(next); if (step < questions.length - 1) setStep(step + 1); };
  return <section className="px-4 py-14"><div className="mx-auto max-w-4xl text-center"><p className="mb-2 inline-block rounded-lg bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-unitel-red">AI-Powered</p><h1 className="font-display text-4xl font-black">AI Package Finder</h1><p className="mt-3 text-slate-500">ຕອບ 4 ຄຳຖາມ ແລ້ວ AI ຈະແນະນຳແພັກເກດທີ່ເໝາະກັບທ່ານ</p>
    {!done ? <div className="card mx-auto mt-10 max-w-2xl p-8 text-left"><div className="mb-8 flex gap-2">{questions.map((_, i)=><div key={i} className={`h-2 flex-1 rounded-full ${i<=step?'bg-unitel-red':'bg-slate-200'}`}/>)}</div><h2 className="font-display text-2xl font-black">{questions[step].q}</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{questions[step].choices.map(c => <button key={c} className="rounded-2xl border-2 border-transparent bg-slate-100 p-5 text-left font-bold hover:border-unitel-red hover:bg-white" onClick={()=>choose(c)}>{c}</button>)}</div>{step > 0 && <button className="btn btn-ghost mt-6" onClick={()=>setStep(step-1)}>Back</button>}</div> : <div className="mt-10"><h2 className="font-display text-3xl font-black">AI Recommendations for You</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{results.map((pkg, i)=><div key={idOf(pkg)}><div className="mb-2 font-black text-unitel-red">{pkg.score}% match</div><PackageCard pkg={pkg} featured={i===0}/></div>)}</div><button className="btn btn-ghost mt-8" onClick={()=>{setAnswers([]);setStep(0);}}>Start Over</button></div>}
  </div></section>;
}
