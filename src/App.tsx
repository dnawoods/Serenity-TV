import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Music,
  Trees as Forest,
  Waves,
  Sparkles,
  Mountain,
  Sun
} from 'lucide-react';
import { VIDEO_SCENES, CATEGORIES } from './constants';
import { VideoScene } from './types';

export default function App() {
  const [selectedScene, setSelectedScene] = useState<VideoScene>(VIDEO_SCENES[0]);
  const [isMuted, setIsMuted] = useState(true);
  const [showUI, setShowUI] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isSidebarFocused, setIsSidebarFocused] = useState(true);
  
  const uiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filteredScenes = activeCategory === 'All' 
    ? VIDEO_SCENES 
    : VIDEO_SCENES.filter(s => s.category === activeCategory);

  // Auto-hide UI
  const resetUITimer = useCallback(() => {
    setShowUI(true);
    if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
    uiTimeoutRef.current = setTimeout(() => {
      // Don't auto-hide if sidebar is focused to avoid confusion
      if (!isSidebarFocused) setShowUI(false);
    }, 8000);
  }, [isSidebarFocused]);

  // TV Navigation Logic
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    resetUITimer();
    
    if (e.key === 'ArrowRight') {
      if (isSidebarFocused) {
        setIsSidebarFocused(false);
        setFocusedIndex(0);
      } else {
        setFocusedIndex(prev => Math.min(prev + 1, filteredScenes.length - 1));
      }
    } else if (e.key === 'ArrowLeft') {
      if (!isSidebarFocused && focusedIndex === 0) {
        setIsSidebarFocused(true);
      } else if (!isSidebarFocused) {
        setFocusedIndex(prev => Math.max(prev - 1, 0));
      }
    } else if (e.key === 'ArrowDown') {
      if (isSidebarFocused) {
        const currentIdx = CATEGORIES.indexOf(activeCategory);
        const nextCatIdx = (currentIdx + 1) % CATEGORIES.length;
        setActiveCategory(CATEGORIES[nextCatIdx]);
        setFocusedIndex(0);
      }
    } else if (e.key === 'ArrowUp') {
      if (isSidebarFocused) {
        const currentIdx = CATEGORIES.indexOf(activeCategory);
        const prevCatIdx = (currentIdx - 1 + CATEGORIES.length) % CATEGORIES.length;
        setActiveCategory(CATEGORIES[prevCatIdx]);
        setFocusedIndex(0);
      }
    } else if (e.key === 'Enter') {
      if (!isSidebarFocused) {
        setSelectedScene(filteredScenes[focusedIndex]);
      } else if (e.key === 'Enter') {
        // Toggle Mute if somehow focused or just use dedicated key
      }
    } else if (e.key === 'm' || e.key === 'M') {
      setIsMuted(prev => !prev);
    } else if (e.key === 'Escape' || e.key === 'Backspace') {
      setShowUI(true);
    }
  }, [isSidebarFocused, focusedIndex, filteredScenes, activeCategory, resetUITimer]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    resetUITimer();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, resetUITimer]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    resetUITimer();
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-sans select-none">
      {/* 4K Video Loop Player */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe
          key={selectedScene.youtubeId + (isMuted ? 'muted' : 'unmuted')}
          id="nature-player"
          className="w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-105"
          src={`https://www.youtube.com/embed/${selectedScene.youtubeId}?autoplay=1&loop=1&playlist=${selectedScene.youtubeId}&controls=0&mute=${isMuted ? 1 : 0}&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1`}
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* UI Overlay */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-10 flex flex-col justify-between p-16 bg-gradient-to-r from-black/90 via-black/40 to-transparent"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-6xl font-light tracking-tighter flex items-center gap-4">
                    <Sparkles className="w-12 h-12 text-blue-400" />
                    SERENITY <span className="font-bold opacity-60">TV</span>
                  </h1>
                </motion.div>
                
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4 bg-white/5 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10"
                >
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Music className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Music Ready</span>
                  </div>
                  <div className="h-4 w-px bg-white/20" />
                  <p className="text-xs text-white/50 font-medium">The video is muted by default so you can play Spotify in the background.</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-end gap-4"
              >
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.3em] font-bold text-blue-400 mb-1">Now Playing</p>
                  <h2 className="text-3xl font-light">{selectedScene.title}</h2>
                </div>
                <button 
                  onClick={toggleMute}
                  className={`p-5 rounded-full backdrop-blur-xl border transition-all duration-500 focus:ring-8 focus:ring-blue-500/50 outline-none ${
                    isMuted 
                      ? 'bg-white/5 border-white/10 text-white/60' 
                      : 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/40'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                </button>
              </motion.div>
            </div>

            {/* Browser / Carousel Section */}
            <div className="flex flex-col gap-10">
              {/* Category Rails */}
              <div className="flex gap-4">
                {CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    className={`px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 outline-none border-2 ${
                      activeCategory === cat 
                        ? 'bg-white text-black border-white' 
                        : (isSidebarFocused && activeCategory === cat 
                            ? 'bg-white/20 border-blue-400 shadow-lg shadow-blue-500/30' 
                            : 'bg-transparent border-white/10 text-white/40 hover:text-white')
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>

              {/* Scene Row */}
              <div className="flex gap-8 overflow-visible">
                {filteredScenes.map((scene, idx) => {
                  const isFocused = !isSidebarFocused && focusedIndex === idx;
                  const isCurrent = selectedScene.id === scene.id;

                  return (
                    <motion.div
                      key={scene.id}
                      animate={{
                        scale: isFocused ? 1.1 : 1,
                        x: -Math.max(0, focusedIndex - 1) * 440,
                        opacity: !isSidebarFocused && Math.abs(focusedIndex - idx) > 3 ? 0.3 : 1
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className={`relative min-w-[400px] h-[240px] rounded-[2rem] overflow-hidden transition-all duration-500 border-4 ${
                        isFocused 
                          ? 'border-blue-400 shadow-[0_0_80px_rgba(59,130,246,0.5)] z-20' 
                          : 'border-white/5 opacity-50 z-10'
                      }`}
                    >
                      <img 
                        src={scene.thumbnail} 
                        className="w-full h-full object-cover" 
                        alt={scene.title}
                      />
                      <div className={`absolute inset-0 transition-opacity duration-500 ${isFocused ? 'bg-black/20' : 'bg-black/60'}`} />
                      
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">{scene.category}</span>
                            <h3 className="text-2xl font-bold">{scene.title}</h3>
                          </div>
                          {isCurrent && (
                            <div className="bg-white/90 text-black p-3 rounded-2xl">
                              <Play className="w-5 h-5 fill-current" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Selection Glow */}
                      {isFocused && (
                        <motion.div 
                          layoutId="focus-glow"
                          className="absolute inset-0 border-8 border-blue-400/30 rounded-[2rem] pointer-events-none"
                        />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Footer Navigation Hints */}
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-white/30 border-t border-white/5 pt-8">
              <div className="flex gap-12">
                <span className="flex items-center gap-3">
                  <span className="bg-white/10 px-2 py-1 rounded">Arrows</span> Navigate
                </span>
                <span className="flex items-center gap-3">
                  <span className="bg-white/10 px-2 py-1 rounded text-white/60">Enter</span> Change Scene
                </span>
                <span className="flex items-center gap-3">
                  <span className="bg-white/10 px-2 py-1 rounded text-white/60">M</span> Toggle Sound
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse" />
                <span>4K ULTRA HD • HDR READY</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; cursor: none; }
        ::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
