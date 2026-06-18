/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_MENU_ITEMS 
} from './data';
import { MenuItem, Category, AppView, CommentFeedback } from './types';
import Header from './components/Header';
import MenuGrid from './components/MenuGrid';
import ItemDetail from './components/ItemDetail';
import AdminPanel from './components/AdminPanel';
import ContactView from './components/ContactView';
import FavoritesView from './components/FavoritesView';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Instagram, 
  Send, 
  Heart, 
  Mail, 
  Facebook,
  Home,
  Utensils,
  CupSoda,
  Sparkles
} from 'lucide-react';

const STATIC_INITIAL_COMMENTS: CommentFeedback[] = [
  {
    id: 'fb-1',
    name: 'Yared Shimelis',
    phone: '+251 911 44 5566',
    comment: 'The double crispy cheese smash burger is easily the best in Addis Ababa! High-density bun of exceptional quality.',
    timestamp: 'Jun 14, 2026, 06:30 PM'
  },
  {
    id: 'fb-2',
    name: 'Helen Kebede',
    phone: '+251 922 12 3456',
    comment: 'Loving the quick prep speed. Bole flagships adjacent to Edna Mall are beautiful is always cozy.',
    timestamp: 'Jun 15, 2026, 10:15 AM'
  }
];

export default function App() {
  // Navigation View Router
  const [currentView, setCurrentView] = useState<AppView>('user-menu');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Global Theme Toggling System (Defaults to Dark Mode per Wow Burger brand guidelines)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('wow_burger_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  // Track Favorites lists
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('wow_burger_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Menu items list state (with ratings support and local persistence)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('wow_burger_menu_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MENU_ITEMS.map(item => ({ ...item, ratings: item.ratings || [5, 4, 5] }));
      }
    }
    // Initialize original recipes with default rating arrays
    return INITIAL_MENU_ITEMS.map(item => ({
      ...item,
      ratings: item.ratings || [5, 4, 5]
    }));
  });

  // Categories CMS lists
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('wow_burger_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Feedbacks comments databases
  const [feedbacks, setFeedbacks] = useState<CommentFeedback[]>(() => {
    const saved = localStorage.getItem('wow_burger_feedbacks');
    return saved ? JSON.parse(saved) : STATIC_INITIAL_COMMENTS;
  });

  // Persists states inside local scopes
  useEffect(() => {
    localStorage.setItem('wow_burger_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('wow_burger_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    localStorage.setItem('wow_burger_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('wow_burger_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('wow_burger_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  // Switch to detailed view
  const handleSelectProduct = (item: MenuItem) => {
    setSelectedItem(item);
    setCurrentView('user-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Menu screen
  const handleBackToMenu = () => {
    setCurrentView('user-menu');
    setSelectedItem(null);
  };

  // Auth/Favorite/Ratings triggers
  const handleToggleFavorite = (itemId: string) => {
    setFavoriteIds(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const handleRateItem = (itemId: string, stars: number) => {
    setMenuItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const currentRatings = item.ratings || [];
          return {
            ...item,
            ratings: [...currentRatings, stars]
          };
        }
        return item;
      })
    );
    // Sync current product details if open
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ratings: [...(prev.ratings || []), stars]
        };
      });
    }
  };

  const handleSubmitComment = (cf: CommentFeedback) => {
    setFeedbacks(prev => [cf, ...prev]);
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(fb => fb.id !== id));
  };

  // CMS Catalog Handlers
  const handleAddItem = (item: MenuItem) => {
    setMenuItems((prev) => [item, ...prev]);
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    if (selectedItem && selectedItem.id === updatedItem.id) {
      setSelectedItem(updatedItem);
    }
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    setFavoriteIds((prev) => prev.filter(fid => fid !== id));
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null);
      setCurrentView('user-menu');
    }
  };

  const handleAddCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const globalBg = isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#F9FAFB] text-gray-900';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-[#E63946] selection:text-white pb-16 md:pb-0 ${globalBg}`} id="wow-burger-app">
      
      {/* Universal Header with theme toggles, fav counts, and views */}
      <Header 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          if (view !== 'user-detail') {
            setSelectedItem(null);
          }
        }}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        favoriteCount={favoriteIds.length}
      />

      {/* Main View Router with transition animations */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {currentView === 'user-menu' && (
            <motion.div
              key="menu-grid-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <MenuGrid 
                items={menuItems} 
                categories={categories} 
                onSelectProduct={handleSelectProduct} 
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                isDarkMode={isDarkMode}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </motion.div>
          )}

          {currentView === 'user-detail' && selectedItem && (
            <motion.div
              key="menu-detail-view"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            >
              <ItemDetail 
                item={selectedItem} 
                onBack={handleBackToMenu}
                onRateItem={handleRateItem}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favoriteIds.includes(selectedItem.id)}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          )}

          {currentView === 'favorites' && (
            <motion.div
              key="favorites-grid-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FavoritesView 
                items={menuItems}
                favoriteIds={favoriteIds}
                onSelectProduct={handleSelectProduct}
                onToggleFavorite={handleToggleFavorite}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          )}

          {currentView === 'contact' && (
            <motion.div
              key="contact-segment-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ContactView 
                isDarkMode={isDarkMode}
                onSubmitComment={handleSubmitComment}
                feedbacks={feedbacks}
              />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div
              key="admin-dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <AdminPanel 
                items={menuItems} 
                categories={categories} 
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                feedbacks={feedbacks}
                onDeleteFeedback={handleDeleteFeedback}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Brand Aesthetic Footer */}
      <footer className="mt-16 border-t-4 border-[#1D1D1D] bg-[#1D1D1D] text-gray-400 py-12 px-4" id="wow-burger-footer">
        <div className="mx-auto max-w-7xl grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Brand Intro column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E63946] text-white font-black text-sm">
                🍔
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">
                Wow <span className="text-[#E63946]">Burger</span>
              </h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              Elevating the legendary smash burger formulation with dry-aged meats, toasted premium grains, and organic, locally sourced condiments in Addis Ababa. Rated best comfort food experience in town.
            </p>
            
            {/* Clickable Social Media Links */}
            <div className="flex gap-3 pt-2 text-gray-400">
              <a href="https://instagram.com/wowburger.et" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Instagram App Link">
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a href="https://t.me/wowburger_ethiopia" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Telegram App Link">
                <Send className="h-4.5 w-4.5" />
              </a>
              <a href="https://facebook.com/wowburger.et" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Facebook App Link">
                <Facebook className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Corrected Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-black text-white font-mono">
              Operating Hours
            </h4>
            <ul className="text-xs space-y-2.5 font-semibold">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#F4A261] shrink-0" />
                <span>Monday - Sunday: <strong className="text-white">10:00 AM - 10:00 PM</strong></span>
              </li>
              <li className="text-[11px] text-emerald-400 font-bold border-l-2 border-emerald-500 pl-2">
                ✓ Dine-in & rapid delivery active everyday in Bole district.
              </li>
            </ul>
          </div>

          {/* Corrected location, phone, and email info */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-black text-white font-mono">
              Gourmet Flagships
            </h4>
            <ul className="text-xs space-y-2.5 font-semibold">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#E63946] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block">Bole Branch</strong>
                  adjacent to Edna Mall, Cameroon St, Addis Ababa, Ethiopia
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-[#F4A261] shrink-0 mt-0.5" />
                <span>
                  <a href="tel:+251911234567" className="hover:text-white transition-all">+251 911 234567</a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <a href="mailto:hello@wowburger.et" className="hover:text-white transition-all">hello@wowburger.et</a>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright notice */}
        <div className="mx-auto max-w-7xl border-t border-gray-800/65 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold text-gray-500">
          <span>&copy; {new Date().getFullYear()} Wow Burger Gourmet Inc. All culinary rights reserved.</span>
          <div className="flex items-center gap-1 text-gray-650">
            <span>Formulated with gourmet passion at Bole</span>
            <Heart className="h-3 w-3 text-[#E63946] fill-[#E63946]" />
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Visual Sticky Helper) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 border-t-2 flex justify-around py-2 md:hidden shadow-lg ${
          isDarkMode 
            ? 'bg-[#1D1D1D] text-gray-400 border-black' 
            : 'bg-white text-gray-600 border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]'
        }`}
        id="mobile-bottom-nav"
      >
        <button
          onClick={() => {
            setCurrentView('user-menu');
            setSelectedCategory('all');
            setSelectedItem(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-colors py-1 px-3 ${
            currentView === 'user-menu' && selectedCategory === 'all'
              ? 'text-[#E63946]'
              : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
          id="m-nav-home"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('user-menu');
            setSelectedCategory('burgers');
            setSelectedItem(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-colors py-1 px-3 ${
            currentView === 'user-menu' && (selectedCategory === 'burgers' || selectedCategory === 'pizzas' || selectedCategory === 'sandwiches')
              ? 'text-[#E63946]'
              : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
          id="m-nav-food"
        >
          <Utensils className="h-4 w-4" />
          <span>Food</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('user-menu');
            setSelectedCategory('cold_drinks');
            setSelectedItem(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-colors py-1 px-3 ${
            currentView === 'user-menu' && (selectedCategory === 'cold_drinks' || selectedCategory === 'hot_drinks')
              ? 'text-[#E63946]'
              : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
          id="m-nav-drinks"
        >
          <CupSoda className="h-4 w-4" />
          <span>Drinks</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('user-menu');
            setSelectedCategory('special');
            setSelectedItem(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-colors py-1 px-3 ${
            currentView === 'user-menu' && selectedCategory === 'special'
              ? 'text-[#E63946]'
              : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
          id="m-nav-special"
        >
          <Sparkles className="h-4 w-4" />
          <span>Special</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('favorites');
            setSelectedItem(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-colors py-1 px-3 ${
            currentView === 'favorites'
              ? 'text-[#E63946]'
              : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
          id="m-nav-favorites"
        >
          <Heart className="h-4 w-4" />
          <span>Favorites</span>
          {favoriteIds.length > 0 && (
            <span className="absolute -top-0.5 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E63946] border border-black text-[8px] font-black text-white">
              {favoriteIds.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
