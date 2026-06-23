# 🍔 Wow Burger — Digital Menu & Admin Platform

A full-stack restaurant web app for **Wow Burger**, a gourmet smash burger restaurant based in Addis Ababa, Ethiopia. Built with React 19, TypeScript, Tailwind CSS v4, Vite, and an Express.js backend — featuring a rich customer-facing digital menu and a powerful admin dashboard.

---

## ✨ Features

### 🧑‍🍽️ Customer Experience
- **Animated Onboarding Carousel** — hero showcase slides for featured items
- **Dynamic Menu Grid** — filterable by category (Burgers, Sides, Drinks, Specials, etc.)
- **Item Detail View** — full ingredient list, calorie info, prep time, spice level, and multi-image carousel
- **Star Rating System** — customers can rate any menu item; ratings persist per-item
- **Favorites** — save and browse favorite items with a live badge count
- **Contact & Feedback** — submit comments/reviews with name and phone number
- **Dark / Light Mode** — defaults to dark mode per Wow Burger brand guidelines; preference saved in `localStorage`
- **Mobile Bottom Nav Bar** — sticky navigation for Home, Food, Drinks, Specials, and Favorites on mobile
- **Framer Motion Animations** — smooth page transitions and micro-interactions throughout

### 🔐 Admin Panel
- **Secure Login** — username/password authentication via Express API; session persisted in `sessionStorage`
- **Role-Based Access** — Admin, Editor, and Viewer roles with differentiated permissions
- **Menu Item CMS** — add, edit, delete menu items with image upload (base64), pricing, availability toggle, ingredients, and more
- **Category Management** — create and delete menu categories with Lucide icon picker
- **Feedback Management** — view and delete customer feedback/comments
- **Employee Management** — add, edit, and remove staff accounts with role assignment and password management
- **Admin Insights Dashboard** — Recharts-powered bar and line charts showing item views, ratings, popularity scores, and category distributions
- **QR Code Hub** — generate, download, copy, and print QR codes pointing to the live menu URL
- **Password Change** — in-panel modal for changing login passwords securely

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Animations | Motion (Framer Motion) |
| Icons | Lucide React |
| Charts | Recharts |
| QR Codes | `qrcode` npm package |
| Backend | Express.js (TypeScript via `tsx`) |
| Bundler | Vite 6 |
| Database | Flat-file JSON (`db.json`) |
| AI Integration | Google Gemini API (`@google/genai`) |

---

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/wow-burger.git
cd wow-burger

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY if using AI features
```

### Development

```bash
npm run dev
```

This starts the full-stack server (Express + Vite middleware) at **http://localhost:3000**

### Production Build

```bash
# Build frontend and bundle the server
npm run build

# Start production server
npm start
```

---

## 🔌 API Endpoints

The Express backend exposes the following REST API:

### Menu Items
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/items` | Get paginated/filtered menu items |
| `POST` | `/api/items` | Create a new menu item |
| `PUT` | `/api/items/:id` | Update an existing menu item |
| `DELETE` | `/api/items/:id` | Delete a menu item |
| `POST` | `/api/items/:id/view` | Increment view count (analytics) |

### Categories
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | Get all categories |
| `POST` | `/api/categories` | Create a category |
| `DELETE` | `/api/categories/:id` | Delete a category |

### Feedback
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/feedbacks` | Get all customer feedback |
| `POST` | `/api/feedbacks` | Submit new feedback |
| `DELETE` | `/api/feedbacks/:id` | Delete a feedback entry |

### Employees
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/employees` | Get all employees |
| `POST` | `/api/employees` | Add a new employee |
| `PUT` | `/api/employees/:id` | Update an employee |
| `DELETE` | `/api/employees/:id` | Remove an employee |

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login with username + password |
| `POST` | `/api/auth/change-password` | Change a user's password |

### Upload
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload a base64 image; returns `/uploads/<filename>` URL |

---

## 🔐 Default Admin Credentials

| Username | Password | Role |
|---|---|---|
| `admin` | `admin` | Admin |
| `samson` | `samson` | Editor |
| `helen` | `helen` | Viewer |

> ⚠️ **Change default passwords immediately after first login** using the in-panel password change modal.

---

## 💾 Data Persistence

- **`db.json`** — auto-generated flat-file database on first server start; stores all items, categories, feedbacks, employees, and hashed passwords. Add this to `.gitignore` if you don't want to commit live data.
- **`localStorage`** — used on the client side to cache dark mode preference, favorites, and menu state for offline resilience.
- **`/uploads/`** — directory for uploaded item images; served statically at `/uploads/<filename>`.

---

## 🌍 Restaurant Info

**Wow Burger Gourmet** — Addis Ababa, Ethiopia

- 📍 Bole Branch — Adjacent to Edna Mall, Cameroon St, Addis Ababa
- 📞 +251 911 234567
- 📧 hello@wowburger.et
- 🕙 Open Daily: 10:00 AM – 10:00 PM
- Instagram: [@wowburger.et](https://instagram.com/wowburger.et)
- Telegram: [t.me/wowburger_ethiopia](https://t.me/wowburger_ethiopia)
- Facebook: [facebook.com/wowburger.et](https://facebook.com/wowburger.et)

---

## 📄 License

Licensed under the [Apache 2.0 License](./LICENSE).

---

> Built with ❤️ in Bole, Addis Ababa.
