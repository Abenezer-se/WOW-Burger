/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Clock, 
  Flame, 
  Leaf, 
  TrendingUp, 
  ShieldCheck, 
  Info,
  UtensilsCrossed,
  Star,
  Heart
} from 'lucide-react';
import { MenuItem } from '../types';

interface ItemDetailProps {
  item: MenuItem;
  onBack: () => void;
  onRateItem: (itemId: string, rating: number) => void;
  onToggleFavorite: (itemId: string) => void;
  isFavorite: boolean;
  isDarkMode: boolean;
}

const DETAIL_THEMES: Record<string, {
  border: string;
  shadow: string;
  badge: string;
  text: string;
  statsBorder: string;
  badgePillShadow: string;
  btnShadow: string;
}> = {
  burgers: {
    border: 'border-[#FF4747]',
    shadow: 'shadow-[6px_6px_0px_0px_#FF4747]',
    badge: 'bg-[#FF4747] text-white border-black',
    text: 'text-[#FF4747]',
    statsBorder: 'border-[#FF4747]',
    badgePillShadow: 'shadow-[1.5px_1.5px_0px_0px_#FF4747]',
    btnShadow: 'shadow-[2px_2px_0px_0px_#FF4747] hover:shadow-[1px_1px_0px_0px_#FF4747]'
  },
  pizzas: {
    border: 'border-[#FFAE19]',
    shadow: 'shadow-[6px_6px_0px_0px_#FFAE19]',
    badge: 'bg-[#FFAE19] text-black border-black',
    text: 'text-[#FFAE19]',
    statsBorder: 'border-[#FFAE19]',
    badgePillShadow: 'shadow-[1.5px_1.5px_0px_0px_#FFAE19]',
    btnShadow: 'shadow-[2px_2px_0px_0px_#FFAE19] hover:shadow-[1px_1px_0px_0px_#FFAE19]'
  },
  sandwiches: {
    border: 'border-[#F4A261]',
    shadow: 'shadow-[6px_6px_0px_0px_#F4A261]',
    badge: 'bg-[#F4A261] text-black border-black',
    text: 'text-[#F4A261]',
    statsBorder: 'border-[#F4A261]',
    badgePillShadow: 'shadow-[1.5px_1.5px_0px_0px_#F4A261]',
    btnShadow: 'shadow-[2px_2px_0px_0px_#F4A261] hover:shadow-[1px_1px_0px_0px_#F4A261]'
  },
  desserts: {
    border: 'border-[#FF4D80]',
    shadow: 'shadow-[6px_6px_0px_0px_#FF4D80]',
    badge: 'bg-[#FF4D80] text-white border-black',
    text: 'text-[#FF4D80]',
    statsBorder: 'border-[#FF4D80]',
    badgePillShadow: 'shadow-[1.5px_1.5px_0px_0px_#FF4D80]',
    btnShadow: 'shadow-[2px_2px_0px_0px_#FF4D80] hover:shadow-[1px_1px_0px_0px_#FF4D80]'
  },
  hot_drinks: {
    border: 'border-[#D4A373]',
    shadow: 'shadow-[6px_6px_0px_0px_#D4A373]',
    badge: 'bg-[#D4A373] text-black border-black',
    text: 'text-[#D4A373]',
    statsBorder: 'border-[#D4A373]',
    badgePillShadow: 'shadow-[1.5px_1.5px_0px_0px_#D4A373]',
    btnShadow: 'shadow-[2px_2px_0px_0px_#D4A373] hover:shadow-[1px_1px_0px_0px_#D4A373]'
  },
  cold_drinks: {
    border: 'border-[#00E5FF]',
    shadow: 'shadow-[6px_6px_0px_0px_#00E5FF]',
    badge: 'bg-[#00E5FF] text-black border-black',
    text: 'text-[#00E5FF]',
    statsBorder: 'border-[#00E5FF]',
    badgePillShadow: 'shadow-[1.5px_1.5px_0px_0px_#00E5FF]',
    btnShadow: 'shadow-[2px_2px_0px_0px_#00E5FF] hover:shadow-[1px_1px_0px_0px_#00E5FF]'
  },
  sides: {
    border: 'border-[#FFB800]',
    shadow: 'shadow-[6px_6px_0px_0px_#FFB800]',
    badge: 'bg-[#FFB800] text-black border-black',
    text: 'text-[#FFB800]',
    statsBorder: 'border-[#FFB800]',
    badgePillShadow: 'shadow-[1.5px_1.5px_0px_0px_#FFB800]',
    btnShadow: 'shadow-[2px_2px_0px_0px_#FFB800] hover:shadow-[1px_1px_0px_0px_#FFB800]'
  }
};

