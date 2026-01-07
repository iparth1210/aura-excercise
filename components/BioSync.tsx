
import React from 'react';
/* Added Cell to the recharts import list */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { Heart, Moon, Wind, Thermometer, Battery, Info, Activity, Zap, ShieldCheck } from 'lucide-react';

const sleepData = [
  { stage: 'Awake', duration: 15, color: '#f59e0b', label: 'WAKE' },
  { stage: 'REM', duration: 110, color: '#ec4899', label: 'REM' },
  { stage: 'Light', duration: 240, color: '#6366f1', label: 'LIGHT' },
  { stage: 'Deep', duration: 120, color: '#06b6d4', label: 'DEEP' },
];

const hrvData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  hrv: 60 + Math.random() * 40,
  stress: 20 + Math.random() * 30
}));

const BioSync: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-32">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl shadow-sm">
            <Activity size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Bio-OS Baseline Active</span>
          </div>
          <h2 className="text-7xl font-black tracking-tighter leading-none text-white">Bio-Sync <span className="text-indigo-500 italic">Flux</span></h2>
          <p className="text-slate-400 text-2xl font-medium max-w-3xl">High-fidelity physiological surveillance. Real-time HRV, Sleep Architecture, and Autonomic Calibration.</p>
        </div>
        <div className="flex bg-slate-900/50 p-2 rounded-[2rem] border-2 border-slate-800 shadow-2xl no-print">
          <button className="px-8 py-3.5 bg-indigo-600 rounded-[1.5rem] text-sm font-black shadow-lg shadow-indigo-500/20 text-white uppercase tracking-widest">24H Metrics</button>
          <button className="px-8 py-3.5 text-slate-500 text-sm font-black uppercase tracking-widest hover:text-white transition-colors">Historical</button>
          <button className="px-8 py-3.5 text-slate-500 text-sm font-black uppercase tracking-widest hover:text-white transition-colors">Compare</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="glass p-10 rounded-[4rem] relative overflow-hidden bg-slate-950/40 border-slate-800 group hover:border-rose-500/30 transition-all shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Heart size={150} className="text-rose-500" />
          </div>
          <div className="flex items-center gap-4 mb-10 text-rose-400">
            <div className="p-3 bg-rose-500/10 rounded-2xl shadow-inner"><Heart size={24} className="fill-rose-500" /></div>
            <span className="font-black text-xs tracking-[0.3em] uppercase">HRV Delta Index</span>
          </div>
          <h3 className="text-7xl font-black mb-4 tracking-tighter text-white leading-none">84 <span className="text-2xl text-slate-600 font-bold">ms</span></h3>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">+12.4% Optimal Elevation</p>
          </div>
          <div className="mt-10 h-28 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hrvData.slice(-12)}>
                <Area type="monotone" dataKey="hrv" stroke="#f43f5e" strokeWidth={4} fill="#f43f5e" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-10 rounded-[4rem] relative overflow-hidden bg-slate-950/40 border-slate-800 group hover:border-indigo-500/30 transition-all shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Moon size={150} className="text-indigo-500" />
          </div>
          <div className="flex items-center gap-4 mb-10 text-indigo-400">
            <div className="p-3 bg-indigo-500/10 rounded-2xl shadow-inner"><Moon size={24} className="fill-indigo-500" /></div>
            <span className="font-black text-xs tracking-[0.3em] uppercase">Restoration State</span>
          </div>
          <h3 className="text-7xl font-black mb-4 tracking-tighter text-white leading-none">96 <span className="text-2xl text-slate-600 font-bold">%</span></h3>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">Circadian Lock Confirmed</p>
          </div>
          <div className="mt-10 flex gap-2 h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
            {sleepData.map((s, i) => (
              <div key={i} style={{ width: `${s.duration / 5}%`, backgroundColor: s.color }} className="shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
            ))}
          </div>
          <div className="mt-6 flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span>22:15_START</span>
            <span>EF: 0.98</span>
            <span>06:40_END</span>
          </div>
        </div>

        <div className="glass p-10 rounded-[4rem] relative overflow-hidden bg-slate-950/40 border-slate-800 group hover:border-emerald-500/30 transition-all shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Battery size={150} className="text-emerald-500" />
          </div>
          <div className="flex items-center gap-4 mb-10 text-emerald-400">
            <div className="p-3 bg-emerald-500/10 rounded-2xl shadow-inner"><Battery size={24} className="fill-emerald-500" /></div>
            <span className="font-black text-xs tracking-[0.3em] uppercase">Operational Reserves</span>
          </div>
          <h3 className="text-7xl font-black mb-4 tracking-tighter text-white leading-none">92 <span className="text-2xl text-slate-600 font-bold">/100</span></h3>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
             <p className="text-indigo-400 text-xs font-black uppercase tracking-widest">Primed for Max Intensity</p>
          </div>
          <div className="mt-10 grid grid-cols-5 gap-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`h-2.5 rounded-full transition-all duration-700 ${i <= 4 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]' : 'bg-slate-900 border border-slate-800'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass p-12 rounded-[4.5rem] bg-slate-950/50 shadow-2xl border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-12">
            <h4 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter text-white">
              <Activity className="text-sky-400" size={32} /> Autonomic Balance
            </h4>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl cursor-help group relative shadow-lg">
              <Info size={18} className="text-slate-500 group-hover:text-white transition-colors" />
              <div className="absolute bottom-full right-0 mb-4 w-72 p-6 bg-slate-900 border-2 border-slate-800 rounded-[2rem] text-xs font-medium text-slate-300 hidden group-hover:block z-50 shadow-2xl backdrop-blur-2xl">
                Real-time Sympathetic vs Parasympathetic flux ratio. Higher bars indicate sympathetic dominance (stress/output phase).
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hrvData.slice(-12)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} fontStyle="italic" />
                <YAxis hide />
                <Tooltip 
                   cursor={{fill: 'rgba(255,255,255,0.03)'}}
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }}
                />
                <Bar dataKey="stress" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={32}>
                  {hrvData.slice(-12).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.stress > 40 ? '#6366f1' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-12 rounded-[4.5rem] bg-gradient-to-br from-indigo-950/30 via-slate-950 to-slate-950 shadow-2xl border-slate-800 border-2 border-indigo-500/10">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl rotate-3"><Zap size={32} fill="white" /></div>
             <h4 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">Bio-Optimization <span className="text-indigo-500 italic">Loop</span></h4>
          </div>
          <div className="space-y-8">
            <div className="flex gap-6 group">
              <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <Thermometer size={28} className="text-indigo-400 group-hover:text-white" />
              </div>
              <div>
                <p className="font-black text-xl text-white mb-2 uppercase tracking-tighter">Hormetic Induction</p>
                <p className="text-base text-slate-400 leading-relaxed font-medium italic">"HRV exceeds baseline by 12ms. Recommend 3 min exposure at 48°F (9°C) to lock in neurotransmitter saturation."</p>
              </div>
            </div>
            <div className="flex gap-6 group">
              <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <Wind size={28} className="text-emerald-400 group-hover:text-white" />
              </div>
              <div>
                <p className="font-black text-xl text-white mb-2 uppercase tracking-tighter">Autonomic Calibration</p>
                <p className="text-base text-slate-400 leading-relaxed font-medium italic">"Respiratory frequency is 14.2 bpm. Initiate 4-4-4-4 box breathing for 10 cycles to downregulate cortisol before the mission."</p>
              </div>
            </div>
            <button className="w-full mt-6 py-6 bg-white text-slate-950 font-black text-xl rounded-[2.5rem] hover:scale-[1.03] active:scale-95 transition-all shadow-[0_25px_50px_rgba(255,255,255,0.1)] uppercase tracking-tighter flex items-center justify-center gap-4 group">
              <ShieldCheck size={24} className="group-hover:text-indigo-600 transition-colors" /> Commit Protocol Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioSync;
