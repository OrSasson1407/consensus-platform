import React, { useState } from 'react';
import App from '../App';
import { Smartphone, BookOpen, Terminal, CheckCircle2, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

export default function WebShell() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const steps = [
    { id: 'step-1', title: 'Install Dependencies', cmd: 'npm install' },
    { id: 'step-2', title: 'Start Expo Server', cmd: 'npx expo start' },
    { id: 'step-3', title: 'Run on Device', desc: 'Scan the QR code with your Expo Go app (iOS/Android) to run instantly.' }
  ];

  return (
    <div id="web-shell-root" className="min-h-screen bg-[#07070a] text-[#e4e1e9] font-sans antialiased flex flex-col selection:bg-[#7c3aed]/30">
      {/* Premium Workspace Header */}
      <header className="border-b border-[#1f1f35]/50 bg-[#0d0d1a]/85 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#7c3aed] text-white font-extrabold text-sm shadow-md shadow-[#7c3aed]/30">
              CS
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                ConsensuS <span className="text-xs bg-[#7c3aed]/10 text-[#d2bbff] px-2.5 py-0.5 rounded-full border border-[#7c3aed]/20 font-medium font-mono">React Native Core</span>
              </h1>
              <p className="text-xs text-[#958da1]">Active Workspace contains standard Expo codebase ready for iOS / Android</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 bg-[#4edea3]/10 border border-[#4edea3]/20 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="text-xs font-semibold text-[#4edea3]">Production Expo Source Active</span>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* LEFT COLUMN: Expo Developer Guide & Configuration Details */}
        <section id="dev-guide-workspace" className="lg:col-span-5 space-y-6">
          <div className="bg-[#0f0f18] border border-[#1f1f35] rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c3aed]/5 blur-3xl rounded-full pointer-events-none" />
            
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-[#7c3aed]" />
              Expo Native Launcher
            </h2>
            <p className="text-xs text-[#958da1] leading-relaxed mb-6">
              You are looking at a real React Native repository. The root <code className="text-[#d2bbff] bg-[#1a1a2e] px-1 py-0.5 rounded">App.tsx</code> and <code className="text-[#d2bbff] bg-[#1a1a2e] px-1 py-0.5 rounded">src/screens/</code> files are pure Expo. Run them on physical devices using the following guide:
            </p>

            {/* Instruction Steps */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="border-l-2 border-[#1f1f35] pl-4 py-1 flex flex-col gap-1.5 relative hover:border-[#7c3aed]/50 transition-colors">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#07070a] border-2 border-[#1f1f35] flex items-center justify-center text-[9px] font-bold text-[#958da1]">
                    {index + 1}
                  </div>
                  <h3 className="text-xs font-bold text-[#e4e1e9] ml-1">{step.title}</h3>
                  {step.cmd ? (
                    <div className="flex items-center justify-between gap-2 bg-[#08080c] border border-[#1f1f35] p-2 rounded-xl mt-1 select-all font-mono text-[11px] text-[#ccc3d8]">
                      <span>$ {step.cmd}</span>
                      <button
                        onClick={() => copyToClipboard(step.cmd, step.id)}
                        className="text-[10px] text-[#7c3aed] hover:text-[#d2bbff] font-semibold px-2 py-1 bg-[#1a1a2e] rounded-md transition"
                      >
                        {copiedCmd === step.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#958da1] ml-1 leading-relaxed">{step.desc}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-[#7c3aed]/5 border border-[#7c3aed]/20 flex gap-3">
              <Sparkles className="w-5 h-5 text-[#d2bbff] shrink-0" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Interactive State Live-Sync</h4>
                <p className="text-[10px] text-[#d2bbff] leading-relaxed">
                  Web-simulation translates native views to HTML coordinates. Try editing the screen files in <code className="bg-[#1f1f35]/50 px-1 py-0.5 rounded">src/screens/</code> directly and watch the emulator reflect your changes!
                </p>
              </div>
            </div>
          </div>

          {/* Core File Tree Breakdown */}
          <div className="bg-[#0f0f18] border border-[#1f1f35] rounded-3xl p-6 shadow-xl">
            <h2 className="text-xs font-bold text-[#958da1] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#7c3aed]" />
              Expo Project File Map
            </h2>
            <div className="space-y-3 font-mono text-xs text-[#ccc3d8]">
              <div className="flex items-center gap-2 text-white">
                <span>📁</span>
                <span>/</span>
              </div>
              <div className="pl-4 space-y-2">
                <div className="flex items-center justify-between text-[#4edea3]">
                  <span>📄 App.tsx</span>
                  <span className="text-[10px] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20">Native Root Entry</span>
                </div>
                <div className="flex items-center justify-between text-[#e4e1e9]">
                  <span>📄 app.json</span>
                  <span className="text-[10px] text-[#958da1]">Expo Manifest</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📁 src/screens/</span>
                </div>
                <div className="pl-6 space-y-1.5 text-slate-400">
                  <div>OnboardingScreen.tsx</div>
                  <div>ExploreScreen.tsx</div>
                  <div>SwipeDeckScreen.tsx</div>
                  <div>MatchCelebrationScreen.tsx</div>
                  <div>ProfileScreen.tsx</div>
                </div>
                <div className="flex items-center gap-2">
                  <span>📁 src/stores/</span>
                </div>
                <div className="pl-6 space-y-1 text-slate-400 font-sans text-xs">
                  <div>useAuthStore.ts (Zustand)</div>
                  <div>useRoomStore.ts (Zustand)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Interactive Smartphone Device Shell */}
        <section id="phone-simulation-view" className="lg:col-span-7 flex flex-col items-center">
          <div className="text-center mb-4">
            <h3 className="text-sm font-bold text-[#d2bbff] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              Live Native Mock Emulator
            </h3>
            <p className="text-xs text-[#958da1]">Compiling pure React Native code live in browser</p>
          </div>

          {/* iOS Smartphone Frame Container */}
          <div className="relative w-[375px] h-[812px] bg-[#000000] rounded-[52px] p-3 border-[6px] border-[#1f1f35] shadow-[0_24px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
            
            {/* Camera island Dynamic Island notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[110px] h-[30px] bg-black rounded-[15px] z-50 flex items-center justify-between px-3">
              <div className="w-3.5 h-3.5 rounded-full bg-[#111] border border-zinc-800"></div>
              <div className="w-3 h-1 bg-[#111] rounded-full"></div>
            </div>

            {/* Inner responsive frame styling */}
            <div className="flex-1 rounded-[40px] overflow-hidden bg-[#0a0a0f] flex flex-col justify-between relative text-sm z-10 border border-[#1f1f35]/20 select-none">
              
              {/* Virtual Top status bar */}
              <div className="absolute top-0 left-0 w-full h-[40px] px-6 flex justify-between items-center text-[11px] font-semibold text-[#e4e1e9] opacity-90 z-40 pointer-events-none">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* Directly Render Native App inside mock viewport */}
              <div className="flex-1 flex flex-col relative w-full h-full pt-10">
                <App />
              </div>

              {/* iOS Home Indicator Bar representation */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />
            </div>
            
            {/* Status indicators side buttons overlay */}
            <div className="absolute -left-[8px] top-[140px] w-[2px] h-[40px] bg-[#1f1f35] rounded-r-md"></div>
            <div className="absolute -left-[8px] top-[190px] w-[2px] h-[60px] bg-[#1f1f35] rounded-r-md"></div>
            <div className="absolute -left-[8px] top-[260px] w-[2px] h-[60px] bg-[#1f1f35] rounded-r-md"></div>
            <div className="absolute -right-[8px] top-[190px] w-[2px] h-[80px] bg-[#1f1f35] rounded-l-md"></div>
          </div>
        </section>

      </main>
    </div>
  );
}
