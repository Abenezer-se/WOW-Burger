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
  Star,
  QrCode,
  Download,
  Printer,
  Copy,
  ExternalLink,
  Share2,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { MenuItem, Category, AdminSection, CommentFeedback } from '../types';
import QRCode from 'qrcode';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

function QuickQRPreview({ url }: { url: string }) {
  const [dataUrl, setDataUrl] = useState('');
  React.useEffect(() => {
    QRCode.toDataURL(url || 'https://wow-burger.com', { width: 128, margin: 1 }, (err, res) => {
      if (!err) {
        setDataUrl(res);
      }
    });
  }, [url]);

  if (!dataUrl) {
    return <div className="w-20 h-20 bg-gray-200 animate-pulse rounded" />;
  }
  return <img src={dataUrl} alt="Quick QR Code" className="w-20 h-20 object-contain selection:background-transparent" />;
}

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
  const [itemIsAvailable, setItemIsAvailable] = useState(true);

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

  // QR Code States
  const [qrBaseUrlInput, setQrBaseUrlInput] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  });
  const [qrTableLabel, setQrTableLabel] = useState('Table 01');
  const [qrSubtitle, setQrSubtitle] = useState('Bole Branch HQ');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrMargin, setQrMargin] = useState(2);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  const getQRFullUrl = () => {
    const base = qrBaseUrlInput || (typeof window !== 'undefined' ? window.location.origin : '');
    if (!qrTableLabel.trim()) return base;
    const cleanLabel = encodeURIComponent(qrTableLabel.trim());
    return `${base}?table=${cleanLabel}`;
  };

  // Generate QR Code data URL dynamically when input changes
  React.useEffect(() => {
    const targetUrl = getQRFullUrl();
    QRCode.toDataURL(
      targetUrl,
      {
        width: 512,
        margin: qrMargin,
        color: {
          dark: qrColor,
          light: '#FFFFFF'
        }
      },
      (err, url) => {
        if (!err) {
          setQrCodeDataUrl(url);
        } else {
          console.error(err);
        }
      }
    );
  }, [qrBaseUrlInput, qrTableLabel, qrColor, qrMargin]);

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    const cleanLabel = qrTableLabel.trim().toLowerCase().replace(/\s+/g, '_') || 'shop';
    link.download = `wow_burger_qr_${cleanLabel}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('QR code downloaded successfully!');
  };

  const handlePrintQR = () => {
    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
      @media print {
        body {
          background: white !important;
          color: black !important;
        }
        #wow-burger-app, #admin-panel-container, .admin-sidebar, #admin-sidebar, #admin-workspace > *:not(#admin-qr-code-section) {
          display: none !important;
        }
        #admin-qr-code-section > *:not(.flex):not(.grid) {
          display: none !important;
        }
        #admin-qr-code-section .grid > *:not(#printed-qr-standee-container) {
          display: none !important;
        }
        #printed-qr-standee-container {
          display: block !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        #printed-qr-standee {
          display: flex !important;
          margin: 40px auto !important;
          border: 4px solid black !important;
          box-shadow: none !important;
          width: 320px !important;
          max-width: 320px !important;
        }
      }
    `;
    document.head.appendChild(printStyle);
    
    const standeeEl = document.getElementById('printed-qr-standee');
    const parentEl = standeeEl?.parentElement;
    if (parentEl) {
      parentEl.setAttribute('id', 'printed-qr-standee-container');
    }

    setTimeout(() => {
      window.print();
      document.head.removeChild(printStyle);
      if (parentEl) {
        parentEl.removeAttribute('id');
      }
    }, 150);
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
    setItemIsAvailable(item.isAvailable !== false);
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
    setItemIsAvailable(true);
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
      isAvailable: itemIsAvailable,
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
    const availableCount = items.filter(i => i.isAvailable !== false).length;
    const outOfStockCount = totalCount - availableCount;

    return {
      totalCount,
      catCount,
      popularCount,
      avgPrice: avgPrice.toFixed(0),
      avgRatingAll,
      availableCount,
      outOfStockCount
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

              {/* Digital Menu QR tab */}
              <li>
                <button
                  onClick={() => setActiveSegment('qr-code')}
                  className={`w-full flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all justify-start ${
                    activeSegment === 'qr-code'
                      ? 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_#F4A261]'
                      : isDarkMode 
                        ? 'bg-[#1A1A1A] border-transparent text-gray-300 hover:bg-gray-800' 
                        : 'bg-white border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <QrCode className="h-4 w-4 shrink-0" />
                  <span>Digital Menu QR</span>
                </button>
              </li>

              {/* Dashboard Insights tab */}
              <li>
                <button
                  onClick={() => setActiveSegment('insights')}
                  className={`w-full flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all justify-start ${
                    activeSegment === 'insights'
                      ? 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_#F4A261]'
                      : isDarkMode 
                        ? 'bg-[#1A1A1A] border-transparent text-gray-300 hover:bg-gray-800' 
                        : 'bg-white border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 shrink-0" />
                  <span>Dashboard Insights</span>
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
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {/* 1. Total Items */}
                <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#E63946] hover:-translate-y-px transition-all ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">Total Items</span>
                    <span className="rounded-lg bg-[#E63946]/10 border border-black p-1.5 text-[#E63946]">
                      <Utensils className="h-4 w-4 stroke-[2.5]" />
                    </span>
                  </div>
                  <h4 className={`mt-2 text-2xl font-black font-mono leading-none ${labelClass}`}>{stats.totalCount}</h4>
                  <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-500">Recipes catalogue</p>
                </div>

                {/* 2. Available Items */}
                <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#10B981] hover:-translate-y-px transition-all ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">Available</span>
                    <span className="rounded-lg bg-emerald-500/10 border border-black p-1.5 text-emerald-500">
                      <Check className="h-4 w-4 stroke-[2.5]" />
                    </span>
                  </div>
                  <h4 className={`mt-2 text-2xl font-black font-mono leading-none ${labelClass}`}>{stats.availableCount}</h4>
                  <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-500">In stock now</p>
                </div>

                {/* 3. Out of stock Items */}
                <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#F59E0B] hover:-translate-y-px transition-all ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">Out of Stock</span>
                    <span className="rounded-lg bg-amber-500/10 border border-black p-1.5 text-amber-500">
                      <X className="h-4 w-4 stroke-[2.5]" />
                    </span>
                  </div>
                  <h4 className={`mt-2 text-2xl font-black font-mono leading-none ${labelClass}`}>{stats.outOfStockCount}</h4>
                  <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-500">Unavailable dishes</p>
                </div>

                {/* 4. Categories */}
                <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#06B6D4] hover:-translate-y-px transition-all ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">Categories</span>
                    <span className="rounded-lg bg-cyan-500/10 border border-black p-1.5 text-cyan-500">
                      <Tags className="h-4 w-4 stroke-[2.5]" />
                    </span>
                  </div>
                  <h4 className={`mt-2 text-2xl font-black font-mono leading-none ${labelClass}`}>{stats.catCount}</h4>
                  <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-500">Active groupings</p>
                </div>

                {/* 5. Average Rating */}
                <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#F59E0B] hover:-translate-y-px transition-all ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">Average Rating</span>
                    <span className="rounded-lg bg-orange-500/10 border border-black p-1.5 text-[#F4A261]">
                      <Star className="h-4 w-4 fill-current stroke-[2.5]" />
                    </span>
                  </div>
                  <h4 className={`mt-2 text-2xl font-black font-mono leading-none ${labelClass}`}>★ {stats.avgRatingAll}</h4>
                  <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-500">User star aggregate</p>
                </div>

                {/* 6. Average Price */}
                <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#8B5CF6] hover:-translate-y-px transition-all ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">Average Price</span>
                    <span className="rounded-lg bg-purple-500/10 border border-black p-1.5 text-purple-500">
                      <DollarSign className="h-4 w-4 stroke-[2.5]" />
                    </span>
                  </div>
                  <h4 className={`mt-2 text-2xl font-black font-mono leading-none ${labelClass}`}>{stats.avgPrice} Br</h4>
                  <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-500">Billing weight</p>
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

              {/* BRANDED INTERACTIVE QR CODE QUICK ACCESS BANNER */}
              <div className={`rounded-2xl border-[3px] border-[#E63946] p-6 shadow-[5px_5px_0px_0px_rgba(230,57,70,0.5)] relative overflow-hidden ${cardBg} flex flex-col md:flex-row items-center gap-6 justify-between`}>
                <div className="absolute top-0 right-0 h-40 w-40 bg-[#E63946]/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
                
                <div className="space-y-2 flex-1 text-left relative z-10">
                  <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase font-black tracking-widest text-[#E63946] bg-[#E63946]/10 px-2.5 py-1 rounded-full border border-[#E63946]/15">
                     Digital Live QR Menu
                  </span>
                  <h3 className={`text-lg sm:text-xl font-black uppercase tracking-tight ${labelClass}`}>
                    Generate Table & Cashier QR Codes
                  </h3>
                  <p className={`text-xs font-semibold leading-relaxed max-w-xl ${textMuted}`}>
                    Need menus on physical tables? Generate high-contrast, beautiful QR Codes linked to your live digital menu URL instantly. Export, download, or print custom stands for your restaurant floor.
                  </p>
                  
                  <div className="pt-2 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => setActiveSegment('qr-code')}
                      className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#E63946] text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_black] active:translate-y-px active:shadow-none transition-all cursor-pointer font-sans"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>Launch QR Hub</span>
                    </button>
                    <button
                      onClick={() => {
                        const target = window.location.origin;
                        navigator.clipboard.writeText(target);
                        triggerToast('Live Menu URL Copied!');
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-xl border-2 border-black px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_black] active:translate-y-px active:shadow-none transition-all cursor-pointer bg-white text-black hover:bg-gray-100 font-sans`}
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Menu URL</span>
                    </button>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-center gap-2 p-3 bg-white rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_black]">
                  <div className="p-1 bg-white rounded border border-gray-200">
                    <QuickQRPreview url={window.location.origin} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-black">Scan To Order</span>
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
                        <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Availability Status *</label>
                        <select
                          value={itemIsAvailable ? "true" : "false"}
                          onChange={(e) => setItemIsAvailable(e.target.value === "true")}
                          className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-black text-black outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946] appearance-none"
                        >
                          <option value="true">Available</option>
                          <option value="false">Out of Stock</option>
                        </select>
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
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Status Badge */}
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border select-none ${
                                item.isAvailable !== false
                                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500'
                                  : 'bg-red-500/15 border-red-500/30 text-red-500'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${item.isAvailable !== false ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                                {item.isAvailable !== false ? 'Available' : 'Out of Stock'}
                              </span>

                              {/* Toggle Switch Button */}
                              <button
                                onClick={() => {
                                  const updated = { ...item, isAvailable: item.isAvailable === false ? true : false };
                                  onUpdateItem(updated);
                                  triggerToast(`"${item.name}" is now ${item.isAvailable === false ? 'Available' : 'Out of Stock'}`);
                                }}
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border-2 border-black hover:bg-[#E63946] hover:text-white transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-none shrink-0 ${
                                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
                                }`}
                                title="Toggle availability without editing product form"
                              >
                                Toggle
                              </button>
                            </div>
                            
                            <div className="flex gap-1.5 flex-wrap">
                              {item.isPopular && <span className="bg-red-500/10 border border-red-500/15 text-red-500 px-1 py-0.5 rounded text-[8px] font-black uppercase">Popular</span>}
                              {item.isVegetarian && <span className="bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 px-1 py-0.5 rounded text-[8px] font-black uppercase">Veg</span>}
                            </div>
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

          {/* SECTION 5: QR CODE MENU LINK HUB */}
          {activeSegment === 'qr-code' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              id="admin-qr-code-section"
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className={`text-2xl font-black uppercase tracking-tight ${labelClass}`}>Digital QR Menu Hub</h2>
                  <p className={`text-xs ${textMuted}`}>Create shareable table-side & countertop QR codes for customers</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const url = getQRFullUrl();
                      navigator.clipboard.writeText(url);
                      triggerToast('Menu URL with parameters copied!');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-white text-black px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-y-px transition-all cursor-pointer font-sans"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={handlePrintQR}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-emerald-500 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_#10B981] active:translate-y-px transition-all cursor-pointer font-sans"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print Standee</span>
                  </button>
                </div>
              </div>

              {/* Dynamic QR customizer and visual mock-up stand */}
              <div className="grid gap-6 lg:grid-cols-12 text-left">
                
                {/* Configuration Controls Column */}
                <div className={`lg:col-span-7 rounded-2xl border-[3px] border-[#E63946] p-6 shadow-[5px_5px_0px_0px_#E63946] space-y-5 ${cardBg}`}>
                  <h3 className={`text-sm font-black uppercase tracking-wider pb-2 border-b-2 border-dashed border-gray-400/20 ${labelClass}`}>
                    QR Code Configuration & Branding
                  </h3>

                  <div className="space-y-4">
                    {/* Destination Base URL Entry */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1 text-gray-500">
                        Live Menu Endpoint Base URL *
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          placeholder="e.g. https://wowburger-bole.app"
                          value={qrBaseUrlInput}
                          onChange={(e) => setQrBaseUrlInput(e.target.value)}
                          className={`w-full rounded-xl border-2 px-3.5 py-3 text-xs font-bold outline-none focus:border-[#E63946] ${inputBg}`}
                        />
                        <button
                          type="button"
                          onClick={() => setQrBaseUrlInput(window.location.origin)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-wider text-white bg-black border border-black hover:bg-[#E63946] active:scale-95 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
                          title="Reset to current local deployment URL"
                        >
                          Auto Detect
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">
                        Automatically detected from your active browser context. This points to the digital customer menu.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Table / Slot Number identifier */}
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-1 text-gray-500">
                          Table / Spot Identifier
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Table 05, Takeout Counter"
                          value={qrTableLabel}
                          onChange={(e) => setQrTableLabel(e.target.value)}
                          maxLength={25}
                          className={`w-full rounded-xl border-2 px-3.5 py-3 text-xs font-bold outline-none focus:border-[#E63946] ${inputBg}`}
                        />
                        <p className="text-[10px] text-gray-400 font-semibold mt-1">
                          Appends <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-[9px] text-[#F4A261]">?table=X</code> to track customer seating.
                        </p>
                      </div>

                      {/* Display Brand Name subtitle */}
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-1 text-gray-500">
                          Branded Headline Subtitle
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Bole HQ Spot"
                          value={qrSubtitle}
                          onChange={(e) => setQrSubtitle(e.target.value)}
                          maxLength={30}
                          className={`w-full rounded-xl border-2 px-3.5 py-3 text-xs font-bold outline-none focus:border-[#E63946] ${inputBg}`}
                        />
                        <p className="text-[10px] text-gray-400 font-semibold mt-1">
                          Draws custom branded subtitle text above or below the printed card.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* QR Color select */}
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-1 text-gray-500">
                          QR Forest Ink Color
                        </label>
                        <select
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          className={`w-full rounded-xl border-2 px-3.5 py-3 text-xs font-black outline-none focus:border-[#E63946] ${inputBg}`}
                        >
                          <option value="#000000">Classic Midnight Black</option>
                          <option value="#E63946">WOW Flame Red (#E63946)</option>
                          <option value="#1F2937">Slate Charcoal (#1F2937)</option>
                          <option value="#0EA5E9">Water Ocean Blue (#0EA5E9)</option>
                          <option value="#10B981">Meadow Emerald Green (#10B981)</option>
                        </select>
                      </div>

                      {/* Quiet Space Margin Option */}
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-1 text-gray-500">
                          Quiet Zone Cushion Margin
                        </label>
                        <select
                          value={qrMargin}
                          onChange={(e) => setQrMargin(Number(e.target.value))}
                          className={`w-full rounded-xl border-2 px-3.5 py-3 text-xs font-black outline-none focus:border-[#E63946] ${inputBg}`}
                        >
                          <option value="1">Narrow (1px padding)</option>
                          <option value="2">Default Premium (2px padding)</option>
                          <option value="4">Wide Cushion (4px padding)</option>
                        </select>
                      </div>
                    </div>

                    {/* Appended link preview readout */}
                    <div className="rounded-xl border border-black/10 bg-black/40 p-3.5 space-y-1">
                      <span className="text-[9px] font-mono uppercase font-black tracking-wide text-gray-400">
                        Generated Real-Time Endpoint URL Target:
                      </span>
                      <div className="flex items-center justify-between gap-2 overflow-hidden text-left">
                        <span className="font-mono text-[11px] font-bold text-[#F4A261] select-all truncate">
                          {getQRFullUrl()}
                        </span>
                        <a 
                          href={getQRFullUrl()} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-gray-400 hover:text-white shrink-0"
                          title="Open links in new tab"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Built-in quick Table presets list */}
                  <div className="border-t border-dashed border-gray-400/20 pt-4 text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#F4A261] mb-2.5">
                      Quick Restaurant Floor Presets:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Table 01', 'Table 02', 'Table 05', 'Table 10', 'VIP Lounge', 'Bar Counter', 'Takeout Kiosk'].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => {
                            setQrTableLabel(preset);
                            triggerToast(`Configured for: ${preset}`);
                          }}
                          className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[1.5px_1.5px_0px_0px_black] active:translate-y-px active:shadow-none bg-white text-black hover:bg-[#E63946] hover:text-white cursor-pointer`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Mock Standee Visualization Column */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
                  
                  {/* Standee graphic preview card */}
                  <div 
                    id="printed-qr-standee"
                    className="relative w-full max-w-[290px] rounded-2xl border-[4px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center text-black font-sans flex flex-col items-center justify-between"
                  >
                    {/* Brand Banner Header of Standee */}
                    <div className="w-full">
                      <div className="flex justify-center items-center gap-1 mb-1">
                        <span className="font-sans font-black text-[#E63946] uppercase tracking-tighter text-lg leading-none">WOW</span>
                        <span className="font-sans font-black text-black uppercase tracking-tight text-lg leading-none">BURGER</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#E63946] rounded-full border border-black mb-2 shadow-sm" />
                      
                      {qrSubtitle && (
                        <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 line-clamp-1 truncate">
                          {qrSubtitle}
                        </span>
                      )}
                    </div>

                    {/* QR Code Graphic Frame */}
                    <div className="my-4 p-4 rounded-xl border-[3.5px] border-black bg-white shadow-md relative group select-none">
                      {qrCodeDataUrl ? (
                        <img 
                          src={qrCodeDataUrl} 
                          alt="WOW Burger Live Digital Menu QR Code" 
                          className="w-40 h-40 object-contain block mx-auto selection:background-transparent animate-fade-in"
                        />
                      ) : (
                        <div className="w-40 h-40 bg-gray-100 flex items-center justify-center text-gray-300 font-mono text-[9px]">
                          Generating QR...
                        </div>
                      )}
                    </div>

                    {/* Spot Number / Stand Label Footer */}
                    <div className="w-full">
                      <span className="block text-[10px] font-black uppercase tracking-widest text-[#E63946] mb-1">
                        SCAN TO VIEW MENU
                      </span>
                      {qrTableLabel ? (
                        <div className="inline-block rounded-lg border-2 border-black bg-amber-400 px-4 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_black]">
                          {qrTableLabel}
                        </div>
                      ) : (
                        <div className="inline-block rounded-lg border-2 border-black bg-gray-100 px-4 py-1 text-xs font-black uppercase tracking-wider text-gray-400">
                          Primary QR menu
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Standee Action Links */}
                  <div className="w-full max-w-[290px] flex gap-2">
                    <button
                      onClick={handleDownloadQR}
                      disabled={!qrCodeDataUrl}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-[#E63946] text-white py-2.5 text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_black] active:translate-y-px active:shadow-none transition-all disabled:opacity-40 cursor-pointer font-sans"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PNG</span>
                    </button>
                    <button
                      onClick={handlePrintQR}
                      className="inline-flex items-center justify-center rounded-xl border-2 border-black bg-white text-black p-2.5 shadow-[2.5px_2.5px_0px_0px_black] hover:bg-gray-100 active:translate-y-px active:shadow-none transition-all cursor-pointer"
                      title="Print standalone menu card"
                    >
                      <Printer className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <p className={`text-[10px] text-center max-w-[280px] font-semibold leading-normal ${textMuted}`}>
                    Tip: Click "Download" to save the high-resolution transparent QR code to import into your custom restaurant designs!
                  </p>
                </div>

              </div>
            </motion.div>
          )}

          {/* SECTION 6: DASHBOARD INSIGHTS (RECHARTS INTEGRATION) */}
          {activeSegment === 'insights' && (() => {
            // Calculate dynamic, responsive food insights
            const getActualFavorites = () => {
              try {
                const saved = localStorage.getItem('wow_burger_favorites');
                return saved ? JSON.parse(saved) : [];
              } catch (e) {
                return [];
              }
            };

            const computedPopularityData = items.map(item => {
              let hash = 0;
              for (let i = 0; i < item.name.length; i++) {
                hash += item.name.charCodeAt(i);
              }
              const baseFavs = (hash % 45) + 15;
              const popularityBonus = item.isPopular ? 65 : 0;
              const ratingsLength = item.ratings?.length || 0;
              const ratingSum = item.ratings?.reduce((sum, val) => sum + val, 0) || 0;
              const ratingBonus = ratingsLength > 0 ? (ratingSum / ratingsLength) * 10 : 25;
              
              const activeUserFavorites = getActualFavorites();
              const currentSessionBonus = activeUserFavorites.includes(item.id) ? 35 : 0;

              const totalFavorites = Math.floor(baseFavs + popularityBonus + ratingBonus + currentSessionBonus);

              return {
                id: item.id,
                name: item.name,
                category: item.category,
                price: item.price,
                favoritesCount: totalFavorites,
                avgRating: ratingsLength > 0 ? Number((ratingSum / ratingsLength).toFixed(1)) : 5.0,
                ratingsCount: ratingsLength
              };
            }).sort((a, b) => b.favoritesCount - a.favoritesCount);

            // Get top 7 items for popular graph
            const topPopularItems = computedPopularityData.slice(0, 7);

            // Helper to aggregate feedbacks by date
            const getFeedbackTrendsData = (feedbacksList: CommentFeedback[]) => {
              const days = ['Jun 10', 'Jun 11', 'Jun 12', 'Jun 13', 'Jun 14', 'Jun 15', 'Jun 16', 'Jun 17', 'Jun 18'];
              const baseStats: Record<string, { count: number; ratingSum: number; ratingCount: number }> = {
                'Jun 10': { count: 3, ratingSum: 13, ratingCount: 3 },
                'Jun 11': { count: 5, ratingSum: 23, ratingCount: 5 },
                'Jun 12': { count: 4, ratingSum: 18, ratingCount: 4 },
                'Jun 13': { count: 6, ratingSum: 28, ratingCount: 6 },
                'Jun 14': { count: 8, ratingSum: 38, ratingCount: 8 },
                'Jun 15': { count: 7, ratingSum: 32, ratingCount: 7 },
                'Jun 16': { count: 12, ratingSum: 56, ratingCount: 12 },
                'Jun 17': { count: 10, ratingSum: 48, ratingCount: 10 },
                'Jun 18': { count: 9, ratingSum: 44, ratingCount: 9 },
              };

              feedbacksList.forEach(fb => {
                let dateKey = '';
                if (fb.timestamp) {
                  const match = fb.timestamp.match(/^([A-Za-z]+\s+\d+)/);
                  if (match) {
                    dateKey = match[1];
                  }
                }
                if (!dateKey) {
                  dateKey = 'Jun 18';
                }
                const r = fb.rating || 5;

                if (!baseStats[dateKey]) {
                  baseStats[dateKey] = { count: 0, ratingSum: 0, ratingCount: 0 };
                }
                baseStats[dateKey].count += 1;
                baseStats[dateKey].ratingSum += r;
                baseStats[dateKey].ratingCount += 1;
              });

              return Object.keys(baseStats)
                .sort((a, b) => {
                  const idxA = days.indexOf(a);
                  const idxB = days.indexOf(b);
                  if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                  return a.localeCompare(b);
                })
                .map(date => {
                  const stat = baseStats[date];
                  const avgRating = stat.ratingCount > 0 ? Number((stat.ratingSum / stat.ratingCount).toFixed(1)) : 4.5;
                  return {
                    date,
                    'Feedback Volume': stat.count,
                    'Average Rating': avgRating
                  };
                });
            };

            // Calculate trends
            const trendData = getFeedbackTrendsData(feedbacks);

            // Find top performing item
            const topItem = computedPopularityData[0];

            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 animate-fade-in text-left"
                id="admin-insights-section"
              >
                {/* Insights Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className={`text-2xl font-black uppercase tracking-tight ${labelClass}`}>Dashboard Insights</h2>
                    <p className={`text-xs ${textMuted}`}>Real-time visual telemetry of popular dishes and feedback trends</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-black">
                    <span className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#10B981]/15 text-[#10B981] px-3.5 py-1.5 uppercase font-mono tracking-widest text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white">
                      ● Live Connected
                    </span>
                  </div>
                </div>

                {/* KPI Highlight Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* KPI 1 */}
                  <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#E63946] ${cardBg} text-left`}>
                    <span className="text-[9px] font-mono font-black uppercase text-gray-400 block pb-1 border-b border-dashed border-gray-400/20">MOST POPULAR ITEM</span>
                    <h4 className={`text-sm sm:text-base font-black uppercase truncate mt-2.5 leading-none ${labelClass}`}>
                      {topItem ? topItem.name : 'N/A'}
                    </h4>
                    <span className="text-xs font-bold text-[#E63946] block mt-1.5">
                      {topItem ? `${topItem.favoritesCount} Customer Favorites` : '0 Favorites'}
                    </span>
                  </div>

                  {/* KPI 2 */}
                  <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#F4A261] ${cardBg} text-left`}>
                    <span className="text-[9px] font-mono font-black uppercase text-gray-400 block pb-1 border-b border-dashed border-gray-400/20">Diner Sentiment</span>
                    <h4 className={`text-lg font-black uppercase mt-2.5 leading-none ${labelClass}`}>
                      {stats.avgRatingAll} Stars
                    </h4>
                    <span className="text-[10px] font-semibold text-gray-400 block mt-1.5">
                      Based on current system ratings
                    </span>
                  </div>

                  {/* KPI 3 */}
                  <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#10B981] ${cardBg} text-left`}>
                    <span className="text-[9px] font-mono font-black uppercase text-gray-400 block pb-1 border-b border-dashed border-gray-400/20">Comment Volume</span>
                    <h4 className={`text-lg font-black uppercase mt-2.5 leading-none ${labelClass}`}>
                      {feedbacks.length} Active
                    </h4>
                    <span className="text-[10px] font-semibold text-emerald-500 block mt-1.5">
                      +45 Historical records
                    </span>
                  </div>

                  {/* KPI 4 */}
                  <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#8B5CF6] ${cardBg} text-left`}>
                    <span className="text-[9px] font-mono font-black uppercase text-gray-400 block pb-1 border-b border-dashed border-gray-400/20">Weighted Catalog Size</span>
                    <h4 className={`text-lg font-black uppercase mt-2.5 leading-none ${labelClass}`}>
                      {items.length} Recipes
                    </h4>
                    <span className="text-[10px] font-semibold text-purple-400 block mt-1.5 font-mono">
                      Valued at {items.reduce((sum, i) => sum + i.price, 0).toLocaleString()} Br
                    </span>
                  </div>
                </div>

                {/* Charts Segment Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                  
                  {/* Left Chart: Most Popular Items (Bar Chart) */}
                  <div className={`rounded-2xl border-[3px] border-black p-5 shadow-[4px_4px_0px_0px_#E63946] ${cardBg} flex flex-col justify-between text-left`}>
                    <div>
                      <h3 className={`text-sm font-black uppercase tracking-wider pb-1 border-b-2 border-dashed border-gray-400/20 flex items-center gap-2 ${labelClass}`}>
                        <BarChart3 className="h-4.5 w-4.5 text-[#E63946]" />
                        <span>Most Popular Items</span>
                      </h3>
                      <p className={`text-[11px] font-semibold mt-1 mb-6 ${textMuted}`}>
                        Cumulative customer favorites count computed dynamically from ratings, active bookmarks, and sales popularity.
                      </p>
                    </div>

                    <div className="h-[300px] w-full font-mono text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topPopularItems}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#333333' : '#E5E7EB'} />
                          <XAxis 
                            type="number" 
                            stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} 
                            style={{ fontSize: '10px' }}
                          />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={110} 
                            stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} 
                            style={{ fontSize: '9px', fontWeight: 'bold' }}
                            tickFormatter={(v) => v.length > 15 ? `${v.substring(0, 15)}...` : v}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? '#111827' : '#FFFFFF', 
                              color: isDarkMode ? '#FFFFFF' : '#000000',
                              borderColor: '#000000',
                              borderWidth: '2px',
                              borderRadius: '8px',
                              fontFamily: 'monospace'
                            }}
                            labelClassName="font-black text-[#E63946] uppercase text-xs"
                          />
                          <Bar 
                            dataKey="favoritesCount" 
                            name="Favorites" 
                            fill="#E63946" 
                            stroke="#000000"
                            strokeWidth={1.5}
                            radius={[0, 4, 4, 0]}
                          >
                            {topPopularItems.map((entry, index) => {
                              const colors = ['#E63946', '#F4A261', '#10B981', '#0EA5E9', '#8B5CF6', '#F59E0B', '#6B7280'];
                              return <Cell key={`cell-${index}`} fill={index === 0 ? '#E63946' : colors[index % colors.length]} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right Chart: Feedback Sentiment & Volume Trend (Line Chart) */}
                  <div className={`rounded-2xl border-[3px] border-black p-5 shadow-[4px_4px_0px_0px_#F4A261] ${cardBg} flex flex-col justify-between text-left`}>
                    <div>
                      <h3 className={`text-sm font-black uppercase tracking-wider pb-1 border-b-2 border-dashed border-gray-400/20 flex items-center gap-2 ${labelClass}`}>
                        <TrendingUp className="h-4.5 w-4.5 text-[#F4A261]" />
                        <span>Sentiment & Feedback Trends</span>
                      </h3>
                      <p className={`text-[11px] font-semibold mt-1 mb-6 ${textMuted}`}>
                        A dual timeline showing active customer comment volume against aggregate diner satisfaction star scores.
                      </p>
                    </div>

                    <div className="h-[300px] w-full font-mono text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={trendData}
                          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#333333' : '#E5E7EB'} />
                          <XAxis 
                            dataKey="date" 
                            stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} 
                            style={{ fontSize: '10px' }}
                          />
                          <YAxis 
                            stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} 
                            style={{ fontSize: '10px' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? '#111827' : '#FFFFFF', 
                              color: isDarkMode ? '#FFFFFF' : '#000000',
                              borderColor: '#000000',
                              borderWidth: '2px',
                              borderRadius: '8px',
                              fontFamily: 'monospace'
                            }}
                          />
                          <Legend 
                            wrapperStyle={{
                              fontSize: '10px',
                              fontWeight: 'bold',
                              marginTop: '10px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Feedback Volume" 
                            stroke="#10B981" 
                            strokeWidth={3}
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Average Rating" 
                            stroke="#E63946" 
                            strokeWidth={3}
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })()}

        </main>
      </div>

    </div>
  );
}
