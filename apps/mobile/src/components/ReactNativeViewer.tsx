import React, { useState } from 'react';
import { 
  ONBOARDING_RN_CODE, 
  EXPLORE_RN_CODE, 
  SWIPE_DECK_RN_CODE, 
  MATCH_RN_CODE, 
  PROFILE_RN_CODE,
  APP_RN_CODE,
  AUTH_STORE_CODE,
  ROOM_STORE_CODE,
  PACKAGE_JSON_CODE
} from '../data/rnCodeStrings';
import { Check, Copy, Code, Smartphone, Compass, Layers, Sparkles, User, Home, Database, Package } from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  code: string;
}

export default function ReactNativeViewer() {
  const tabs: Tab[] = [
    { id: 'app', name: 'App.tsx', icon: Home, code: APP_RN_CODE },
    { id: 'package', name: 'package.json', icon: Package, code: PACKAGE_JSON_CODE },
    { id: 'auth_store', name: 'useAuthStore.ts', icon: Database, code: AUTH_STORE_CODE },
    { id: 'room_store', name: 'useRoomStore.ts', icon: Database, code: ROOM_STORE_CODE },
    { id: 'onboarding', name: 'OnboardingScreen.tsx', icon: Smartphone, code: ONBOARDING_RN_CODE },
    { id: 'explore', name: 'ExploreScreen.tsx', icon: Compass, code: EXPLORE_RN_CODE },
    { id: 'swipe', name: 'SwipeDeckScreen.tsx', icon: Layers, code: SWIPE_DECK_RN_CODE },
    { id: 'celebration', name: 'MatchCelebration.tsx', icon: Sparkles, code: MATCH_RN_CODE },
    { id: 'profile', name: 'ProfileScreen.tsx', icon: User, code: PROFILE_RN_CODE }
  ];

  const [activeTab, setActiveTab] = useState('app');
  const [copied, setCopied] = useState(false);

  const activeCode = tabs.find(t => t.id === activeTab)?.code || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="react-native-source-viewer" className="flex flex-col h-full bg-[#111118] border border-[#1f1f35] rounded-2xl overflow-hidden shadow-2xl">
      {/* Viewer Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-[#0d0d1a] border-b border-[#1f1f35] gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#7c3aed]/10 text-[#d2bbff] rounded-lg">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-md font-bold text-[#e4e1e9]">Expo Code Generator</h2>
            <p className="text-xs text-[#958da1]">TypeScript • StyleSheets • Zustand Stores Connected</p>
          </div>
        </div>

        <button 
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-95 ${
            copied 
              ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/40' 
              : 'bg-[#7c3aed] text-[#ede0ff] hover:brightness-110 shadow-lg shadow-[#7c3aed]/20'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy File Content
            </>
          )}
        </button>
      </div>

      {/* Screen Selector Tabs */}
      <div className="flex overflow-x-auto bg-[#131318] p-2 gap-1 border-b border-[#1f1f35] scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCopied(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 ${
                isSelected 
                  ? 'bg-[#1f1f25] text-[#d2bbff] border border-[#1f1f35]' 
                  : 'text-[#958da1] hover:text-[#e4e1e9]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Code Display Area */}
      <div className="flex-1 overflow-auto bg-[#0a0a0f] p-4 font-mono text-xs text-[#ccc3d8] relative leading-relaxed scrollbar-thin">
        {/* Absolute indicators */}
        <div className="absolute right-4 top-4 px-2 py-1 bg-[#1a0a2e] border border-[#7c3aed]/20 text-xxs text-[#d2bbff] rounded uppercase tracking-wider font-bold">
          {activeTab} Screen
        </div>
        
        <pre className="whitespace-pre overflow-x-auto selection:bg-[#7c3aed]/30 scrollbar-none">
          <code>{activeCode}</code>
        </pre>
      </div>

      {/* Footer advice */}
      <div className="px-6 py-3 bg-[#0d0d1a] border-t border-[#1f1f35] text-center text-xxs text-[#958da1] italic">
        🔒 All local stores references (useAuthStore, useRoomStore) are pre-allocated for instant, hassle-free drops.
      </div>
    </div>
  );
}
