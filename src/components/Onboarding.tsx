import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronLeft, ChevronRight, X, Play, RefreshCw } from 'lucide-react';

interface OnboardingProps {
  isDarkMode: boolean;
  onClose?: () => void;
}

const ONBOARDING_PAGES = [
  {
    title: "🍔 Crafted Gourmet Smash Burgers",
    description: "Savor Addis Ababa's ultimate smash patties, crafted with dry-aged prime beef, melted brie, caramelized shallots, and house-blended spices on buttered brioche.",
    badge: "Bole Signature",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
    color: "#E63946"
  },
  {
    title: "🍕 Handcrafted 48Hr Sourdough Pizzas",
    description: "Pistachio-blistered sourdough crusts baked to perfection in our custom stone oven. Smothered in wild truffle oils, cremini mushrooms, and fresh fior di latte gourmet mozzarella.",
    badge: "Stone Oven Baked",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
    color: "#F4A261"
  },
  {
    title: "🍹 Wild-Harvested Chilled Craft Brews",
    description: "Wash down your feasts with our premium floral iced teas and signature single-origin cold brews sourced directly from wild micro-farms in Sidama.",
    badge: "100% Organic Brew",
    image: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&q=80&w=600",
    color: "#00E5FF"
  },
  {
    title: "⭐ Rate, Save and Play with Secret Recipes",
    description: "Browse detailed nutritional counts, check prep times, save your favorites instantly to a personalized layout, and rate any item directly to inspire our kitchen masters.",
    badge: "Interactive Gourmet Experience",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600",
    color: "#2A9D8F"
  }
];

export default function Onboarding({ isDarkMode, onClose }: OnboardingProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showTutor, setShowTutor] = useState(() => {
    try {
      const saved = localStorage.getItem('wow-onboarding-showcase');
      return saved !== 'hidden';
    } catch {
      return true;
    }
  });

  const handleDismiss = () => {
    setShowTutor(false);
    try {
      localStorage.setItem('wow-onboarding-showcase', 'hidden');
    } catch (e) {
      // safe ignore
    }
    if (onClose) onClose();
  };

  const handleNext = () => {
    if (currentPage === ONBOARDING_PAGES.length - 1) {
      // Loop back or simply dismiss the tutorial
      handleDismiss();
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? ONBOARDING_PAGES.length - 1 : prev - 1));
  };

  const currentSlide = ONBOARDING_PAGES[currentPage];

  if (!showTutor) {
    return (
      <div className="flex justify-end mb-6" id="onboarding-re-activator">
        <button
          onClick={() => {
            setCurrentPage(0);
            setShowTutor(true);
            try {
              localStorage.removeItem('wow-onboarding-showcase');
            } catch {}
          }}
          className={`flex items-center gap-1.5 rounded-xl border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#E63946] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${
            isDarkMode ? 'bg-[#1D1D1D] text-white hover:bg-black' : 'bg-white text-black hover:bg-gray-50'
          }`}
          id="btn-show-tutor"
        >
          <RefreshCw className="h-4 w-4 stroke-[3]" />
          <span>Interactive App Tour</span>
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`mb-10 overflow-hidden rounded-3xl border-[4px] border-black p-5 sm:p-7 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative ${
        isDarkMode 
          ? 'bg-[#1A1A1A] text-white' 
          : 'bg-white text-gray-900 border-black shadow-[6px_6px_0px_0px_#E63946]'
      }`}
      id="onboarding-main-card"
    >
      {/* Skip/Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-[#E63946] text-white hover:bg-black hover:text-white transition-all active:scale-90"
        id="onboarding-dismiss-cross"
        title="Skip Showcase"
      >
        <X className="h-4 w-4 stroke-[3]" />
      </button>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 lg:items-center">
        {/* Left Side: Photo slide container with neat shadow overlay */}
        <div className="col-span-1 lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[320px] lg:max-w-full aspect-[4/3] rounded-2xl border-[3.5px] border-black overflow-hidden shadow-[4px_4px_0px_0px_#000000] bg-neutral-900 group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPage}
                src={currentSlide.image}
                alt={currentSlide.title}
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
                id="onboarding-slide-image"
              />
            </AnimatePresence>
            
            {/* Color accent bar matching current page category */}
            <div 
              className="absolute top-3 left-3 border-[2px] border-black text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-[1.5px_1.5px_0px_0px_#000000] z-10 flex items-center gap-1 bg-black" 
              style={{ borderColor: currentSlide.color }}
            >
              <Sparkles className="h-3 w-3 animate-spin" style={{ color: currentSlide.color }} />
              <span>{currentSlide.badge}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Copywriting Content & Navigation Button Row */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="rounded-md border-2 border-black bg-black px-2.5 py-0.5 font-mono text-[10px] font-black text-white">
                Step {currentPage + 1} of {ONBOARDING_PAGES.length}
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#E63946]">
                Wow Burger Highlights
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="space-y-2.5"
                id="onboarding-slide-info"
              >
                <h3 className="font-sans text-xl sm:text-2xl font-black uppercase tracking-tight text-balance leading-none">
                  {currentSlide.title}
                </h3>
                <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {currentSlide.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stepper Buttons and Indicators row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-[3px] border-dashed border-black/10">
            {/* Progress dot loops */}
            <div className="flex items-center gap-1.5" id="onboarding-indicators">
              {ONBOARDING_PAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`h-3 rounded-full transition-all border border-black ${
                    currentPage === idx 
                      ? 'w-7 bg-[#E63946]' 
                      : 'w-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                  }`}
                  aria-label={`Show slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black transition-all active:scale-95 ${
                  isDarkMode 
                    ? 'bg-neutral-800 text-white hover:bg-neutral-900' 
                    : 'bg-neutral-100 text-black hover:bg-neutral-200'
                }`}
                id="onboarding-btn-prev"
                title="Go Back"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-xl border-[2.5px] border-black bg-[#E63946] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                id="onboarding-btn-next"
                title="Next Feature"
              >
                <span>
                  {currentPage === ONBOARDING_PAGES.length - 1 ? 'Start Dining' : 'Next'}
                </span>
                {currentPage === ONBOARDING_PAGES.length - 1 ? (
                  <Play className="h-3.5 w-3.5 fill-current stroke-[2.5]" />
                ) : (
                  <ChevronRight className="h-4 w-4 stroke-[3]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
