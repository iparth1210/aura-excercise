import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Zap, 
  ShieldCheck, 
  Video, 
  ListChecks, 
  Target, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Globe, 
  Activity,
  Coffee,
  Heart,
  RefreshCw,
  Clock,
  History,
  Timer,
  AlertCircle,
  Settings2,
  Lock,
  FileText,
  User,
  Info
} from 'lucide-react';
import { UserProfile } from '../types';
import { generateRitualVideo, getAI } from '../services/gemini';

interface TacticalTask {
  id: string;
  time: string;
  title: string;
  objective: string;
  instructions: string[];
  category: 'nutrition' | 'movement' | 'mindset' | 'recovery';
}

const Protocols: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  const [mode, setMode] = useState<'IDLE' | 'MORNING_BLUEPRINT'>('IDLE');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TacticalTask[]>([]);
  const [showExportSettings, setShowExportSettings] = useState(false);
  
  const [exportConfig, setExportConfig] = useState({
    // Core Segments
    mindset: true,
    nutrition: true,
    movement: true,
    recovery: true,
    // UI Modules
    readiness: true,
    target: true,
    // Granular Data Points
    showInstructions: true,
    showObjectives: true,
    showBioMarkers: true,
    showIdentity: true,
    onlyPending: false,
    includeNotesField: true
  });

  const loadingMessages = [
    "Analyzing Biological Heritage...",
    "Synchronizing Circadian Rhythm...",
    "Mapping Geographic Constraints...",
    "Synthesizing Ritual Visualization...",
    "Compiling Elite Blueprint..."
  ];

  useEffect(() => {
    if (user && tasks.length === 0) {
      setTasks(generateInitialTacticalPlan());
    }
  }, [user]);

  useEffect(() => {
    let interval: number;
    if (isGenerating) {
      interval = window.setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const generateInitialTacticalPlan = (): TacticalTask[] => {
    if (!user) return [];
    
    const isDesi = user.origin === 'India';
    const goalType = user.targetPhysique;

    return [
      {
        id: 'task-1',
        time: '06:00',
        title: isDesi ? 'Sattvic Awakening & Hydration' : 'Circadian Prime & Hydration',
        objective: 'Neurological Reset',
        category: 'mindset',
        instructions: [
          'Drink 500ml warm water with sea salt and lemon.',
          isDesi ? 'Perform 5 rounds of Surya Namaskar facing East.' : '10 minutes of direct sunlight exposure.',
          'Nasal breathing only (4-4-4-4 box breathing) for 5 minutes.'
        ]
      },
      {
        id: 'task-2',
        time: '08:30',
        title: 'Metabolic Breakfast Induction',
        objective: 'Macro-Priming',
        category: 'nutrition',
        instructions: [
          `Prepare ${goalType === 'shredded' ? 'High Protein / Minimal Carb' : 'Moderate Carb'} meal.`,
          isDesi ? 'Moong Dal Chilla with Paneer or 4 Egg Whites with Spinach.' : 'Greek Yogurt with Whey and Chia Seeds.',
          'Consume 200mg Caffeine (Black Coffee/Tea) if needed for focus.'
        ]
      },
      {
        id: 'task-3',
        time: '12:00',
        title: 'Kinetic Movement Block',
        objective: `${goalType.replace('_', ' ').toUpperCase()} Intensity`,
        category: 'movement',
        instructions: [
          '5 mins dynamic mobility warmup.',
          goalType === 'shredded' ? 'High-volume supersets with 30s rest.' : 'Heavy compound lifts (4x8 reps) with 2m rest.',
          'Focus on isometric holds at peak contraction for 2 seconds.'
        ]
      },
      {
        id: 'task-4',
        time: '18:00',
        title: 'Cognitive Recovery & Nutrition',
        objective: 'Tissue Repair',
        category: 'nutrition',
        instructions: [
          'Post-workout shake: 30g Protein + 5g Creatine.',
          'Dinner: Lean protein source + high-volume fibrous greens.',
          'Limit sodium intake to prevent evening water retention.'
        ]
      },
      {
        id: 'task-5',
        time: '21:30',
        title: 'Deep Sleep Architecture',
        objective: 'Hormonal Optimization',
        category: 'recovery',
        instructions: [
          'No digital screens for 45 minutes before bed.',
          isDesi ? 'Ashwagandha + Magnesium warm water ritual.' : 'ZMA or Magnesium Glycinate supplement.',
          'Perform a 2-minute gratitude scan to downregulate cortisol.'
        ]
      }
    ];
  };

  const toggleTask = (id: string) => {
    const next = new Set(completedTaskIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompletedTaskIds(next);
  };

  const updateTaskTime = (id: string, newTime: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, time: newTime } : t));
  };

  const resetTimes = () => {
    setTasks(generateInitialTacticalPlan());
  };

  const initializeMission = async () => {
    if (!(await (window as any).aistudio.hasSelectedApiKey())) {
      await (window as any).aistudio.openSelectKey();
    }

    setIsGenerating(true);
    setMode('MORNING_BLUEPRINT');
    try {
      const prompt = `A cinematic ultra-high-definition video of a professional athlete performing a ${user?.targetPhysique} ritual in ${user?.residence}. Dynamic camera work, focus on discipline and intensity.`;
      const operation = await generateRitualVideo(prompt);
      
      let pollOp = operation;
      while (!pollOp.done) {
        await new Promise(r => setTimeout(r, 10000));
        const ai = getAI();
        pollOp = await ai.operations.getVideosOperation({ operation: pollOp });
      }

      const downloadLink = pollOp.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await res.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (e: any) { 
      console.error(e);
      if (e?.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
    } finally { 
      setIsGenerating(false); 
    }
  };

  const handleExport = () => {
    setShowExportSettings(false);
    window.print();
  };

  const visibleTasks = tasks.filter(t => {
    if (exportConfig.onlyPending && completedTaskIds.has(t.id)) return false;
    return exportConfig[t.category as keyof typeof exportConfig] !== false;
  });

  if (mode === 'IDLE') {
    return (
      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
            <ShieldCheck size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Tactical OS v4.0</span>
          </div>
          <h2 className="text-8xl font-black tracking-tighter mb-6 leading-none">Pro <span className="text-indigo-500 italic">Blueprint</span></h2>
          <p className="text-slate-400 text-2xl font-medium">Generate your interactive mission report. Grounded in your biological heritage and geographic environment.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <button 
            onClick={initializeMission}
            className="w-full glass p-20 rounded-[5rem] border-2 border-indigo-500/20 group hover:border-indigo-500 transition-all flex flex-col items-center justify-center text-center gap-8 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />
            <div className="w-28 h-28 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl rotate-3 group-hover:rotate-6 transition-transform">
              <Zap size={56} fill="white" />
            </div>
            <div>
              <h3 className="text-5xl font-black tracking-tighter mb-4">Initialize Tactical Briefing</h3>
              <p className="text-slate-500 text-xl">Synthesize your personal <span className="text-indigo-400 font-bold uppercase">{user?.targetTimeline}</span> transformation protocol.</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in">
        <div className="w-40 h-40 relative mb-12">
           <div className="absolute inset-0 border-8 border-indigo-500/10 rounded-full" />
           <div className="absolute inset-0 border-8 border-indigo-500 border-t-transparent rounded-full animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
             <RefreshCw className="animate-spin" size={64} />
           </div>
        </div>
        <h3 className="text-5xl font-black mb-4 tracking-tighter text-white uppercase leading-none text-center">
          {loadingMessages[loadingStep]}
        </h3>
        <p className="text-slate-500 text-lg font-mono tracking-[0.5em] uppercase opacity-50">SYNCING_BIO_CONSTRAINTS</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-top-12 duration-1000 max-w-7xl mx-auto pb-32">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 mb-16 no-print">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-3 mb-6">
             <span className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 rounded-xl uppercase tracking-widest">Protocol Sync: Active</span>
             <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 rounded-xl uppercase tracking-widest">{completedTaskIds.size} / {tasks.length} Completed</span>
             <span className="px-4 py-1.5 bg-slate-800 border border-slate-700 text-[10px] font-black text-slate-400 rounded-xl uppercase tracking-widest flex items-center gap-2">
                <Timer size={12} /> Live Strategy Mode
             </span>
          </div>
          <h2 className="text-7xl font-black tracking-tighter mb-3 leading-none">Daily Mission <span className="text-indigo-500 italic">Log</span></h2>
          <p className="text-slate-400 text-2xl font-medium">Identity: {user?.name} // Sequence: {user?.targetPhysique.toUpperCase().replace('_', ' ')}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 relative">
          <button 
            onClick={resetTimes}
            className="px-8 py-5 bg-slate-900 border-2 border-slate-800 text-slate-400 rounded-[2.5rem] font-bold flex items-center gap-2 hover:text-white hover:border-slate-700 transition-all shadow-xl"
            title="Reset to default protocol times"
          >
            <History size={20} /> Reset Logic
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowExportSettings(!showExportSettings)}
              className={`px-8 py-5 border-2 rounded-[2.5rem] font-bold flex items-center gap-3 transition-all shadow-xl ${showExportSettings ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)]' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
            >
              <Settings2 size={20} /> Customize Export
            </button>
            
            {showExportSettings && (
              <div className="absolute top-full mt-4 right-0 w-[420px] glass p-10 rounded-[4rem] border-2 border-indigo-500/20 z-[60] shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                      <FileText size={20} />
                   </div>
                   <h4 className="text-sm font-black text-white uppercase tracking-widest">Tactical Report Config</h4>
                </div>

                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Functional Segments</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'mindset', label: 'Mindset' },
                        { id: 'nutrition', label: 'Nutrition' },
                        { id: 'movement', label: 'Movement' },
                        { id: 'recovery', label: 'Recovery' },
                      ].map(opt => (
                        <button 
                          key={opt.id}
                          onClick={() => setExportConfig({...exportConfig, [opt.id]: !exportConfig[opt.id as keyof typeof exportConfig]})}
                          className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${exportConfig[opt.id as keyof typeof exportConfig] ? 'bg-indigo-600/10 border-indigo-500/40 text-white' : 'border-slate-800 text-slate-600'}`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                          <Check size={12} className={exportConfig[opt.id as keyof typeof exportConfig] ? 'opacity-100' : 'opacity-0'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Granular Data Points</p>
                    <div className="space-y-3">
                      {[
                        { id: 'showInstructions', label: 'Workflow Instructions', desc: 'Include detailed step-by-step logic' },
                        { id: 'showObjectives', label: 'Strategic Objectives', desc: 'Show the "Why" behind each block' },
                        { id: 'showBioMarkers', label: 'Biometric Markers', desc: 'Readiness and HRV snapshots' },
                        { id: 'showIdentity', label: 'Identity Metadata', desc: 'Heritage and Sequence designation' },
                        { id: 'target', label: 'Target Visual Blueprint', desc: 'Include AI-generated physique goal' },
                        { id: 'includeNotesField', label: 'Manual Field Log', desc: 'Add empty space for manual notation' },
                        { id: 'onlyPending', label: 'Prune Completed', desc: 'Only include non-executed tasks' },
                      ].map(opt => (
                        <button 
                          key={opt.id}
                          onClick={() => setExportConfig({...exportConfig, [opt.id]: !exportConfig[opt.id as keyof typeof exportConfig]})}
                          className="w-full flex items-start justify-between group p-3 hover:bg-white/5 rounded-2xl transition-colors"
                        >
                          <div className="text-left pr-4">
                            <span className={`text-[11px] font-black block leading-none mb-1 ${exportConfig[opt.id as keyof typeof exportConfig] ? 'text-white' : 'text-slate-600'}`}>{opt.label}</span>
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{opt.desc}</span>
                          </div>
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 mt-1 ${exportConfig[opt.id as keyof typeof exportConfig] ? 'bg-emerald-600 border-emerald-500' : 'border-slate-800'}`}>
                            {exportConfig[opt.id as keyof typeof exportConfig] && <Check size={14} strokeWidth={4} />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleExport}
                  className="w-full mt-10 py-5 bg-white text-slate-950 rounded-3xl font-black text-lg uppercase tracking-tighter flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_15px_30px_rgba(255,255,255,0.1)]"
                >
                  <Download size={22} /> Execute Export
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setMode('IDLE')} className="px-8 py-5 bg-slate-900 border-2 border-slate-800 text-slate-400 rounded-[2.5rem] font-bold hover:bg-slate-800 transition-all">Dismiss</button>
        </div>
      </div>

      {/* HEADER FOR PRINT REPORT */}
      <div className="hidden print:block mb-12 border-b-4 border-black pb-8">
        <div className="flex justify-between items-end">
          <div>
             <h1 className="text-6xl font-black tracking-tighter uppercase leading-none mb-2">AURA ULTRA</h1>
             <p className="text-xs font-mono font-black uppercase tracking-[0.4em]">Tactical Protocol Report // {new Date().toLocaleDateString()}</p>
          </div>
          {exportConfig.showIdentity && (
            <div className="text-right">
               <p className="text-xs font-black uppercase tracking-widest mb-1">DESIGNATION: {user?.name}</p>
               <p className="text-xs font-black uppercase tracking-widest mb-1">SEQUENCE: {user?.targetPhysique}</p>
               <p className="text-xs font-black uppercase tracking-widest">ORIGIN: {user?.origin}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">
          {/* VIDEO FEED - HIDDEN FROM PRINT */}
          <div className="glass p-12 rounded-[4.5rem] bg-indigo-500/5 border-indigo-500/10 no-print shadow-2xl">
             <div className="flex items-center justify-between mb-8">
                <h4 className="flex items-center gap-4 text-2xl font-black tracking-tighter uppercase text-indigo-400">
                  <Video size={24} /> Neural Anchor Feed
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">
                   <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Live Rendering
                </div>
             </div>
             <div className="aspect-video bg-slate-950 rounded-[3rem] overflow-hidden relative border-2 border-indigo-500/20 shadow-[0_0_80px_rgba(99,102,241,0.1)]">
                {videoUrl ? (
                  <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800 gap-6">
                    <Video size={80} className="opacity-20" />
                    <p className="font-mono text-xs uppercase tracking-[0.4em] opacity-40">Awaiting visual synthesis</p>
                  </div>
                )}
             </div>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-4xl font-black mb-8 flex items-center gap-5 uppercase tracking-tighter leading-none print:text-2xl print:mb-4">
              <ListChecks className="text-indigo-400 no-print" size={32} /> Tactical Workflow
            </h4>
            <div className="space-y-6 print:space-y-4">
              {visibleTasks.length === 0 && (
                <div className="p-20 text-center border-2 border-dashed border-slate-800 rounded-[4rem] print:border-black">
                  <AlertCircle size={48} className="mx-auto text-slate-700 mb-6" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No protocols matching current filter criteria.</p>
                </div>
              )}
              {visibleTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`glass p-10 rounded-[4rem] border-2 transition-all duration-700 print:rounded-2xl print:p-6 print:border-black ${
                    completedTaskIds.has(task.id) 
                      ? 'border-emerald-500/20 bg-emerald-500/5 opacity-50 scale-[0.98] print:opacity-100' 
                      : expandedTaskId === task.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-8 print:gap-4">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`w-16 h-16 rounded-[2rem] flex items-center justify-center border-4 transition-all shrink-0 mt-1 no-print ${
                        completedTaskIds.has(task.id) ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_40px_rgba(16,185,129,0.4)]' : 'border-slate-700 bg-slate-950 text-transparent hover:border-indigo-500'
                      }`}
                    >
                      <Check size={32} strokeWidth={4} />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-4 print:mb-2">
                        <div className="flex flex-wrap items-center gap-4 print:gap-2">
                           <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] print:bg-none print:border print:border-black ${
                             task.category === 'nutrition' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                             task.category === 'movement' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                             task.category === 'mindset' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
                           }`}>
                             {task.category}
                           </span>
                           
                           <div className="relative flex items-center gap-3 no-print bg-slate-900/50 hover:bg-slate-900 px-4 py-1.5 rounded-2xl border border-slate-800 transition-all cursor-pointer group/time">
                             <Clock size={14} className="text-slate-500 group-hover/time:text-indigo-400" />
                             <input 
                                type="time"
                                value={task.time}
                                onChange={(e) => updateTaskTime(task.id, e.target.value)}
                                className="bg-transparent text-sm font-mono font-black text-indigo-400 tracking-widest outline-none border-none w-28 appearance-none cursor-pointer"
                             />
                           </div>
                           <span className="hidden print:inline text-sm font-mono font-black text-slate-800 ml-1">@ {task.time}</span>
                           {completedTaskIds.has(task.id) && <span className="hidden print:inline text-[9px] font-black text-emerald-600 ml-auto uppercase">[EXECUTED]</span>}
                        </div>
                        <button 
                          onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                          className="no-print p-3 bg-slate-900/50 rounded-2xl text-slate-600 hover:text-white hover:bg-indigo-600 transition-all"
                        >
                          {expandedTaskId === task.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                        </button>
                      </div>
                      
                      <h5 className={`text-3xl font-black tracking-tighter leading-tight mb-2 print:text-xl print:mb-1 ${completedTaskIds.has(task.id) ? 'line-through text-slate-600 print:text-black' : 'text-white print:text-black'}`}>
                        {task.title}
                      </h5>
                      
                      {exportConfig.showObjectives && (
                        <div className="flex items-center gap-3 text-slate-500 print:text-slate-600 print:gap-1">
                          <AlertCircle size={14} className="no-print" />
                          <p className="text-xs font-black uppercase tracking-[0.3em] print:tracking-widest">{task.objective}</p>
                        </div>
                      )}
                      
                      {(expandedTaskId === task.id || exportConfig.showInstructions) && (
                        <div className={`mt-8 pt-8 border-t border-slate-800 print:mt-4 print:pt-4 print:border-black ${expandedTaskId === task.id ? 'block' : 'hidden print:block'}`}>
                          <ul className="space-y-6 print:space-y-3">
                            {task.instructions.map((step, idx) => (
                              <li key={idx} className="flex gap-6 text-slate-300 font-medium leading-relaxed text-lg print:text-sm print:gap-3 print:text-black">
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-2.5 shrink-0 shadow-[0_0_10px_#6366f1] print:border print:border-black print:bg-none print:shadow-none" />
                                <span className="flex-1">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {exportConfig.includeNotesField && (
                <div className="hidden print:block p-10 border-2 border-black rounded-2xl min-h-[150px]">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">TACTICAL FIELD NOTES</p>
                   <div className="border-b border-black/10 h-8 mb-4" />
                   <div className="border-b border-black/10 h-8 mb-4" />
                   <div className="border-b border-black/10 h-8" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-12 print:space-y-8">
           <div className={`glass p-12 rounded-[5rem] border-2 border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden shadow-2xl print:rounded-2xl print:p-8 print:border-black ${exportConfig.target ? '' : 'print:hidden'}`}>
              <h4 className="flex items-center gap-4 text-2xl font-black mb-10 tracking-tighter uppercase text-indigo-400 print:text-lg print:mb-6">
                <Target size={24} className="no-print" /> Objective Vision
              </h4>
              <div className="aspect-square rounded-[4rem] overflow-hidden border-2 border-slate-800 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative mb-10 group print:rounded-2xl print:mb-6">
                 {user?.physiqueVisualUrl ? (
                   <img src={user.physiqueVisualUrl} alt="Target Physique" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out" />
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-slate-800 gap-6">
                      <Activity size={100} className="opacity-20 animate-pulse" />
                      <p className="font-black uppercase text-xs tracking-[0.6em] opacity-30">Identity Locked</p>
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90 print:hidden" />
                 <div className="absolute bottom-10 left-10 right-10 print:hidden">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                       <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">Target Synthesis: ACTIVE</p>
                    </div>
                    <p className="text-5xl font-black text-white tracking-tighter uppercase leading-none">{user?.targetPhysique.replace('_', ' ')}</p>
                 </div>
              </div>
              <div className="p-8 bg-slate-950/90 rounded-[3rem] border border-slate-800 shadow-inner print:border-black print:bg-none print:p-4">
                 <p className="text-lg text-indigo-100 font-medium leading-relaxed italic text-center print:text-sm print:text-black">
                    "Genetic destiny is forged in daily repetition. Sync your neural drive with the physical workload."
                 </p>
              </div>
           </div>

           <div className={`glass p-12 rounded-[5rem] bg-emerald-500/5 border-emerald-500/20 shadow-2xl print:rounded-2xl print:p-8 print:border-black ${exportConfig.readiness && exportConfig.showBioMarkers ? '' : 'print:hidden'}`}>
              <h4 className="flex items-center gap-4 font-black text-2xl mb-10 tracking-tighter uppercase text-emerald-400 print:text-lg print:mb-6">
                <Activity size={24} className="no-print" /> Readiness Matrix
              </h4>
              <div className="space-y-6 print:space-y-3">
                 {[
                   { icon: Heart, label: 'HRV Baseline', val: '84 ms', color: 'text-rose-400' },
                   { icon: Coffee, label: 'Metabolic Peak', val: tasks.find(t => t.category === 'nutrition')?.time || '08:30', color: 'text-amber-400' },
                   { icon: Globe, label: 'Geo-Context', val: user?.residence, color: 'text-sky-400' }
                 ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-900/60 rounded-[2.5rem] border border-slate-800 group hover:border-emerald-500/50 transition-all print:bg-none print:border-black print:p-3 print:rounded-xl">
                       <div className="flex items-center gap-5 print:gap-2">
                          <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 ${stat.color} group-hover:scale-110 transition-transform no-print`}>
                             <stat.icon size={22} />
                          </div>
                          <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] print:text-[10px] print:text-black">{stat.label}</span>
                       </div>
                       <span className="text-xl font-black text-white uppercase tracking-tighter print:text-sm print:text-black">{stat.val}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <style>{`
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1) hue-rotate(180deg) brightness(1.5);
          cursor: pointer;
        }
        @media print {
          .glass { background: #fff !important; border: 1px solid #000 !important; color: #000 !important; box-shadow: none !important; }
          body { background: #fff !important; color: #000 !important; }
          h2, h4, h5 { color: #000 !important; }
          .text-slate-400, .text-slate-500, .text-slate-300 { color: #000 !important; }
          .text-indigo-500, .text-emerald-500, .text-indigo-400 { color: #000 !important; font-weight: 900 !important; }
          .no-print { display: none !important; }
          input[type="time"] { display: none !important; }
          ul li { color: #000 !important; list-style-type: none; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
          .aspect-video, .aspect-square { border: 1px solid #000 !important; border-radius: 8px !important; }
          .bg-indigo-500, .bg-emerald-500, .bg-indigo-600 { background-color: #000 !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          aside, main header { display: none !important; }
          .max-w-7xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          main { overflow: visible !important; height: auto !important; }
        }
      `}</style>
    </div>
  );
};

export default Protocols;