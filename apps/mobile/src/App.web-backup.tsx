import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CATEGORIES, 
  CARDS_POOL, 
  ActivityCard 
} from './data/mockData';
import ReactNativeViewer from './components/ReactNativeViewer';
import { 
  Smartphone, 
  Sparkles, 
  User, 
  Compass, 
  Check, 
  X, 
  RotateCcw, 
  Heart, 
  ChevronRight, 
  Info,
  LogOut,
  Save,
  CheckCircle,
  Copy
} from 'lucide-react';

export default function App() {
  // Mobile Router States: 'onboarding' | 'explore' | 'swipe' | 'match' | 'profile'
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'explore' | 'swipe' | 'match' | 'profile'>('onboarding');

  // Reactively shared user profile models (Zundand mock binding simulation)
  const [userName, setUserName] = useState('Alex');
  const [phoneNumber, setPhoneNumber] = useState('(555) 012-3456');
  const [emailAddress, setEmailAddress] = useState('alex@consensus.io');
  const [userHandle, setUserHandle] = useState('@alex');

  // Interactive Room Selection state
  const [selectedCategory, setSelectedCategory] = useState<string>('movies');
  const [roomCode, setRoomCode] = useState('');
  const [recentRoomName, setRecentRoomName] = useState('Friday Dinner');

  // Simulated loading state for categories
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Swiping state variables
  const [swipeStack, setSwipeStack] = useState<ActivityCard[]>(CARDS_POOL.movies);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [swipeActionMessage, setSwipeActionMessage] = useState<'like' | 'nope' | null>(null);

  // Stats Counters
  const [roomsCount, setRoomsCount] = useState(24);
  const [matchesCount, setMatchesCount] = useState(182);

  // Synchronize category select changes to reload corresponding pools
  useEffect(() => {
    if (CARDS_POOL[selectedCategory]) {
      setSwipeStack(CARDS_POOL[selectedCategory]);
      setCurrentCardIndex(0);
    }
  }, [selectedCategory]);

  // Trigger simulated categories loading skeleton when opening explore screen
  useEffect(() => {
    if (currentScreen === 'explore') {
      setCategoriesLoading(true);
      const timer = setTimeout(() => {
        setCategoriesLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleGetStartedOnboarding = () => {
    if (!userName.trim()) return;
    setUserHandle(`@${userName.toLowerCase().replace(/\s+/g, '_')}`);
    setCurrentScreen('explore');
  };

  const handleSwipeAction = (direction: 'like' | 'nope') => {
    setSwipeActionMessage(direction);
    
    setTimeout(() => {
      setSwipeActionMessage(null);
      if (direction === 'like') {
        // Trigger instant celebration screen mimicking perfect match agreement
        setCurrentScreen('match');
        setMatchesCount(prev => prev + 1);
      } else {
        if (currentCardIndex + 1 < swipeStack.length) {
          setCurrentCardIndex(prev => prev + 1);
        } else {
          // Out of cards
          setCurrentCardIndex(swipeStack.length);
        }
      }
    }, 450);
  };

  const handleProfileSave = () => {
    // Show saving feedback
    const toast = document.getElementById('save-toast');
    if (toast) {
      toast.classList.remove('opacity-0');
      setTimeout(() => toast.classList.add('opacity-0'), 2000);
    }
  };

  const handleLogOut = () => {
    setUserName('Alex');
    setUserHandle('@alex');
    setPhoneNumber('(555) 012-3456');
    setEmailAddress('alex@consensus.io');
    setCurrentScreen('onboarding');
  };

  return (
    <div id="app-designer" className="min-h-screen bg-[#07070a] text-[#e4e1e9] font-sans antialiased overflow-x-hidden selection:bg-[#7c3aed]/30">
      {/* Main Studio Banner Header */}
      <header className="border-b border-[#1f1f35]/50 bg-[#0d0d1a]/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#7c3aed] text-white font-extrabold text-sm shadow-md shadow-[#7c3aed]/30">CS</span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                ConsensuS <span className="text-xs bg-[#7c3aed]/10 text-[#d2bbff] px-2 py-0.5 rounded-full border border-[#7c3aed]/20 font-medium">Design System Translator</span>
              </h1>
              <p className="text-xs text-[#958da1]">Perfect HTML/Tailwind to React Native Components Conversion Sandbox</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-[#111118] border border-[#1f1f35] rounded-xl p-1 gap-1">
              <span className="text-xs text-[#958da1] px-3 font-semibold">Active Screen:</span>
              <button 
                onClick={() => setCurrentScreen('onboarding')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentScreen === 'onboarding' ? 'bg-[#7c3aed] text-white shadow' : 'text-[#958da1] hover:text-[#e4e1e9]'
                }`}
              >
                Onboarding
              </button>
              <button 
                onClick={() => setCurrentScreen('explore')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentScreen === 'explore' ? 'bg-[#7c3aed] text-white shadow' : 'text-[#958da1] hover:text-[#e4e1e9]'
                }`}
              >
                Explore / Categories
              </button>
              <button 
                onClick={() => setCurrentScreen('swipe')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentScreen === 'swipe' ? 'bg-[#7c3aed] text-white shadow' : 'text-[#958da1] hover:text-[#e4e1e9]'
                }`}
              >
                Swipe Deck
              </button>
              <button 
                onClick={() => setCurrentScreen('match')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentScreen === 'match' ? 'bg-[#7c3aed] text-white shadow' : 'text-[#958da1] hover:text-[#e4e1e9]'
                }`}
              >
                Celebration
              </button>
              <button 
                onClick={() => {
                  // Standardize Jordan D statistics as shown in Profile Screen Wireframe
                  setUserName('Jordan D.');
                  setUserHandle('@jordan_consensus');
                  setPhoneNumber('+1 (555) 012-3456');
                  setEmailAddress('jordan.d@example.com');
                  setCurrentScreen('profile');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentScreen === 'profile' ? 'bg-[#7c3aed] text-white shadow' : 'text-[#958da1] hover:text-[#e4e1e9]'
                }`}
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Body Workspace */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: The Premium Smartphone Device Simulator */}
        <section id="phone-simulation-view" className="lg:col-span-5 flex flex-col items-center">
          <div className="text-center mb-4">
            <h3 className="text-sm font-bold text-[#d2bbff] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              Live Responsive Preview
            </h3>
            <p className="text-xs text-[#958da1]">Pure React Native-equivalent CSS execution</p>
          </div>

          {/* Interactive Bezel Box Container */}
          <div className="relative w-[360px] h-[780px] bg-[#0c0c12] rounded-[44px] p-3 border-4 border-[#1f1f35] shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
            
            {/* Ambient Back Glow Inside Device */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[180%] h-[350px] bg-gradient-radial from-[#7c3aed]/10 to-transparent pointer-events-none z-0" />

            {/* Smartphone Top Notch Sensor Area */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-40 h-5 bg-[#1f1f35] rounded-full z-50 flex items-center justify-between px-4">
              <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
              <div className="w-12 h-1 bg-black/40 rounded-full"></div>
            </div>

            {/* Physical Screen Inset viewport */}
            <div className="flex-1 rounded-[32px] overflow-hidden bg-[#131318] flex flex-col justify-between relative text-sm z-10 border border-[#1f1f35]/20">
              
              {/* SCREEN STAGE: Onboarding */}
              {currentScreen === 'onboarding' && (
                <div id="stage-onboarding" className="flex-1 flex flex-col justify-between p-6 pt-12 relative overflow-hidden transition-all">
                  <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-radial from-[#7c3aed]/15 to-transparent pointer-events-none z-0" />
                  
                  <div className="flex-1 flex flex-col justify-center items-center relative z-10 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 mb-6">
                      <span className="text-[10px] font-bold tracking-widest text-[#d2bbff]">EST. 2024</span>
                    </div>
                    <h1 className="text-[44px] font-extrabold tracking-tighter text-[#e4e1e9] leading-none mb-3">ConsensuS</h1>
                    <p className="font-sans text-[#ccc3d8] text-sm max-w-[280px] leading-relaxed mx-auto">
                      Collective decisions, made simple. Join the social pulse.
                    </p>

                    {/* Onboarding Input Stack */}
                    <div className="w-full mt-10 space-y-4">
                      {/* Form: Phone Number */}
                      <div className="text-left">
                        <label className="text-[10px] font-bold tracking-widest text-[#958da1] uppercase block mb-1.5 ml-1">Phone Number</label>
                        <div className="flex items-center h-14 bg-[#111118]/80 border border-[#1f1f35] rounded-xl px-4 focus-within:border-[#7c3aed] transition-all">
                          <span className="mr-3 text-[#7c3aed]">📞</span>
                          <span className="font-semibold text-[#e4e1e9] mr-2">+1</span>
                          <input 
                            type="text" 
                            className="bg-transparent border-none focus:outline-none w-full text-white placeholder-[#958da1]/50 text-sm font-semibold"
                            placeholder="(555) 000-0000"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Form: Display Name */}
                      <div className="text-left">
                        <label className="text-[10px] font-bold tracking-widest text-[#958da1] uppercase block mb-1.5 ml-1">Display Name</label>
                        <div className="flex items-center h-14 bg-[#111118]/80 border border-[#1f1f35] rounded-xl px-4 focus-within:border-[#7c3aed] transition-all">
                          <span className="mr-3 text-[#7c3aed]">👤</span>
                          <input 
                            type="text" 
                            className="bg-transparent border-none focus:outline-none w-full text-white placeholder-[#958da1]/50 text-sm font-semibold"
                            placeholder="Choose your handle"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Primary Continue button */}
                      <button 
                        onClick={handleGetStartedOnboarding}
                        className="w-full h-14 mt-4 bg-[#7c3aed] text-[#ede0ff] rounded-full font-bold text-sm shadow-[0_8px_32px_rgba(124,58,237,0.35)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        Get Started
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-center text-[11px] text-[#958da1] max-w-[2700px] mt-6 leading-relaxed px-4">
                      By continuing, you agree to our <span className="text-[#d2bbff] font-bold">Terms of Service</span> and <span className="text-[#d2bbff] font-bold">Privacy Policy</span>.
                    </p>
                  </div>

                  {/* Aesthetic Glowing Base Anchor */}
                  <div className="w-full relative h-[64px] shrink-0">
                    <div className="absolute bottom-0 left-0 w-full h-full opacity-40 blur-2xl pointer-events-none bg-gradient-to-t from-[#7c3aed] to-transparent"></div>
                  </div>
                </div>
              )}

              {/* SCREEN STAGE: Explore / Categories */}
              {currentScreen === 'explore' && (
                <div id="stage-explore" className="flex-1 flex flex-col justify-between pt-14 pb-20 relative transition-all">
                  
                  {/* Fixed Header */}
                  <header className="absolute top-0 left-0 w-full h-14 flex justify-between items-center px-4 bg-[#131318]/80 backdrop-blur-md border-b border-[#1f1f35]/30 z-20">
                    <span className="font-bold text-sm text-[#e4e1e9]">Hi, {userName}!</span>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1c1c24] border border-[#d2bbff]/20 overflow-hidden flex items-center justify-center">
                        <img 
                          className="w-full h-full object-cover" 
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=clamp&q=80&w=150" 
                          alt="Avatar" 
                        />
                      </div>
                      <button onClick={() => setCurrentScreen('profile')} className="text-[#958da1] hover:text-[#d2bbff]">
                        ⚙️
                      </button>
                    </div>
                  </header>

                  <div className="flex-1 overflow-y-auto px-4 pt-14 pb-4 scroll-hide">
                    {/* Hero Display Heading with simulated skeleton refetch tool */}
                    <div className="mt-4 mb-5 flex justify-between items-end">
                      <div>
                        <h1 className="text-4xl font-extrabold tracking-tighter text-[#d2bbff] leading-none mb-1">What are we<br/>deciding?</h1>
                        <p className="text-xs text-[#958da1] font-semibold">Choose a category to start your room.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setCategoriesLoading(true);
                          setTimeout(() => setCategoriesLoading(false), 1200);
                        }}
                        className="text-xs bg-[#7c3aed]/10 text-[#d2bbff] border border-[#7c3aed]/20 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 hover:bg-[#7c3aed]/20 transition-all duration-300 active:scale-95 mb-1"
                        title="Retry category retrieval with skeleton loader"
                      >
                        <span className="text-[10px]">🔄</span> Refetch
                      </button>
                    </div>

                    {/* Horizontal scrollable cards container / skeletons representing react-native-skeleton-content */}
                    {categoriesLoading ? (
                      <div className="flex gap-4 overflow-x-auto py-2 scroll-hide">
                        {[1, 2, 3].map((idx) => (
                          <div 
                            key={idx}
                            className="relative shrink-0 w-48 h-[280px] rounded-2xl overflow-hidden border border-[#1f1f35]/50 bg-[#111118]/80 p-4 flex flex-col justify-between animate-pulse"
                          >
                            {/* Top Selection/Indicator skeleton placeholder */}
                            <div className="flex justify-end">
                              <div className="w-8 h-8 rounded-full bg-[#1b1b26]/85 border border-[#1f1f35]/40 shadow-inner" />
                            </div>

                            {/* Bottom Metadata skeleton lines */}
                            <div className="space-y-2">
                              {/* Department label skeleton */}
                              <div className="w-16 h-3 bg-[#4edea3]/15 rounded-md" />
                              {/* Title line 1 skeleton */}
                              <div className="w-3/4 h-5 bg-[#1f1f2e] rounded-lg" />
                              {/* Title line 2 skeleton */}
                              <div className="w-1/2 h-3 bg-[#1b1b26] rounded-md" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-4 overflow-x-auto py-2 scroll-hide">
                        {CATEGORIES.map((item) => {
                          const isSelected = selectedCategory === item.id;
                          return (
                            <div 
                              key={item.id}
                              onClick={() => setSelectedCategory(item.id)}
                              className={`relative shrink-0 w-48 h-[280px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                                isSelected ? 'border-2 border-[#d2bbff] ring-4 ring-[#7c3aed]/10' : 'border border-[#1f1f35]'
                              }`}
                            >
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-[#111118]/25 to-transparent"></div>

                              {/* Selection check indicator */}
                              {isSelected && (
                                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#d2bbff] flex items-center justify-center text-[#3f008e] font-extrabold shadow shadow-black">
                                  <Check className="w-4 h-4" />
                                </div>
                              )}

                              <div className="absolute bottom-4 left-4 right-4">
                                <span className="text-[9px] font-bold tracking-widest text-[#4edea3] uppercase block mb-1">{item.department}</span>
                                <h3 className="text-lg font-bold text-white leading-tight">{item.emoji} {item.title}</h3>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Launch Room Button */}
                    <div className="mt-6">
                      <button 
                        onClick={() => setCurrentScreen('swipe')}
                        className="w-full bg-[#7c3aed] py-4 rounded-full font-bold text-white text-xs flex items-center justify-center gap-2 neon-glow-primary hover:brightness-110 active:scale-[0.98] transition-all"
                      >
                        Create Room
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Gradient Fade Divider */}
                    <div className="my-8 gradient-divider"></div>

                    {/* Friend room sign and join form */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-[#958da1]">OR JOIN A FRIEND'S ROOM</span>
                        <div className="relative flex items-center mt-2">
                          <input 
                            type="text" 
                            className="w-full bg-[#1b1b20] border border-[#1f1f35] rounded-xl py-3.5 pl-4 pr-20 text-xs font-semibold text-white focus:outline-none focus:border-[#7c3aed] placeholder-[#958da1]/50"
                            placeholder="Enter Room ID (e.g. #7721)"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                          />
                          <button 
                            onClick={() => setCurrentScreen('swipe')}
                            className="absolute right-2 top-2 bottom-2 bg-[#2a292f] text-[#d2bbff] px-4 rounded-lg text-xs font-bold hover:brightness-110"
                          >
                            Join
                          </button>
                        </div>
                      </div>

                      {/* Simple rejoin banner */}
                      <div className="p-3.5 bg-[#171724]/75 rounded-xl border border-[#1f1f35] flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#4edea3]/10 flex items-center justify-center text-[#4edea3] text-xs">⏳</div>
                          <span className="text-xs font-semibold text-white">Recent: "{recentRoomName}"</span>
                        </div>
                        <button 
                          onClick={() => setCurrentScreen('swipe')} 
                          className="text-[#d2bbff] text-xs font-bold hover:underline"
                        >
                          Rejoin
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Bar */}
                  <nav className="absolute bottom-0 left-0 w-full h-14 bg-[#111118]/90 backdrop-blur-md border-t border-[#1f1f35]/40 flex justify-around items-center px-4 z-20">
                    <button onClick={() => setCurrentScreen('explore')} className="flex flex-col items-center justify-center text-[#d2bbff] bg-[#7c3aed]/10 px-3 py-1.5 rounded-full">
                      <Compass className="w-4 h-4" />
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Explore</span>
                    </button>
                    <button onClick={() => setCurrentScreen('swipe')} className="flex flex-col items-center justify-[#958da1] text-[#958da1] hover:text-white transition">
                      <span className="text-md">👥</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Rooms</span>
                    </button>
                    <button onClick={() => setCurrentScreen('match')} className="flex flex-col items-center text-[#958da1] hover:text-white transition">
                      <span className="text-md">❤️</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Matches</span>
                    </button>
                    <button onClick={() => setCurrentScreen('profile')} className="flex flex-col items-center text-[#958da1] hover:text-white transition">
                      <span className="text-md font-sans">👤</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Profile</span>
                    </button>
                  </nav>
                </div>
              )}

              {/* SCREEN STAGE: Swipe Deck */}
              {currentScreen === 'swipe' && (
                <div id="stage-swipe-deck" className="flex-1 flex flex-col justify-between pt-14 pb-20 relative transition-all">
                  
                  {/* Header Navigation */}
                  <header className="absolute top-0 left-0 w-full h-14 flex justify-between items-center px-4 bg-[#131318]/80 backdrop-blur-md border-b border-[#1f1f35]/30 z-20">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#7c3aed] flex items-center justify-center font-bold text-[9px] text-[#ede0ff]">UP</div>
                      <span className="font-extrabold text-[#d2bbff] tracking-tight text-sm">ConsensuS</span>
                    </div>
                    <button onClick={() => setCurrentScreen('profile')} className="text-[#958da1] hover:text-[#d2bbff]">
                      ⚙️
                    </button>
                  </header>

                  {/* Active swiper workspace */}
                  <div className="flex-grow flex flex-col items-center justify-center py-4 relative">
                    
                    {/* Swipe counters */}
                    <div className="mb-4 text-center">
                      <div className="flex -space-x-1.5 justify-center">
                        <img className="w-8 h-8 rounded-full border-2 border-[#131318] object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" alt="f1" />
                        <img className="w-8 h-8 rounded-full border-2 border-[#131318] object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" alt="f2" />
                        <img className="w-8 h-8 rounded-full border-2 border-[#131318] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="f3" />
                        <div className="w-8 h-8 rounded-full border-2 border-[#131318] bg-[#1f1f25] flex items-center justify-center text-[9px] font-bold text-[#d2bbff]">+2</div>
                      </div>
                      <span className="text-[9px] font-bold tracking-widest text-[#958da1] uppercase block mt-2">4 Friends Swiping ({selectedCategory})</span>
                    </div>

                    <div className="w-[85%] h-1 bg-[#1f1f35]/50 rounded-full mb-4"></div>

                    {/* The Card View Area */}
                    <div className="w-[280px] h-[360px] relative">
                      <AnimatePresence mode="popLayout">
                        {currentCardIndex >= swipeStack.length ? (
                          <motion.div 
                            key="empty"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', damping: 20, stiffness: 120 } }}
                            className="absolute inset-0 bg-[#111118] border border-[#1f1f35] rounded-3xl p-6 flex flex-col items-center justify-center text-center"
                          >
                            <div className="w-16 h-16 rounded-full bg-[#7c3aed]/10 text-[#d2bbff] flex items-center justify-center text-3xl mb-4 animate-bounce">🎬</div>
                            <h2 className="text-md font-bold text-[#d2bbff] mb-2">You've seen everything!</h2>
                            <p className="text-xs text-[#958da1]">Waiting for other friends to finalize. We will match soon!</p>
                            <button 
                              onClick={() => setCurrentCardIndex(0)}
                              className="mt-6 px-4 py-2 bg-[#2a292f] hover:bg-[#35343a] text-xs font-bold text-[#d2bbff] rounded-lg flex items-center gap-1.5 transition-all"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Restart Stack
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key={swipeStack[currentCardIndex].id}
                            initial={{ scale: 0.92, y: 15, opacity: 0.85 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{
                              x: swipeActionMessage === 'like' ? 320 : swipeActionMessage === 'nope' ? -320 : 0,
                              y: 20,
                              opacity: 0,
                              rotate: swipeActionMessage === 'like' ? 15 : swipeActionMessage === 'nope' ? -15 : 0,
                              transition: { type: 'spring', damping: 25, stiffness: 150 }
                            }}
                            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(event, info) => {
                              if (info.offset.x > 100) {
                                handleSwipeAction('like');
                              } else if (info.offset.x < -100) {
                                handleSwipeAction('nope');
                              }
                            }}
                            className="absolute inset-0 bg-[#111118] rounded-3xl border border-[#1f1f35] overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300 cursor-grab active:cursor-grabbing select-none"
                          >
                            
                            {/* Top Card Image Body content */}
                            <div className="h-[60%] relative overflow-hidden bg-black pointer-events-none">
                              <img 
                                src={swipeStack[currentCardIndex].image} 
                                alt="Movie Poster" 
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Overlay Indicators matching swipe action message */}
                              {swipeActionMessage === 'like' && (
                                <div className="absolute top-6 left-6 border-4 border-[#4edea3] px-4 py-1 rounded-lg text-[#4edea3] font-black text-2xl tracking-widest rotate-[-12deg] bg-[#111118]/90 z-20">
                                  LIKE
                                </div>
                              )}

                              {swipeActionMessage === 'nope' && (
                                <div className="absolute top-6 right-6 border-4 border-[#ef4444] px-4 py-1 rounded-lg text-[#ef4444] font-black text-2xl tracking-widest rotate-[12deg] bg-[#111118]/90 z-20">
                                  NOPE
                                </div>
                              )}
                            </div>

                            {/* Detail metadata stack bottom */}
                            <div className="h-[40%] bg-[#1b1b20] p-4 flex flex-col justify-between pointer-events-none">
                              <div>
                                <div className="flex justify-between items-center">
                                  <h3 className="text-md font-extrabold text-white truncate leading-none">
                                    {swipeStack[currentCardIndex].title}
                                  </h3>
                                  {swipeStack[currentCardIndex].badge && (
                                    <span className="text-[8px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/25">
                                      Joined
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#958da1] mt-1 truncate">
                                  {swipeStack[currentCardIndex].meta}
                                </p>
                              </div>

                              {/* Tags list */}
                              <div className="flex flex-wrap gap-1.5">
                                {swipeStack[currentCardIndex].tags.map((tag, i) => (
                                  <span key={i} className="text-[10px] font-semibold text-[#e4e1e9] bg-[#2a292f] px-2.5 py-1 rounded-full border border-[#1f1f35]/40">{tag}</span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Physics swiper action controllers */}
                    {currentCardIndex < swipeStack.length && (
                      <div className="flex gap-8 justify-center items-center mt-6">
                        <button 
                          onClick={() => handleSwipeAction('nope')}
                          className="w-14 h-14 rounded-full bg-[#111118] border border-[#ef4444]/40 text-[#ef4444] flex items-center justify-center hover:bg-[#ef4444]/10 transition active:scale-90 neon-glow-error"
                        >
                          <X className="w-6 h-6" />
                        </button>
                        <button 
                          onClick={() => handleSwipeAction('like')}
                          className="w-14 h-14 rounded-full bg-[#111118] border border-[#4edea3] text-[#4edea3] flex items-center justify-center hover:bg-[#4edea3]/10 transition active:scale-90 neon-glow-secondary"
                        >
                          <Heart className="w-6 h-6 fill-current" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Navigation Bar */}
                  <nav className="absolute bottom-0 left-0 w-full h-14 bg-[#111118]/90 backdrop-blur-md border-t border-[#1f1f35]/40 flex justify-around items-center px-4 z-20">
                    <button onClick={() => setCurrentScreen('explore')} className="flex flex-col items-center justify-center text-[#958da1] hover:text-white transition">
                      <Compass className="w-4 h-4" />
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Explore</span>
                    </button>
                    <button onClick={() => setCurrentScreen('swipe')} className="flex flex-col items-center justify-center text-[#d2bbff] bg-[#7c3aed]/10 px-3 py-1.5 rounded-full">
                      <span className="text-md">👥</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Rooms</span>
                    </button>
                    <button onClick={() => setCurrentScreen('match')} className="flex flex-col items-center text-[#958da1] hover:text-white transition">
                      <span className="text-md">❤️</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Matches</span>
                    </button>
                    <button onClick={() => setCurrentScreen('profile')} className="flex flex-col items-center text-[#958da1] hover:text-white transition">
                      <span className="text-md font-sans">👤</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Profile</span>
                    </button>
                  </nav>
                </div>
              )}

              {/* SCREEN STAGE: Match Celebration */}
              {currentScreen === 'match' && (
                <div id="stage-match" className="flex-1 flex flex-col justify-between pt-14 pb-20 relative overflow-hidden transition-all text-center">
                  
                  {/* Celebration Background Glow blur */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[60%] bg-[#fbbf24]/5 blur-3xl rounded-full pointer-events-none z-0" />

                  {/* Absolute Headers */}
                  <header className="absolute top-0 left-0 w-full h-14 flex justify-between items-center px-4 bg-[#131318]/80 backdrop-blur-md border-b border-[#1f1f35]/30 z-20">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#7c3aed] flex items-center justify-center font-bold text-[9px] text-[#ede0ff]">JD</div>
                      <span className="font-extrabold text-[#d2bbff] tracking-tight text-sm">ConsensuS</span>
                    </div>
                    <button onClick={() => setCurrentScreen('profile')} className="text-[#958da1] hover:text-[#d2bbff]">
                      ⚙️
                    </button>
                  </header>

                  {/* Body celebration content */}
                  <div className="flex-grow overflow-y-auto px-4 pt-14 pb-4 flex flex-col justify-between items-center relative z-10 scroll-hide">
                    
                    {/* Celebration Header block */}
                    <div className="mt-4 mb-4 animate-bounce">
                      <span className="text-[10px] font-bold tracking-widest text-[#fbbf24] uppercase block mb-1">Match Achieved</span>
                      <h1 className="text-3xl font-black text-white leading-tight">🎉 It's a Match!</h1>
                    </div>

                    {/* Matched Poster Card wrapper */}
                    <div className="relative w-[240px] h-[340px] rounded-3xl overflow-hidden border border-[#1f1f35] neon-glow-gold bg-[#111118]/90 celebration-float-animation">
                      <img 
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400" 
                        alt="Match Poster" 
                        className="w-full h-2/3 object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#111118] via-[#111118]/90 to-transparent"></div>

                      <span className="absolute top-3 right-3 text-[9px] font-bold text-[#261a00] bg-[#fbbf24] px-2.5 py-1 rounded-full shadow-md shadow-black/50">
                        100% COMPATIBLE
                      </span>

                      <div className="absolute bottom-4 left-4 right-4 text-center">
                        <h2 className="text-xl font-black text-white mb-1">Interstellar</h2>
                        <p className="text-[11px] text-[#958da1] font-semibold leading-relaxed">You all agreed on this choice</p>
                        
                        <div className="flex -space-x-1.5 justify-center mt-3">
                          <div className="w-6 h-6 rounded-full border-2 border-[#111118] bg-[#7c3aed] flex items-center justify-center font-bold text-[8px] text-white">JD</div>
                          <div className="w-6 h-6 rounded-full border-2 border-[#111118] bg-[#00a572] flex items-center justify-center font-bold text-[8px] text-white">MS</div>
                          <div className="w-6 h-6 rounded-full border-2 border-[#111118] bg-[#836100] flex items-center justify-center font-bold text-[8px] text-white">AK</div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons list */}
                    <div className="w-full space-y-2 mt-6">
                      <button 
                        onClick={() => alert("Launching Interstellar streaming player integration!")}
                        className="w-full h-11 bg-[#fbbf24] text-[#261a00] rounded-full font-bold text-xs shadow-[0_4px_16px_rgba(251,191,36,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
                      >
                        Watch Now
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedCategory('movies');
                          setCurrentScreen('explore');
                        }}
                        className="w-full h-11 rounded-full border border-[#fbbf24]/50 text-[#fbbf24] font-bold text-xs hover:bg-[#fbbf24]/5 active:scale-[0.98] transition-all"
                      >
                        Start New Room
                      </button>
                      <button 
                        onClick={() => alert("Copied Match Details to share clipboard!")}
                        className="w-full text-[11px] text-[#958da1] font-semibold hover:text-[#fbbf24]"
                      >
                        Share with Group
                      </button>
                    </div>
                  </div>

                  {/* Navigation Bar */}
                  <nav className="absolute bottom-0 left-0 w-full h-14 bg-[#111118]/90 backdrop-blur-md border-t border-[#1f1f35]/40 flex justify-around items-center px-4 z-20">
                    <button onClick={() => setCurrentScreen('explore')} className="flex flex-col items-center justify-center text-[#958da1] hover:text-white transition">
                      <Compass className="w-4 h-4" />
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Explore</span>
                    </button>
                    <button onClick={() => setCurrentScreen('swipe')} className="flex flex-col items-center justify-center text-[#958da1] hover:text-white transition">
                      <span className="text-md">👥</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Rooms</span>
                    </button>
                    <button onClick={() => setCurrentScreen('match')} className="flex flex-col items-center justify-center text-[#fbbf24] bg-[#fbbf24]/10 px-3 py-1.5 rounded-full">
                      <span className="text-md text-[#fbbf24]">❤️</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Matches</span>
                    </button>
                    <button onClick={() => setCurrentScreen('profile')} className="flex flex-col items-center text-[#958da1] hover:text-white transition">
                      <span className="text-md font-sans">👤</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Profile</span>
                    </button>
                  </nav>
                </div>
              )}

              {/* SCREEN STAGE: Profile Settings */}
              {currentScreen === 'profile' && (
                <div id="stage-profile" className="flex-1 flex flex-col justify-between pt-14 pb-20 relative transition-all">
                  
                  {/* Header bar controls */}
                  <header className="absolute top-0 left-0 w-full h-14 flex justify-between items-center px-4 bg-[#131318]/80 backdrop-blur-md border-b border-[#1f1f35]/30 z-20">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setCurrentScreen('explore')} 
                        className="text-[#958da1] hover:text-[#d2bbff] p-1 font-bold mr-1"
                      >
                        ✕
                      </button>
                      <h1 className="font-bold text-sm text-[#e4e1e9]">Profile</h1>
                    </div>
                    <button onClick={() => alert("General settings triggers...")} className="text-[#958da1] hover:text-[#d2bbff]">
                      ⚙️
                    </button>
                  </header>

                  {/* Profile contents viewport */}
                  <div className="flex-grow overflow-y-auto px-4 pt-14 pb-4 z-10 scroll-hide">
                    
                    {/* Saving floating feedback toast inside mockup */}
                    <div id="save-toast" className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/40 px-4 py-2 rounded-xl text-xs font-semibold opacity-0 transition-opacity duration-300 z-30 pointer-events-none flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Saved Successfully
                    </div>

                    {/* Avatar with dynamic reactive initials */}
                    <div className="flex flex-col items-center mt-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full avatar-gradient shadow-xl flex items-center justify-center text-white text-3xl font-extrabold relative z-10">
                          {userName.substring(0, 2).toUpperCase() || 'JD'}
                        </div>
                        <button className="absolute -bottom-1 -right-1 z-20 bg-[#d2bbff] p-2 rounded-full border-4 border-[#0a0a0f] text-[#3f008e] active:scale-95 hover:brightness-110 transition">
                          ✏️
                        </button>
                        <div className="absolute inset-0 bg-[#7c3aed]/20 blur-2xl -z-0 rounded-full"></div>
                      </div>

                      <div className="text-center mt-4">
                        <h2 className="text-xl font-bold text-white">{userName}</h2>
                        <p className="text-xs text-[#958da1] mt-0.5">{userHandle}</p>
                      </div>
                    </div>

                    {/* Details input stack */}
                    <div className="mt-8 space-y-4">
                      {/* Name input */}
                      <div>
                        <label className="text-[10px] font-bold text-[#958da1] uppercase block mb-1 tracking-widest ml-1">Display Name</label>
                        <div className="flex items-center h-12 bg-[#171724]/75 rounded-xl px-4 border border-[#1f1f35] focus-within:border-[#7c3aed] transition">
                          <span className="text-[#958da1] text-sm mr-3">👤</span>
                          <input 
                            type="text" 
                            className="bg-transparent border-none focus:outline-none w-full text-white text-xs font-semibold"
                            value={userName}
                            onChange={(e) => {
                              setUserName(e.target.value);
                              setUserHandle(`@${e.target.value.toLowerCase().replace(/\s+/g, '_')}`);
                            }}
                          />
                        </div>
                      </div>

                      {/* Phone input (marked read-only verified) */}
                      <div>
                        <label className="text-[10px] font-bold text-[#958da1] uppercase block mb-1 tracking-widest ml-1">Verified Phone</label>
                        <div className="flex items-center h-12 bg-[#1b1b20] rounded-xl px-4 border border-border-subtle/10 opacity-75">
                          <span className="text-[#958da1] text-xs mr-3">📞</span>
                          <input 
                            type="text" 
                            className="bg-transparent border-none text-[#958da1] text-xs font-semibold w-full outline-none cursor-not-allowed"
                            value={phoneNumber}
                            readOnly
                          />
                          <span className="text-[#4edea3] text-xs font-bold">✓</span>
                        </div>
                      </div>

                      {/* Email input */}
                      <div>
                        <label className="text-[10px] font-bold text-[#958da1] uppercase block mb-1 tracking-widest ml-1">Email Address</label>
                        <div className="flex items-center h-12 bg-[#171724]/75 rounded-xl px-4 border border-[#1f1f35] focus-within:border-[#7c3aed] transition">
                          <span className="text-[#958da1] text-sm mr-3">✉️</span>
                          <input 
                            type="email" 
                            className="bg-transparent border-none focus:outline-none w-full text-white text-xs font-semibold"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stats columns */}
                    <div className="grid grid-cols-3 gap-3 mt-8 mb-6">
                      <div className="p-3 bg-[#111118]/80 border border-[#1f1f35] rounded-xl text-center">
                        <span className="text-md font-bold text-[#d2bbff] block">{roomsCount}</span>
                        <span className="text-[8px] font-bold text-[#958da1] block tracking-wider uppercase mt-1">Rooms</span>
                      </div>
                      <div className="p-3 bg-[#111118]/80 border border-[#1f1f35] rounded-xl text-center">
                        <span className="text-md font-bold text-[#4edea3] block">{matchesCount}</span>
                        <span className="text-[8px] font-bold text-[#958da1] block tracking-wider uppercase mt-1">Matches</span>
                      </div>
                      <div className="p-3 bg-[#111118]/80 border border-[#1f1f35] rounded-xl text-center">
                        <span className="text-md font-bold text-[#fbbf24] block">92%</span>
                        <span className="text-[8px] font-bold text-[#958da1] block tracking-wider uppercase mt-1">Agree</span>
                      </div>
                    </div>

                    {/* Primary profiles CTA buttons */}
                    <div className="space-y-3 mt-6">
                      <button 
                        onClick={handleProfileSave}
                        className="w-full h-12 bg-[#7c3aed] text-[#ede0ff] rounded-full font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#7c3aed]/20"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button 
                        onClick={handleLogOut}
                        className="w-full h-12 bg-transparent border border-[#ef4444]/30 text-[#ef4444] rounded-full font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#ef4444]/5 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>

                    <p className="text-center text-[10px] text-[#958da1] mt-8 tracking-widest font-mono">CONSENSU_S V2.4.0</p>
                  </div>

                  {/* Navigation Bar */}
                  <nav className="absolute bottom-0 left-0 w-full h-14 bg-[#111118]/90 backdrop-blur-md border-t border-[#1f1f35]/40 flex justify-around items-center px-4 z-20">
                    <button onClick={() => setCurrentScreen('explore')} className="flex flex-col items-center justify-center text-[#958da1] hover:text-white transition">
                      <Compass className="w-4 h-4" />
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Explore</span>
                    </button>
                    <button onClick={() => setCurrentScreen('swipe')} className="flex flex-col items-center justify-center text-[#958da1] hover:text-white transition">
                      <span className="text-md">👥</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Rooms</span>
                    </button>
                    <button onClick={() => setCurrentScreen('match')} className="flex flex-col items-center text-[#958da1] hover:text-white transition">
                      <span className="text-md">❤️</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Matches</span>
                    </button>
                    <button onClick={() => setCurrentScreen('profile')} className="flex flex-col items-center justify-center text-[#d2bbff] bg-[#7c3aed]/10 px-3 py-1.5 rounded-full">
                      <span className="text-md font-sans">👤</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Profile</span>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Code View Inspector */}
        <section id="source-code-inspector" className="lg:col-span-7 flex flex-col h-[780px]">
          <div className="mb-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              📂 Transformed React Native Files
            </h3>
            <p className="text-xs text-[#958da1]">Drop-ready code for your Expo navigation paths</p>
          </div>
          
          <div className="flex-1">
            <ReactNativeViewer />
          </div>
        </section>
      </main>

      {/* Decorative Outer Ambient Grids */}
      <footer className="border-t border-[#1f1f35]/30 bg-[#07070a] py-8 text-center text-xs text-[#958da1] mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Google AI Studio Workspace • Crafted for ConsensuS Applet</p>
          <div className="flex gap-6">
            <span className="text-[#d2bbff] font-semibold">React Net Native (Expo)</span>
            <span className="text-[#4edea3] font-semibold">Zustand Integrated</span>
            <span className="text-[#fbbf24] font-semibold">Minimalist Theme</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
