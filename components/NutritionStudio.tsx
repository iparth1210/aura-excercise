
import React, { useState, useRef } from 'react';
import { Camera, ShieldCheck, Zap, RefreshCcw, PieChart, Info, Scale, UtensilsCrossed, Calendar, Droplet, Flame, MapPin, Globe, Play, Youtube, ChevronDown, ChevronUp, Clock, List, RefreshCw, X, Star, Target } from 'lucide-react';
import { UserProfile, MealStep } from '../types';
import { analyzeMealImage } from '../services/gemini';

const NutritionStudio: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<null | any>(null);
  const [expandedMealIdx, setExpandedMealIdx] = useState<number | null>(0);
  const [activeTutorialIdx, setActiveTutorialIdx] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateMealBlueprint = (): MealStep[] => {
    const heritage = user?.origin || 'India';
    if (heritage === 'India') {
      return [
        {
          meal: "Morning Metabolic Start",
          menu: "Sprouted Moong & Paneer Salad",
          objective: "High-Protein / High-Fiber Induction",
          ingredients: ["1 Cup Sprouted Moong Dal", "100g Fresh Paneer", "Cucumber", "Lemon & Spices"],
          preparationSteps: ["Steam moong", "Toss paneer", "Mix veggies", "Season"],
          videoUrl: "https://www.youtube.com/embed/5U2z03F6Ie8"
        },
        {
          meal: "Desi-Fusion Lunch",
          menu: "Quinoa Veggie Khichdi with Curd",
          objective: "Sustained Glycogen Flow",
          ingredients: ["Quinoa", "Moong Dal", "Veggies", "Ghee", "Spices"],
          preparationSteps: ["Pressure cook grains", "Temper with spices", "Serve with Curd"],
          videoUrl: "https://www.youtube.com/embed/69nUfA8o56E"
        }
      ];
    }
    return [
      {
        meal: "Standard Induction",
        menu: "Oatmeal with Whey",
        objective: "Glycogen Prime",
        ingredients: ["Oats", "Whey Protein", "Berries"],
        preparationSteps: ["Cook oats", "Stir protein", "Top berries"],
        videoUrl: "https://www.youtube.com/embed/69nUfA8o56E"
      }
    ];
  };

  const mealBlueprint = generateMealBlueprint();

  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) { console.error(e); }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || !user) return;
    setIsAnalyzing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];

    try {
      const data = await analyzeMealImage(base64, user);
      setAnalysis(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
      setIsCapturing(false);
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(t => t.stop());
    }
  };

  const toggleTutorial = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTutorialIdx(activeTutorialIdx === idx ? null : idx);
    if (expandedMealIdx !== idx) setExpandedMealIdx(idx);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
        <div>
          <div className="flex gap-2 mb-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <Globe size={14} className="text-orange-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">{user?.origin} Heritage Sync</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <Star size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Metabolic Mastery</span>
            </div>
          </div>
          <h2 className="text-7xl font-black tracking-tighter mb-4 text-white leading-none">Metabolic <span className="text-emerald-500 italic">Studio</span></h2>
          <p className="text-slate-400 text-2xl max-w-3xl font-medium">Precision nutrient logic for your <span className="text-emerald-400 font-black uppercase">{user?.targetPhysique.replace('_', ' ')}</span> evolution.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT COLUMN: MEAL BLUEPRINT */}
        <div className="lg:col-span-6 space-y-8">
           <h4 className="flex items-center gap-4 text-xs font-black mb-6 tracking-[0.4em] uppercase text-slate-500">
             <Calendar className="text-emerald-400" size={16} /> Culinary Protocols
           </h4>
           
           <div className="space-y-6">
              {mealBlueprint.map((meal, i) => (
                <div key={i} className={`glass rounded-[3.5rem] overflow-hidden border-2 transition-all duration-700 ${expandedMealIdx === i ? 'border-emerald-500 shadow-[0_30px_70px_rgba(16,185,129,0.1)] bg-emerald-500/5' : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'}`}>
                   <button 
                     onClick={() => setExpandedMealIdx(expandedMealIdx === i ? null : i)}
                     className="w-full p-10 flex items-center justify-between text-left"
                   >
                      <div className="flex items-center gap-8">
                         <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform ${expandedMealIdx === i ? 'bg-emerald-500 text-white rotate-6' : 'bg-slate-900 text-emerald-400'}`}>
                            <UtensilsCrossed size={28} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{meal.meal}</p>
                            <h3 className="text-3xl font-black text-white tracking-tighter leading-none">{meal.menu}</h3>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         {/* HEADER TUTORIAL BUTTON */}
                         <button 
                           onClick={(e) => toggleTutorial(i, e)}
                           className={`p-4 rounded-2xl transition-all group/yt shadow-lg ${activeTutorialIdx === i ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-500 hover:text-white hover:bg-slate-800'}`}
                           title="Watch Tutorial Video"
                         >
                           <Youtube size={24} className="group-hover/yt:scale-110 transition-transform" />
                         </button>
                         {expandedMealIdx === i ? <ChevronUp size={28} className="text-emerald-400" /> : <ChevronDown size={28} className="text-slate-700" />}
                      </div>
                   </button>

                   {expandedMealIdx === i && (
                     <div className="px-10 pb-10 space-y-10 animate-in slide-in-from-top-6 duration-700">
                        {/* VIDEO PLAYER SECTION */}
                        {activeTutorialIdx === i && (
                          <div className="aspect-video glass rounded-[3rem] overflow-hidden border-2 border-emerald-500/40 shadow-2xl relative animate-in zoom-in-95 duration-500">
                             <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                                <span className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest border border-emerald-500/20">Pro Chef Protocol</span>
                                <button onClick={(e) => toggleTutorial(i, e)} className="p-3 bg-black/60 backdrop-blur-xl rounded-xl text-white hover:bg-rose-600 transition-all border border-white/10">
                                   <X size={20} />
                                </button>
                             </div>
                             <iframe 
                               width="100%" 
                               height="100%" 
                               src={`${meal.videoUrl}?autoplay=1`} 
                               title="Meal Tutorial" 
                               frameBorder="0" 
                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                               allowFullScreen 
                               className="w-full h-full"
                             />
                          </div>
                        )}

                        <div className="p-8 bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/20">
                           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                             <div>
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Target size={12} /> Strategic Objective</p>
                                <p className="text-xl font-bold text-white tracking-tight">{meal.objective}</p>
                             </div>
                             <button 
                               onClick={(e) => toggleTutorial(i, e)}
                               className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase tracking-tighter text-sm hover:bg-emerald-500 transition-all shadow-xl group/btn"
                             >
                               <Play size={18} fill="currentColor" className="group-hover/btn:scale-110 transition-transform" />
                               {activeTutorialIdx === i ? 'Hide Tutorial' : 'Watch Tutorial'}
                             </button>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-6">
                              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3"><List size={14} className="text-emerald-500" /> Precise Sourcing</h5>
                              <ul className="space-y-4">
                                 {meal.ingredients.map((ing, idx) => (
                                   <li key={idx} className="flex items-center gap-4 text-lg font-bold text-slate-300">
                                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /> 
                                      {ing}
                                   </li>
                                 ))}
                              </ul>
                           </div>
                           <div className="space-y-6">
                              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3"><Clock size={14} className="text-emerald-500" /> Executive Workflow</h5>
                              <ul className="space-y-4">
                                 {meal.preparationSteps.map((step, idx) => (
                                   <li key={idx} className="text-sm font-medium text-slate-400 leading-relaxed border-l-2 border-emerald-500/20 pl-6 group hover:border-emerald-500 transition-colors">
                                      {step}
                                   </li>
                                 ))}
                              </ul>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* RIGHT COLUMN: MEAL ANALYZER */}
        <div className="lg:col-span-6">
          <div className="glass rounded-[5rem] overflow-hidden relative aspect-square shadow-[0_40px_100px_rgba(0,0,0,0.8)] bg-slate-950 border-2 border-slate-800 group/vision">
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-slate-950/90 backdrop-blur-2xl z-50 animate-in fade-in duration-500">
                <div className="w-32 h-32 relative mb-12">
                   <div className="absolute inset-0 border-8 border-emerald-500/10 rounded-full" />
                   <div className="absolute inset-0 border-8 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                   <div className="absolute inset-0 flex items-center justify-center text-emerald-400">
                     <Flame size={48} className="animate-pulse" />
                   </div>
                </div>
                <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Mapping Metabolism...</h3>
                <p className="text-slate-500 font-mono text-xs tracking-[0.6em] uppercase mt-6">Multimodal Synthesis Loop</p>
              </div>
            )}

            {!isCapturing && !analysis && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 mesh-gradient opacity-10" />
                <div className="w-32 h-32 bg-slate-900/80 rounded-[3rem] flex items-center justify-center mb-12 border-2 border-slate-800 group-hover/vision:border-emerald-500 group-hover/vision:scale-110 transition-all cursor-pointer shadow-2xl relative z-10 duration-500" onClick={startCamera}>
                   <Camera size={56} className="text-emerald-500" />
                </div>
                <h3 className="text-6xl font-black mb-4 tracking-tighter uppercase text-white relative z-10 leading-none">Induct <span className="text-emerald-500 italic">Plate</span></h3>
                <p className="text-slate-400 max-w-sm text-2xl font-medium leading-relaxed italic relative z-10">
                  Synchronize your fuel source with the Gemini Studio Vision Engine for real-time macro-alignment.
                </p>
              </div>
            )}

            {isCapturing && (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale opacity-50" />
                <div className="absolute inset-0 p-16 flex flex-col items-center justify-center pointer-events-none">
                   <div className="scanline shadow-[0_0_20px_#10b981]" />
                   <div className="w-96 h-96 border-4 border-emerald-500/10 rounded-[5rem] relative shadow-[0_0_150px_rgba(16,185,129,0.1)]">
                      <div className="absolute top-0 left-0 w-20 h-20 border-t-8 border-l-8 border-emerald-500 rounded-tl-[3.5rem] shadow-[0_0_30px_#10b981]" />
                      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-8 border-r-8 border-emerald-500 rounded-br-[3.5rem] shadow-[0_0_30px_#10b981]" />
                   </div>
                   <div className="absolute bottom-16 w-full px-16 pointer-events-auto">
                      <button onClick={captureAndAnalyze} className="w-full py-10 bg-emerald-600 text-white rounded-[3.5rem] font-black text-4xl shadow-[0_30px_80px_rgba(16,185,129,0.4)] hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter">Capture fuel</button>
                   </div>
                </div>
              </div>
            )}

            {analysis && (
              <div className="w-full h-full flex flex-col p-16 animate-in fade-in zoom-in-95 duration-700 bg-slate-950">
                <div className="flex items-center gap-8 mb-12">
                  <div className="w-20 h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                     <PieChart size={40} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-5xl font-black tracking-tighter text-white leading-none uppercase">{analysis.item}</h3>
                    <div className="flex items-center gap-3 mt-3">
                       <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                       <p className="text-emerald-500 text-xs font-black uppercase tracking-[0.3em]">{analysis.protocolMatch}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-12">
                   {Object.entries(analysis.macros).map(([key, val]: any) => (
                     <div key={key} className="p-8 bg-slate-900 rounded-[3rem] border-2 border-slate-800 group hover:border-emerald-500/30 transition-all">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{key}</p>
                        <p className="text-4xl font-black text-white">{val}<span className="text-sm ml-1 opacity-40">{typeof val === 'number' ? 'g' : ''}</span></p>
                     </div>
                   ))}
                </div>

                <div className="p-10 bg-emerald-500/5 border-2 border-emerald-500/20 rounded-[4rem] mb-12 shadow-inner">
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4">Metabolic Impact Logic</p>
                   <p className="text-2xl font-bold leading-tight italic text-white">"{analysis.metabolicImpact} {analysis.recommendation}"</p>
                </div>

                <div className="mt-auto flex gap-6">
                  <button onClick={() => setAnalysis(null)} className="flex-1 py-8 bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] font-black text-slate-400 hover:text-white hover:bg-slate-800 transition-all uppercase tracking-tighter">Discard Scan</button>
                  <button className="px-14 py-8 bg-emerald-600 text-white rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-emerald-500 transition-all">Store Entry</button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" width="1024" height="1024" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionStudio;
