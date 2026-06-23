/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[]; // Multiple images for carousel
  category: string; // 'burgers' | 'sides' | 'drinks' | 'desserts'
  ingredients: string[];
  calories: number;
  prepTime: string; // e.g. "5-7 min"
  spicyLevel?: number; // 0, 1, 2, 3
  isPopular?: boolean;
  isVegetarian?: boolean;
  ratings?: number[]; // rating array e.g. [5, 4, 5, 3]
  isAvailable?: boolean;
  views?: number; // item view counts for analytics
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // Lucide icon string identifier
}

export interface CommentFeedback {
  id: string;
  name: string;
  phone: string;
  comment: string;
  timestamp: string;
  rating?: number; // optional general experience rating
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  isAvailable?: boolean;
}

export type AppView = 'user-menu' | 'user-detail' | 'admin' | 'contact' | 'favorites';

export type AdminSection = 'dashboard' | 'menu-items' | 'categories' | 'feedbacks' | 'qr-code' | 'insights' | 'employees';

