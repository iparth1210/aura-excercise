
import React, { useState } from 'react';
import { Search, MapPin, Globe, ExternalLink, ShieldCheck, ChevronRight, Activity, Cpu, Database, Link as LinkIcon, RefreshCcw } from 'lucide-react';
import { analyzePerformance } from '../services/gemini';
import { UserProfile } from '../types';

const DeepAnalysis: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<null | any>(null);

  const runPerformanceScan = async () => {
    if (!user) return;
    setIsAnalyzing(true);
    
    try {
      // Get location if possible
      let coords = undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej)
        );
        coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) { console.debug("Geo failed, using default."); }

      const data = await analyzePerformance(user, coords);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-12 duration-1000">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
        <div>
          <h2 className="text-6xl font-extrabold tracking-tighter mb-4">Neural <span className="text-indigo-500">Synthesis</span></h2>
          <p className="text-slate-400 text-xl max-w-3xl">Grounding your personal bio-metrics in the world's most advanced athletic research using <span className="text-white font-bold">Gemini 2.5 Fusion</span>.</p>
        </div>
        {!isAnalyzing && (
          <button 
            onClick={runPerformanceScan}
            className="group relative px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-lg transition-all hover:scale-[1.03] shadow-2xl shadow-white/10"
          >
            <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
            <span className="relative flex items-center gap-3">
              {results ? "Recalibrate System" : "Run AI Optimization"} 
              <ChevronRight size={24} />
            </span>
          </button>
        )}
      </div>

      {isAnalyzing ? (
        <div className="glass rounded-[4rem] p-24 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[500px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
            <div className="h-full bg-indigo-500 w-1/3 animate-[progress_3s_ease-in-out_infinite]" />
          </div>
          <style>{`
            @keyframes progress {
              0% { width: 0%; left: 0%; }
              50% { width: 50%; left: 25%; }
              100% { width: 0%; left: 100%; }
            }
          `}</style>
          
          <div className="w-32 h-32 relative mb-12">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu size={48} className="text-indigo-400 animate-pulse" />
            </div>
          </div>
          
          <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase">Fusing Identity Vectors...</h3>
          <div className="flex flex-col gap-3 font-mono text-[10px] tracking-widest text-slate-500 uppercase">
            <p className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" /> Grounding with Google Search</p>
            <p className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Scanning local infrastructure</p>
            <p className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" /> Generating 2.5 series synthesis</p>
          </div>
        </div>
      ) : results ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="glass p-12 rounded-[3.5rem] border-l-8 border-l-indigo-500 bg-slate-950/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg">
                  <Activity size={24} className="text-white" />
                </div>
                <h4 className="text-2xl font-black tracking-tight uppercase">AI Master Directive</h4>
              </div>
              <div className="prose prose-invert max-w-none text-xl text-slate-200 leading-relaxed font-medium mb-12 whitespace-pre-wrap italic">
                {results.text}
              </div>
              
              <div className="space-y-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Grounding Assets</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.grounding.map((g: any, i: number) => (
                    <a key={i} href={g.web?.uri || g.maps?.uri} target="_blank" className="flex items-center justify-between p-6 bg-slate-900/50 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                          {g.web ? <Globe size={18} /> : <MapPin size={18} />}
                        </div>
                        <span className="font-bold text-sm text-slate-300 group-hover:text-white truncate max-w-[150px]">{g.web?.title || g.maps?.title || "Resource Link"}</span>
                      </div>
                      <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-400" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="glass p-10 rounded-[3rem] bg-emerald-500/5 border-emerald-500/20">
               <h4 className="text-xl font-black mb-6 flex items-center gap-3"><MapPin className="text-emerald-400" /> Local Intelligence</h4>
               <p className="text-sm text-slate-400 leading-relaxed font-medium mb-8">
                 We've mapped your <span className="text-white">{user?.residence}</span> environment. Based on your <span className="text-emerald-400">{user?.origin}</span> heritage, we suggest checking the links for specialized sourcing.
               </p>
               <button className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-emerald-950 hover:bg-emerald-500 transition-all">
                 Show Nearby Map
               </button>
            </div>
            
            <div className="p-10 glass rounded-[3rem] bg-indigo-600/10 border-indigo-500/20">
              <h4 className="text-lg font-black mb-4 flex items-center gap-3"><Database className="text-indigo-400" /> Bio-Context</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                Optimization strategy accounts for local AQI and your specific goal set: <span className="text-indigo-400 font-bold">{(user?.primaryGoals || []).join(' + ')}</span>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-60">
          {[
            { icon: Globe, title: "Search Grounding", desc: "Live web synthesis for latest protocols." },
            { icon: MapPin, title: "Maps Grounding", desc: "Local infrastructure and sourcing mapping." },
            { icon: Cpu, title: "Advanced Reasoning", desc: "Hyper-personalized 2.5 series logic." }
          ].map((item, i) => (
            <div key={i} className="glass p-12 rounded-[4rem] border-dashed border-2 border-slate-800 flex flex-col items-center text-center group hover:border-indigo-500 transition-all">
              <item.icon size={56} className="text-slate-800 group-hover:text-indigo-500 mb-8 transition-colors" />
              <h4 className="text-2xl font-black mb-4 tracking-tighter uppercase">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium uppercase tracking-widest">{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeepAnalysis;
