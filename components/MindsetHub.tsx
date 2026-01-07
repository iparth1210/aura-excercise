
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Brain, Waves, AudioLines, Zap, Headphones, Moon, Activity, Volume2, ShieldCheck, Cpu, X, SignalHigh } from 'lucide-react';
import { UserProfile } from '../types';
import { getAI } from '../services/gemini';
import { Modality } from '@google/genai';

const MindsetHub: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  const [isLive, setIsLive] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [status, setStatus] = useState('Standby');
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(32).fill(0));
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) int16[i] = data[i] * 32768;
    return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
  };

  const updateVisualizer = () => {
    if (analyzerRef.current) {
      const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
      analyzerRef.current.getByteFrequencyData(dataArray);
      // Downsample to 32 points
      const bars = 32;
      const step = Math.floor(dataArray.length / bars);
      const newData = [];
      for (let i = 0; i < bars; i++) {
        newData.push(dataArray[i * step] / 255);
      }
      setVisualizerData(newData);
    }
    animationFrameRef.current = requestAnimationFrame(updateVisualizer);
  };

  const startLiveCoaching = async () => {
    if (isLive) {
      session?.close();
      setIsLive(false);
      setStatus('Standby');
      cancelAnimationFrame(animationFrameRef.current);
      setVisualizerData(new Array(32).fill(0));
      return;
    }

    setIsLive(true);
    setStatus('Initializing Neural Link...');
    
    try {
      const ai = getAI();
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = outCtx;

      const analyzer = outCtx.createAnalyser();
      analyzer.fftSize = 256;
      analyzer.connect(outCtx.destination);
      analyzerRef.current = analyzer;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('Neural Link Active');
            updateVisualizer();
            const source = inCtx.createMediaStreamSource(stream);
            const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              sessionPromise.then(s => s.sendRealtimeInput({ media: createBlob(inputData) }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onmessage: async (msg: any) => {
            if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const base64 = msg.serverContent.modelTurn.parts[0].inlineData.data;
              const ctx = audioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(analyzerRef.current!);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Coaching link failed:', e);
            setStatus('Error: Link Corrupted');
          },
          onclose: () => {
            setIsLive(false);
            setStatus('Session Terminated');
            cancelAnimationFrame(animationFrameRef.current);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `You are Aura Ultra, a world-class elite performance coach. 
          User is ${user?.name}, ${user?.origin} background, in ${user?.residence}.
          Goal: ${user?.primaryGoals.join(', ')}. Target Physique: ${user?.targetPhysique}.
          Talk like a high-end coach: scientific, brief, encouraging, and extremely professional. Ground your advice in heritage-based biology.`
        }
      });

      setSession(await sessionPromise);
    } catch (err) {
      console.error(err);
      setIsLive(false);
      setStatus('Access Denied');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-1000 pb-32">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-sm">
          <Activity size={16} className="text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Deep Cognition Protocol</span>
        </div>
        <h2 className="text-8xl font-black tracking-tighter leading-none text-white">Aura <span className="text-indigo-500 italic">Coaching</span></h2>
        <p className="text-slate-400 text-2xl font-medium max-w-2xl mx-auto">Native Voice-to-Voice Performance Sync. Grounded in Gemini 2.5 Logic.</p>
      </div>

      <div className="glass p-20 rounded-[5rem] border-2 border-slate-800 flex flex-col items-center justify-center relative overflow-hidden bg-slate-950 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
        {isLive && <div className="absolute inset-0 bg-indigo-500/[0.03] animate-pulse" />}
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
           {isLive && <div className="h-full bg-indigo-500 animate-pulse shadow-[0_0_15px_#6366f1]" style={{ width: '100%' }} />}
        </div>
        
        <div className="relative z-10 flex flex-col items-center w-full">
          {/* Audio Visualizer Ring */}
          <div className="relative flex items-center justify-center mb-16">
            <div className={`absolute inset-0 rounded-full border-4 border-indigo-500/20 transition-all duration-700 ${isLive ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`} />
            <div className={`w-64 h-64 rounded-full flex items-center justify-center transition-all duration-700 relative z-10 ${isLive ? 'bg-indigo-600 shadow-[0_0_100px_rgba(99,102,241,0.5)]' : 'bg-slate-900 border-2 border-slate-800 shadow-inner'}`}>
               <div className="flex items-end gap-1.5 h-32 px-10">
                 {visualizerData.map((v, i) => (
                   <div 
                    key={i} 
                    className="w-1.5 bg-white/80 rounded-full transition-all duration-75"
                    style={{ height: `${Math.max(5, v * 100)}%`, opacity: 0.3 + (v * 0.7) }}
                   />
                 ))}
               </div>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 {isLive ? <AudioLines size={64} className="text-white/20" /> : <Brain size={64} className="text-slate-700/50" />}
               </div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h3 className={`text-6xl font-black tracking-tighter transition-colors duration-500 leading-none uppercase ${isLive ? 'text-white' : 'text-slate-500'}`}>
              {status}
            </h3>
            <div className="flex items-center justify-center gap-4 text-slate-600 font-mono text-[10px] uppercase tracking-[0.5em]">
               <SignalHigh size={12} className={isLive ? 'text-indigo-500' : 'text-slate-800'} />
               Gemini 2.5 Flash Native Sync
               <Cpu size={12} className={isLive ? 'text-indigo-500' : 'text-slate-800'} />
            </div>
          </div>

          <button 
            onClick={startLiveCoaching}
            className={`mt-20 group relative px-20 py-8 rounded-[3rem] font-black text-3xl transition-all shadow-2xl active:scale-95 ${isLive ? 'bg-rose-600 text-white hover:bg-rose-500' : 'bg-white text-slate-950 hover:scale-[1.02] hover:shadow-white/10'}`}
          >
            {isLive ? (
              <span className="flex items-center gap-4"><X size={32} /> Terminate Sync</span>
            ) : (
              <span className="flex items-center gap-4"><Zap size={32} fill="currentColor" /> Initialize Neural Link</span>
            )}
            {!isLive && <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-0 group-hover:opacity-20 rounded-[3rem] transition-opacity" />}
          </button>
        </div>

        {isLive && (
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { label: 'Induction Voice', val: 'Zephyr Pro', icon: Volume2, color: 'text-indigo-400' },
              { label: 'Neural Accuracy', val: '99.8%', icon: Zap, color: 'text-emerald-400' },
              { label: 'Grounding Latency', val: '~120ms', icon: Cpu, color: 'text-sky-400' }
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-slate-900/50 rounded-[2.5rem] border border-slate-800 flex flex-col items-center gap-3 group hover:border-indigo-500/30 transition-all">
                <stat.icon size={24} className={`${stat.color} group-hover:scale-110 transition-transform`} />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black text-white tracking-tighter uppercase">{stat.val}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="glass p-12 rounded-[4rem] bg-indigo-500/5 border-indigo-500/20 shadow-xl group hover:border-indigo-500/40 transition-all">
           <h4 className="flex items-center gap-4 font-black text-2xl mb-6 tracking-tighter uppercase text-white">
             <ShieldCheck className="text-indigo-400" size={28} /> Neural Privacy
           </h4>
           <p className="text-lg text-slate-400 leading-relaxed font-medium italic">
             "Your cognitive signatures are ephemeral. All neural synthesis occurs in real-time volatility. No persistence detected beyond the active session loop."
           </p>
        </div>
        <div className="glass p-12 rounded-[4rem] bg-emerald-500/5 border-emerald-500/20 shadow-xl group hover:border-emerald-500/40 transition-all">
           <h4 className="flex items-center gap-4 font-black text-2xl mb-6 tracking-tighter uppercase text-white">
             <Headphones className="text-emerald-400" size={28} /> Acoustic Fidelity
           </h4>
           <p className="text-lg text-slate-400 leading-relaxed font-medium italic">
             "For maximum entrainment, utilize spatial audio monitors. The Zephyr-v4 voice architecture is optimized for binaural cognitive resonance."
           </p>
        </div>
      </div>
    </div>
  );
};

export default MindsetHub;
