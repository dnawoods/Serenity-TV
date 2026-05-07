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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showUI, setShowUI] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [focusedSection, setFocusedSection] = useState<'categories' | 'scenes' | 'header'>('categories');
  const [focusedCategoryIndex, setFocusedCategoryIndex] = useState(0);
  const [focusedSceneIndex, setFocusedSceneIndex] = useState(0);
  
  const uiTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredScenes = activeCategory === 'All' 
    ? VIDEO_SCENES 
    : VIDEO_SCENES.filter(s => s.category === activeCategory);

  // Auto-hide UI
  const resetUITimer = useCallback((forceShow = true) => {
    if (forceShow) setShowUI(true);
    if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
    uiTimeoutRef.current = setTimeout(() => {
      setShowUI(false);
    }, 10000);
  }, []);

  // TV Navigation Logic
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // If UI is hidden, any key should just show it first
    const isOkKey = ['Enter', 'Select', 'Center'].includes(e.key);
    const isNavigationKey = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key);

    // Get current state via functional updates or by managing carefully
    // To avoid dependency loop on showUI, we can't easily check 'showUI' here
    // unless we use a ref or include it. Let's include it but fix the effect.

    if (!showUI) {
      if (isOkKey || isNavigationKey) {
        setShowUI(true);
        resetUITimer(true);
        if (isPlaying && !isOkKey) return; 
      }
    } else {
      resetUITimer(true);
    }

    if (focusedSection === 'header') {
      if (e.key === 'ArrowDown') {
        setFocusedSection('categories');
      } else if (isOkKey) {
        setIsMuted(prev => !prev);
      }
    } 
    else if (focusedSection === 'categories') {
      if (e.key === 'ArrowRight') {
        setFocusedCategoryIndex(prev => Math.min(prev + 1, CATEGORIES.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setFocusedCategoryIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'ArrowDown') {
        setFocusedSection('scenes');
        setFocusedSceneIndex(0);
      } else if (e.key === 'ArrowUp') {
        setFocusedSection('header');
      } else if (isOkKey) {
        setActiveCategory(CATEGORIES[focusedCategoryIndex]);
        setFocusedSceneIndex(0);
      }
    } 
    else if (focusedSection === 'scenes') {
      if (e.key === 'ArrowRight') {
        setFocusedSceneIndex(prev => Math.min(prev + 1, filteredScenes.length - 1));
      } else if (e.key === 'ArrowLeft') {
        if (focusedSceneIndex === 0) {
          // Stay in scenes
        } else {
          setFocusedSceneIndex(prev => Math.max(prev - 1, 0));
        }
      } else if (e.key === 'ArrowUp') {
        setFocusedSection('categories');
      } else if (isOkKey) {
        const targetScene = filteredScenes[focusedSceneIndex];
        setSelectedScene(targetScene);
        setIsPlaying(true);
        setShowUI(false);
        if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
        
        if (containerRef.current && !document.fullscreenElement) {
          containerRef.current.requestFullscreen().catch(err => {
            console.warn(`Fullscreen error: ${err.message}`);
          });
        }
        return; // Exit early to avoid UI reset
      }
    }

    if (e.key === 'm' || e.key === 'M') {
      setIsMuted(prev => !prev);
    } else if (e.key === 'Escape' || e.key === 'Backspace') {
      if (isPlaying) {
        setIsPlaying(false);
        setShowUI(true);
        resetUITimer(true);
      } else if (focusedSection !== 'categories') {
        setFocusedSection('categories');
        resetUITimer(true);
      }
    }
  }, [focusedSection, focusedCategoryIndex, focusedSceneIndex, filteredScenes, isPlaying, showUI, resetUITimer]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    resetUITimer();
  };

  const focusedScene = focusedSection === 'scenes' 
    ? filteredScenes[focusedSceneIndex] 
    : (isPlaying ? selectedScene : filteredScenes[0]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black text-white overflow-hidden font-sans select-none">
      {/* 4K Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <AnimatePresence>
          {isPlaying ? (
            <motion.div
              key={`video-${selectedScene.youtubeId}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <iframe
                id="nature-player"
                className="w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-105"
                src={`https://www.youtube.com/embed/${selectedScene.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${selectedScene.youtubeId}&controls=0&rel=0&modestbranding=1`}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                frameBorder="0"
              />
            </motion.div>
          ) : (
            <motion.div
              key={`thumb-${focusedScene.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img 
                src={focusedScene.thumbnail} 
                className="w-full h-full object-cover scale-110 blur-[2px] opacity-60"
                alt=""
              />
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* The vignette was removed to improve video brightness */}
      </div>

      {/* UI Overlay */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-10 flex flex-col justify-between p-16 bg-gradient-to-r from-black/80 via-black/20 to-transparent"
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
                <button 
                  onClick={toggleMute}
                  className={`p-5 rounded-full backdrop-blur-xl border transition-all duration-500 outline-none ${
                    focusedSection === 'header' 
                      ? 'ring-8 ring-blue-500/50 scale-110 border-blue-400' 
                      : ''
                  } ${
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
                {CATEGORIES.map((cat, idx) => {
                  const isFocused = focusedSection === 'categories' && focusedCategoryIndex === idx;
                  const isActive = activeCategory === cat;
                  
                  return (
                    <motion.button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setFocusedCategoryIndex(idx);
                        setFocusedSection('categories');
                        setFocusedSceneIndex(0);
                        resetUITimer();
                      }}
                      animate={{ 
                        scale: isFocused ? 1.1 : 1,
                        backgroundColor: isActive ? "rgba(255, 255, 255, 1)" : (isFocused ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0)"),
                        color: isActive ? "rgba(0, 0, 0, 1)" : (isFocused ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.4)"),
                        borderColor: isFocused ? "rgba(96, 165, 250, 1)" : (isActive ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.1)")
                      }}
                      className="px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 outline-none border-2 shadow-lg shadow-transparent"
                      style={{
                        boxShadow: isFocused ? "0 0 30px rgba(59, 130, 246, 0.3)" : "none"
                      }}
                    >
                      {cat}
                    </motion.button>
                  );
                })}
              </div>

              {/* Scene Row */}
              <div className="flex gap-8 overflow-visible">
                {filteredScenes.map((scene, idx) => {
                  const isFocused = focusedSection === 'scenes' && focusedSceneIndex === idx;
                  const isCurrent = selectedScene.id === scene.id;

                  return (
                    <motion.div
                      key={scene.id}
                      onClick={() => {
                        setSelectedScene(scene);
                        setIsPlaying(true);
                        setShowUI(false);
                        setFocusedSceneIndex(idx);
                        setFocusedSection('scenes');
                        
                        if (containerRef.current && !document.fullscreenElement) {
                          containerRef.current.requestFullscreen().catch(err => {
                            console.warn(`Fullscreen error: ${err.message}`);
                          });
                        }
                      }}
                      animate={{
                        scale: isFocused ? 1.1 : 1,
                        x: -Math.max(0, focusedSceneIndex - 1) * 440,
                        opacity: focusedSection === 'scenes' && Math.abs(focusedSceneIndex - idx) > 3 ? 0.3 : 1
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
                  <span className="bg-white/10 px-3 py-1 rounded">D-PAD</span> Browse Scenes
                </span>
                <span className="flex items-center gap-3">
                  <span className="bg-white/10 px-3 py-1 rounded text-white/60">OK</span> Select
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
