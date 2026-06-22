import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Smartphone, 
  Check, 
  Copy, 
  Plus, 
  RefreshCw, 
  User as UserIcon, 
  Share2, 
  Heart, 
  X, 
  ChevronLeft, 
  LogOut, 
  Users, 
  Radio, 
  Film, 
  Utensils, 
  Compass, 
  Code, 
  CheckCircle,
  ExternalLink,
  Laptop
} from 'lucide-react';

import { MOCK_MOVIES, MOCK_RESTAURANTS, MOCK_ACTIVITIES, ContentItem } from './data/mockContent';
import { EXPO_CODE_FILES, CodeFile } from './data/expoCodeMap';

interface User {
  id: string;
  phone_number: string;
  display_name: string;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

export default function App() {
  // --- Developer Dashboard State ---
  const [activeTab, setActiveTab] = useState<'simulation' | 'components'>('simulation');
  const [selectedCodeFile, setSelectedCodeFile] = useState<CodeFile>(EXPO_CODE_FILES[0]);
  const [copiedFileIndex, setCopiedFileIndex] = useState<boolean>(false);
  const [simFriendsEnabled, setSimFriendsEnabled] = useState<boolean>(true);
  const [forceMatchState, setForceMatchState] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Phone Simulator State ---
  const [phoneScreen, setPhoneScreen] = useState<'Onboarding' | 'RoomCreate' | 'SwipeDeck' | 'Match' | 'Profile'>('Onboarding');
  const [currentPhoneTime, setCurrentPhoneTime] = useState<string>('09:41');
  
  // Custom User Session Variables
  const [userToken, setUserToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [lobbyCategory, setLobbyCategory] = useState<'MOVIES' | 'RESTAURANTS' | 'ACTIVITIES'>('MOVIES');
  const [membersInLobby, setMembersInLobby] = useState<User[]>([]);
  
  // Swiping State inside the Simulator
  const [deckSwipedCount, setDeckSwipedCount] = useState<number>(0);
  const [hasAllAgreedMatch, setHasAllAgreedMatch] = useState<boolean>(false);
  const [matchedItemData, setMatchedItemData] = useState<any>(null);
  
  // Confetti Pieces for Match Screen
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentPhoneTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Sync simulated members when options change or user logs in
  useEffect(() => {
    if (!currentUser) {
      setMembersInLobby([]);
      return;
    }

    const baseline: User[] = [currentUser];
    if (simFriendsEnabled) {
      baseline.push(
        { id: 'usr-sarah', phone_number: '054-999-1111', display_name: 'Sarah 🎬' },
        { id: 'usr-alex', phone_number: '054-999-2222', display_name: 'Alex 🍕' },
        { id: 'usr-david', phone_number: '054-999-3333', display_name: 'David 🎯' }
      );
    }
    setMembersInLobby(baseline);
  }, [currentUser, simFriendsEnabled]);

  // Generate Confetti when reaching Match screen
  useEffect(() => {
    if (phoneScreen === 'Match') {
      const colors = ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#a78bfa', '#f43f5e'];
      const pieces = Array.from({ length: 90 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 30,
        size: 6 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 4,
      }));
      setConfetti(pieces);
    } else {
      setConfetti([]);
    }
  }, [phoneScreen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCode = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFileIndex(true);
    showToast('Copied code reference to clipboard!');
    setTimeout(() => setCopiedFileIndex(false), 2000);
  };

  // --- Onboarding Handlers ---
  const [phoneNumberInput, setPhoneNumberInput] = useState<string>('');
  const [displayNameInput, setDisplayNameInput] = useState<string>('');
  const [registering, setRegistering] = useState<boolean>(false);

  const executeMockRegister = () => {
    if (!phoneNumberInput.trim() || !displayNameInput.trim()) {
      showToast('Please fill out all fields on onboarding.');
      return;
    }
    setRegistering(true);
    setTimeout(() => {
      const registerPayload = {
        id: 'usr-' + Math.random().toString(36).substr(2, 9),
        phone_number: phoneNumberInput,
        display_name: displayNameInput,
      };
      setCurrentUser(registerPayload);
      setUserToken('tkn_simulated_' + Math.random().toString(36).substr(2, 12));
      setPhoneScreen('RoomCreate');
      setRegistering(false);
      showToast(`Welcome to ConsensuS, ${registerPayload.display_name}!`);
    }, 850);
  };

  // --- Room Create Handlers ---
  const [createdMockRoom, setCreatedMockRoom] = useState<string | null>(null);
  const [joiningRoomIdInput, setJoiningRoomIdInput] = useState<string>('');
  const [loadingLobby, setLoadingLobby] = useState<boolean>(false);

  const executeMockCreateRoom = () => {
    setLoadingLobby(true);
    setTimeout(() => {
      const generatedId = 'room-' + Math.floor(100000 + Math.random() * 900000).toString();
      setCreatedMockRoom(generatedId);
      setCurrentRoomId(generatedId);
      setLoadingLobby(false);
      showToast('Created simulated room successfully!');
    }, 700);
  };

  const executeMockJoinRoom = (targetId?: string) => {
    const finalId = targetId || joiningRoomIdInput.trim();
    if (!finalId) {
      showToast('Enter a lobby code to join.');
      return;
    }
    setLoadingLobby(true);
    setTimeout(() => {
      setCurrentRoomId(finalId);
      setDeckSwipedCount(0);
      setPhoneScreen('SwipeDeck');
      setLoadingLobby(false);
      showToast(`Simulated connection to room ${finalId}`);
    }, 600);
  };

  // Copy lobby code inside simulated phone
  const copyLobbyCodeInPhone = () => {
    if (createdMockRoom) {
      navigator.clipboard.writeText(createdMockRoom);
      showToast('Lobby Invite code copied to physical clipboard!');
    }
  };

  // --- Swiping Deck Handlers ---
  const getActiveDeckOfLobby = (): ContentItem[] => {
    if (lobbyCategory === 'RESTAURANTS') return MOCK_RESTAURANTS;
    if (lobbyCategory === 'ACTIVITIES') return MOCK_ACTIVITIES;
    return MOCK_MOVIES;
  };

  const activeContentList = getActiveDeckOfLobby();

  // Handle Swipe Gesture Simulation
  const handleLikeSwipe = () => {
    if (deckSwipedCount >= activeContentList.length) return;
    const currentItem = activeContentList[deckSwipedCount];
    
    // Check if Simulated Friends will match on this card!
    // In "Auto-Vote Match" mode, they always swipe right on the 1st or 2nd item!
    if (simFriendsEnabled && (deckSwipedCount === 0 || deckSwipedCount === 1)) {
      setTimeout(() => {
        setMatchedItemData({
          id: currentItem.id,
          title: currentItem.title,
          image_url: currentItem.image_url,
          action_link: lobbyCategory === 'MOVIES' ? 'https://netflix.com' : lobbyCategory === 'RESTAURANTS' ? 'https://opentable.com' : 'https://google.com'
        });
        setPhoneScreen('Match');
        showToast(`🎉 Matches reached real-time: ${currentItem.title}!`);
      }, 500);
    } else {
      setDeckSwipedCount(prev => prev + 1);
    }
  };

  const handleNopeSwipe = () => {
    if (deckSwipedCount >= activeContentList.length) return;
    setDeckSwipedCount(prev => prev + 1);
  };

  // Force Trigger Match Screen (for designers to review)
  const forceTriggerMockMatch = () => {
    if (!currentUser) {
      showToast('Please onboard first inside the phone simulation!');
      return;
    }
    const currentItem = activeContentList[deckSwipedCount % activeContentList.length];
    setMatchedItemData({
      id: currentItem.id,
      title: currentItem.title,
      image_url: currentItem.image_url,
      action_link: 'https://netflix.com'
    });
    setPhoneScreen('Match');
  };

  const resetAllAppSession = () => {
    setUserToken(null);
    setCurrentUser(null);
    setCurrentRoomId(null);
    setCreatedMockRoom(null);
    setDeckSwipedCount(0);
    setPhoneScreen('Onboarding');
    setPhoneNumberInput('');
    setDisplayNameInput('');
  };

  const resetLobbyOnly = () => {
    setCreatedMockRoom(null);
    setCurrentRoomId(null);
    setDeckSwipedCount(0);
    setPhoneScreen('RoomCreate');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 antialiased select-none font-sans flex flex-col">
      {/* Dynamic Keyframes for Confetti, Floats, and Animations */}
      <style>{`
        @keyframes floatConfetti {
          0% {
            transform: translateY(0) rotate(0deg) translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateY(900px) rotate(360deg) translateX(50px);
            opacity: 0.2;
          }
        }
        .confetti-p {
          animation: floatConfetti linear infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.15; transform: scale(1); filter: blur(30px); }
          50% { opacity: 0.35; transform: scale(1.15); filter: blur(40px); }
        }
        .glow-halo {
          animation: pulseGlow 4s ease-in-out infinite;
        }
      `}</style>

      {/* HEADER BANNER */}
      <header className="border-b border-slate-200 bg-white py-3 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight text-slate-900 logo-text">
              ConsensuS
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">
              Tinder for groups — React Native Expo App
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden lg:flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 text-indigo-700 font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            <span>Developer Sandbox Active</span>
          </div>
          <div className="text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full font-bold">
            UTC: <span className="text-slate-900 font-bold">2026-06-22</span>
          </div>
        </div>
      </header>

      {/* DYNAMIC TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-indigo-500/20 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2.5 text-xs font-medium"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN LAYOUT SPLIT */}
      <main className="flex-grow w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* LEFT COLUMN: THE SIDEBAR AND SANDBOX STATUS PANEL (3 COLS) */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          
          {/* CONTROL RACK FOR PHONE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
              <span>🎛️ Sandbox Controls</span>
              <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">Option Panel</span>
            </h3>
            
            <div className="flex flex-col gap-2 text-xs">
              {/* Sim Friends */}
              <button 
                onClick={() => setSimFriendsEnabled(!simFriendsEnabled)}
                className={`py-2.5 px-3 rounded-xl text-left border font-bold flex items-center justify-between transition ${
                  simFriendsEnabled 
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                <span>Mock friends active</span>
                <span className={`w-2 h-2 rounded-full ${simFriendsEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </button>

              {/* Force Match */}
              <button 
                onClick={forceTriggerMockMatch}
                disabled={phoneScreen === 'Onboarding'}
                className="py-2.5 px-3 rounded-xl text-left border border-slate-200 bg-white hover:bg-slate-50 text-amber-600 font-bold flex items-center justify-between transition disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>Trigger Match Screen</span>
                <span className="text-[10px]">✨</span>
              </button>
            </div>

            <div className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3 flex items-center gap-1.5">
              <span className="text-indigo-600 font-bold">Mode:</span>
              <span>Mock Friends vote with you and match instantly on swiping right!</span>
            </div>
          </div>

          {/* DYNAMIC MEMBERS AND SOCIAL LOGS PANEL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex-1 flex flex-col gap-4 shadow-sm min-h-[300px]">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Lobby Progress & Members</p>
            
            {currentUser ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-semibold text-xs text-slate-400 uppercase tracking-wider">Active Group</p>
                    <p className="font-bold text-sm text-slate-800 mt-0.5">
                      {currentRoomId ? `Lobby #${currentRoomId}` : 'Create or Join first!'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Category Selected: <strong className="text-indigo-600">{lobbyCategory}</strong>
                    </p>
                  </div>

                  {/* Voting Progress dynamically matching swiped indices */}
                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-semibold text-slate-600">Decision ConsensuS</span>
                      <span className="text-xs font-bold text-indigo-600">
                        {currentRoomId 
                          ? `${Math.min(100, Math.round(((deckSwipedCount) / (activeContentList.length || 10)) * 100))}%`
                          : '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full transition-all duration-300"
                        style={{
                          width: `${currentRoomId ? Math.min(100, Math.round(((deckSwipedCount) / (activeContentList.length || 10)) * 100)) : 0}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Member items */}
                  <div className="mt-6 space-y-3.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Lobby Seat Status</span>
                    {membersInLobby.map((mbr) => {
                      const isMe = mbr.id === currentUser.id;
                      const hasVoted = deckSwipedCount >= activeContentList.length;
                      return (
                        <div key={mbr.id} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            isMe ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'
                          }`}>
                            {mbr.display_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {mbr.display_name} {isMe && '(You)'}
                            </p>
                            <p className="text-[9px] font-medium leading-none mt-0.5">
                              {hasVoted ? (
                                <span className="text-emerald-500 font-bold">Finished Voting</span>
                              ) : (
                                <span className={isMe ? 'text-indigo-500 font-bold' : 'text-slate-400'}>
                                  {isMe ? 'Voting now...' : 'Awaiting feedback'}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Session live status block */}
                <div className="flex items-center gap-2.5 p-3 bg-indigo-50 text-indigo-700 rounded-xl mt-auto">
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse" />
                  <span className="text-[11px] font-bold tracking-wide uppercase">ConsensuS Stream Live</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                <span className="text-2xl opacity-60">👥</span>
                <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                  Log in inside the virtual phone simulation to boot database lobbies and simulate real-time room sessions.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CENTER COLUMN: THE PHONE SIMULATOR (4 COLS) */}
        <section className="lg:col-span-4 flex flex-col items-center justify-start gap-4 relative py-2">
          
          {/* Floating Accent Elements */}
          <div className="absolute left-[-24px] top-[180px] hidden xl:flex flex-col gap-4 pointer-events-none z-10">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-md border border-slate-150 flex items-center justify-center text-red-500 rotate-6 transition-all">
              <span className="text-xl font-black">✕</span>
            </div>
          </div>
          <div className="absolute right-[-24px] top-[290px] hidden xl:flex flex-col gap-4 pointer-events-none z-10">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-md border border-slate-150 flex items-center justify-center text-emerald-500 -rotate-12 transition-all">
              <span className="text-xl font-black">✓</span>
            </div>
          </div>

          <div id="virtual-phone-frame" className="relative w-[326px] h-[640px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-[8px] border-slate-900 flex flex-col justify-between overflow-hidden">
            {/* PHONE TOP NOTCH/ISLAND */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-b-xl z-40 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-700 rounded-full" />
            </div>

            {/* SCREEN BOUNDARY CONTAINER - CLEAN SLATE LIGHT BG */}
            <div className="flex-1 w-full h-full bg-slate-50 rounded-[32px] overflow-hidden flex flex-col justify-between relative">
              {/* MOBILE BAR STATUS */}
              <div className="h-9 pt-2.5 px-6 flex items-center justify-between text-[11px] text-slate-800 font-bold z-40 absolute top-0 left-0 w-full bg-gradient-to-b from-slate-100 to-transparent">
                <span>{currentPhoneTime}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">5G</span>
                  <div className="w-5 h-2.5 rounded-sm border border-slate-800 p-0.5 flex items-center">
                    <div className="w-3.5 h-full bg-slate-800 rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* SCREEN CONTENT AREA (SCROLL-CONTROLLED SECURE ROOT) */}
              <div className="flex-1 w-full pt-10 pb-5 px-4 flex flex-col justify-between overflow-hidden">
                
                {/* 1. ONBOARDING SCREEN */}
                {phoneScreen === 'Onboarding' && (
                  <div className="flex-grow flex flex-col justify-center gap-5 mt-4">
                    <div className="text-center pt-2">
                      <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tighter">ConsensuS</h2>
                      <p className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase mt-0.5">group decisions</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-4.5 flex flex-col gap-3.5 mt-1 shadow-sm">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Phone number</label>
                        <input 
                          type="tel" 
                          placeholder="e.g. 054-123-4567"
                          value={phoneNumberInput}
                          onChange={(e) => setPhoneNumberInput(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2.5 rounded-xl focus:border-indigo-500 outline-none transition"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Display name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. John Doe"
                          value={displayNameInput}
                          onChange={(e) => setDisplayNameInput(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2.5 rounded-xl focus:border-indigo-500 outline-none transition"
                        />
                      </div>

                      <button
                        onClick={executeMockRegister}
                        disabled={registering}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-xs mt-1.5 shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.98] transition"
                      >
                        {registering ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>Get Started</span>
                        )}
                      </button>
                    </div>

                    <p className="text-[9px] text-center text-slate-400 px-3 leading-relaxed">
                      Build instant lobbies for films, group dinners, or active sports/hangouts!
                    </p>
                  </div>
                )}

                {/* 2. ROOM CREATE HUB */}
                {phoneScreen === 'RoomCreate' && currentUser && (
                  <div className="flex-grow flex flex-col justify-between mt-2">
                    {/* Top bar with initials */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 font-bold">Welcome back,</span>
                        <h4 className="text-xs font-bold text-slate-900 mt-0.5 leading-none">{currentUser.display_name}</h4>
                      </div>
                      <button 
                        onClick={() => setPhoneScreen('Profile')}
                        className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white border border-indigo-500 hover:scale-105 transition shadow-sm"
                      >
                        {currentUser.display_name.charAt(0).toUpperCase()}
                      </button>
                    </div>

                    {!createdMockRoom ? (
                      <div className="flex-grow flex flex-col justify-center gap-3 py-2">
                        <div className="flex flex-col">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">1. Choose Category</h4>
                          <span className="text-[10px] text-slate-500">Pick what you are matching together</span>
                        </div>

                        {/* 3 Categories list */}
                        <div className="flex flex-col gap-2">
                          {[
                            { type: 'MOVIES' as const, icon: <Film className="w-4 h-4 text-pink-500" />, emoji: '🎬', label: 'Movies', desc: 'Pick films to watch close' },
                            { type: 'RESTAURANTS' as const, icon: <Utensils className="w-4 h-4 text-orange-500" />, emoji: '🍕', label: 'Restaurants', desc: 'Decide where to grub' },
                            { type: 'ACTIVITIES' as const, icon: <Compass className="w-4 h-4 text-cyan-500" />, emoji: '🎯', label: 'Activities', desc: 'Active sports & outings' }
                          ].map((cat) => {
                            const isSelected = lobbyCategory === cat.type;
                            return (
                              <button
                                key={cat.type}
                                onClick={() => setLobbyCategory(cat.type)}
                                className={`p-2.5 rounded-xl text-left border flex items-center justify-between transition ${
                                  isSelected 
                                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm' 
                                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="text-lg">{cat.emoji}</span>
                                  <div>
                                    <span className="text-xs text-slate-900 font-bold block">{cat.label}</span>
                                    <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">{cat.desc}</span>
                                  </div>
                                </div>
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-indigo-600' : 'border-slate-300'}`}>
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={executeMockCreateRoom}
                          disabled={loadingLobby}
                          className="bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-md shadow-indigo-600/10 transition mt-1"
                        >
                          {loadingLobby ? (
                            <RefreshCw className="w-3 animate-spin text-white" />
                          ) : (
                            <span>Create Decisions Lobby</span>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="flex-grow flex flex-col justify-center gap-4 items-center py-4 text-center">
                        <span className="text-3xl animate-bounce">🎬</span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Invite Code Generated</h4>
                          <p className="text-[10px] text-slate-500 px-3 mt-1 leading-snug">Friends join from their screens with this lobby ID:</p>
                        </div>

                        <div 
                          onClick={copyLobbyCodeInPhone}
                          className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl w-full max-w-[210px] cursor-pointer hover:border-indigo-500 transition flex items-center justify-between gap-2 shadow-sm"
                        >
                          <span className="font-mono text-xs text-amber-600 tracking-wider font-bold">{createdMockRoom}</span>
                          <Copy className="w-3 h-3 text-slate-400" />
                        </div>

                        <div className="flex flex-col gap-2 w-full px-2">
                          <button
                            onClick={() => executeMockJoinRoom(createdMockRoom)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-xs font-bold shadow-sm"
                          >
                            Start Swiping Deck
                          </button>
                          <button
                            onClick={() => setCreatedMockRoom(null)}
                            className="text-slate-400 hover:text-slate-600 text-[9px] uppercase font-bold mt-1"
                          >
                            Reset Choice
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Divider JOIN logic */}
                    {!createdMockRoom && (
                      <div className="border-t border-slate-200 pt-3 mt-auto flex flex-col gap-1.5">
                        <span className="text-[9px] uppercase text-slate-400 font-bold text-center">or join existing lobby</span>
                        <div className="flex gap-1.5">
                          <input 
                            type="text" 
                            placeholder="Lobby ID..."
                            value={joiningRoomIdInput}
                            onChange={(e) => setJoiningRoomIdInput(e.target.value)}
                            className="flex-1 bg-white border border-slate-200 text-xs text-slate-800 p-2 rounded-lg outline-none focus:border-indigo-500"
                          />
                          <button
                            onClick={() => executeMockJoinRoom()}
                            className="bg-slate-800 text-white font-bold text-[11px] px-3.5 rounded-lg hover:bg-slate-900"
                          >
                            Join
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. SWIPE DECK SCREEN */}
                {phoneScreen === 'SwipeDeck' && currentUser && (
                  <div className="flex-grow flex flex-col justify-between mt-2 h-full">
                    {/* Header bar */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Matching Lobby</span>
                        <h4 className="text-[11px] font-mono font-bold text-indigo-600 mt-0.5">
                          #{currentRoomId?.slice(0, 8)}
                        </h4>
                      </div>

                      {/* Active Member badges */}
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-1.5">
                          {membersInLobby.map((mbr) => (
                            <div 
                              key={mbr.id} 
                              title={mbr.display_name}
                              className="w-5 h-5 rounded-full bg-indigo-600 border border-slate-50 flex items-center justify-center text-[9px] font-bold text-white uppercase shadow-sm"
                            >
                              {mbr.display_name.charAt(0)}
                            </div>
                          ))}
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold ml-1">{membersInLobby.length} active</span>
                      </div>
                    </div>

                    {/* Active swiper cards list */}
                    <div className="flex-grow my-3 flex flex-col justify-center items-center relative min-h-[300px]">
                      {deckSwipedCount < activeContentList.length ? (
                        <AnimatePresence mode="popLayout">
                          {activeContentList.map((card, idx) => {
                            if (idx !== deckSwipedCount) return null;
                            return (
                              <motion.div
                                key={card.id}
                                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, y: -20, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="w-full max-w-[250px] aspect-[3/4] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md flex flex-col relative"
                              >
                                <img 
                                  src={card.image_url} 
                                  alt={card.title} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-[58%] object-cover block"
                                />
                                <div className="p-3.5 flex-1 flex flex-col justify-between">
                                  <div>
                                    <h5 className="font-extrabold text-xs text-slate-900 tracking-tight leading-snug line-clamp-2">
                                      {card.title}
                                    </h5>
                                    
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                      {card.meta_data.year && (
                                        <span className="bg-indigo-50 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                          {card.meta_data.year}
                                        </span>
                                      )}
                                      {card.meta_data.cuisine && (
                                        <span className="bg-slate-100 text-slate-600 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                          {card.meta_data.cuisine}
                                        </span>
                                      )}
                                      {card.meta_data.rating && (
                                        <span className="bg-amber-50 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                          ★ {card.meta_data.rating}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="text-[8px] text-slate-400 italic">
                                    Swipe or tap direct feedback buttons
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      ) : (
                        <div className="text-center px-4">
                          <span className="text-3xl animate-bounce block">💤</span>
                          <h5 className="text-xs font-bold text-slate-900 mt-2">All options swiped!</h5>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">
                            Waiting for other lobby friends to match. Instantly start a new room selection!
                          </p>
                          <button
                            onClick={resetLobbyOnly}
                            className="bg-slate-800 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg mt-3 shadow-sm hover:bg-slate-900 transition"
                          >
                            Exit Deck
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Like / Nope Buttons */}
                    {deckSwipedCount < activeContentList.length && (
                      <div className="flex gap-3.5 items-center justify-center pb-1">
                        <button 
                          onClick={handleNopeSwipe}
                          className="w-11 h-11 rounded-full bg-white border border-red-200 shadow-md flex items-center justify-center hover:bg-red-50 active:scale-95 transition text-red-500 font-extrabold"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={handleLikeSwipe}
                          className="w-11 h-11 rounded-full bg-indigo-600 border border-indigo-500 shadow-md flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition text-white font-extrabold"
                        >
                          <Heart className="w-4 h-4 fill-white text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. MATCH CELEBRATION SCREEN */}
                {phoneScreen === 'Match' && matchedItemData && (
                  <div className="flex-grow flex flex-col justify-between items-center text-center mt-3 relative h-full">
                    
                    {/* CONFETTI LAYER */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px] z-10">
                      {confetti.map((c) => (
                        <div 
                          key={c.id}
                          className="confetti-p absolute w-2 h-2 rounded-full"
                          style={{
                            left: `${c.x}%`,
                            top: `${c.y}px`,
                            width: `${c.size}px`,
                            height: `${c.size}px`,
                            backgroundColor: c.color,
                            animationDelay: `${c.delay}s`,
                            animationDuration: `${c.duration}s`,
                          }}
                        />
                      ))}
                    </div>

                    <div className="z-20 mt-2">
                      <span className="text-[9px] uppercase font-bold text-amber-600 tracking-widest block leading-none">
                        🎉 Consensus Reached 🎉
                      </span>
                      <h4 className="text-lg font-bold font-display text-slate-900 tracking-tight mt-1 leading-none">
                        It's a Match!
                      </h4>
                    </div>

                    {/* Artwork Container */}
                    <div className="relative w-36 h-36 flex items-center justify-center my-3 z-20">
                      <div className="absolute w-40 h-40 rounded-full bg-amber-100 glow-halo flex items-center justify-center" />
                      <img 
                        src={matchedItemData.image_url} 
                        alt={matchedItemData.title}
                        referrerPolicy="no-referrer"
                        className="w-28 h-28 rounded-full border-4 border-amber-400 object-cover shadow-lg relative"
                      />
                    </div>

                    <div className="z-20 max-w-[220px]">
                      <h5 className="font-extrabold text-indigo-700 text-xs tracking-tight line-clamp-1 leading-tight">
                        {matchedItemData.title}
                      </h5>
                      <p className="text-[9px] text-slate-500 px-2 mt-1 leading-snug">
                        All decision-makers are locked in on this choice!
                      </p>
                    </div>

                    <div className="w-full flex flex-col gap-1.5 pt-2 z-20">
                      {matchedItemData.action_link && (
                        <a 
                          href={matchedItemData.action_link}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition"
                        >
                          <span>Explore Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      
                      <button
                        onClick={resetLobbyOnly}
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-2 rounded-lg text-xs font-bold transition shadow-sm"
                      >
                        Start New Room
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. PROFILE SCREEN */}
                {phoneScreen === 'Profile' && currentUser && (
                  <div className="flex-grow flex flex-col justify-between mt-2 pt-1">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                      <button 
                        onClick={() => setPhoneScreen('RoomCreate')}
                        className="text-slate-400 hover:text-slate-800 transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-xs font-bold text-slate-900">Member Settings</span>
                    </div>

                    <div className="flex-grow flex flex-col justify-center gap-3 py-3">
                      {/* Avatar initials BIG */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xl text-white border-2 border-slate-100 shadow-md">
                          {currentUser.display_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[10px] text-indigo-600 uppercase font-black tracking-widest mt-0.5">ConsensuS Member</span>
                      </div>

                      {/* Display name form */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm">
                        <div className="flex flex-col gap-0.5">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Number (Static)</label>
                          <input 
                            type="text" 
                            value={currentUser.phone_number} 
                            disabled 
                            className="bg-slate-50 border border-slate-200 text-xs text-slate-400 p-2 rounded-lg outline-none cursor-not-allowed"
                          />
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Display name</label>
                          <input 
                            type="text" 
                            value={currentUser.display_name} 
                            onChange={(e) => setCurrentUser({...currentUser, display_name: e.target.value})}
                            className="bg-white border border-slate-200 text-xs text-slate-800 p-2 rounded-lg focus:border-indigo-500 outline-none transition"
                          />
                        </div>
                      </div>

                      <button
                        onClick={resetAllAppSession}
                        className="w-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold py-2 rounded-xl hover:bg-red-100/40 active:scale-98 transition flex items-center justify-center gap-1.5 transition"
                      >
                        <LogOut className="w-3.5 h-3.5 block" />
                        <span>Log Out Sessions</span>
                      </button>
                    </div>

                    <p className="text-[9px] text-center text-slate-400 leading-tight">
                      Session and active database credentials stored locally in this sandbox tab.
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* PHONE BOTTOM NAV BAR */}
            <div className="absolute bottom-1 right-1/2 translate-x-1/2 w-28 h-1 bg-slate-400 rounded-full z-40" />
          </div>
        </section>

        {/* RIGHT COLUMN: CODE VIEWER & EXPLORER (5 COLS) */}
        <section className="lg:col-span-5 flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          
          {/* RIGHT COL BAR DECORATOR AND SELECTORS */}
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>📂 Expo mobile app Frontend codebase</span>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">11 complete files</span>
              </h2>
            </div>
            
            <button
              onClick={() => handleCopyCode(selectedCodeFile.content)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition text-xs font-bold flex items-center justify-center gap-1.5 self-start shadow-sm"
            >
              {copiedFileIndex ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File code</span>
                </>
              )}
            </button>
          </div>

          {/* EXPLORER TABS PANELS SPLIT */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[480px]">
            {/* FILE EXPLORER SIDEBAR PANEL */}
            <div className="md:col-span-4 bg-slate-50/60 border-r border-slate-200 p-3 flex flex-col gap-1.5 overflow-y-auto">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-2 mb-2 block">
                Project Files Tree
              </span>

              {EXPO_CODE_FILES.map((file) => {
                const isActive = selectedCodeFile.name === file.name;
                return (
                  <button
                    key={file.name}
                    onClick={() => setSelectedCodeFile(file)}
                    className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-mono transition flex items-center justify-between ${
                      isActive 
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold' 
                        : 'border border-transparent text-slate-500 hover:text-slate-950 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Code className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500" />
                      <span className="truncate">{file.name}</span>
                    </div>
                  </button>
                );
              })}

              <div className="mt-6 border-t border-slate-200 pt-4 px-2">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Build Environment</h4>
                <div className="flex flex-col gap-1.5 text-[10px] text-slate-500 leading-normal font-mono list-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
                    <span>expo-cli configured</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" />
                    <span>packages auto-linked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
                    <span>websockets active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SYNTAX HIGHLIGHTED CODE CONTAINER VIEW */}
            <div className="md:col-span-8 flex flex-col p-4 bg-slate-900 overflow-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3 text-[11px] text-slate-400 font-mono">
                <span>Path: <strong className="text-slate-200">{selectedCodeFile.path}</strong></span>
              </div>
              <pre className="flex-1 font-mono text-[11.5px] text-indigo-200 bg-slate-950 p-4 rounded-xl whitespace-pre-wrap leading-relaxed overflow-x-auto overflow-y-auto max-h-[460px]">
                <code>{selectedCodeFile.content}</code>
              </pre>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER COOPERATING BAR */}
      <footer className="border-t border-slate-200 bg-[#f8fafc] py-4 px-6 text-center text-xs text-slate-500">
        ConsensuS client-side and iOS/Android Expo mobile app codebase compiled and validated for Expo builders. 
        © 2026 ConsensuS Team. All rights reserved.
      </footer>
    </div>
  );
}
