/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Utensils, 
  Tags, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  DollarSign, 
  Award,
  Clock,
  Sparkles,
  Flame,
  MessageSquare,
  Lock,
  Unlock,
  AlertCircle,
  Eye,
  Star
} from 'lucide-react';
import { MenuItem, Category, AdminSection, CommentFeedback } from '../types';

interface AdminPanelProps {
  items: MenuItem[];
  categories: Category[];
  onAddItem: (item: MenuItem) => void;
  onUpdateItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  feedbacks: CommentFeedback[];
  onDeleteFeedback: (id: string) => void;
  isDarkMode: boolean;
}

export default function AdminPanel({
  items,
  categories,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onAddCategory,
  onDeleteCategory,
  feedbacks,
  onDeleteFeedback,
  isDarkMode
}: AdminPanelProps) {
  // Authentication states (Gatekeep guest access strictly)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('wow_burger_admin_auth') === 'true';
  });
  const [authError, setAuthError] = useState<string | null>(null);

  // Navigation segment
  const [activeSegment, setActiveSegment] = useState<AdminSection>('dashboard');

  // Menu Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form input states
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('burgers');
  const [itemDescription, setItemDescription] = useState('');
  const [itemIngredients, setItemIngredients] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [itemCalories, setItemCalories] = useState('650');
  const [itemPrepTime, setItemPrepTime] = useState('5-8 min');
  const [itemSpicy, setItemSpicy] = useState('0');
  const [itemIsPopular, setItemIsPopular] = useState(false);
  const [itemIsVeg, setItemIsVeg] = useState(false);

  // Category Simple Form states
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatId, setNewCatId] = useState('');

  // Inline dynamic category state (when not in categories list)
  const [isAddingInlineCat, setIsAddingInlineCat] = useState(false);
  const [inlineCatName, setInlineCatName] = useState('');

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handle Admin Credentials Login
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (username.trim() === 'admin' && password.trim() === 'admin') {
      setIsLoggedIn(true);
      sessionStorage.setItem('wow_burger_admin_auth', 'true');
      triggerToast('Welcome back, Bole Administrator!');
    } else {
      setAuthError('Invalid username or password! (Try: admin/admin)');
    }
  };

  // Sign out
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('wow_burger_admin_auth');
    setUsername('');
    setPassword('');
  };

  // Pre-load form for Editing Menu Item
  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemPrice(item.price.toString());
    setItemCategory(item.category);
    setItemDescription(item.description);
    setItemIngredients(item.ingredients.join(', '));
    setItemImage(item.image);
    setItemCalories(item.calories.toString());
    setItemPrepTime(item.prepTime);
    setItemSpicy((item.spicyLevel ?? 0).toString());
    setItemIsPopular(!!item.isPopular);
    setItemIsVeg(!!item.isVegetarian);
    setIsFormOpen(true);
  };

  // Open Form fresh for Adding
  const handleAddNewClick = () => {
    setEditingItem(null);
    setItemName('');
    setItemPrice('');
    setItemCategory(categories[0]?.id || 'burgers');
    setItemDescription('');
    setItemIngredients('');
    setItemCalories('500');
    setItemPrepTime('5-8 min');
    setItemSpicy('0');
    setItemIsPopular(false);
    setItemIsVeg(false);
    setItemImage('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600');
    setIsFormOpen(true);
  };

  // Submit Menu Item Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemPrice || !itemDescription) {
      triggerToast('Please complete all mandatory fields!');
      return;
    }

    const priceNum = parseFloat(itemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      triggerToast('Please enter a valid retail price!');
      return;
    }

    const itemObj: MenuItem = {
      id: editingItem ? editingItem.id : 'item-' + Date.now(),
      name: itemName,
      description: itemDescription,
      price: priceNum,
      image: itemImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
      category: itemCategory,
      ingredients: itemIngredients.split(',').map(s => s.trim()).filter(Boolean),
      calories: parseInt(itemCalories) || 450,
      prepTime: itemPrepTime || '6-8/min',
      spicyLevel: parseInt(itemSpicy) || 0,
      isPopular: itemIsPopular,
      isVegetarian: itemIsVeg,
      ratings: editingItem ? (editingItem.ratings || []) : [5] // Initialize with a 5 star for freshly created
    };

    if (editingItem) {
      onUpdateItem(itemObj);
      triggerToast(`Successfully modified: "${itemName}"`);
    } else {
      onAddItem(itemObj);
      triggerToast(`Successfully created: "${itemName}"`);
    }

    setIsFormOpen(false);
  };

  // Submit Category Form
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) {
      triggerToast('Please provide a category name!');
      return;
    }
    const safeId = newCatId.trim().toLowerCase() || newCatName.trim().toLowerCase().replace(/\s+/g, '-');
    
    if (categories.some(c => c.id === safeId)) {
      triggerToast('Category identifier already exists!');
      return;
    }

    const catObj: Category = {
      id: safeId,
      name: newCatName,
      iconName: 'Flame'
    };

    onAddCategory(catObj);
    triggerToast(`Created new category: "${newCatName}"`);
    setNewCatName('');
    setNewCatId('');
    setIsCategoryFormOpen(false);
  };

  // Calculate statistics for the Dashboard
  const stats = React.useMemo(() => {
    const totalCount = items.length;
    const catCount = categories.length;
    const popularCount = items.filter(i => i.isPopular).length;
    const avgPrice = items.reduce((acc, current) => acc + current.price, 0) / (totalCount || 1);
    
    // Calculate overall stars rating average across all items
    let sumRating = 0;
    let totalRatingsCount = 0;
    items.forEach(item => {
      const rates = item.ratings || [];
      rates.forEach(r => {
        sumRating += r;
        totalRatingsCount++;
      });
    });
    const avgRatingAll = totalRatingsCount > 0 ? (sumRating / totalRatingsCount).toFixed(1) : '5.0';

    return {
      totalCount,
      catCount,
      popularCount,
      avgPrice: avgPrice.toFixed(0),
      avgRatingAll
    };
  }, [items, categories]);

  // Design Theme Classes
  const bgWorkspace = isDarkMode ? 'bg-[#121212]' : 'bg-[#F9FAFB]';
  const labelClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-[#1A1A1A] border-gray-800' : 'bg-white border-gray-200 shadow-sm';
  const inputBg = isDarkMode ? 'bg-[#121212] text-white border-gray-800' : 'bg-white text-gray-900 border-gray-300';

  // LOGIN BARRIER GATE
  if (!isLoggedIn) {
    return (
      <div className={`min-h-[80vh] flex items-center justify-center px-4 py-12 ${bgWorkspace}`} id="admin-login-screen">
        <div className={`w-full max-w-md rounded-2xl border-[3px] border-[#E63946] p-8 shadow-[6px_6px_0px_0px_rgba(230,57,70,0.5)] ${isDarkMode ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-900'}`}>
          <div className="text-center mb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E63946] text-white border-2 border-black shadow-md mb-3 animate-pulse">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight font-sans">
              Bole Admin Portal
            </h2>
            <p className={`text-xs font-bold leading-normal mt-1.5 ${textMuted}`}>
              Access to recipes, categories, rating states, and user feedbacks is protected.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authError && (
              <div className="rounded-xl border border-red-500 bg-red-400/10 p-3 flex items-start gap-2 text-xs font-bold text-red-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                Admin Username
              </label>
              <input
                type="text"
                placeholder="Enter user name (admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-xl border-[2.5px] border-black bg-white px-3.5 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#E63946]"
                id="admin-user-input"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter password (admin)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border-[2.5px] border-black bg-white px-3.5 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#E63946]"
                id="admin-pass-input"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl border-[2.5px] border-black bg-[#E63946] py-3 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all mt-6"
              id="admin-login-submit"
            >
              <Unlock className="h-4 w-4" />
              <span>Authenticate Bole Node</span>
            </button>
          </form>

          <div className="mt-6 border-t border-dashed border-gray-700/50 pt-4 text-center">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#F4A261]">
              Testing Keynote:
            </span>
            <p className="text-[11px] font-bold text-gray-400 mt-1">
              Log in with Username <code className="bg-black/40 px-1 py-0.5 rounded text-white font-mono">admin</code> and Password <code className="bg-black/40 px-1 py-0.5 rounded text-white font-mono">admin</code>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD VIEW RENDER
  return (
    <div className={`mx-auto max-w-7xl px-4 py-6 md:px-6`} id="admin-panel-container">
      
      {/* Toast Alert Notice */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -45, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 border-2 border-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#F4A261] flex items-center gap-2"
            id="admin-toast-message"
          >
            <Check className="h-4 w-4 text-[#F4A261]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6 md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full shrink-0 md:w-64 animate-fade-in" id="admin-sidebar">
          <div className={`rounded-2xl border-[3px] border-[#E63946] p-4 shadow-[4px_4px_0px_0px_#E63946] ${cardBg}`}>
            {/* Sidebar Identity Header */}
            <div className="hidden border-b-2 border-dashed border-gray-500/20 pb-4 mb-4 md:block">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E63946] font-mono">
                Admin Terminals
              </span>
              <h3 className={`text-base font-black uppercase mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bole HQ Admin</h3>
            </div>

            {/* Sidebar Buttons */}
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  onClick={() => setActiveSegment('dashboard')}
                  className={`w-full flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all justify-start ${
                    activeSegment === 'dashboard'
                      ? 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_#F4A261]'
                      : isDarkMode 
                        ? 'bg-[#1A1A1A] border-transparent text-gray-300 hover:bg-gray-800' 
                        : 'bg-white border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  <span>Dashboard</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActiveSegment('menu-items')}
                  className={`w-full flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all justify-start ${
                    activeSegment === 'menu-items'
                      ? 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_#F4A261]'
                      : isDarkMode 
                        ? 'bg-[#1A1A1A] border-transparent text-gray-300 hover:bg-gray-800' 
                        : 'bg-white border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Utensils className="h-4 w-4 shrink-0" />
                  <span>Catalogue ({items.length})</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActiveSegment('categories')}
                  className={`w-full flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all justify-start ${
                    activeSegment === 'categories'
                      ? 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_#F4A261]'
                      : isDarkMode 
                        ? 'bg-[#1A1A1A] border-transparent text-gray-300 hover:bg-gray-800' 
                        : 'bg-white border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Tags className="h-4 w-4 shrink-0" />
                  <span>Types ({categories.length})</span>
                </button>
              </li>

              {/* Feedbacks Sub-tab */}
              <li>
                <button
                  onClick={() => setActiveSegment('feedbacks')}
                  className={`relative w-full flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all justify-start ${
                    activeSegment === 'feedbacks'
                      ? 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_#F4A261]'
                      : isDarkMode 
                        ? 'bg-[#1A1A1A] border-transparent text-gray-300 hover:bg-gray-800' 
                        : 'bg-white border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span>Comments ({feedbacks.length})</span>
                  {feedbacks.length > 0 && (
                    <span className="absolute right-3 rounded bg-amber-500/20 text-amber-500 px-1.5 py-0.5 text-[9px] font-black">
                      {feedbacks.length}
                    </span>
                  )}
                </button>
              </li>

              {/* Clear Logout button */}
              <li className="pt-4 border-t border-dashed border-gray-650/20 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 rounded-xl border-2 border-transparent px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all text-red-500 hover:bg-red-500/15"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Lock Console</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Core Sections Workspace */}
        <main className="flex-1 min-w-0" id="admin-workspace">
          
          {/* SECTION 1: DASHBOARD LANDING */}
          {activeSegment === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              id="admin-dashboard-section"
            >
              {/* Header block with strictly visible text */}
              <div>
                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight uppercase leading-none ${labelClass}`}>
                  Console Executive
                </h2>
                <p className="text-xs font-black text-[#E63946] mt-1.5 uppercase tracking-wider">
                  Bole branch operations and rating telemetry
                </p>
              </div>

              {/* Bento Grid Stats - Adjusted for Absolute Visibility in Dark & Light Modes */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className={`rounded-xl border-[3px] border-[#E63946] p-5 shadow-[4px_4px_0px_0px_#E63946] hover:-translate-y-px transition-all ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">Dishes Listed</span>
                    <span className="rounded-lg bg-red-95/10 border border-[#E63946] p-2 text-[#E63946]">
                      <Utensils className="h-4 w-4 stroke-[2.5]" />
                    </span>
                  </div>
                  <h4 className={`mt-3 text-3xl font-black font-mono leading-none ${labelClass}`}>{stats.totalCount}</h4>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Recipes catalogue</p>
                </div>

                <div className={`rounded-xl border-[3px] border-[#E63946] p-5 shadow-[4px_4px_0px_0px_#E63946] hover:-translate-y-px transition-all ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">Categories</span>
                    <span className="rounded-lg bg-amber-95/15 border border-[#E63946] p-2 text-[#F4A261]">
                      <Tags className="h-4 w-4 stroke-[2.5]" />
                    </span>
                  </div>
                  <h4 className={`mt-3 text-3xl font-black font-mono leading-none ${labelClass}`}>{stats.catCount}</h4>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Active groupings</p>
                </div>

                <div className={`rounded-xl border-[3px] border-[#E63946] p-5 shadow-[4px_4px_0px_0px_#E63946] hover:-translate-y-px transition-all ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">Average Rating</span>
                    <span className="rounded-lg bg-orange-95/10 border border-[#E63946] p-2 text-amber-500">
                      <Star className="h-4 w-4 fill-current stroke-[2.5]" />
                    </span>
                  </div>
                  <h4 className={`mt-3 text-3xl font-black font-mono leading-none ${labelClass}`}>★ {stats.avgRatingAll}</h4>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">User star aggregate</p>
                </div>

                <div className={`rounded-xl border-[3px] border-[#E63946] p-5 shadow-[4px_4px_0px_0px_#E63946] hover:-translate-y-px transition-all ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">Average Price</span>
                    <span className="rounded-lg bg-green-95/10 border border-[#E63946] p-2 text-emerald-500">
                      <DollarSign className="h-4 w-4 stroke-[2.5]" />
                    </span>
                  </div>
                  <h4 className={`mt-3 text-3xl font-black font-mono leading-none ${labelClass}`}>{stats.avgPrice} Br</h4>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Average billing weight</p>
                </div>
              </div>

              {/* Graphic Indicators & Category Count distribution list */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className={`rounded-xl border-[3px] border-[#E63946] p-5 shadow-[4px_4px_0px_0px_#E63946] ${cardBg}`}>
                  <h3 className={`text-xs font-black uppercase tracking-widest mb-4 border-b-2 border-dashed border-gray-400/20 pb-2 flex items-center justify-between font-display ${labelClass}`}>
                    <span>Menu Weight by Category</span>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Recipe Count</span>
                  </h3>
                  <div className="space-y-4">
                    {categories.map((cat) => {
                      const count = items.filter(i => i.category === cat.id).length;
                      const percentage = (count / (items.length || 1)) * 100;
                      return (
                        <div key={cat.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold font-sans">
                            <span className={labelClass}>{cat.name}</span>
                            <span className="font-mono text-gray-500">{count} items</span>
                          </div>
                          <div className="h-3 w-full rounded-full bg-black/25 overflow-hidden border border-black/5 flex">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className="h-full bg-[#E63946]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-block: Recipe aggregates ratings list */}
                <div className={`rounded-xl border-[3px] border-[#E63946] p-5 shadow-[4px_4px_0px_0px_#E63946] ${cardBg}`}>
                  <h3 className={`text-xs font-black uppercase tracking-widest mb-4 border-b-2 border-dashed border-gray-400/20 pb-2 flex items-center justify-between font-display ${labelClass}`}>
                    <span>Recipe Star Ratings</span>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Avg Stars (Votes)</span>
                  </h3>
                  <div className="space-y-3 max-h-[220px] overflow-y-auto scrollbar-none pr-1">
                    {items.map((item) => {
                      const rates = item.ratings || [];
                      const count = rates.length;
                      const avg = count > 0 ? (rates.reduce((a, b) => a + b, 0) / count).toFixed(1) : '5.0';
                      return (
                        <div key={item.id} className="flex items-center justify-between text-xs border-b border-gray-400/10 pb-1.5 last:border-0">
                          <span className={`${labelClass} font-bold line-clamp-1 truncate max-w-[140px]`}>{item.name}</span>
                          <div className="flex items-center gap-1.5 font-mono text-amber-500 font-black">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  className={`h-2.5 w-2.5 ${s <= Math.round(parseFloat(avg)) ? 'fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span>{avg}</span>
                            <span className="text-gray-400 font-semibold font-sans text-[10px]">({count})</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bole Operations Info block */}
              <div className={`rounded-2xl border-[3px] border-emerald-500 p-5 shadow-[3px_3px_0px_0px_#10B981] ${cardBg}`}>
                <h4 className="text-emerald-500 font-black uppercase text-xs tracking-wider mb-1">
                  Active Operational Credentials
                </h4>
                <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  This dashboard lists localized mock data. User comments, ratings, and menu catalogue creations are stored securely in the local browser state. To reset defaults, please lock console or reload.
                </p>
              </div>
            </motion.div>
          )}

          {/* SECTION 2: CATALOGUE/MENU ITEMS */}
          {activeSegment === 'menu-items' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              id="admin-catalogue-section"
            >
              {/* Top Row bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className={`text-2xl font-black uppercase tracking-tight ${labelClass}`}>Recipe Catalogue</h2>
                  <p className={`text-xs ${textMuted}`}>Create, edit, or delete dishes in Wow Burger Bole</p>
                </div>
                {!isFormOpen && (
                  <button
                    onClick={handleAddNewClick}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-emerald-500 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_#10B981] active:translate-y-px active:scale-95 transition-all"
                    id="add-recipe-launcher"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Recipe</span>
                  </button>
                )}
              </div>

              {/* Add / Edit form panel inside active space */}
              <AnimatePresence>
                {isFormOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    className="overflow-hidden rounded-2xl border-[4px] border-black bg-white shadow-[6px_6px_0px_0px_#E63946] transition-all"
                    id="admin-form-shell"
                  >
                    {/* Header: Classic Black and Red Theme */}
                    <div className="border-b-[4px] border-black bg-[#E63946] px-5 py-4 flex items-center justify-between text-white">
                      <h4 className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest text-white">
                        <Sparkles className="h-5 w-5 text-black animate-pulse" />
                        <span>{editingItem ? `Edit Recipe: ${editingItem.name}` : 'Compose Elegant New Item'}</span>
                      </h4>
                      <button
                        onClick={() => {
                          setIsFormOpen(false);
                          setIsAddingInlineCat(false);
                        }}
                        className="rounded-lg border-2 border-black bg-black p-1 text-[#E63946] hover:bg-white hover:text-black transition-colors"
                        title="Close Form"
                      >
                        <X className="h-4 w-4 stroke-[3]" />
                      </button>
                    </div>

                    <form onSubmit={handleFormSubmit} className="p-5 space-y-4 bg-white text-black">
                      {/* Grid fields */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Item Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Garlic Jalapeno Smash"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Price (Birr) *</label>
                          <input
                            type="number"
                            step="1"
                            required
                            placeholder="e.g. 750"
                            value={itemPrice}
                            onChange={(e) => setItemPrice(e.target.value)}
                            className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-black text-black uppercase tracking-wider">Category Group *</label>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingInlineCat(!isAddingInlineCat);
                                setInlineCatName('');
                              }}
                              className="text-[10px] font-black text-[#E63946] hover:bg-red-50 hover:px-1 rounded uppercase tracking-wider transition-all"
                              id="toggle-inline-category-btn"
                            >
                              {isAddingInlineCat ? "✕ Existing List" : "✏️ + Add if not listed"}
                            </button>
                          </div>

                          {isAddingInlineCat ? (
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Write new category name..."
                                value={inlineCatName}
                                onChange={(e) => setInlineCatName(e.target.value)}
                                className="flex-1 rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]"
                                id="inline-category-name-input"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const nameTrimmed = inlineCatName.trim();
                                  if (!nameTrimmed) {
                                    triggerToast('Provide a valid category name!');
                                    return;
                                  }
                                  const safeId = nameTrimmed.toLowerCase().replace(/\s+/g, '-');
                                  if (categories.some(c => c.id === safeId)) {
                                    triggerToast('Category already exists! Selected from list.');
                                    setItemCategory(safeId);
                                    setIsAddingInlineCat(false);
                                    setInlineCatName('');
                                    return;
                                  }
                                  const newCatObj: Category = {
                                    id: safeId,
                                    name: nameTrimmed,
                                    iconName: 'Flame'
                                  };
                                  onAddCategory(newCatObj);
                                  setItemCategory(safeId);
                                  setIsAddingInlineCat(false);
                                  setInlineCatName('');
                                  triggerToast(`Added category "${nameTrimmed}"`);
                                }}
                                className="rounded-xl border-2 border-black bg-black text-white hover:bg-[#E63946] hover:text-white px-4 py-2.5 text-xs font-black uppercase transition-all shadow-[2px_2px_0px_0px_#E63946]"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <select
                              value={itemCategory}
                              onChange={(e) => setItemCategory(e.target.value)}
                              className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946] appearance-none"
                            >
                              {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Prep Speed *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 5-7 min"
                            value={itemPrepTime}
                            onChange={(e) => setItemPrepTime(e.target.value)}
                            className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Image URL *</label>
                        <input
                          type="url"
                          required
                          placeholder="e.g. https://images.unsplash.com/..."
                          value={itemImage}
                          onChange={(e) => setItemImage(e.target.value)}
                          className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Energy (Calories)</label>
                          <input
                            type="number"
                            placeholder="650"
                            value={itemCalories}
                            onChange={(e) => setItemCalories(e.target.value)}
                            className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Spicy Tier (0 - 3)</label>
                          <select
                            value={itemSpicy}
                            onChange={(e) => setItemSpicy(e.target.value)}
                            className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]"
                          >
                            <option value="0">0 (Mild)</option>
                            <option value="1">1 (Warm)</option>
                            <option value="2">2 (Hot)</option>
                            <option value="3">3 (Volcanic)</option>
                          </select>
                        </div>

                        <div className="flex gap-4 items-center justify-around h-full pt-4 border-2 border-black rounded-xl px-2 bg-gray-50">
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-black uppercase text-black select-none">
                            <input
                              type="checkbox"
                              checked={itemIsPopular}
                              onChange={(e) => setItemIsPopular(e.target.checked)}
                              className="rounded border-2 border-black text-[#E63946] focus:ring-[#E63946] h-4.5 w-4.5 cursor-pointer"
                            />
                            <span>Popular</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-black uppercase text-black select-none">
                            <input
                              type="checkbox"
                              checked={itemIsVeg}
                              onChange={(e) => setItemIsVeg(e.target.checked)}
                              className="rounded border-2 border-black text-[#E63946] focus:ring-[#E63946] h-4.5 w-4.5 cursor-pointer"
                            />
                            <span>Veg</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Description *</label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Summative gourmet details..."
                          value={itemDescription}
                          onChange={(e) => setItemDescription(e.target.value)}
                          className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Ingredients (comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Wagyu beef, Cheddar, Bole Chili Spice"
                          value={itemIngredients}
                          onChange={(e) => setItemIngredients(e.target.value)}
                          className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsFormOpen(false);
                            setIsAddingInlineCat(false);
                          }}
                          className="rounded-xl border-2 border-black bg-black text-white px-4 py-2.5 text-xs font-black uppercase transition-all hover:bg-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-xl border-2 border-black bg-[#E63946] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all hover:bg-black hover:text-white"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Catalogue Table */}
              <div className={`overflow-x-auto rounded-2xl border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_#E63946] ${cardBg}`} id="catalogue-table-holder">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-400/20 text-11px font-black uppercase tracking-wider text-gray-500 font-mono">
                      <th className="px-4 py-3">Dishes</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Spicy</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-400/10 text-xs font-semibold">
                    {items.map((item) => (
                      <tr key={item.id} className={`hover:bg-gray-550/5 transition-colors ${
                        isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'
                      }`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-cover border border-black/10 shrink-0" />
                            <span className={`font-bold uppercase ${labelClass}`}>{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-black/30 px-2 py-0.5 text-[9px] font-mono text-gray-400 uppercase tracking-wider">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-mono font-black ${labelClass}`}>{item.price} Br</span>
                        </td>
                        <td className="px-4 py-3">
                          {item.spicyLevel !== undefined && item.spicyLevel > 0 ? (
                            <span className="text-red-500">{'🌶️'.repeat(item.spicyLevel)}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5 flex-wrap">
                            {item.isPopular && <span className="bg-red-500/10 border border-red-500/15 text-red-500 px-1 py-0.5 rounded text-[8px] font-black uppercase">Popular</span>}
                            {item.isVegetarian && <span className="bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 px-1 py-0.5 rounded text-[8px] font-black uppercase">Veg</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="rounded-lg bg-[#F4A261]/10 text-[#F4A261] border border-[#F4A261]/25 p-1.5 hover:bg-[#F4A261]/20 transition-all"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove custom recipe "${item.name}" from catalogue permanently?`)) {
                                  onDeleteItem(item.id);
                                  triggerToast(`Deleted ${item.name}`);
                                }
                              }}
                              className="rounded-lg bg-red-500/15 text-red-500 border border-red-500/25 p-1.5 hover:bg-red-500/20 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* SECTION 3: CATEGORIES */}
          {activeSegment === 'categories' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              id="admin-categories-section"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className={`text-2xl font-black uppercase tracking-tight ${labelClass}`}>Recipe Categories</h2>
                  <p className={`text-xs ${textMuted}`}>Create and classify divisions inside Wow Burger</p>
                </div>
                {!isCategoryFormOpen && (
                  <button
                    onClick={() => setIsCategoryFormOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-emerald-500 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_#10B981] active:translate-y-px active:scale-95 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create New Category</span>
                  </button>
                )}
              </div>

              {/* Brand Category Custom form */}
              <AnimatePresence>
                {isCategoryFormOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    className="overflow-hidden rounded-2xl border-[4px] border-black bg-white shadow-[6px_6px_0px_0px_#E63946] max-w-lg transition-all"
                  >
                    <div className="border-b-[4px] border-black bg-[#E63946] px-5 py-4 flex items-center justify-between text-white">
                      <h4 className="font-black text-xs sm:text-sm uppercase tracking-widest text-white flex items-center gap-1.5 font-display">
                        <Sparkles className="h-5 w-5 text-black animate-bounce" />
                        <span>Form New Grouping</span>
                      </h4>
                      <button 
                        onClick={() => setIsCategoryFormOpen(false)} 
                        className="rounded-lg border-2 border-black bg-black p-1 text-[#E63946] hover:bg-white hover:text-black transition-colors"
                        title="Close Category Form"
                      >
                        <X className="h-4 w-4 stroke-[3]" />
                      </button>
                    </div>

                    <form onSubmit={handleCategorySubmit} className="p-5 space-y-4 bg-white text-black">
                      <div>
                        <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Grouping Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Milkshakes"
                          value={newCatName}
                          onChange={(e) => {
                            setNewCatName(e.target.value);
                            setNewCatId(e.target.value.trim().toLowerCase().replace(/\s+/g, '-'));
                          }}
                          className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-black uppercase tracking-wider mb-1 font-mono">Custom ID identifier</label>
                        <input
                          type="text"
                          placeholder="e.g. milkshakes (autogenerated)"
                          value={newCatId}
                          onChange={(e) => setNewCatId(e.target.value)}
                          className="w-full rounded-xl border-2 border-black bg-gray-50 px-3.5 py-2.5 text-xs font-mono font-bold text-gray-700 outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]"
                        />
                      </div>

                      <div className="flex justify-end gap-3.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsCategoryFormOpen(false)}
                          className="rounded-xl border-2 border-black bg-black text-white px-4 py-2.5 text-xs font-black uppercase transition-all hover:bg-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-xl border-2 border-black bg-[#E63946] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all hover:bg-black hover:text-white"
                        >
                          Save Category
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Categories list */}
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3" id="admin-categories-grid">
                {categories.map((cat) => {
                  const count = items.filter(itm => itm.category === cat.id).length;
                  return (
                    <div key={cat.id} className={`rounded-xl border-[3px] border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] relative overflow-hidden ${cardBg}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#E63946] font-mono leading-none">
                            /{cat.id}
                          </span>
                          <h4 className={`text-base font-black mt-1 uppercase ${labelClass}`}>{cat.name}</h4>
                          <span className="inline-block mt-2 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-500">
                            {count} recipe items active
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete grouping "${cat.name}"? Recipes will not be deleted but they will lose category associations.`)) {
                              onDeleteCategory(cat.id);
                              triggerToast(`Deleted ${cat.name}`);
                            }
                          }}
                          className="rounded-lg bg-red-500/10 text-red-500 border border-red-500/15 p-1.5 hover:bg-red-500/20 transition-all shrink-0 ml-2"
                          title="Remove Category"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SECTION 4: USER FEEDBACKS/COMMENTS */}
          {activeSegment === 'feedbacks' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              id="admin-feedbacks-section"
            >
              <div>
                <h2 className={`text-2xl font-black uppercase tracking-tight ${labelClass}`}>Customer Feedbacks & Comments</h2>
                <p className={`text-xs ${textMuted}`}>Read remarks, logs, and communication phone numbers submitted in Addis Ababa</p>
              </div>

              {feedbacks.length === 0 ? (
                <div className={`rounded-2xl border-[3px] border-dashed border-gray-600 p-12 text-center max-w-sm mx-auto ${cardBg}`}>
                  <MessageSquare className="h-10 w-10 text-gray-500 mx-auto stroke-[2.5]" />
                  <h4 className={`text-sm font-black uppercase mt-4 ${labelClass}`}>No Feedbacks Received</h4>
                  <p className={`text-xs mt-1 font-semibold ${textMuted}`}>
                    As soon as customers leave feedbacks in the Contact tab, they will stream live to this console pane.
                  </p>
                </div>
              ) : (
                <div className="space-y-4" id="feedbacks-comments-list">
                  {feedbacks.map((fb) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={fb.id}
                      className={`relative rounded-xl border-[3px] border-black p-5 shadow-[4px_4px_0px_0px_#F4A261] flex flex-col md:flex-row justify-between gap-4 items-start ${cardBg}`}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs font-black uppercase tracking-wide px-2 py-0.5 rounded bg-black/30 border border-black/15 text-[#E63946]`}>
                            Sender: {fb.name}
                          </span>
                          <span className="font-mono text-[10px] text-gray-500 font-bold border-l border-gray-400 pl-2">
                            {fb.timestamp}
                          </span>
                        </div>
                        
                        <p className={`text-xs font-semibold leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          "{fb.comment}"
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <a 
                            href={`tel:${fb.phone}`}
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-black uppercase text-[#F4A261] hover:underline"
                            title="Dial sender phone"
                          >
                            📞 Direct Dial: {fb.phone}
                          </a>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm('Delete this comment registry?')) {
                            onDeleteFeedback(fb.id);
                            triggerToast('Comment removed.');
                          }
                        }}
                        className="rounded-lg bg-red-500/15 text-red-500 border border-red-500/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider hover:bg-red-500/25 transition-all shrink-0 leading-none"
                      >
                        Delete Log
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </main>
      </div>

    </div>
  );
}
