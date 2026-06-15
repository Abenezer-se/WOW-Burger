/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Home, 
  MapPin, 
  Heart, 
  ShieldAlert, 
  Sun, 
  Moon 
} from 'lucide-react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  favoriteCount: number;
}

export default function Header({ 
  currentView, 
  onViewChange, 
  isDarkMode, 
  onToggleTheme,
  favoriteCount
}: HeaderProps) {
  const baseHeaderBg = isDarkMode ? 'bg-[#1A1A1A]/95 border-[#E63946]' : 'bg-white/95 border-[#E63946] text-black';
  const logoTxtColor = isDarkMode ? 'text-white' : 'text-gray-900';

  const navTabs: { id: AppView; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'user-menu', label: 'Home', icon: Home },
    { id: 'favorites', label: 'Favorite', icon: Heart },
    { id: 'contact', label: 'Contact', icon: MapPin },
    { id: 'admin', label: 'Admin', icon: ShieldAlert }
  ];

  return (
    <header className={`sticky top-0 z-50 w-full border-b-[3px] backdrop-blur-md transition-all shadow-md ${baseHeaderBg}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-3 md:flex-row md:px-6">
        
        {/* Brand Logo Group */}
        <div 
          onClick={() => onViewChange('user-menu')} 
          className="flex cursor-pointer items-center gap-2.5 group"
          id="brand-logo"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#E63946] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105">
            <Flame className="h-5 w-5 fill-white/10" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border border-black bg-[#F4A261] flex items-center justify-center text-[8px] font-bold text-[#1D1D1D]"
            >
              ★
            </motion.div>
          </div>
          <div>
            <h1 className={`font-sans text-xl font-black tracking-tight sm:text-2xl leading-none ${logoTxtColor}`}>
              Wow <span className="text-[#E63946]">Burger</span>
            </h1>
            <p className="hidden text-[9px] uppercase tracking-widest font-black text-[#E63946] sm:block mt-0.5 font-mono">
              Bole Addis Ababa, Ethiopia
            </p>
          </div>
        </div>

        {/* Dynamic Nav Tabs and Light/Dark Toggle */}
        <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:w-auto md:justify-end">
          {/* Main Navigation Row */}
          <nav className={`flex items-center rounded-xl p-1 border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.45)] ${
            isDarkMode ? 'bg-[#121212] border-[#E63946]' : 'bg-gray-100 border-[#E63946]'
          }`}>
            {navTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = currentView === tab.id || (tab.id === 'user-menu' && currentView === 'user-detail');
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onViewChange(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all rounded-lg ${
                    isSelected
                      ? 'bg-[#E63946] text-white shadow-sm border border-black/25'
                      : isDarkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                  id={`nav-tab-${tab.id}`}
                >
                  <TabIcon className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  
                  {/* Badge count for favorites */}
                  {tab.id === 'favorites' && favoriteCount > 0 && (
                    <span className="ml-1 rounded bg-black/35 px-1.5 py-0.5 font-mono text-[9px] font-black text-white">
                      {favoriteCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-transform duration-250 active:scale-90 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.45)] ${
              isDarkMode 
                ? 'bg-[#1D1D1D] hover:bg-[#2D2D2D] border-amber-400 text-amber-400' 
                : 'bg-white hover:bg-slate-50 border-indigo-600 text-indigo-600'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="theme-toggler"
          >
            {isDarkMode ? <Sun className="h-4.5 w-4.5 fill-amber-400/10 stroke-[2.5]" /> : <Moon className="h-4.5 w-4.5 fill-indigo-600/10 stroke-[2.5]" />}
          </button>
        </div>

      </div>
    </header>
  );
}
