/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Flame, Clock } from 'lucide-react';
import { MenuItem } from '../types';

interface FavoritesViewProps {
  items: MenuItem[];
  favoriteIds: string[];
  onSelectProduct: (item: MenuItem) => void;
  onToggleFavorite: (itemId: string) => void;
  isDarkMode: boolean;
}

// Map categories to color themes (mirrors MenuGrid for consistency)
const CATEGORY_STYLE_MAP: Record<string, {
  cardClasses: string;
  imageBorder: string;
  textAccent: string;
  textAccentHover: string;
  dividerClasses: string;
}> = {
  burgers: {
    cardClasses: 'border-[#FF4747] shadow-[4px_4px_0px_0px_#FF4747] hover:shadow-[7px_7px_0px_0px_#FF4747]',
    imageBorder: 'border-b-[3px] border-[#FF4747]',
    textAccent: 'text-[#FF4747]',
    textAccentHover: 'group-hover:text-[#FF4747]',
    dividerClasses: 'border-[#FF4747]/30'
  },
  pizzas: {
    cardClasses: 'border-[#FFAE19] shadow-[4px_4px_0px_0px_#FFAE19] hover:shadow-[7px_7px_0px_0px_#FFAE19]',
    imageBorder: 'border-b-[3px] border-[#FFAE19]',
    textAccent: 'text-[#FFAE19]',
    textAccentHover: 'group-hover:text-[#FFAE19]',
    dividerClasses: 'border-[#FFAE19]/30'
  },
  sandwiches: {
    cardClasses: 'border-[#F4A261] shadow-[4px_4px_0px_0px_#F4A261] hover:shadow-[7px_7px_0px_0px_#F4A261]',
    imageBorder: 'border-b-[3px] border-[#F4A261]',
    textAccent: 'text-[#F4A261]',
    textAccentHover: 'group-hover:text-[#F4A261]',
    dividerClasses: 'border-[#F4A261]/30'
  },
  desserts: {
    cardClasses: 'border-[#FF4D80] shadow-[4px_4px_0px_0px_#FF4D80] hover:shadow-[7px_7px_0px_0px_#FF4D80]',
    imageBorder: 'border-b-[3px] border-[#FF4D80]',
    textAccent: 'text-[#FF4D80]',
    textAccentHover: 'group-hover:text-[#FF4D80]',
    dividerClasses: 'border-[#FF4D80]/30'
  },
  hot_drinks: {
    cardClasses: 'border-[#D4A373] shadow-[4px_4px_0px_0px_#D4A373] hover:shadow-[7px_7px_0px_0px_#D4A373]',
    imageBorder: 'border-b-[3px] border-[#D4A373]',
    textAccent: 'text-[#D4A373]',
    textAccentHover: 'group-hover:text-[#D4A373]',
    dividerClasses: 'border-[#D4A373]/30'
  },
  cold_drinks: {
    cardClasses: 'border-[#00E5FF] shadow-[4px_4px_0px_0px_#00E5FF] hover:shadow-[7px_7px_0px_0px_#00E5FF]',
    imageBorder: 'border-b-[3px] border-[#00E5FF]',
    textAccent: 'text-[#00E5FF]',
    textAccentHover: 'group-hover:text-[#00E5FF]',
    dividerClasses: 'border-[#00E5FF]/30'
  }
};

const getCategoryStyles = (category: string) => {
  return CATEGORY_STYLE_MAP[category] || {
    cardClasses: 'border-[#E63946] shadow-[4px_4px_0px_0px_#E63946] hover:shadow-[7px_7px_0px_0px_#E63946]',
    imageBorder: 'border-b-[3px] border-[#E63946]',
    textAccent: 'text-[#E63946]',
    textAccentHover: 'group-hover:text-[#E63946]',
    dividerClasses: 'border-[#E63946]/30 font-mono text-[9px]'
  };
};

