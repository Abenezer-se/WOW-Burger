import React, { useState, useEffect } from 'react';
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
  Lock, 
  Unlock, 
  AlertCircle, 
  Star, 
  MessageSquare,
  Sparkles,
  Flame,
  ChevronLeft,
  ChevronRight,
  Shield,
  Key,
  TrendingUp,
  QrCode,
  Users
} from 'lucide-react';

import { MenuItem, Category, AdminSection, CommentFeedback, Employee } from '../types';

// Import extracted sub-components
import ImageUploadField from './ImageUploadField';
import EmployeeManagement from './EmployeeManagement';
import AdminInsights from './AdminInsights';
import QrCodeHub from './QrCodeHub';

interface AdminPanelProps {
  items: MenuItem[]; // fallback full list
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
  items: parentItems,
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
  // Authentication states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const saved = sessionStorage.getItem('wow_burger_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('wow_burger_admin_auth') === 'true';
  });
  const [authError, setAuthError] = useState<string | null>(null);

  // Password Change Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
  const [itemImage, setItemImage] = useState(''); // Primary display URL
  const [itemImages, setItemImages] = useState<string[]>([]); // Media Gallery URLs
  const [itemCalories, setItemCalories] = useState('650');
  const [itemPrepTime, setItemPrepTime] = useState('5-8 min');
  const [itemSpicy, setItemSpicy] = useState('0');
  const [itemIsPopular, setItemIsPopular] = useState(false);
  const [itemIsVeg, setItemIsVeg] = useState(false);
  const [itemIsAvailable, setItemIsAvailable] = useState(true);

  // Server-Side Paginated list states
  const [adminItems, setAdminItems] = useState<MenuItem[]>([]);
  const [adminPage, setAdminPage] = useState(1);
  const [adminLimit, setAdminLimit] = useState(5);
  const [adminTotalPages, setAdminTotalPages] = useState(1);
  const [adminTotalItems, setAdminTotalItems] = useState(0);
  
  // Search and Filter states
  const [adminSearch, setAdminSearch] = useState('');
  const [adminFilterCategory, setAdminFilterCategory] = useState('all');

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch paginated items from backend server
  const fetchPaginatedItems = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: adminPage.toString(),
        limit: adminLimit.toString(),
        search: adminSearch.trim(),
        category: adminFilterCategory
      });
      const res = await fetch(`/api/items?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setAdminItems(data.items || []);
        setAdminTotalPages(data.pagination.totalPages || 1);
        setAdminTotalItems(data.pagination.totalItems || 0);
      }
    } catch (err) {
      console.error('Error fetching paginated items:', err);
    }
  };

  // Reload pagination when filter params or page changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchPaginatedItems();
    }
  }, [adminPage, adminLimit, adminFilterCategory, adminSearch, isLoggedIn]);

  // Handle Admin Credentials Login
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        sessionStorage.setItem('wow_burger_admin_auth', 'true');
        sessionStorage.setItem('wow_burger_current_user', JSON.stringify(data.user));
        triggerToast(`Welcome back, ${data.user.name}!`);
      } else {
        const err = await res.json();
        setAuthError(err.error || 'Invalid credentials!');
      }
    } catch (err) {
      setAuthError('Connection failed. Please make sure the backend is running.');
    }
  };

  // Handle Password Change Form Submit
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPass || !newPass || !confirmPass) {
      setPasswordError('Please fill out all fields.');
      return;
    }

    if (newPass !== confirmPass) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser?.email || 'admin',
          currentPassword: currentPass,
          newPassword: newPass
        })
      });

      if (res.ok) {
        triggerToast('Password updated successfully!');
        setIsPasswordModalOpen(false);
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
      } else {
        const err = await res.json();
        setPasswordError(err.error || 'Failed to update password.');
      }
    } catch (e) {
      setPasswordError('Server connection error.');
    }
  };

  // Sign out
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    sessionStorage.removeItem('wow_burger_admin_auth');
    sessionStorage.removeItem('wow_burger_current_user');
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
    setItemImages(item.images || [item.image]);
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
    setItemImages([]);
    setIsFormOpen(true);
  };

  // Submit Menu Item Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Role permissions gate
    if (currentUser?.role === 'Viewer') {
      triggerToast('Permission Denied: Viewer accounts cannot edit dishes.');
      return;
    }

    if (!itemName || !itemPrice || !itemDescription) {
      triggerToast('Please complete all mandatory fields!');
      return;
    }

    const priceNum = parseFloat(itemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      triggerToast('Please enter a valid retail price!');
      return;
    }

    // Ensure our images media gallery has at least our primary image in it
    const activeImages = itemImages.length > 0 ? itemImages : [itemImage];

    const itemObj: MenuItem = {
      id: editingItem ? editingItem.id : 'item-' + Date.now(),
      name: itemName,
      description: itemDescription,
      price: priceNum,
      image: itemImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
      images: activeImages,
      category: itemCategory,
      ingredients: itemIngredients.split(',').map(s => s.trim()).filter(Boolean),
      calories: parseInt(itemCalories) || 450,
      prepTime: itemPrepTime || '6-8 min',
      spicyLevel: parseInt(itemSpicy) || 0,
      isPopular: itemIsPopular,
      isVegetarian: itemIsVeg,
      isAvailable: itemIsAvailable,
      ratings: editingItem ? (editingItem.ratings || []) : [5],
      views: editingItem ? (editingItem.views || 0) : 0
    };

    try {
      const endpoint = editingItem ? `/api/items/${editingItem.id}` : '/api/items';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemObj)
      });

      if (res.ok) {
        const savedItem = await res.json();
        
        // Propagate updates to root app state
        if (editingItem) {
          onUpdateItem(savedItem);
          triggerToast(`Successfully modified: "${itemName}"`);
        } else {
          onAddItem(savedItem);
          triggerToast(`Successfully created: "${itemName}"`);
        }
        
        setIsFormOpen(false);
        fetchPaginatedItems(); // reload current paginated list from server
      } else {
        triggerToast('Failed to write changes to full-stack catalog.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Server sync issue saving item.');
    }
  };

  // Handle local deletion with permission checks
  const handleDeleteClick = async (itemId: string, name: string) => {
    if (currentUser?.role === 'Viewer' || currentUser?.role === 'Editor') {
      triggerToast(`Permission Denied: ${currentUser.role} role cannot delete recipes.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete "${name}" from the active menu catalog?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        onDeleteItem(itemId);
        triggerToast(`Successfully deleted recipe: ${name}`);
        // Adjust pagination page if we deleted the last item on the page
        if (adminItems.length === 1 && adminPage > 1) {
          setAdminPage(prev => prev - 1);
        } else {
          fetchPaginatedItems();
        }
      } else {
        triggerToast('Deletion rejected by server.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Connection failure deleting item.');
    }
  };

  // Memoize statistics based on parent live items
  const stats = React.useMemo(() => {
    const totalCount = parentItems.length;
    const catCount = categories.length;
    const popularCount = parentItems.filter(i => i.isPopular).length;
    const avgPrice = parentItems.reduce((acc, current) => acc + current.price, 0) / (totalCount || 1);
    
    // Calculate overall stars rating average across all items
    let sumRating = 0;
    let totalRatingsCount = 0;
    parentItems.forEach(item => {
      const rates = item.ratings || [];
      rates.forEach(r => {
        sumRating += r;
        totalRatingsCount++;
      });
    });
    const avgRatingAll = totalRatingsCount > 0 ? (sumRating / totalRatingsCount).toFixed(1) : '5.0';
    const availableCount = parentItems.filter(i => i.isAvailable !== false).length;
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
  }, [parentItems, categories]);

  // Design Theme Classes
  const bgWorkspace = isDarkMode ? 'bg-[#121212]' : 'bg-[#F9FAFB]';
  const labelClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-650';
  const cardBg = isDarkMode ? 'bg-[#1A1A1A] border-gray-800' : 'bg-white border-gray-200 shadow-sm';

  // LOGIN BARRIER GATE
  if (!isLoggedIn) {
    return (
      <div className={`min-h-[85vh] flex items-center justify-center px-4 py-12 ${bgWorkspace}`} id="admin-login-screen">
        <div className={`w-full max-w-md rounded-2xl border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#E63946] ${isDarkMode ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-900'}`}>
          <div className="text-center mb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E63946] text-white border-2 border-black shadow-md mb-3">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight font-sans">
              Bole Terminal Login
            </h2>
            <p className={`text-xs font-bold leading-normal mt-1.5 ${textMuted}`}>
              Access to recipes, employee files, and telemetry dashboard requires authentication.
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
                Username/Email
              </label>
              <input
                type="text"
                placeholder="Enter username (e.g. admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-xl border-[2.5px] border-black bg-white px-3.5 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#E63946]"
                id="admin-user-input"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border-[2.5px] border-black bg-white px-3.5 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#E63946]"
                id="admin-pass-input"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl border-[2.5px] border-black bg-[#E63946] py-3 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all mt-6 cursor-pointer"
              id="admin-login-submit"
            >
              <Unlock className="h-4 w-4" />
              <span>Authenticate Staff</span>
            </button>
          </form>

          <div className="mt-6 border-t border-dashed border-gray-400/20 pt-4 text-center">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#E63946]">
              Operational Defaults:
            </span>
            <p className="text-[11px] font-bold text-gray-400 mt-1 leading-normal">
              Admin: <code className="bg-black/35 px-1 py-0.5 rounded text-white font-mono">admin</code> / <code className="bg-black/35 px-1 py-0.5 rounded text-white font-mono">admin</code><br/>
              Editor: <code className="bg-black/35 px-1 py-0.5 rounded text-white font-mono">samson</code> / <code className="bg-black/35 px-1 py-0.5 rounded text-white font-mono">samson</code><br/>
              Viewer: <code className="bg-black/35 px-1 py-0.5 rounded text-white font-mono">helen</code> / <code className="bg-black/35 px-1 py-0.5 rounded text-white font-mono">helen</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6" id="admin-panel-container">
      
      {/* Toast Notification element */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -45, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 border-2 border-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#E63946] flex items-center gap-2"
            id="admin-toast-message"
          >
            <Check className="h-4 w-4 text-[#10B981]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6 md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full shrink-0 md:w-64 animate-fade-in" id="admin-sidebar">
          <div className={`rounded-2xl border-[3px] border-[#E63946] p-4 shadow-[4px_4px_0px_0px_#E63946] ${cardBg}`}>
            {/* Sidebar Identity Header */}
            <div className="hidden border-b-2 border-dashed border-gray-500/20 pb-4 mb-4 md:block text-left">
              <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#E63946]">
                Operational Terminal
              </span>
              <h3 className={`text-base font-black uppercase mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentUser?.name || 'Bole Console'}
              </h3>
              <span className="inline-flex items-center gap-1 mt-1.5 rounded bg-black/35 border border-gray-400/10 px-2 py-0.5 text-[8px] font-mono text-gray-400 uppercase tracking-widest">
                Role: {currentUser?.role || 'Viewer'}
              </span>
            </div>

            {/* Sidebar Buttons */}
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  onClick={() => setActiveSegment('dashboard')}
                  className={`w-full flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all justify-start cursor-pointer ${
                    activeSegment === 'dashboard'
                      ? 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_black]'
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
                  className={`w-full flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all justify-start cursor-pointer ${
                    activeSegment === 'menu-items'
                      ? 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_black]'
                      : isDarkMode 
                        ? 'bg-[#1A1A1A] border-transparent text-gray-300 hover:bg-gray-800' 
                        : 'bg-white border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Utensils className="h-4 w-4 shrink-0" />
                  <span>Catalogue ({parentItems.length})</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActiveSegment('categories')}
                  className={`w-full flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all justify-start cursor-pointer ${
                    activeSegment === 'categories'
                      ? 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_black]'
                      : isDarkMode 
                        ? 'bg-[#1A1A1A] border-transparent text-gray-300 hover:bg-gray-800' 
                        : 'bg-white border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Tags className="h-4 w-4 shrink-0" />
                  <span>Categories ({categories.length})</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActiveSegment('feedbacks')}
                  className={`relative w-full flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all justify-start cursor-pointer ${
                    activeSegment === 'feedbacks'
                      ? 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_black]'
                      : isDarkMode 
                        ? 'bg-[#1A1A1A] border-transparent text-gray-300 hover:bg-gray-800' 
                        : 'bg-white border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span>Comments ({feedbacks.length})</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActiveSegment('qr-code')}
                  className={`w-full flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all justify-start cursor-pointer ${
                    activeSegment === 'qr-code'
                      ? 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_black]'
                      : isDarkMode 
                        ? 'bg-[#1A1A1A] border-transparent text-gray-300 hover:bg-gray-800' 
                        : 'bg-white border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <QrCode className="h-4 w-4 shrink-0" />
                  <span>QR Generators</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActiveSegment('insights')}
                  className={`w-full flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all justify-start cursor-pointer ${
                    activeSegment === 'insights'
                      ? 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_black]'
                      : isDarkMode 
                        ? 'bg-[#1A1A1A] border-transparent text-gray-300 hover:bg-gray-800' 
                        : 'bg-white border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 shrink-0" />
                  <span>Insights Charts</span>
                </button>
              </li>

              {/* Show Employee Directory ONLY to Admin roles */}
              {currentUser?.role === 'Admin' && (
                <li>
                  <button
                    onClick={() => setActiveSegment('employees')}
                    className={`w-full flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all justify-start cursor-pointer ${
                      activeSegment === 'employees'
                        ? 'bg-[#E63946] border-black text-white shadow-[2px_2px_0px_0px_black]'
                        : isDarkMode 
                          ? 'bg-[#1A1A1A] border-transparent text-gray-300 hover:bg-gray-800' 
                          : 'bg-white border-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="h-4 w-4 shrink-0" />
                    <span>Employees</span>
                  </button>
                </li>
              )}

              {/* Password update key */}
              <li className="pt-4 border-t border-dashed border-gray-650/25 mt-4">
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex items-center gap-2.5 rounded-xl border-2 border-transparent px-4 py-2.5 text-xs font-black uppercase tracking-wider text-amber-500 hover:bg-amber-500/10 transition-all cursor-pointer"
                >
                  <Key className="h-3.5 w-3.5 shrink-0" />
                  <span>Change Password</span>
                </button>
              </li>

              {/* Clear Logout button */}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 rounded-xl border-2 border-transparent px-4 py-2 text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-500/15 transition-all cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Lock Console</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Core Sections Workspace */}
        <main className="flex-grow min-w-0" id="admin-workspace">
          
          {/* SECTION 1: DASHBOARD LANDING */}
          {activeSegment === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-left animate-fade-in"
              id="admin-dashboard-section"
            >
              <div>
                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight uppercase leading-none ${labelClass}`}>
                  Console Dashboard
                </h2>
                <p className="text-xs font-black text-[#E63946] mt-1.5 uppercase tracking-wider">
                  Real-time fullstack telemetry for Bole Flagship operations
                </p>
              </div>

              {/* Bento Grid Stats */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#E63946] ${cardBg}`}>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-mono">Catalog Count</span>
                  <h4 className={`mt-2 text-2xl font-black font-mono leading-none ${labelClass}`}>{stats.totalCount}</h4>
                  <p className="mt-1.5 text-[9px] font-bold uppercase text-gray-500">Active recipe entries</p>
                </div>

                <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#10B981] ${cardBg}`}>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-mono">In Stock Now</span>
                  <h4 className={`mt-2 text-2xl font-black font-mono leading-none text-emerald-500`}>{stats.availableCount}</h4>
                  <p className="mt-1.5 text-[9px] font-bold uppercase text-gray-500">Available dishes</p>
                </div>

                <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#F4A261] ${cardBg}`}>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-mono">Diner Sentiment</span>
                  <h4 className={`mt-2 text-2xl font-black font-mono leading-none text-amber-500`}>★ {stats.avgRatingAll}</h4>
                  <p className="mt-1.5 text-[9px] font-bold uppercase text-gray-500">Review aggregates</p>
                </div>

                <div className={`rounded-xl border-[3px] border-black p-4 shadow-[3px_3px_0px_0px_#8B5CF6] ${cardBg}`}>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-mono">Average Price</span>
                  <h4 className={`mt-2 text-2xl font-black font-mono leading-none text-purple-500`}>{stats.avgPrice} Br</h4>
                  <p className="mt-1.5 text-[9px] font-bold uppercase text-gray-500">Avarage ticket price</p>
                </div>
              </div>

              {/* Dynamic Categories Visualizers */}
              <div className={`rounded-xl border-[3px] border-black p-5 shadow-[4px_4px_0px_0px_black] ${cardBg}`}>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-4 border-b-2 border-dashed border-gray-400/20 pb-2 flex items-center justify-between ${labelClass}`}>
                  <span>Recipe Weight by Category</span>
                  <span className="text-[10px] font-mono text-gray-400">Total Count</span>
                </h3>
                <div className="space-y-4">
                  {categories.map((cat) => {
                    const count = parentItems.filter(i => i.category === cat.id).length;
                    const percentage = (count / (parentItems.length || 1)) * 100;
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold font-sans">
                          <span className={labelClass}>{cat.name}</span>
                          <span className="font-mono text-gray-500">{count} items</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-black/15 overflow-hidden border border-black/5 flex">
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

              {/* Operational Privilege Indicator */}
              <div className="rounded-2xl border-[3px] border-emerald-500 p-5 shadow-[3px_3px_0px_0px_#10B981] bg-emerald-500/5 text-left">
                <h4 className="text-emerald-500 font-black uppercase text-xs tracking-wider mb-1">
                  Active Operational Terminal Authenticated
                </h4>
                <p className={`text-xs font-semibold leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Logged in as <strong className="font-black text-emerald-500">{currentUser?.name}</strong> with <strong className="font-black">{currentUser?.role}</strong> permissions. To update, change segments using the navigation sidebar terminal.
                </p>
              </div>
            </motion.div>
          )}

          {/* SECTION 2: CATALOGUE/MENU ITEMS (WITH SERVER-SIDE PAGINATION) */}
          {activeSegment === 'menu-items' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-left animate-fade-in"
              id="admin-catalogue-section"
            >
              {/* Top Row bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className={`text-2xl font-black uppercase tracking-tight ${labelClass}`}>Catalog Recipes</h2>
                  <p className={`text-xs ${textMuted}`}>Create, edit, or delete dishes. Changes persist to backend db.json</p>
                </div>
                {!isFormOpen && currentUser?.role !== 'Viewer' && (
                  <button
                    onClick={handleAddNewClick}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-emerald-500 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_#10B981] active:translate-y-px active:scale-95 transition-all cursor-pointer"
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
                    {/* Header */}
                    <div className="border-b-[4px] border-black bg-[#E63946] px-5 py-4 flex items-center justify-between text-white">
                      <h4 className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest text-white">
                        <Sparkles className="h-5 w-5 text-black animate-pulse" />
                        <span>{editingItem ? `Edit Recipe: ${editingItem.name}` : 'Compose Elegant New Item'}</span>
                      </h4>
                      <button
                        onClick={() => setIsFormOpen(false)}
                        className="rounded-lg border-2 border-black bg-black p-1 text-[#E63946] hover:bg-white hover:text-black transition-colors cursor-pointer"
                        title="Close Form"
                      >
                        <X className="h-4 w-4 stroke-[3]" />
                      </button>
                    </div>

                    <form onSubmit={handleFormSubmit} className="p-5 space-y-5 bg-white text-black">
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
                            className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946]"
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
                            className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946]"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Category Group *</label>
                          <select
                            value={itemCategory}
                            onChange={(e) => setItemCategory(e.target.value)}
                            className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946] appearance-none"
                          >
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Prep Speed *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 5-7 min"
                            value={itemPrepTime}
                            onChange={(e) => setItemPrepTime(e.target.value)}
                            className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946]"
                          />
                        </div>
                      </div>

                      {/* URL input fallback if needed */}
                      <div>
                        <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Primary Display Image URL *</label>
                        <input
                          type="url"
                          required
                          placeholder="e.g. https://images.unsplash.com/..."
                          value={itemImage}
                          onChange={(e) => setItemImage(e.target.value)}
                          className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946] mb-2"
                        />
                      </div>

                      {/* Modular Upload field Supporting multiple uploads */}
                      <ImageUploadField 
                        images={itemImages} 
                        onChange={setItemImages} 
                        primaryImage={itemImage} 
                        onPrimaryChange={setItemImage} 
                        isDarkMode={isDarkMode} 
                        triggerToast={triggerToast}
                        disabled={currentUser?.role === 'Viewer'}
                      />

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Energy (Calories)</label>
                          <input
                            type="number"
                            placeholder="650"
                            value={itemCalories}
                            onChange={(e) => setItemCalories(e.target.value)}
                            className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Spicy Tier (0 - 3)</label>
                          <select
                            value={itemSpicy}
                            onChange={(e) => setItemSpicy(e.target.value)}
                            className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black focus:border-[#E63946]"
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

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Availability Status *</label>
                          <select
                            value={itemIsAvailable ? "true" : "false"}
                            onChange={(e) => setItemIsAvailable(e.target.value === "true")}
                            className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-black text-black outline-none focus:border-[#E63946] appearance-none"
                          >
                            <option value="true">Available</option>
                            <option value="false">Out of Stock</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Prep Speed *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 5-7 min"
                            value={itemPrepTime}
                            onChange={(e) => setItemPrepTime(e.target.value)}
                            className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none"
                          />
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
                          className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">Ingredients (comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Wagyu beef, Cheddar, Bole Chili"
                          value={itemIngredients}
                          onChange={(e) => setItemIngredients(e.target.value)}
                          className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946]"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsFormOpen(false)}
                          className="rounded-xl border-2 border-black bg-black text-white px-4 py-2.5 text-xs font-black uppercase transition-all hover:bg-gray-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={currentUser?.role === 'Viewer'}
                          className="rounded-xl border-2 border-black bg-[#E63946] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all hover:bg-black hover:text-white cursor-pointer disabled:opacity-50"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filtering & Searching Row (Added filtering options to the admin item list) */}
              <div className={`rounded-2xl border-[3px] border-black p-4 flex flex-col sm:flex-row gap-3 items-center justify-between ${cardBg}`}>
                <div className="w-full sm:w-1/2">
                  <input
                    type="text"
                    placeholder="🔍 Real-time Search Recipes..."
                    value={adminSearch}
                    onChange={(e) => {
                      setAdminSearch(e.target.value);
                      setAdminPage(1); // reset to page 1
                    }}
                    className="w-full rounded-xl border-2 border-black bg-white px-4 py-2 text-xs font-black outline-none text-black"
                  />
                </div>
                <div className="w-full sm:w-1/3 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-gray-400 shrink-0 font-mono">Filter Category:</span>
                  <select
                    value={adminFilterCategory}
                    onChange={(e) => {
                      setAdminFilterCategory(e.target.value);
                      setAdminPage(1); // reset page
                    }}
                    className="w-full rounded-xl border-2 border-black bg-white text-black px-3 py-2 text-xs font-black outline-none"
                  >
                    <option value="all">All Groupings</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Catalogue Table */}
              <div className={`overflow-x-auto rounded-2xl border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_#E63946] ${cardBg}`} id="catalogue-table-holder">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-400/20 text-[10px] font-black uppercase tracking-wider text-gray-500 font-mono">
                      <th className="px-4 py-3">Dish name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Views</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-400/10 text-xs font-semibold">
                    {adminItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-500/5 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-cover border border-black/10 shrink-0" />
                            <span className={`font-black uppercase tracking-tight ${labelClass}`}>{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-black/35 px-2 py-0.5 text-[9px] font-mono text-gray-400 uppercase tracking-wider">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-mono font-black ${labelClass}`}>{item.price} Br</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-gray-400 font-bold">{item.views || 0} views</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border select-none ${
                            item.isAvailable !== false
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500'
                              : 'bg-red-500/15 border-red-500/30 text-red-500'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${item.isAvailable !== false ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                            {item.isAvailable !== false ? 'In Stock' : 'Out of stock'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditClick(item)}
                              disabled={currentUser?.role === 'Viewer'}
                              className="rounded border border-black/10 bg-black/5 p-1.5 text-amber-500 hover:bg-black/20 transition-all cursor-pointer disabled:opacity-45"
                              title="Edit specifications"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item.id, item.name)}
                              disabled={currentUser?.role === 'Viewer' || currentUser?.role === 'Editor'}
                              className="rounded border border-black/10 bg-black/5 p-1.5 text-red-500 hover:bg-black/20 transition-all cursor-pointer disabled:opacity-45"
                              title="Delete Item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* SERVER-SIDE PAGINATION CONTROL BAR */}
                <div className="mt-4 border-t border-dashed border-gray-400/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase text-gray-400 font-mono">Limit:</span>
                    <select
                      value={adminLimit}
                      onChange={(e) => {
                        setAdminLimit(parseInt(e.target.value));
                        setAdminPage(1); // reset to page 1
                      }}
                      className="rounded-lg border-2 border-black bg-white text-black px-2 py-1 text-xs font-black outline-none cursor-pointer"
                    >
                      <option value="5">5 records</option>
                      <option value="10">10 records</option>
                      <option value="20">20 records</option>
                      <option value="50">50 records</option>
                    </select>
                  </div>

                  <span className={`text-xs font-black font-mono ${labelClass}`}>
                    Page {adminPage} of {adminTotalPages} <span className="text-gray-400">({adminTotalItems} records total)</span>
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setAdminPage(p => Math.max(1, p - 1))}
                      disabled={adminPage === 1}
                      className="rounded-xl border-2 border-black bg-white text-black px-3.5 py-1.5 text-xs font-black uppercase transition-all shadow-[1.5px_1.5px_0px_0px_black] active:translate-y-px active:shadow-none hover:bg-gray-100 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed disabled:active:translate-y-0"
                    >
                      <ChevronLeft className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => setAdminPage(p => Math.min(adminTotalPages, p + 1))}
                      disabled={adminPage === adminTotalPages}
                      className="rounded-xl border-2 border-black bg-white text-black px-3.5 py-1.5 text-xs font-black uppercase transition-all shadow-[1.5px_1.5px_0px_0px_black] active:translate-y-px active:shadow-none hover:bg-gray-100 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed disabled:active:translate-y-0"
                    >
                      <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* SECTION 3: CATEGORIES LIST */}
          {activeSegment === 'categories' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-left animate-fade-in"
              id="admin-categories-section"
            >
              <div>
                <h2 className={`text-2xl font-black uppercase tracking-tight ${labelClass}`}>Menu Groupings & Categories</h2>
                <p className={`text-xs ${textMuted}`}>Create types to group items like burgers, sides, drinks and desserts.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => {
                  const count = parentItems.filter(itm => itm.category === cat.id).length;
                  return (
                    <div key={cat.id} className={`rounded-xl border-[3px] border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)] relative overflow-hidden ${cardBg}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#E63946] font-mono leading-none">
                            /{cat.id}
                          </span>
                          <h4 className={`text-base font-black mt-1 uppercase ${labelClass}`}>{cat.name}</h4>
                          <span className="inline-block mt-2 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-500">
                            {count} recipes linked
                          </span>
                        </div>
                        {currentUser?.role !== 'Viewer' && currentUser?.role !== 'Editor' && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete grouping "${cat.name}"? Recipes will not be deleted but they will lose category associations.`)) {
                                onDeleteCategory(cat.id);
                                triggerToast(`Deleted ${cat.name}`);
                              }
                            }}
                            className="rounded-lg bg-red-500/10 text-red-500 border border-red-500/15 p-1.5 hover:bg-red-500/20 transition-all shrink-0 ml-2 cursor-pointer"
                            title="Remove Category"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        )}
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
              className="space-y-6 text-left animate-fade-in"
              id="admin-feedbacks-section"
            >
              <div>
                <h2 className={`text-2xl font-black uppercase tracking-tight ${labelClass}`}>Customer Feedbacks</h2>
                <p className={`text-xs ${textMuted}`}>Read customer remarks, contact phone numbers and star ratings.</p>
              </div>

              {feedbacks.length === 0 ? (
                <div className={`rounded-2xl border-[3px] border-dashed border-gray-600 p-12 text-center max-w-sm mx-auto ${cardBg}`}>
                  <MessageSquare className="h-10 w-10 text-gray-500 mx-auto stroke-[2.5]" />
                  <h4 className={`text-sm font-black uppercase mt-4 ${labelClass}`}>No Feedbacks Received</h4>
                  <p className={`text-xs mt-1 font-semibold ${textMuted}`}>
                    As soon as customers leave reviews, they will show up here.
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
                          <span className="text-[10px] font-black uppercase tracking-wide px-2.5 py-0.5 rounded bg-black/35 text-[#E63946] border border-gray-400/10 font-mono">
                            Sender: {fb.name}
                          </span>
                          <span className="font-mono text-[10px] text-gray-500 font-bold border-l border-gray-400 pl-2">
                            {fb.timestamp}
                          </span>
                        </div>
                        
                        <p className={`text-xs font-semibold leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          "{fb.comment}"
                        </p>

                        <div className="flex gap-1 items-center font-black text-amber-500 font-mono text-[10px]">
                          Rating: {'★'.repeat(fb.rating || 5)} ({fb.rating || 5} Stars)
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <a 
                            href={`tel:${fb.phone}`}
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-black uppercase text-[#F4A261] hover:underline"
                            title="Dial sender phone"
                          >
                            📞 Call Customer: {fb.phone}
                          </a>
                        </div>
                      </div>

                      {currentUser?.role === 'Admin' && (
                        <button
                          onClick={() => {
                            if (confirm('Delete this comment registry?')) {
                              onDeleteFeedback(fb.id);
                              triggerToast('Comment removed.');
                            }
                          }}
                          className="rounded-lg bg-red-500/15 text-red-500 border border-red-500/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider hover:bg-red-500/25 transition-all shrink-0 leading-none cursor-pointer"
                        >
                          Delete Log
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* SECTION 5: QR CODE MENU LINK HUB (MODULARIZED) */}
          {activeSegment === 'qr-code' && (
            <QrCodeHub isDarkMode={isDarkMode} triggerToast={triggerToast} />
          )}

          {/* SECTION 6: DASHBOARD INSIGHTS (RECHARTS INTEGRATION) (MODULARIZED) */}
          {activeSegment === 'insights' && (
            <AdminInsights items={parentItems} feedbacks={feedbacks} isDarkMode={isDarkMode} stats={stats} />
          )}

          {/* SECTION 7: EMPLOYEE MANAGEMENT (MODULARIZED) */}
          {activeSegment === 'employees' && (
            <EmployeeManagement currentUser={currentUser} isDarkMode={isDarkMode} triggerToast={triggerToast} />
          )}

        </main>
      </div>

      {/* SECURE PASSWORD CHANGE DIALOG MODAL */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-fade-in" id="password-change-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl border-[3.5px] border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(244,162,97,0.85)] text-black"
            >
              <div className="flex justify-between items-center border-b-2 border-dashed border-gray-200 pb-3 mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#E63946] flex items-center gap-1.5">
                  <Key className="h-4.5 w-4.5" />
                  Update Credentials
                </h3>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="text-gray-400 hover:text-black cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 text-left">
                {passwordError && (
                  <div className="rounded-lg border border-red-500 bg-red-400/10 p-2.5 text-xs font-bold text-red-500 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Enter new secure password"
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Re-type new secure password"
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-black outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="rounded-xl border-2 border-black bg-black text-white px-4 py-2 text-xs font-black uppercase hover:bg-gray-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl border-2 border-black bg-[#E63946] text-white px-5 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_black] cursor-pointer"
                  >
                    Update Key
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
