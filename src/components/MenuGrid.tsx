/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Beef, 
  CupSoda, 
  IceCream, 
  Search, 
  Sparkles, 
  Clock, 
  Leaf, 
  ArrowRight,
  TrendingUp,
  Pizza,
  Sandwich,
  Cake,
  Coffee,
  Heart,
  Star
} from 'lucide-react';
import { MenuItem, Category } from '../types';

interface MenuGridProps {
  items: MenuItem[];
  categories: Category[];
  onSelectProduct: (item: MenuItem) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (itemId: string) => void;
  isDarkMode?: boolean;
}

// Icon helper map to render category icons dynamically
const ICON_MAP: Record<string, React.ReactNode> = {
  Flame: <Flame className="h-4 w-4" />,
  Beef: <Beef className="h-4 w-4" />,
  CupSoda: <CupSoda className="h-4 w-4" />,
  IceCream: <IceCream className="h-4 w-4" />,
  Pizza: <Pizza className="h-4 w-4" />,
  Sandwich: <Sandwich className="h-4 w-4" />,
  Cake: <Cake className="h-4 w-4" />,
  Coffee: <Coffee className="h-4 w-4" />
};

export default function MenuGrid({ 
  items, 
  categories, 
  onSelectProduct,
  favoriteIds = [],
  onToggleFavorite,
  isDarkMode = true
}: MenuGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'popular' | 'spicy'>('all');

  // Multi-theme category configurations
  const getCategoryTheme = (id: string, dark: boolean) => {
    const THEMES: Record<string, {
      border: string;
      text: string;
      bgActive: string;
      bgActiveHover: string;
      cardClasses: string;
      imageBorder: string;
      textAccent: string;
      textAccentHover: string;
      dividerClasses: string;
      categoryBadgeBg: string;
    }> = {
      all: {
        border: 'border-[#E63946]',
        text: 'text-[#E63946]',
        bgActive: 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_#F4A261]',
        bgActiveHover: dark 
          ? 'bg-[#1A1A1A] border-[#E63946] text-white hover:bg-[#252525] shadow-[2px_2px_0px_0px_#E63946]'
          : 'bg-white border-[#E63946] text-gray-800 hover:bg-gray-100 shadow-[2px_2px_0px_0px_#E63946]',
        cardClasses: 'border-[#E63946] shadow-[4px_4px_0px_0px_#E63946] hover:shadow-[6px_6px_0px_0px_#E63946]',
        imageBorder: 'border-b-[2.5px] border-[#E63946]',
        textAccent: 'text-[#E63946]',
        textAccentHover: 'group-hover:text-[#E63946]',
        dividerClasses: 'border-t-2 border-[#E63946]/30',
        categoryBadgeBg: 'bg-red-95/40 border-[#E63946] text-[#E63946]'
      },
      burgers: {
        border: 'border-[#FF4747]',
        text: 'text-[#FF4747]',
        bgActive: 'bg-[#FF4747] border-black text-white shadow-[2px_2px_0px_0px_#FFAE19]',
        bgActiveHover: dark 
          ? 'bg-[#1A1A1A] border-[#FF4747] text-white hover:bg-[#252525] shadow-[2px_2px_0px_0px_#FF4747]'
          : 'bg-white border-[#FF4747] text-gray-800 hover:bg-gray-100 shadow-[2px_2px_0px_0px_#FF4747]',
        cardClasses: 'border-[#FF4747] shadow-[4px_4px_0px_0px_#FF4747] hover:shadow-[6px_6px_0px_0px_#FF4747]',
        imageBorder: 'border-b-[2.5px] border-[#FF4747]',
        textAccent: 'text-[#FF4747]',
        textAccentHover: 'group-hover:text-[#FF4747]',
        dividerClasses: 'border-t-2 border-[#FF4747]/30',
        categoryBadgeBg: 'bg-red-95/40 border-[#FF4747] text-red-500'
      },
      pizzas: {
        border: 'border-[#FFAE19]',
        text: 'text-[#FFAE19]',
        bgActive: 'bg-[#FFAE19] border-black text-black shadow-[2px_2px_0px_0px_#E63946]',
        bgActiveHover: dark 
          ? 'bg-[#1A1A1A] border-[#FFAE19] text-white hover:bg-[#252525] shadow-[2px_2px_0px_0px_#FFAE19]'
          : 'bg-white border-[#FFAE19] text-gray-800 hover:bg-gray-100 shadow-[2px_2px_0px_0px_#FFAE19]',
        cardClasses: 'border-[#FFAE19] shadow-[4px_4px_0px_0px_#FFAE19] hover:shadow-[6px_6px_0px_0px_#FFAE19]',
        imageBorder: 'border-b-[2.5px] border-[#FFAE19]',
        textAccent: 'text-[#FFAE19]',
        textAccentHover: 'group-hover:text-[#FFAE19]',
        dividerClasses: 'border-t-2 border-[#FFAE19]/30',
        categoryBadgeBg: 'bg-amber-95/45 border-[#FFAE19] text-[#FFAE19]'
      },
      sandwiches: {
        border: 'border-[#F4A261]',
        text: 'text-[#F4A261]',
        bgActive: 'bg-[#F4A261] border-black text-black shadow-[2px_2px_0px_0px_#00E5FF]',
        bgActiveHover: dark 
          ? 'bg-[#1A1A1A] border-[#F4A261] text-white hover:bg-[#252525] shadow-[2px_2px_0px_0px_#F4A261]'
          : 'bg-white border-[#F4A261] text-gray-800 hover:bg-gray-100 shadow-[2px_2px_0px_0px_#F4A261]',
        cardClasses: 'border-[#F4A261] shadow-[4px_4px_0px_0px_#F4A261] hover:shadow-[6px_6px_0px_0px_#F4A261]',
        imageBorder: 'border-b-[2.5px] border-[#F4A261]',
        textAccent: 'text-[#F4A261]',
        textAccentHover: 'group-hover:text-[#F4A261]',
        dividerClasses: 'border-t-2 border-[#F4A261]/30',
        categoryBadgeBg: 'bg-orange-95/40 border-[#F4A261] text-orange-500'
      },
      desserts: {
        border: 'border-[#FF4D80]',
        text: 'text-[#FF4D80]',
        bgActive: 'bg-[#FF4D80] border-black text-white shadow-[2px_2px_0px_0px_#D4A373]',
        bgActiveHover: dark 
          ? 'bg-[#1A1A1A] border-[#FF4D80] text-white hover:bg-[#252525] shadow-[2px_2px_0px_0px_#FF4D80]'
          : 'bg-white border-[#FF4D80] text-gray-800 hover:bg-gray-100 shadow-[2px_2px_0px_0px_#FF4D80]',
        cardClasses: 'border-[#FF4D80] shadow-[4px_4px_0px_0px_#FF4D80] hover:shadow-[6px_6px_0px_0px_#FF4D80]',
        imageBorder: 'border-b-[2.5px] border-[#FF4D80]',
        textAccent: 'text-[#FF4D80]',
        textAccentHover: 'group-hover:text-[#FF4D80]',
        dividerClasses: 'border-t-2 border-[#FF4D80]/30',
        categoryBadgeBg: 'bg-pink-95/40 border-[#FF4D80] text-pink-500'
      },
      hot_drinks: {
        border: 'border-[#D4A373]',
        text: 'text-[#D4A373]',
        bgActive: 'bg-[#D4A373] border-black text-black shadow-[2px_2px_0px_0px_#FF4747]',
        bgActiveHover: dark 
          ? 'bg-[#1A1A1A] border-[#D4A373] text-white hover:bg-[#252525] shadow-[2px_2px_0px_0px_#D4A373]'
          : 'bg-white border-[#D4A373] text-gray-800 hover:bg-gray-100 shadow-[2px_2px_0px_0px_#D4A373]',
        cardClasses: 'border-[#D4A373] shadow-[4px_4px_0px_0px_#D4A373] hover:shadow-[6px_6px_0px_0px_#D4A373]',
        imageBorder: 'border-b-[2.5px] border-[#D4A373]',
        textAccent: 'text-[#D4A373]',
        textAccentHover: 'group-hover:text-[#D4A373]',
        dividerClasses: 'border-t-2 border-[#D4A373]/30',
        categoryBadgeBg: 'bg-yellow-95/35 border-[#D4A373] text-amber-600'
      },
      cold_drinks: {
        border: 'border-[#00E5FF]',
        text: 'text-[#00E5FF]',
        bgActive: 'bg-[#00E5FF] border-black text-black shadow-[2px_2px_0px_0px_#FF4D80]',
        bgActiveHover: dark 
          ? 'bg-[#1A1A1A] border-[#00E5FF] text-white hover:bg-[#252525] shadow-[2px_2px_0px_0px_#00E5FF]'
          : 'bg-white border-[#00E5FF] text-gray-800 hover:bg-gray-100 shadow-[2px_2px_0px_0px_#00E5FF]',
        cardClasses: 'border-[#00E5FF] shadow-[4px_4px_0px_0px_#00E5FF] hover:shadow-[6px_6px_0px_0px_#00E5FF]',
        imageBorder: 'border-b-[2.5px] border-[#00E5FF]',
        textAccent: 'text-[#00E5FF]',
        textAccentHover: 'group-hover:text-[#00E5FF]',
        dividerClasses: 'border-t-2 border-[#00E5FF]/30',
        categoryBadgeBg: 'bg-cyan-95/35 border-[#00E5FF] text-cyan-600'
      }
    };

    return THEMES[id] || THEMES.all;
  };

  const getCategoryStyles = (category: string) => {
    return getCategoryTheme(category, isDarkMode);
  };

  // Perform search & categorisation calculations
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Category check
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      // 2. Search Box check
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));

      // 3. Dietary tag check
      let matchesDiet = true;
      if (dietFilter === 'veg') matchesDiet = !!item.isVegetarian;
      else if (dietFilter === 'popular') matchesDiet = !!item.isPopular;
      else if (dietFilter === 'spicy') matchesDiet = item.spicyLevel !== undefined && item.spicyLevel > 0;

      return matchesCategory && matchesSearch && matchesDiet;
    });
  }, [items, selectedCategory, searchQuery, dietFilter]);

  // Design helpers based on themes
  const backgroundClass = isDarkMode ? 'bg-[#121212]' : 'bg-[#F9FAFB]';
  const textMutedClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const labelClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBgClass = isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white text-gray-900';
  const inputBgClass = isDarkMode ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-950 border-gray-300';

  return (
    <div className={`mx-auto max-w-7xl px-4 py-6 md:px-6`} id="menu-view-root">
      
      {/* Brand Header Banner */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 border-b-2 border-dashed border-gray-800/15 pb-6 sm:flex-row">
        <div>
          <h2 className={`font-sans text-2xl font-black uppercase tracking-tight text-white mb-1 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Addis Ababa Gourmet Selection
          </h2>
          <p className={`text-xs font-semibold ${textMutedClass}`}>
            Select our gourmet recipes designed with single-origin cuts, organic grains & Bole spices.
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-orange-950/25 border border-amber-500/20 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-amber-500 font-mono">
          <Sparkles className="h-4 w-4 fill-amber-500/10" />
          <span>BOLE BRANCH SPECIAL</span>
        </div>
      </div>

      {/* Control Panel: Search & Categories */}
      <div className="mb-10 space-y-5 rounded-2xl border-[3px] border-black p-5 shadow-[5px_5px_0px_0px_#E63946] relative overflow-hidden" id="menu-search-bar" style={{
        backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF'
      }}>
        {/* Glow accent */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />

        <div className="grid gap-4 md:grid-cols-12 md:items-center">
          {/* Search Input Box */}
          <div className="relative md:col-span-6">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 stroke-[2.5]" />
            </div>
            <input
              type="text"
              placeholder="Search Bole burgers, pies, cold teas, or recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl border-[3px] border-[#E63946] py-3.5 pl-11 pr-4 text-sm font-bold shadow-[3px_3px_0px_0px_#E63946] outline-none transition-all placeholder:text-gray-500 focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/10 ${inputBgClass}`}
              id="menu-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center px-2 font-black uppercase text-xs text-gray-400 hover:text-[#E63946]"
                id="search-clear-btn"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories Tab Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:col-span-12" id="categories-bar">
            {/* Category horizontal scroll container */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 w-full lg:w-auto">
              {/* All Option */}
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all border-[2.5px] ${
                  selectedCategory === 'all'
                    ? getCategoryTheme('all', isDarkMode).bgActive
                    : getCategoryTheme('all', isDarkMode).bgActiveHover
                }`}
                id="category-tab-all"
              >
                <span>🍽️</span>
                <span>All Eats</span>
              </button>

              {categories.map((cat) => {
                const theme = getCategoryTheme(cat.id, isDarkMode);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all border-[2.5px] ${
                      selectedCategory === cat.id
                        ? theme.bgActive
                        : theme.bgActiveHover
                    }`}
                    id={`category-tab-${cat.id}`}
                  >
                    <span className={selectedCategory === cat.id ? 'text-inherit' : theme.text}>
                      {ICON_MAP[cat.iconName]}
                    </span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Filter Pill Badges */}
            <div className="flex items-center gap-1.5 border-t border-gray-800/10 pt-2 sm:border-0 sm:pt-0" id="dietary-filter-container">
              <span className={`hidden text-[11px] font-black uppercase tracking-wider text-gray-400 lg:inline-block mr-1`}>Filters:</span>
              
              <button
                onClick={() => setDietFilter('all')}
                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all border ${
                  dietFilter === 'all'
                    ? 'bg-[#E63946] border-[#E63946] text-white'
                    : isDarkMode 
                      ? 'bg-transparent border-gray-800 text-gray-400 hover:text-white hover:border-gray-600' 
                      : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400'
                }`}
                id="diet-filter-all"
              >
                All
              </button>

              <button
                onClick={() => setDietFilter('veg')}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all border ${
                  dietFilter === 'veg'
                    ? 'bg-[#E63946] border-[#E63946] text-white'
                    : isDarkMode 
                      ? 'bg-transparent border-gray-800 text-gray-400 hover:text-white hover:border-gray-600' 
                      : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400'
                }`}
                id="diet-filter-veg"
              >
                <Leaf className="h-2.5 w-2.5 fill-current" />
                Veg
              </button>

              <button
                onClick={() => setDietFilter('popular')}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all border ${
                  dietFilter === 'popular'
                    ? 'bg-[#E63946] border-[#E63946] text-white'
                    : isDarkMode 
                      ? 'bg-transparent border-gray-800 text-gray-400 hover:text-white hover:border-gray-600' 
                      : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400'
                }`}
                id="diet-filter-popular"
              >
                <TrendingUp className="h-2.5 w-2.5" />
                Popular
              </button>

              <button
                onClick={() => setDietFilter('spicy')}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all border ${
                  dietFilter === 'spicy'
                    ? 'bg-[#E63946] border-[#E63946] text-white'
                    : isDarkMode 
                      ? 'bg-transparent border-gray-800 text-gray-400 hover:text-white hover:border-gray-600' 
                      : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400'
                }`}
                id="diet-filter-spicy"
              >
                <span>🌶️</span>
                <span>Spicy</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Menu Items */}
      <AnimatePresence mode="popLayout">
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-2xl border-[3px] border-dashed border-gray-600 p-12 text-center max-w-sm mx-auto ${cardBgClass}`}
            id="empty-menu-placeholder"
          >
            <span className="text-3xl">🏜️</span>
            <h4 className={`text-base font-black uppercase tracking-wider mt-4 ${labelClass}`}>No dishes found</h4>
            <p className={`text-xs font-semibold leading-relaxed mt-2 ${textMutedClass}`}>
              Try expanding your search parameters or select a different category option on the bar above.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            id="gourmet-items-grid"
          >
            {filteredItems.map((item) => {
              const theme = getCategoryStyles(item.category);
              const isFav = favoriteIds.includes(item.id);

              // Calculate star rating average
              const itemRatings = item.ratings || [];
              const avgRating = itemRatings.length > 0 
                ? (itemRatings.reduce((a, b) => a + b, 0) / itemRatings.length).toFixed(1)
                : null;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={item.id}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border-[3px] transition-all duration-300 hover:-translate-y-1 ${cardBgClass} ${theme.cardClasses}`}
                  id={`card-item-${item.id}`}
                  onClick={() => onSelectProduct(item)}
                >
                  {/* Image container with ratio */}
                  <div className={`relative aspect-video w-full overflow-hidden bg-gray-900 ${theme.imageBorder}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Left corner status tags */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {item.isPopular && (
                        <span className="flex items-center gap-1 rounded-lg bg-[#FF4747] border border-black px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
                          <TrendingUp className="h-3 w-3" />
                          BEST SELLER
                        </span>
                      )}
                      {item.isVegetarian && (
                        <span className="flex items-center gap-1 rounded-lg bg-emerald-500 border border-black px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
                          <Leaf className="h-3 w-3 fill-white/10" />
                          VEGGIE
                        </span>
                      )}
                    </div>

                    {/* Heart Favorite icon on top right */}
                    {onToggleFavorite && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(item.id);
                        }}
                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white text-[#E63946] shadow-sm transition-transform active:scale-90"
                        title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                        id={`fav-btn-grid-${item.id}`}
                      >
                        <Heart className={`h-4.5 w-4.5 stroke-[2.5] ${isFav ? 'fill-[#E63946]' : 'text-gray-400'}`} />
                      </button>
                    )}

                    {/* Custom Prep & Calories Badge in Image overlay bottom */}
                    <div className="absolute bottom-3 right-3 flex gap-1.5">
                      {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
                        <span className="rounded-lg bg-red-600 border border-black px-2 py-0.5 text-[8px] font-black text-white shadow-sm font-mono leading-relaxed">
                          {'🌶️'.repeat(item.spicyLevel)} SPICY
                        </span>
                      )}
                      <span className="flex items-center gap-1 rounded-lg bg-[#121212]/90 border border-black/55 px-2 py-0.5 text-[9px] font-bold text-white uppercase font-mono">
                        <Clock className="h-3 w-3 text-[#F4A261]" />
                        {item.prepTime}
                      </span>
                    </div>
                  </div>

                  {/* Content body */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-sans text-base font-black tracking-tight transition-colors leading-snug uppercase ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      } ${theme.textAccentHover}`}>
                        {item.name}
                      </h3>
                      <span className={`shrink-0 text-base font-black tracking-tight font-mono ${theme.textAccent}`}>
                        {item.price.toFixed(0)} Br
                      </span>
                    </div>

                    {/* Rating star display on card */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex items-center text-amber-400">
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                      <span className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-wider">
                        {avgRating ? `${avgRating} avg stars` : 'tap to rate'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className={`mt-2.5 line-clamp-2 text-xs font-semibold leading-relaxed font-sans ${textMutedClass}`}>
                      {item.description}
                    </p>

                    <div className={`mt-4 flex items-center justify-between border-t border-dashed pt-3 text-[10px] font-black uppercase tracking-widest text-gray-400 ${theme.dividerClasses}`}>
                      <span className="font-mono text-gray-400">{item.calories} Cal</span>
                      <span className={`flex items-center gap-1 group-hover:translate-x-1 transition-transform ${theme.textAccent}`}>
                        Inspect Recipe
                        <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
