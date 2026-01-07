
import React, { useMemo } from 'react';
import { TrendingUp, Flame, Moon, Timer, Target, Activity, ShieldCheck, Zap, Thermometer, Wind, Droplets, MapPin, Globe, ImageIcon, Clock, ChevronRight, BarChart3, Heart, BrainCircuit } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { UserProfile } from '../types';

const fluxData = [
  { time: '06:00', focus: 30, energy: 40, strain: 10, hrv: 72 },
  { time: '09:00', focus: 85, energy: 95, strain: 40, hrv: 68 },
  { time: '12:00', focus: 75, energy: 80, strain: 65, hrv: 64 },
  { time: '15:00', focus: 95, energy: 70, strain: 90, hrv: 60 },
  { time: '18:00', focus: 70, energy: 85, strain: 55, hrv: 74 },
  { time: '21:00', focus: 45, energy: 35, strain: 25, hrv: 82 },
];

const MetricCard: React.FC<{ icon: any, label: string, value: string, trend: string, color: string, subValue?: string }> = ({ icon: Icon, label, value, trend, color, subValue }) => (
  <div className="glass p-8 rounded-[3rem] transition-all hover:scale-[1.02] cursor-default group border-slate-800 hover:border-indigo-500/30 flex flex-col justify-between relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}>
      <Icon size={120} />
    </div>
    <div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-20 shadow-inner flex items-center justify-center`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-widest">
            <TrendingUp size={12} /> {trend}
          </span>
          {subValue && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{subValue}</span>}
        </div>
      </div>
      <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mb-2">{label}</p>
      <h3 className="text-5xl font-extrabold group-hover:text-white transition-colors tracking-tighter leading-none">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  const recommendations = useMemo(() => {
    if (!user) return [];
    const base = [
      { id: 1, type: 'Performance', icon: Zap, color: 'text-indigo-400', text: `Optimize metabolic window: High-protein infusion required at ${user.origin === 'India' ? '08:30 IST' : '08:00 Local'}.` },
      { id: 2, type: 'Environment', icon: Wind, color: 'text-sky-400', text: `Air quality in ${user.residence} is high. Strategic outdoor session for V02 max improvement.` },
      { id: 3, type: 'Heritage', icon: Globe, color: 'text-orange-400', text: `${user.origin} heritage detected: Supplement with Ashwagandha for cortisol modulation.` }
    ];
    return base;
  }, [user]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 space-y-12 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 no-print">
             <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <ShieldCheck size={14} /> Operational Identity Locked
             </div>
             <div className="px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <MapPin size={14} /> Global Sync: {user?.residence}
             </div>
             <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <Globe size={14} /> Heritage: {user?.origin}
             </div>
          </div>
          <h2 className="text-7xl font-extrabold tracking-tighter mb-4 leading-none text-white">Status <span className="text-indigo-500 italic">Critical.</span></h2>
          <p className="text-slate-400 text-2xl max-w-3xl font-medium leading-relaxed">
            Morning, <span className="text-white font-black">{user?.name}</span>. Your efficiency matrix is operating at <span className="text-emerald-400 font-black">94%</span>. Current protocol focused on <span className="text-indigo-400 font-black uppercase">{user?.targetPhysique.replace('_', ' ')}</span> within the <span className="text-white font-black uppercase">{user?.targetTimeline}</span> window.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 no-print">
          <button className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2.5rem] font-black text-xl transition-all shadow-[0_25px_50px_rgba(79,70,229,0.4)] uppercase tracking-tighter flex items-center gap-3 active:scale-95 group">
            <Activity size={24} className="group-hover:animate-pulse" /> Full Bio-Scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <MetricCard icon={Flame} label="Metabolic Vector" value="2,840" trend="+12.4%" color="bg-orange-500" subValue="CALORIES_INFUSED" />
        <MetricCard icon={Moon} label="Recovery State" value="92%" trend="+4.2%" color="bg-indigo-500" subValue="RESTORATION_SYNC" />
        <MetricCard icon={Timer} label="Focus Density" value="6.5h" trend="+22.1%" color="bg-emerald-500" subValue="NEURAL_SATURATION" />
        <MetricCard icon={Target} label="Objective Progress" value="14.2%" trend="+1.5%" color="bg-sky-500" subValue="MISSION_ELAPSED" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="glass rounded-[4rem] p-12 border-slate-800 shadow-2xl relative overflow-hidden bg-slate-950/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6 relative z-10">
               <h3 className="text-3xl font-black flex items-center gap-5 tracking-tighter uppercase leading-none">
                 <Activity size={32} className="text-indigo-400" />
                 Neural & Metabolic Flux
               </h3>
               <div className="flex gap-6 no-print">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cognitive Focus</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Somatic Energy</span>
                  </div>
               </div>
            </div>
            <div className="h-[450px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fluxData}>
                  <defs>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={15} fontStyle="italic" />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dx={-15} fontStyle="italic" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#f8fafc', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="focus" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorFocus)" />
                  <Area type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={6} fillOpacity={1} fill="url(#colorEnergy)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="glass rounded-[4rem] p-12 border-slate-800 shadow-2xl relative overflow-hidden bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
                <h3 className="text-3xl font-black flex items-center gap-5 tracking-tighter uppercase leading-none">
                  <ImageIcon size={32} className="text-indigo-400" />
                  Objective ID Blueprint
                </h3>
                <div className="px-5 py-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center gap-3 shadow-inner">
                   <Clock size={16} className="text-indigo-400" />
                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">{user?.targetTimeline} Deadline Anchor</span>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="aspect-square bg-slate-900 rounded-[3.5rem] overflow-hidden border-2 border-slate-800 relative group shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                   {user?.physiqueVisualUrl ? (
                     <img src={user.physiqueVisualUrl} alt="Target Physique" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 ease-out" />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-slate-800 gap-6">
                        <Activity size={80} className="opacity-20 animate-pulse" />
                        <p className="font-black uppercase tracking-[0.5em] text-[10px] opacity-30">Awaiting visual lock</p>
                     </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-2">Neural Reference</p>
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Blueprint_{user?.targetPhysique}</h4>
                   </div>
                </div>
                <div className="space-y-8 flex flex-col justify-center">
                   <div className="p-8 bg-slate-900/60 rounded-[3rem] border border-slate-800 relative group hover:border-indigo-500/30 transition-all shadow-inner">
                      <div className="absolute top-4 right-6 text-[8px] font-black text-slate-700 uppercase tracking-widest">Logic_Core_v4</div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Physiological Projection</p>
                      <p className="text-xl text-slate-300 leading-relaxed font-medium italic">
                        "Grounding ${user?.origin} heritage into your <span className="text-white font-black">{user?.targetPhysique.replace('_', ' ').toUpperCase()}</span> model. Neural simulation projects a <span className="text-emerald-400 font-black">7.2% optimization</span> shift within 21 cycles."
                      </p>
                   </div>
                   <div className="p-8 bg-indigo-600/10 rounded-[3rem] border border-indigo-500/20 shadow-inner group hover:bg-indigo-600/15 transition-all">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Current Tactical Phase</p>
                      <p className="text-xl text-slate-300 leading-relaxed font-medium">Infiltrating <span className="text-white font-black">Hypertrophic Window</span>. High-threshold motor unit recruitment is prioritized for the next 72 hours.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="glass rounded-[4rem] p-12 border-slate-800 shadow-2xl relative overflow-hidden bg-slate-950/60 flex flex-col justify-between min-h-[500px]">
             <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                <BrainCircuit size={150} className="text-indigo-400" />
             </div>
             <div>
               <h3 className="text-2xl font-black mb-10 tracking-tighter uppercase text-indigo-400 flex items-center gap-4">
                 <Zap size={24} className="fill-indigo-500" /> Command Overrides
               </h3>
               <div className="space-y-6 relative z-10">
                  {recommendations.map(rec => (
                    <div key={rec.id} className="p-6 bg-slate-900/80 rounded-[2.5rem] border border-slate-800 group/item hover:border-indigo-500/50 transition-all cursor-pointer">
                      <div className="flex items-center gap-4 mb-4">
                        <rec.icon size={18} className={rec.color} />
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${rec.color}`}>{rec.type}</span>
                      </div>
                      <p className="text-base text-slate-300 leading-relaxed font-medium italic group-hover/item:text-white transition-colors">"{rec.text}"</p>
                    </div>
                  ))}
               </div>
             </div>
             <button className="mt-8 w-full py-5 bg-slate-900 border-2 border-slate-800 rounded-[2rem] font-black text-sm uppercase tracking-widest text-slate-500 hover:text-white hover:border-slate-600 transition-all flex items-center justify-center gap-3">
                <BarChart3 size={16} /> View Deep Analysis <ChevronRight size={16} />
             </button>
          </div>

          <div className="glass rounded-[4rem] p-12 border-slate-800 shadow-2xl bg-slate-950/40">
             <h3 className="text-2xl font-black mb-10 tracking-tighter uppercase text-sky-400 flex items-center gap-4">
               <Globe size={24} className="text-sky-400" /> Environment OS
             </h3>
             <div className="grid grid-cols-1 gap-6 relative z-10">
                {[
                  { icon: Thermometer, label: 'Ambient Temperature', val: '68°F', sub: 'OPTIMAL', color: 'text-orange-400', bg: 'bg-orange-400' },
                  { icon: Wind, label: 'CO2 Concentration', val: '412 PPM', sub: 'EXCELLENT', color: 'text-indigo-400', bg: 'bg-indigo-400' },
                  { icon: Droplets, label: 'Relative Humidity', val: '42%', sub: 'STABLE', color: 'text-sky-400', bg: 'bg-sky-400' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-900/50 rounded-3xl border border-slate-800 shadow-inner group hover:bg-slate-900 transition-colors">
                     <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl ${item.bg}/10 flex items-center justify-center ${item.color} shadow-inner`}>
                           <item.icon size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                          <p className="text-xl font-black text-white uppercase tracking-tighter">{item.val}</p>
                        </div>
                     </div>
                     <span className={`text-[8px] font-black px-3 py-1 rounded-full ${item.bg}/10 ${item.color} border border-current opacity-60`}>{item.sub}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