const getDetailTheme = (cat: string) => {
  return DETAIL_THEMES[cat] || {
    border: 'border-[#E63946]',
    shadow: 'shadow-[6px_6px_0px_0px_#E63946]',
    badge: 'bg-[#E63946] text-white border-black',
    text: 'text-[#E63946]',
    statsBorder: 'border-[#E63946]',
    badgePillShadow: 'shadow-[1.5px_1.5px_0px_0px_#E63946]',
    btnShadow: 'shadow-[2px_2px_0px_0px_#E63946] hover:shadow-[1px_1px_0px_0px_#E63946]'
  };
};

export default function ItemDetail({ 
  item, 
  onBack, 
  onRateItem, 
  onToggleFavorite, 
  isFavorite, 
  isDarkMode 
}: ItemDetailProps) {
  const theme = getDetailTheme(item.category);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [justRated, setJustRated] = useState<boolean>(false);

  // Calculate average rating
  const userRatings = item.ratings || [];
  const ratingsCount = userRatings.length;
  const avgRating = ratingsCount > 0 
    ? (userRatings.reduce((sum, rating) => sum + rating, 0) / ratingsCount).toFixed(1)
    : 'No ratings yet';

  const handleRate = (stars: number) => {
    onRateItem(item.id, stars);
    setJustRated(true);
    setTimeout(() => {
      setJustRated(false);
    }, 2500);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6" id="product-detail-page">
      {/* Back Button and Path navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className={`group flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all hover:translate-y-px active:scale-95 ${
            isDarkMode 
              ? 'bg-[#1A1A1A] text-white' 
              : 'bg-white text-gray-900'
          } ${theme.border} ${theme.btnShadow}`}
          id="detail-back-button"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          Back to Menu
        </button>

        {/* Small badge path */}
        <span className="hidden text-xs font-black text-gray-400 sm:inline-block font-mono uppercase tracking-widest">
          WOW BURGER &gt; <span className={theme.text}>{item.category}</span>
        </span>
      </div>

      {/* Main Container */}
      <div className={`overflow-hidden rounded-2xl border-[3px] transition-all duration-300 ${
        isDarkMode ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-900 shadow-md'
      } ${theme.border} ${theme.shadow}`}>
        <div className="grid md:grid-cols-2">
          
          {/* Left: Large Image Container with Shared Layout Animations */}
          <div className={`relative aspect-square w-full overflow-hidden bg-[#121212] md:h-full border-b-[3px] md:border-b-0 md:border-r-[3px] ${theme.border}`}>
            <motion.img
              layoutId={`card-${item.id}`}
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            {/* Dark gradients for text legibility */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 md:hidden" />
            
            {/* Quick Badges inside Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {item.isPopular && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F4A261] border border-black px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-md">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Best Seller
                </span>
              )}
              {item.isVegetarian && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 border border-black px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-md">
                  <Leaf className="h-3.5 w-3.5 fill-white/15" />
                  100% Veg
                </span>
              )}
            </div>

            {/* Favorite toggle position inside Image */}
            <button
              onClick={() => onToggleFavorite(item.id)}
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-white/95 text-[#E63946] shadow-md transition-transform duration-200 hover:scale-110 active:scale-95"
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              id={`favorite-toggle-${item.id}`}
            >
              <Heart 
                className={`h-5 w-5 stroke-[2.5] transition-colors ${
                  isFavorite ? 'fill-[#E63946]' : 'text-gray-400'
                }`} 
              />
            </button>

            {/* Price Overlay on Mobile Detail Image */}
            <div className="absolute bottom-4 right-4 md:hidden">
              <span className={`rounded-xl border-2 border-black px-4 py-2 text-lg font-black text-white shadow-md ${theme.badge}`}>
                {item.price.toFixed(0)} Birr
              </span>
            </div>
          </div>

          {/* Right: Rich Informational Details and Nutrition Grid */}
          <div className={`p-6 sm:p-8 md:p-10 flex flex-col justify-between ${
            isDarkMode ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-900'
          }`}>
            <div>
              {/* Category, Spicy & Title Group */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[10px] uppercase tracking-widest font-black font-mono border border-black rounded px-2.5 py-1 ${theme.badge}`}>
                  {item.category}
                </span>

                {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
                  <span className={`inline-flex items-center gap-1 rounded-lg border-2 px-2.5 py-1 text-[10px] font-black text-red-500 bg-red-50/10 ${theme.border}`}>
                    <Flame className="h-3.5 w-4 fill-red-500 text-red-500" />
                    SPICY: {item.spicyLevel}/3
                  </span>
                )}
              </div>

              {/* Title & Price for Desktop */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 md:gap-4 mb-2">
                <h2 className={`font-sans text-2xl font-black tracking-tight sm:text-3xl leading-none uppercase ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.name}
                </h2>
                <span className={`hidden md:inline-block shrink-0 text-3xl font-black tracking-tight font-mono ${theme.text}`}>
                  {item.price.toFixed(0)} <span className="text-sm font-black uppercase font-sans">Birr</span>
                </span>
              </div>

              {/* Rating Summary block */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((starIdx) => {
                    const thresholdValue = ratingsCount > 0 ? (userRatings.reduce((sum, r) => sum + r, 0) / ratingsCount) : 0;
                    return (
                      <Star 
                        key={starIdx} 
                        className={`h-4 w-4 ${
                          starIdx <= Math.round(thresholdValue) 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    );
                  })}
                </div>
                <span className="text-xs font-black tracking-wide font-mono text-gray-400">
                  {avgRating} ({ratingsCount} {ratingsCount === 1 ? 'rating' : 'ratings'})
                </span>
              </div>

              {/* Full Description */}
              <p className={`text-xs sm:text-sm font-semibold leading-relaxed mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {item.description}
              </p>

              {/* Live Rating Selector */}
              <div className={`mb-6 rounded-xl border-2 p-4 text-center ${
                isDarkMode ? 'bg-[#121212]/55 border-gray-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">
                  How do you like this recipe? Tap to Rate:
                </h4>
                
                <div className="flex justify-center items-center gap-2 mb-1.5" id="rating-stars-input">
                  {[1, 2, 3, 4, 5].map((starNum) => (
                    <button
                      key={starNum}
                      onClick={() => handleRate(starNum)}
                      onMouseEnter={() => setHoverRating(starNum)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform active:scale-95 duration-100 hover:scale-115 p-1"
                      title={`Rate ${starNum} Stars`}
                    >
                      <Star 
                        className={`h-7 w-7 transition-colors ${
                          starNum <= (hoverRating || 0)
                            ? 'fill-amber-400 text-amber-400'
                            : userRatings.length > 0 && starNum <= Math.round(userRatings[userRatings.length - 1])
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {justRated ? (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] font-black text-emerald-500 uppercase tracking-wide mt-1"
                    >
                      ✓ Thank you for rating! Saved on Ethiopia servers.
                    </motion.p>
                  ) : (
                    <p className="text-[10px] font-bold text-gray-400 italic">
                      Cast dynamic customer feedback in Addis Ababa!
                    </p>
                  )}
                </AnimatePresence>
              </div>

              {/* Grid of Micro stats: Prep Time, Calories, and Protein info */}
              <div className={`grid grid-cols-3 gap-1 border-t-3 border-b-3 py-4 mb-6 text-center ${
                isDarkMode ? 'bg-[#121212] text-white' : 'bg-slate-50 text-gray-800'
              } ${theme.statsBorder}`}>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider font-mono">Prep Speed</span>
                  <span className="mt-1 flex items-center gap-1 text-xs font-black uppercase">
                    <Clock className="h-3.5 w-3.5 text-[#F4A261] stroke-[2.5]" />
                    {item.prepTime}
                  </span>
                </div>
                
                <div className={`border-x-2 flex flex-col items-center ${theme.statsBorder}`}>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider font-mono">Energy</span>
                  <span className={`mt-1 flex items-center gap-1 text-xs font-black uppercase`}>
                    <Flame className={`h-3.5 w-3.5 fill-red-500/20 stroke-[2.5] ${theme.text}`} />
                    {item.calories} Cal
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider font-mono">Kitchen Cert</span>
                  <span className="mt-1 flex items-center gap-1 text-xs font-black text-emerald-500 uppercase">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-505 stroke-[2.5]" />
                    Fresh
                  </span>
                </div>
              </div>

              {/* Separator / Header for Ingredients */}
              <div className="mb-4">
                <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-3">
                  <UtensilsCrossed className={`h-3.5 w-3.5 stroke-[2.5] ${theme.text}`} />
                  Gourmet Ingredients
                </h4>
                {/* Ingredients Pill Cloud */}
                <div className="flex flex-wrap gap-2" id="ingredients-container">
                  {item.ingredients.map((ingredient, idx) => (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={idx}
                      className={`rounded-lg px-3 py-1.5 text-xs font-black border-2 hover:scale-[1.02] cursor-default transition-all ${
                        isDarkMode 
                          ? 'bg-[#121212] text-white' 
                          : 'bg-white text-gray-800'
                      } ${theme.border} ${theme.badgePillShadow}`}
                    >
                      {ingredient}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* Extra Quality assurance footer */}
            <div className={`mt-8 rounded-xl border-2 p-4 flex items-start gap-3 shadow-[2px_2px_0px_0px_#E63946] ${
              isDarkMode ? 'bg-orange-950/25' : 'bg-orange-50/70 border-amber-300'
            } ${theme.border}`}>
              <Info className="h-5 w-5 text-orange-400 shrink-0 mt-0.5 stroke-[2.5]" />
              <div>
                <h5 className="text-xs font-black uppercase tracking-wide">Allergy Guidance Notice</h5>
                <p className={`mt-1 text-[11px] font-semibold leading-normal ${
                  isDarkMode ? 'text-orange-200' : 'text-orange-950'
                }`}>
                  Our kitchens make use of organic local dairy, wheat flours, and roasted nuts. For bespoke dining requests or critical dietary accommodations, please discuss with our server staff at Bole.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