export default function FavoritesView({
  items,
  favoriteIds,
  onSelectProduct,
  onToggleFavorite,
  isDarkMode
}: FavoritesViewProps) {
  // Filter items matching favorited ids
  const favoritedItems = items.filter(item => favoriteIds.includes(item.id));

  const textMutedClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBgClass = isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white text-gray-900 shadow-sm';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6" id="favorites-panel">
      {/* Page Title */}
      <div className="mb-8 text-center max-w-xl mx-auto">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#E63946] border border-[#E63946]/30 bg-[#E63946]/10 rounded px-2 md:px-3 py-1">
          Your Gourmet Core
        </span>
        <h2 className={`font-sans text-3xl font-black uppercase tracking-tight mt-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Favorite Dishes
        </h2>
        <p className={`text-xs font-semibold mt-1.5 ${textMutedClass}`}>
          Quickly review, rate, or access your saved specialties. Your favorites are stored directly in local cache.
        </p>
      </div>

      {favoritedItems.length === 0 ? (
        <div className={`rounded-2xl border-[3px] border-dashed border-gray-500 p-12 text-center max-w-md mx-auto ${
          isDarkMode ? 'bg-[#1A1A1A]/50' : 'bg-slate-50'
        }`}>
          <Heart className="h-12 w-12 text-gray-400 mx-auto stroke-[2] animate-pulse" />
          <h3 className={`text-base font-black uppercase tracking-wider mt-4 leading-none ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            No Favorites Saved
          </h3>
          <p className={`text-xs font-bold leading-normal mt-2 mb-6 ${textMutedClass}`}>
            Tap the heart icon when browsing deep inside recipe details or the main catalog to save custom gourmet items here!
          </p>
          <button
            onClick={() => {
              // Switch view to home menu
              const tabBtn = document.getElementById('nav-tab-user-menu');
              if (tabBtn) tabBtn.click();
            }}
            className="rounded-xl border-2 border-black bg-[#E63946] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all"
          >
            Explore Menu Catalog
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" id="favorites-grid">
          {favoritedItems.map((item) => {
            const styles = getCategoryStyles(item.category);
            return (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl border-[3px] bg-[#1A1A1A] transition-all duration-300 ${
                  item.isAvailable === false
                    ? 'opacity-60 saturate-50 cursor-not-allowed'
                    : 'cursor-pointer hover:-translate-y-1'
                } ${cardBgClass} ${styles.cardClasses}`}
                onClick={() => {
                  if (item.isAvailable !== false) {
                    onSelectProduct(item);
                  }
                }}
              >
                {/* Image panel */}
                <div className={`relative aspect-video w-full overflow-hidden bg-gray-950 ${styles.imageBorder}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Out of Stock Banner Overlay */}
                  {item.isAvailable === false && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                      <span className="bg-[#E63946] text-white font-black text-[9px] sm:text-[11px] uppercase tracking-widest px-3 py-1.5 border-2 border-black rounded-lg shadow-[2.5px_2.5px_0px_0px_black] rotate-[-5deg] animate-pulse">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Category Pill Tag */}
                  <span className="absolute top-3 left-3 rounded bg-black/75 px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-white">
                    {item.category}
                  </span>

                  {/* Favorite Toggle Button inside card */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white text-[#E63946] shadow-sm transition-transform active:scale-90 z-20"
                    title="Remove from favorites"
                  >
                    <Heart className="h-4 w-4 fill-[#E63946] stroke-[2.5]" />
                  </button>
                </div>

                {/* Info and content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className={`font-sans text-sm font-black tracking-tight leading-snug uppercase transition-colors line-clamp-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    } ${item.isAvailable === false ? '' : styles.textAccentHover}`}>
                      {item.name}
                    </h3>
                    <span className={`shrink-0 text-sm font-black tracking-tight font-mono ${styles.textAccent}`}>
                      {item.price.toFixed(0)} Br
                    </span>
                  </div>

                  <p className={`mt-1.5 text-xs font-semibold leading-relaxed line-clamp-2 ${textMutedClass}`}>
                    {item.description}
                  </p>

                  <div className={`mt-4 flex items-center justify-between border-t border-dashed pt-3 text-[10px] font-black uppercase tracking-widest ${styles.dividerClasses}`}>
                    <span className={`flex items-center gap-1 ${
                      item.isAvailable === false ? 'opacity-40' : 'group-hover:translate-x-1 transition-transform ' + styles.textAccent
                    }`}>
                      {item.isAvailable === false ? 'Unavailable' : 'View Details >'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.prepTime}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
