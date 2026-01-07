
import React, { useState } from 'react';
import { ChevronRight, ArrowRight, Zap, ShieldCheck, Sparkles, Brain, Dumbbell, Utensils, Target, Moon, Activity, Layout, Trophy, Sun, Check, MapPin, Globe, Home, Clock, ImageIcon, RefreshCw, Search } from 'lucide-react';
import { UserProfile, PhysiqueType } from '../types';
import { generatePhysiqueVisual, generateGlobalBlueprint } from '../services/gemini';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    age: 28,
    weight: 80,
    height: "180cm",
    primaryGoals: [],
    dietaryPreferences: [],
    experienceLevel: 'intermediate',
    sleepHabit: 'early_bird',
    stressLevel: 'moderate',
    equipmentAccess: [],
    origin: '',
    residence: '',
    targetPhysique: 'athletic_lean',
    targetTimeline: '12 Weeks',
    completedOnboarding: true
  });

  const toggleMultiSelect = (field: keyof UserProfile, value: string) => {
    setProfile(prev => {
      const current = (prev[field] as string[]) || [];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const generateAndDeploy = async () => {
    setIsGenerating(true);
    setLoadingText('Synthesizing Physique Visualization...');
    try {
      const visualUrl = await generatePhysiqueVisual(profile.targetPhysique || 'athletic_lean');
      
      setLoadingText('Grounding Biological Heritage & Global Context...');
      const blueprint = await generateGlobalBlueprint(profile);
      
      const finalProfile = { 
        ...profile, 
        physiqueVisualUrl: visualUrl || undefined,
        personalizedProtocols: blueprint.protocols,
        personalizedRoutine: blueprint.routine,
        personalizedMeals: blueprint.meals
      } as UserProfile;
      
      onComplete(finalProfile);
    } catch (e) {
      console.error(e);
      onComplete(profile as UserProfile);
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    {
      title: "Identity Induction",
      desc: "Synchronizing your biological signature.",
      component: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Designation</label>
            <input 
              type="text" 
              placeholder="Full Name / Handle" 
              className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-2xl font-black text-white focus:border-indigo-500 outline-none transition-all shadow-inner"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Solar Age</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-xl font-bold text-white focus:border-indigo-500 outline-none transition-all"
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Mass (kg)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-xl font-bold text-white focus:border-indigo-500 outline-none transition-all"
                  value={profile.weight}
                  onChange={(e) => setProfile({...profile, weight: parseInt(e.target.value)})}
                />
             </div>
          </div>
        </div>
      )
    },
    {
      title: "Geographic Fusion",
      desc: "Input your heritage and current residence for global grounding.",
      component: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2"><Globe size={12}/> Origin / Biological Heritage</label>
            <input 
              type="text" 
              placeholder="e.g. West African, South Indian, Nordic..." 
              className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-xl font-bold text-white focus:border-orange-500 outline-none transition-all"
              value={profile.origin}
              onChange={(e) => setProfile({...profile, origin: e.target.value})}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2"><MapPin size={12}/> Current Residence (City/Country)</label>
            <input 
              type="text" 
              placeholder="e.g. London, UK / New York, USA..." 
              className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-xl font-bold text-white focus:border-sky-500 outline-none transition-all"
              value={profile.residence}
              onChange={(e) => setProfile({...profile, residence: e.target.value})}
            />
          </div>
        </div>
      )
    },
    {
      title: "Physique Blueprint",
      desc: "Select your target aesthetic and operational timeline.",
      component: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Goal Physique Type</label>
            <div className="grid grid-cols-2 gap-4">
               {[
                { id: 'shredded', label: 'The Shredded Pro', desc: 'Max Definition' },
                { id: 'mass_monster', label: 'Mass Monster', desc: 'Max Hypertrophy' },
                { id: 'athletic_lean', label: 'Athletic Lean', desc: 'MMA / Sprinter' },
                { id: 'functional_power', label: 'Functional Power', desc: 'Strength / Rugged' }
               ].map(opt => (
                 <button 
                   key={opt.id}
                   onClick={() => setProfile({...profile, targetPhysique: opt.id as PhysiqueType})}
                   className={`flex flex-col items-start p-5 rounded-[2rem] border-2 transition-all gap-1 text-left ${profile.targetPhysique === opt.id ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                 >
                   <span className="font-black tracking-tighter text-lg">{opt.label}</span>
                   <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{opt.desc}</span>
                 </button>
               ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Mission Timeline</label>
            <div className="grid grid-cols-3 gap-3">
              {['8 Weeks', '12 Weeks', '24 Weeks'].map(opt => (
                <button 
                  key={opt}
                  onClick={() => setProfile({...profile, targetTimeline: opt})}
                  className={`py-4 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${profile.targetTimeline === opt ? 'bg-white text-slate-950 border-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Performance Vector",
      desc: "Define your primary objectives (Select all).",
      component: (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {[
            { id: 'hypertrophy', label: 'Hypertrophy', desc: 'Muscle Density', icon: Dumbbell },
            { id: 'longevity', label: 'Longevity', desc: 'Cellular Health', icon: ShieldCheck },
            { id: 'cognitive', label: 'Cognition', desc: 'Neural Focus', icon: Brain },
            { id: 'fat_loss', label: 'Lean State', desc: 'Metabolism', icon: Target },
          ].map(goal => (
            <button 
              key={goal.id}
              onClick={() => toggleMultiSelect('primaryGoals', goal.id)}
              className={`flex flex-col items-start p-6 rounded-[2.5rem] border-2 transition-all gap-1 relative overflow-hidden ${
                profile.primaryGoals?.includes(goal.id) ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              {profile.primaryGoals?.includes(goal.id) && <Check size={16} className="absolute top-4 right-4 text-indigo-400" />}
              <goal.icon size={28} className={profile.primaryGoals?.includes(goal.id) ? 'text-indigo-400 mb-2' : 'text-slate-700 mb-2'} />
              <span className="font-black tracking-tighter text-lg">{goal.label}</span>
              <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{goal.desc}</span>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Metabolic Strategy",
      desc: "Select all applicable dietary frameworks.",
      component: (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {[
            { id: 'omnivore', label: 'Standard/Omnivore', icon: Utensils },
            { id: 'vegetarian', label: 'Vegetarian', icon: Sparkles },
            { id: 'vegan', label: 'Plant Based', icon: Sun },
            { id: 'keto', label: 'Ketogenic', icon: Zap },
            { id: 'paleo', label: 'Paleo/Primal', icon: ShieldCheck },
            { id: 'fasting', label: 'IF / 16:8 Window', icon: Activity },
          ].map(diet => (
            <button 
              key={diet.id}
              onClick={() => toggleMultiSelect('dietaryPreferences', diet.id)}
              className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-4 relative overflow-hidden text-left ${
                profile.dietaryPreferences?.includes(diet.id) ? 'bg-emerald-600/10 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {profile.dietaryPreferences?.includes(diet.id) && <Check size={14} className="absolute top-4 right-4 text-emerald-400" />}
              <diet.icon size={20} />
              <span className="font-bold text-xs">{diet.label}</span>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Tactical Environment",
      desc: "Available infrastructure (Select all).",
      component: (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {[
            { id: 'full_gym', label: 'Commercial Complex', desc: 'Full Gym Access', icon: Layout },
            { id: 'home_gym', label: 'Personal Base', desc: 'Home Setup / Dumbbells', icon: ShieldCheck },
            { id: 'outdoor', label: 'Urban Field', desc: 'Parks / Calisthenics', icon: Globe },
            { id: 'none', label: 'Minimalist', desc: 'Bodyweight Focus', icon: Activity },
          ].map(env => (
            <button 
              key={env.id}
              onClick={() => toggleMultiSelect('equipmentAccess', env.id)}
              className={`w-full flex items-center p-6 rounded-[2rem] border-2 transition-all gap-5 relative overflow-hidden ${
                profile.equipmentAccess?.includes(env.id) ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-slate-900/50 border-slate-800 text-slate-400'
              }`}
            >
              {profile.equipmentAccess?.includes(env.id) && <Check size={16} className="absolute top-4 right-4 text-indigo-400" />}
              <div className={`p-3 rounded-xl ${profile.equipmentAccess?.includes(env.id) ? 'bg-indigo-500 text-white' : 'bg-slate-800'}`}>
                <env.icon size={20} />
              </div>
              <div className="text-left">
                <p className="font-black text-lg leading-none mb-1">{env.label}</p>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{env.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Bio-Clock",
      desc: "Synchronize your circadian rhythm.",
      component: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Sleep Habit</label>
            <div className="flex gap-3">
              {['early_bird', 'night_owl', 'irregular'].map(opt => (
                <button 
                  key={opt}
                  onClick={() => setProfile({...profile, sleepHabit: opt as any})}
                  className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${profile.sleepHabit === opt ? 'bg-white text-slate-950 border-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                >
                  {opt.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Stress Threshold</label>
            <div className="flex gap-3">
              {['low', 'moderate', 'high'].map(opt => (
                <button 
                  key={opt}
                  onClick={() => setProfile({...profile, stressLevel: opt as any})}
                  className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${profile.stressLevel === opt ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      generateAndDeploy();
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="w-32 h-32 relative mb-12">
           <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full" />
           <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center"><RefreshCw className="text-indigo-400 animate-pulse" size={48} /></div>
        </div>
        <h3 className="text-4xl font-black mb-4 tracking-tighter text-white">{loadingText}</h3>
        <p className="text-slate-500 text-lg font-mono tracking-[0.3em] uppercase opacity-50">PRO_ELITE_SYNTHESIS_LOOP</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden text-center">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      
      <div className="max-w-2xl w-full glass p-12 md:p-16 rounded-[4rem] relative z-10 border-2 border-indigo-500/20 shadow-[0_0_100px_rgba(99,102,241,0.1)] text-left">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Zap size={24} fill="currentColor" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 transition-all duration-700 ease-out shadow-[0_0_10px_#6366f1]" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Global Protocol</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-[0.2em]">{step + 1} / {steps.length}</span>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-5xl font-black tracking-tighter mb-4 text-white leading-none">{steps[step].title}</h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">{steps[step].desc}</p>
        </div>

        <div className="min-h-[340px] flex flex-col justify-center">
          {steps[step].component}
        </div>

        <div className="mt-12 flex gap-4">
          {step > 0 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="p-6 bg-slate-900 border-2 border-slate-800 rounded-3xl font-black text-slate-500 hover:text-white transition-all"
            >
              <ArrowRight size={24} className="rotate-180" />
            </button>
          )}
          <button 
            onClick={next}
            disabled={(step === 0 && !profile.name) || (step === 1 && (!profile.origin || !profile.residence))}
            className="flex-1 py-6 bg-white text-slate-950 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-20 disabled:grayscale"
          >
            {step === steps.length - 1 ? 'Deploy Identity' : 'Advance'} 
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
