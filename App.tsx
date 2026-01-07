
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  BrainCircuit, 
  BarChart3, 
  Menu, 
  User, 
  Zap,
  Fingerprint,
  ClipboardList,
  Utensils,
  Globe
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import MovementLab from './components/MovementLab';
import MindsetHub from './components/MindsetHub';
import DeepAnalysis from './components/DeepAnalysis';
import BioSync from './components/BioSync';
import Protocols from './components/Protocols';
import NutritionStudio from './components/NutritionStudio';
import PerformanceNetwork from './components/PerformanceNetwork';
import Onboarding from './components/Onboarding';
import { AppTab, UserProfile } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('aura_user_profile');
    if (saved) {
      setUserProfile(JSON.parse(saved));
    } else {
      setActiveTab(AppTab.ONBOARDING);
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('aura_user_profile', JSON.stringify(profile));
    setActiveTab(AppTab.DASHBOARD);
  };

  const navigation = [
    { id: AppTab.DASHBOARD, label: 'Pulse', icon: LayoutDashboard },
    { id: AppTab.MOVEMENT, label: 'Kinetics', icon: Activity },
    { id: AppTab.MINDSET, label: 'Cognition', icon: BrainCircuit },
    { id: AppTab.BIO_SYNC, label: 'Bio-Sync', icon: Fingerprint },
    { id: AppTab.NUTRITION, label: 'Metabolic', icon: Utensils },
    { id: AppTab.PROTOCOLS, label: 'Protocols', icon: ClipboardList },
    { id: AppTab.NETWORK, label: 'Network', icon: Globe },
    { id: AppTab.ANALYSIS, label: 'Optimization', icon: BarChart3 },
  ];

  if (activeTab === AppTab.ONBOARDING) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD: return <Dashboard user={userProfile} />;
      case AppTab.MOVEMENT: return <MovementLab user={userProfile} />;
      case AppTab.MINDSET: return <MindsetHub user={userProfile} />;
      case AppTab.BIO_SYNC: return <BioSync />;
      case AppTab.NUTRITION: return <NutritionStudio user={userProfile} />;
      case AppTab.PROTOCOLS: return <Protocols user={userProfile} />;
      case AppTab.NETWORK: return <PerformanceNetwork />;
      case AppTab.ANALYSIS: return <DeepAnalysis user={userProfile} />;
      default: return <Dashboard user={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/50 transform transition-all duration-500 ease-in-out md:relative md:translate-x-0 no-print ${isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-indigo-500/10' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center gap-4 mb-16 px-2">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3">
              <Zap className="text-white fill-white" size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">AURA <span className="text-indigo-500">ULTRA</span></h1>
              <p className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold opacity-80">v3.0.0 Genesis</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                  activeTab === item.id 
                    ? 'bg-indigo-600/10 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                    : 'text-slate-500 hover:bg-slate-800/30 hover:text-slate-300'
                }`}
              >
                <item.icon size={20} className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110 text-indigo-400' : 'group-hover:scale-105'}`} />
                <span className="font-semibold tracking-tight text-sm">{item.label}</span>
                {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />}
              </button>
            ))}
          </nav>

          <div className="mt-8">
            <div className="glass p-5 rounded-3xl border border-slate-700/50 relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab(AppTab.ONBOARDING)}>
              <div className="absolute top-0 right-0 p-1 opacity-20">
                <Fingerprint size={48} className="text-indigo-500" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-indigo-500/50 flex items-center justify-center">
                  <User size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-tight">{userProfile?.name || 'New Athlete'}</p>
                  <p className="text-[10px] text-emerald-400 font-mono font-bold tracking-widest uppercase">{userProfile?.experienceLevel || 'Initializing'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="md:hidden flex items-center justify-between p-6 bg-slate-950/50 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 no-print">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400">
            <Menu size={28} />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="text-indigo-500" size={20} />
            <h2 className="text-xl font-bold tracking-tighter uppercase">Aura</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700" />
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </div>
      </main>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500 no-print"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
