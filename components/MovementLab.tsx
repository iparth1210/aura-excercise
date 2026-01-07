import React, { useRef, useState, useEffect } from 'react';
import { Camera, Play, Square, Activity, Target, Brain, Youtube, RefreshCw, Star, AlertTriangle, CheckCircle, List, Dumbbell, ChevronRight, X, Timer, Pause, SkipForward, Clock, Plus, Minus } from 'lucide-react';
import { UserProfile, ExerciseStep } from '../types';
import { analyzeFormAI } from '../services/gemini';

const MovementLab: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formFeedback, setFormFeedback] = useState<any>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // Routine Generation
  const generateRoutine = (): ExerciseStep[] => {
    const heritage = user?.origin || 'India';
    const routine: ExerciseStep[] = [];
    
    if (heritage === 'India') {
      routine.push({
        name: "Surya Namaskar", 
        sets: "5", 
        reps: "Flow", 
        tempo: "Breath",
        instructions: ["Pranamasana (Prayer Pose)", "Hasta Uttanasana (Raised Arms)", "Padahastasana (Hand to Foot)"],
        cue: "Nasal breathing only. Sync movement with breath.", 
        videoUrl: "https://www.youtube.com/embed/fAAsBf17vI0"
      });
    }
    
    routine.push({
      name: "Bilateral Goblet Squat", 
      sets: "4", 
      reps: "12", 
      tempo: "3-1-1",
      instructions: ["Hold weight close to chest", "Sit back into hips", "Drive knees out on ascent"],
      cue: "Maintain neutral spine. Brace core.", 
      videoUrl: "https://www.youtube.com/embed/MeIiIdhvXT4"
    });

    routine.push({
      name: "Bulgarian Split Squat", 
      sets: "3", 
      reps: "10/side", 
      tempo: "2-0-1",
      instructions: ["Elevate rear foot", "Lower hips vertically", "Drive through front heel"],
      cue: "Keep torso slightly forward for glute emphasis.", 
      videoUrl: "https://www.youtube.com/embed/2C-uNgKwPLE"
    });

    return routine;
  };

  const dailyRoutine = generateRoutine();
  
  // Set & Timer State
  const [currentSet, setCurrentSet] = useState(1);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [totalRestDuration, setTotalRestDuration] = useState(60); 
  const [isResting, setIsResting] = useState(false);
  
  // Tactical Operational Timer (Configurable Mins/Secs)
  const [timerMins, setTimerMins] = useState(1);
  const [timerSecs, setTimerSecs] = useState(0);
  const [activeTimerRemaining, setActiveTimerRemaining] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lastTimerStartValue, setLastTimerStartValue] = useState(60);

  // Per-exercise rest configuration state
  const [exerciseRestSettings, setExerciseRestSettings] = useState<Record<number, number>>(
    Object.fromEntries(dailyRoutine.map((_, i) => [i, 60]))
  );

  const activeExercise = dailyRoutine[activeExerciseIdx];
  const totalSets = parseInt(activeExercise.sets) || 1;

  // Metabolic Rest Overlay Timer Logic
  useEffect(() => {
    let interval: number;
    if (isResting && restTimeLeft > 0) {
      interval = window.setInterval(() => {
        setRestTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (restTimeLeft === 0 && isResting) {
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimeLeft]);

  // Tactical Manual Timer Logic
  useEffect(() => {
    let interval: number;
    if (isTimerRunning && activeTimerRemaining > 0) {
      interval = window.setInterval(() => {
        setActiveTimerRemaining(prev => prev - 1);
      }, 1000);
    } else if (activeTimerRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeTimerRemaining]);

  const startTracking = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsTracking(true);
      setFormFeedback(null);
    } catch (e) { console.error(e); }
  };

  const captureForFeedback = async () => {
    if (!videoRef.current || !canvasRef.current || !user) return;
    setIsAnalyzing(true);
    const canvas = canvasRef.current;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
    
    try {
      const feedback = await analyzeFormAI(base64, activeExercise.name, user);
      setFormFeedback(feedback);
    } catch (e) { console.error(e); } finally { setIsAnalyzing(false); }
  };

  const handleSelectExercise = (idx: number, playTutorial: boolean = false) => {
    setActiveExerciseIdx(idx);
    setFormFeedback(null);
    setCurrentSet(1);
    setIsResting(false);
    setRestTimeLeft(0);
    resetTacticalTimer();
    if (playTutorial) {
      setShowTutorial(true);
    }
  };

  const completeSet = () => {
    const configuredRest = exerciseRestSettings[activeExerciseIdx] || 60;
    if (currentSet < totalSets) {
      setCurrentSet(prev => prev + 1);
      setTotalRestDuration(configuredRest);
      setRestTimeLeft(configuredRest);
      setIsResting(true);
      setIsTimerRunning(false); // Stop manual timer when auto rest starts
    } else {
      // Exercise Finished
      const nextIdx = (activeExerciseIdx + 1) % dailyRoutine.length;
      handleSelectExercise(nextIdx);
    }
  };

  const skipRest = () => {
    setRestTimeLeft(0);
    setIsResting(false);
  };

  const adjustRestTime = (delta: number) => {
    setExerciseRestSettings(prev => ({
      ...prev,
      [activeExerciseIdx]: Math.max(10, (prev[activeExerciseIdx] || 60) + delta)
    }));
  };

  // Tactical Timer Handlers
  const toggleTacticalTimer = () => {
    if (!isTimerRunning && activeTimerRemaining === 0) {
      resetTacticalTimer();
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTacticalTimer = () => {
    const total = timerMins * 60 + timerSecs;
    setActiveTimerRemaining(total);
    setLastTimerStartValue(total);
    setIsTimerRunning(false);
  };

  const adjustManualConfig = (type: 'min' | 'sec', delta: number) => {
    if (type === 'min') {
      const newVal = Math.max(0, Math.min(59, timerMins + delta));
      setTimerMins(newVal);
      if (!isTimerRunning) setActiveTimerRemaining(newVal * 60 + timerSecs);
    } else {
      let newVal = timerSecs + delta;
      if (newVal >= 60) newVal = 0;
      if (newVal < 0) newVal = 55;
      setTimerSecs(newVal);
      if (!isTimerRunning) setActiveTimerRemaining(timerMins * 60 + newVal);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-6 shadow-sm">
            <Activity size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Kinetic Intelligence System</span>
          </div>
          <h2 className="text-7xl font-black tracking-tighter mb-2 leading-none text-white">Movement <span className="text-indigo-500 italic">Lab</span></h2>
          <p className="text-slate-400 text-2xl font-medium">Real-time Form Correction // Current Focus: <span className="text-indigo-400 font-bold uppercase">{activeExercise.name}</span></p>
        </div>
        <div className="flex gap-4">
          {!isTracking ? (
            <button 
              onClick={startTracking} 
              className="px-12 py-5 bg-indigo-600 text-white rounded-[2.5rem] font-black shadow-[0_20px_50px_rgba(99,102,241,0.3)] flex items-center gap-4 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter text-xl"
            >
              <Camera size={24} /> Initialize Scan
            </button>
          ) : (
            <button 
              onClick={() => { setIsTracking(false); (videoRef.current?.srcObject as MediaStream)?.getTracks().forEach(t => t.stop()); }} 
              className="px-12 py-5 bg-slate-900 border-2 border-slate-800 text-slate-400 rounded-[2.5rem] font-black flex items-center gap-4 hover:bg-slate-800 transition-all text-xl"
            >
              <Square size={20} fill="currentColor" /> Kill Feed
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT COLUMN: NAVIGATION & DETAILS */}
        <div className="lg:col-span-4 space-y-10">
          <div className="glass p-10 rounded-[4rem] border-slate-800 bg-slate-950/40 shadow-2xl">
            <h4 className="flex items-center gap-4 text-xs font-black text-slate-500 uppercase tracking-[0.5em] mb-10">
               <List size={14} className="text-indigo-400" /> Kinetic Sequence
            </h4>
            <div className="space-y-4">
              {dailyRoutine.map((ex, idx) => (
                <div 
                  key={idx}
                  className={`group p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center justify-between ${
                    activeExerciseIdx === idx 
                      ? 'bg-indigo-600/10 border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.1)]' 
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => handleSelectExercise(idx)}
                >
                  <div className="flex items-center gap-6 min-w-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 transition-transform group-hover:rotate-3 ${
                      activeExerciseIdx === idx ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-800 text-slate-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="truncate">
                      <h5 className={`font-black text-lg tracking-tighter leading-tight mb-1.5 ${activeExerciseIdx === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                        {ex.name}
                      </h5>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{ex.sets} x {ex.reps} // Rest: {exerciseRestSettings[idx] || 60}s</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleSelectExercise(idx, true); }}
                    className={`p-4 rounded-2xl transition-all shadow-md group/yt ${
                      activeExerciseIdx === idx && showTutorial ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-slate-900 text-slate-500 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Watch Visual Protocol"
                  >
                    <Youtube size={22} className="group-hover/yt:scale-110 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-12 rounded-[4.5rem] bg-indigo-950/20 border-indigo-500/10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
              <Dumbbell size={120} className="text-indigo-400" />
            </div>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase leading-none">{activeExercise.name}</h3>
                <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Protocol: {activeExercise.tempo} Execution</p>
                <button 
                  onClick={() => setShowTutorial(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-600/10 border border-rose-500/20 rounded-xl text-[10px] font-black text-rose-400 uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all group"
                >
                  <Youtube size={14} className="group-hover:scale-110 transition-transform" />
                  Watch Protocol Video
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-slate-950/80 px-6 py-4 rounded-[2rem] border border-indigo-500/20 text-center shadow-lg">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Set Tracker</p>
                   <p className="text-3xl font-black text-white">{currentSet}<span className="text-slate-600 text-lg">/{totalSets}</span></p>
                </div>
                {/* REST CONFIGURATION CONTROL */}
                <div className="bg-slate-950/80 px-4 py-3 rounded-[1.5rem] border border-emerald-500/20 text-center shadow-lg">
                   <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1"><Clock size={10} /> Rest Setting</p>
                   <div className="flex items-center justify-between gap-2">
                     <button onClick={() => adjustRestTime(-5)} className="p-1 hover:text-emerald-400 text-slate-600 transition-colors"><Minus size={14} /></button>
                     <p className="text-lg font-black text-white">{exerciseRestSettings[activeExerciseIdx] || 60}s</p>
                     <button onClick={() => adjustRestTime(5)} className="p-1 hover:text-emerald-400 text-slate-600 transition-colors"><Plus size={14} /></button>
                   </div>
                </div>
              </div>
            </div>

            {/* TACTICAL TIMER UI */}
            <div className="mb-12 p-8 bg-slate-900/40 rounded-[3rem] border-2 border-slate-800 relative z-10 group/timer">
               <div className="flex items-center justify-between mb-6">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Timer size={14} className={isTimerRunning ? 'animate-pulse text-indigo-500' : ''} /> Tactical Timer
                  </p>
                  <div className="flex items-center gap-3 bg-slate-950/50 px-3 py-1.5 rounded-xl border border-slate-800">
                     <button onClick={() => adjustManualConfig('min', -1)} className="text-slate-500 hover:text-indigo-400"><Minus size={14} /></button>
                     <span className="text-xs font-black text-white w-6 text-center">{timerMins}m</span>
                     <button onClick={() => adjustManualConfig('min', 1)} className="text-slate-500 hover:text-indigo-400"><Plus size={14} /></button>
                     <div className="w-px h-4 bg-slate-800 mx-1" />
                     <button onClick={() => adjustManualConfig('sec', -5)} className="text-slate-500 hover:text-indigo-400"><Minus size={14} /></button>
                     <span className="text-xs font-black text-white w-6 text-center">{timerSecs}s</span>
                     <button onClick={() => adjustManualConfig('sec', 5)} className="text-slate-500 hover:text-indigo-400"><Plus size={14} /></button>
                  </div>
               </div>

               <div className="flex items-center justify-between gap-6">
                  <div className="flex-1 text-5xl font-black text-white font-mono tracking-tighter shadow-inner bg-slate-950/80 py-4 px-6 rounded-2xl border border-indigo-500/20 text-center">
                    {formatTime(activeTimerRemaining)}
                  </div>
                  <div className="flex flex-col gap-2">
                     <button 
                      onClick={toggleTacticalTimer}
                      className={`p-5 rounded-2xl transition-all shadow-xl ${isTimerRunning ? 'bg-amber-600 text-white shadow-amber-500/20' : 'bg-indigo-600 text-white shadow-indigo-500/30'}`}
                     >
                        {isTimerRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                     </button>
                     <button 
                      onClick={resetTacticalTimer}
                      className="p-3 bg-slate-800 text-slate-500 rounded-xl hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
                     >
                        <RefreshCw size={18} />
                     </button>
                  </div>
               </div>
               
               {/* Progress Bar for Manual Timer */}
               <div className="mt-6 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-indigo-500 transition-all duration-1000 ${isTimerRunning ? 'opacity-100 shadow-[0_0_10px_#6366f1]' : 'opacity-40'}`} 
                    style={{ width: `${(activeTimerRemaining / lastTimerStartValue) * 100}%` }} 
                  />
               </div>
            </div>

            <div className="space-y-8 mb-12 relative z-10">
               {activeExercise.instructions.map((step, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/20 group-hover:bg-indigo-600/20 transition-colors">
                       <span className="text-[10px] font-black text-indigo-400">{i + 1}</span>
                    </div>
                    <p className="text-lg text-slate-300 font-medium leading-relaxed">{step}</p>
                  </div>
               ))}
            </div>
            <div className="p-8 bg-slate-900/60 rounded-[3rem] border border-slate-800 relative z-10 shadow-inner">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                 <Brain size={14} className="animate-pulse" /> Neural Trigger
               </p>
               <p className="text-base text-slate-200 italic leading-relaxed font-medium">"{activeExercise.cue}"</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VISION FEED & FEEDBACK */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {showTutorial && (
            <div className="glass rounded-[5rem] overflow-hidden aspect-video relative animate-in slide-in-from-top-12 duration-700 border-2 border-indigo-500/30 shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-30">
               <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-10">
                  <h5 className="text-lg font-black tracking-tighter uppercase text-white drop-shadow-md flex items-center gap-3">
                    <Youtube size={24} className="text-rose-500" /> Visual Tutorial: {activeExercise.name}
                  </h5>
                  <button 
                    onClick={() => setShowTutorial(false)}
                    className="p-5 bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] text-white hover:bg-rose-600 transition-all border border-slate-700 shadow-xl"
                  >
                    <X size={24} />
                  </button>
               </div>
               <iframe 
                width="100%" 
                height="100%" 
                src={`${activeExercise.videoUrl}?autoplay=1`} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen 
                className="w-full h-full"
               />
            </div>
          )}

          <div className="glass rounded-[5.5rem] overflow-hidden relative flex-1 min-h-[700px] border-2 border-slate-800 shadow-[0_60px_150px_rgba(0,0,0,0.9)] bg-black group/vision">
            {isAnalyzing && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
                 <div className="w-32 h-32 relative mb-10">
                   <div className="absolute inset-0 border-8 border-indigo-500/10 rounded-full" />
                   <div className="absolute inset-0 border-8 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                   <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                     <Target size={48} className="animate-pulse" />
                   </div>
                 </div>
                 <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">Analyzing Kinetics...</h3>
                 <p className="text-slate-500 font-mono text-xs tracking-[0.6em] uppercase">Grounding Form Metrics</p>
              </div>
            )}

            {isResting && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-3xl animate-in zoom-in-95 duration-500 p-16 text-center">
                 <div className="w-64 h-64 relative mb-12">
                    <svg className="w-full h-full -rotate-90">
                       <circle cx="50%" cy="50%" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-900" />
                       <circle 
                        cx="50%" cy="50%" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        className="text-indigo-500 transition-all duration-1000"
                        strokeDasharray="754"
                        strokeDashoffset={754 * (1 - restTimeLeft / totalRestDuration)}
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-1">Resting</p>
                       <p className="text-8xl font-black text-white tracking-tighter">{restTimeLeft}<span className="text-2xl text-slate-600 font-bold ml-1">s</span></p>
                    </div>
                 </div>
                 <h3 className="text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">Metabolic Reset</h3>
                 <p className="text-slate-400 text-xl font-medium max-w-md mb-12 italic">"Focus on deep nasal breathing. Downregulate your heart rate for the next operational block."</p>
                 <button 
                  onClick={skipRest}
                  className="px-16 py-6 bg-white text-slate-950 rounded-[2.5rem] font-black text-2xl flex items-center gap-4 hover:scale-105 transition-all shadow-2xl"
                 >
                   <SkipForward size={28} fill="currentColor" /> Skip Protocol
                 </button>
              </div>
            )}
            
            {isTracking ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover transition-opacity duration-1000"
                />
                <canvas ref={canvasRef} className="hidden" width="1024" height="1024" />
                <div className="absolute inset-0 pointer-events-none p-20">
                   <div className="w-full h-full border-2 border-indigo-500/10 rounded-[4rem] relative">
                      <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-indigo-500 rounded-tl-[3.5rem] shadow-[0_0_30px_rgba(99,102,241,0.5)]" />
                      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-indigo-500 rounded-br-[3.5rem] shadow-[0_0_30px_rgba(99,102,241,0.5)]" />
                      <div className="scanline" />
                   </div>
                </div>

                {/* Tracking HUD Controls */}
                <div className="absolute bottom-16 left-0 right-0 px-16 z-20 flex gap-8">
                   <button 
                    onClick={captureForFeedback}
                    className="flex-1 py-10 bg-indigo-600 text-white rounded-[3.5rem] font-black text-3xl shadow-[0_30px_80px_rgba(99,102,241,0.5)] hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter flex items-center justify-center gap-6"
                   >
                     <Target size={32} /> Analysis Scan
                   </button>
                   <button 
                    onClick={completeSet}
                    className="flex-1 py-10 bg-white text-slate-950 rounded-[3.5rem] font-black text-3xl shadow-[0_30px_80px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter flex items-center justify-center gap-6"
                   >
                     <CheckCircle size={32} fill="currentColor" /> Set Complete
                   </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-16 text-center relative overflow-hidden">
                 <div className="absolute inset-0 mesh-gradient opacity-20" />
                 <div className="w-32 h-32 bg-slate-900/80 rounded-[3rem] border-2 border-slate-800 flex items-center justify-center mb-12 group-hover/vision:border-indigo-500 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 group-hover/vision:scale-110 duration-500">
                    <Camera size={56} className="text-indigo-500" />
                 </div>
                 <h3 className="text-7xl font-black mb-8 tracking-tighter uppercase text-white relative z-10 leading-none">Vision Logic <span className="text-indigo-500 italic">OFFLINE</span></h3>
                 <p className="text-slate-400 max-w-xl text-2xl font-medium leading-relaxed italic relative z-10 px-4">
                   Activate the Kinetic Tracker to initiate high-fidelity form critique and set management grounded in elite performance research.
                 </p>
              </div>
            )}

            {formFeedback && (
              <div className="absolute top-16 left-16 right-16 bottom-44 bg-slate-950/98 backdrop-blur-3xl border-2 border-indigo-500/40 rounded-[5rem] p-16 z-40 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-700 shadow-[0_50px_150px_rgba(0,0,0,1)]">
                 <div className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-8">
                       <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_50px_rgba(99,102,241,0.4)]">
                          <CheckCircle size={40} />
                       </div>
                       <div>
                          <h4 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Fusion Sync Report</h4>
                          <div className="flex items-center gap-3 mt-3">
                             <div className="h-2 w-48 bg-slate-900 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" style={{ width: `${formFeedback.overallScore}%` }} />
                             </div>
                             <p className="text-indigo-400 text-sm font-black uppercase tracking-[0.4em]">Efficiency: {formFeedback.overallScore}%</p>
                          </div>
                       </div>
                    </div>
                    <button onClick={() => setFormFeedback(null)} className="p-6 bg-slate-900 border-2 border-slate-800 rounded-3xl text-slate-500 hover:text-white hover:border-slate-600 transition-all shadow-xl">
                       <RefreshCw size={32} />
                    </button>
                 </div>

                 <div className="space-y-12">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                       <div className="p-10 bg-slate-900/60 rounded-[4rem] border-2 border-slate-800 hover:border-indigo-500/30 transition-all group/card">
                          <p className="text-[12px] font-black text-emerald-400 uppercase tracking-[0.5em] mb-6 flex items-center gap-4">
                             <CheckCircle size={18} /> Kinetic Alignment
                          </p>
                          <p className="text-2xl text-slate-200 font-medium leading-relaxed italic">"{formFeedback.alignmentNotes}"</p>
                       </div>
                       <div className="p-10 bg-rose-950/20 rounded-[4rem] border-2 border-rose-500/30 hover:border-rose-500/50 transition-all">
                          <p className="text-[12px] font-black text-rose-400 uppercase tracking-[0.5em] mb-6 flex items-center gap-4">
                             <AlertTriangle size={18} /> Structural Alert
                          </p>
                          <p className="text-2xl text-rose-100/90 font-medium leading-relaxed italic">"{formFeedback.safetyAlerts}"</p>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <h5 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.6em] px-4 flex items-center gap-3">
                          <Star size={16} fill="currentColor" /> Pro Form Corrections
                       </h5>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {formFeedback.eliteCues.map((cue: string, i: number) => (
                             <div key={i} className="flex flex-col gap-6 p-10 bg-indigo-600/5 border-2 border-indigo-500/10 rounded-[3.5rem] group/cue hover:bg-indigo-600/10 transition-all hover:-translate-y-2">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 group-hover/cue:bg-indigo-600 group-hover/cue:text-white transition-all shadow-inner">
                                   <Star size={24} />
                                </div>
                                <p className="text-xl font-black text-white leading-snug tracking-tighter italic">"{cue}"</p>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementLab;