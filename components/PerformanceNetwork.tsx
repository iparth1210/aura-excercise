
import React, { useState } from 'react';
import { Search, Globe, Zap, ChevronRight, Share2, UserCheck, ShieldCheck, RefreshCw, ExternalLink } from 'lucide-react';
import { searchProtocols } from '../services/gemini';

const PerformanceNetwork: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const data = await searchProtocols(query);
      setResults(data);
    } catch (e) { console.error(e); } finally { setIsSearching(false); }
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-left-8 duration-1000">
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full mb-8">
          <Globe size={14} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">Gemini 3 Grounding Active</span>
        </div>
        <h2 className="text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent leading-none">Pro <span className="text-sky-500 italic">Network</span></h2>
        <p className="text-slate-400 text-xl font-medium">Verified grounding into the latest elite athletic research.</p>
      </div>

      <div className="max-w-3xl mx-auto relative group">
        <div className="glass p-4 rounded-[2.5rem] flex items-center gap-4 border-2 border-slate-800 focus-within:border-sky-500/50 shadow-2xl">
           <Search className="text-slate-500 ml-4" size={24} />
           <input 
             type="text" 
             placeholder="Query elite protocols..."
             className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-white"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
           />
           <button onClick={handleSearch} className="px-8 py-4 bg-sky-600 text-white rounded-[1.5rem] font-black flex items-center gap-2">
             {isSearching ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} />}
             {isSearching ? "Searching..." : "Sync"}
           </button>
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className="glass p-12 rounded-[4rem] border-l-8 border-l-sky-500 bg-slate-950/50">
               <h4 className="text-xl font-black text-sky-400 mb-6 uppercase tracking-widest">Grounding Synthesis</h4>
               <div className="prose prose-invert max-w-none text-lg leading-relaxed text-slate-300 font-medium whitespace-pre-wrap">
                 {results.text}
               </div>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
             <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Scientific Assets</h4>
             {results.grounding.map((g: any, i: number) => (
               <a key={i} href={g.web?.uri} target="_blank" className="flex items-center justify-between p-6 bg-slate-900/50 rounded-3xl border border-slate-800 hover:border-sky-500/30 transition-all group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-sky-600 transition-colors"><Globe size={18} /></div>
                    <span className="font-bold text-sm text-slate-300 truncate max-w-[150px]">{g.web?.title}</span>
                 </div>
                 <ExternalLink size={16} className="text-slate-600" />
               </a>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceNetwork;
