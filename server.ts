import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Load initial types and data
import { INITIAL_MENU_ITEMS, INITIAL_CATEGORIES } from './src/data';
import { MenuItem, Category, CommentFeedback, Employee } from './src/types';

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Set JSON and URLencoded limits for base64 image uploading
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

interface DBStructure {
  items: MenuItem[];
  categories: Category[];
  feedbacks: CommentFeedback[];
  employees: Employee[];
  passwords: Record<string, string>; // Maps employee email/username to password
}

// Initialize db.json if not present
function loadDatabase(): DBStructure {
  if (!fs.existsSync(DB_PATH)) {
    const defaultComments: CommentFeedback[] = [
      {
        id: 'fb-1',
        name: 'Yared Shimelis',
        phone: '+251 911 44 5566',
        comment: 'The double crispy cheese smash burger is easily the best in Addis Ababa! High-density bun of exceptional quality.',
        timestamp: 'Jun 14, 2026, 06:30 PM',
        rating: 5
      },
      {
        id: 'fb-2',
        name: 'Helen Kebede',
        phone: '+251 922 12 3456',
        comment: 'Loving the quick prep speed. Bole flagships adjacent to Edna Mall are beautiful is always cozy.',
        timestamp: 'Jun 15, 2026, 10:15 AM',
        rating: 4
      }
    ];

    const defaultEmployees: Employee[] = [
      { id: 'emp-1', name: 'Bole Administrator', email: 'admin', role: 'Admin', isAvailable: true },
      { id: 'emp-2', name: 'Samson Kebede', email: 'samson', role: 'Editor', isAvailable: true },
      { id: 'emp-3', name: 'Helen Kebede', email: 'helen', role: 'Viewer', isAvailable: true }
    ];

    const defaultPasswords: Record<string, string> = {
      'admin': 'admin',
      'samson': 'samson',
      'helen': 'helen'
    };

    const seededItems = INITIAL_MENU_ITEMS.map((item, index) => ({
      ...item,
      images: [item.image],
      views: Math.floor(Math.random() * 320) + 40, // realistic starting view counts
      ratings: item.ratings || [5, 4, 5]
    }));

    const initialDB: DBStructure = {
      items: seededItems,
      categories: INITIAL_CATEGORIES,
      feedbacks: defaultComments,
      employees: defaultEmployees,
      passwords: defaultPasswords
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2), 'utf8');
    return initialDB;
  }

  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw) as DBStructure;
    
    // Ensure all items have images array and views
    let updated = false;
    if (parsed.items) {
      parsed.items = parsed.items.map(item => {
        let editItem = false;
        if (!item.images || item.images.length === 0) {
          item.images = [item.image];
          editItem = true;
        }
        if (item.views === undefined) {
          item.views = Math.floor(Math.random() * 100) + 10;
          editItem = true;
        }
        if (editItem) updated = true;
        return item;
      });
    }

    if (updated) {
      fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), 'utf8');
    }

    return parsed;
  } catch (e) {
    console.error('Error reading db.json, returning empty structure', e);
    return { items: [], categories: [], feedbacks: [], employees: [], passwords: {} };
  }
}

function saveDatabase(db: DBStructure) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Menu Items Endpoint (Paginated & Filtered)
app.get('/api/items', (req, res) => {
  const db = loadDatabase();
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const search = (req.query.search as string || '').toLowerCase().trim();
  const category = req.query.category as string || 'all';

  let filteredItems = db.items;

  // Filter by category
  if (category !== 'all') {
    filteredItems = filteredItems.filter(item => item.category === category);
  }

  // Filter by search query
  if (search) {
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(search) || 
      item.description.toLowerCase().includes(search) ||
      item.ingredients.some(i => i.toLowerCase().includes(search))
    );
  }

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + limit);

  res.json({
    items: paginatedItems,
    allItems: db.items, // returned for client-side search/detail fallbacks if needed
    pagination: {
      page,
      limit,
      totalItems,
      totalPages
    }
  });
});

// Create/Add Menu Item
app.post('/api/items', (req, res) => {
  const db = loadDatabase();
  const newItem: MenuItem = req.body;
  
  if (!newItem.id) {
    newItem.id = 'b' + Date.now();
  }
  if (!newItem.images || newItem.images.length === 0) {
    newItem.images = [newItem.image];
  }
  if (newItem.views === undefined) {
    newItem.views = 0;
  }
  if (!newItem.ratings) {
    newItem.ratings = [5];
  }

  db.items.push(newItem);
  saveDatabase(db);
  res.status(201).json(newItem);
});

// Update Menu Item
app.put('/api/items/:id', (req, res) => {
  const db = loadDatabase();
  const itemId = req.params.id;
  const updatedData = req.body;

  const index = db.items.findIndex(item => item.id === itemId);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const currentItem = db.items[index];
  const mergedItem = {
    ...currentItem,
    ...updatedData,
    images: updatedData.images || currentItem.images || [updatedData.image || currentItem.image]
  };

  db.items[index] = mergedItem;
  saveDatabase(db);
  res.json(mergedItem);
});

// Delete Menu Item
app.delete('/api/items/:id', (req, res) => {
  const db = loadDatabase();
  const itemId = req.params.id;

  const initialLength = db.items.length;
  db.items = db.items.filter(item => item.id !== itemId);
  
  if (db.items.length === initialLength) {
    return res.status(404).json({ error: 'Item not found' });
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Item deleted successfully' });
});

// Increment View Count (Analytics track views)
app.post('/api/items/:id/view', (req, res) => {
  const db = loadDatabase();
  const itemId = req.params.id;

  const item = db.items.find(i => i.id === itemId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  item.views = (item.views || 0) + 1;
  saveDatabase(db);
  res.json({ success: true, id: itemId, views: item.views });
});

// 2. Categories Endpoints
app.get('/api/categories', (req, res) => {
  const db = loadDatabase();
  res.json(db.categories);
});

app.post('/api/categories', (req, res) => {
  const db = loadDatabase();
  const newCat: Category = req.body;
  
  if (db.categories.some(c => c.id === newCat.id)) {
    return res.status(400).json({ error: 'Category ID already exists' });
  }

  db.categories.push(newCat);
  saveDatabase(db);
  res.status(201).json(newCat);
});

app.delete('/api/categories/:id', (req, res) => {
  const db = loadDatabase();
  const catId = req.params.id;

  db.categories = db.categories.filter(c => c.id !== catId);
  saveDatabase(db);
  res.json({ success: true });
});

// 3. Feedback Comments Endpoints
app.get('/api/feedbacks', (req, res) => {
  const db = loadDatabase();
  res.json(db.feedbacks);
});

app.post('/api/feedbacks', (req, res) => {
  const db = loadDatabase();
  const newFeedback: CommentFeedback = req.body;
  if (!newFeedback.id) {
    newFeedback.id = 'fb-' + Date.now();
  }
  db.feedbacks.unshift(newFeedback); // Newest first
  saveDatabase(db);
  res.status(201).json(newFeedback);
});

app.delete('/api/feedbacks/:id', (req, res) => {
  const db = loadDatabase();
  const feedbackId = req.params.id;

  db.feedbacks = db.feedbacks.filter(f => f.id !== feedbackId);
  saveDatabase(db);
  res.json({ success: true });
});

// 4. Base64 Image Upload Endpoint
app.post('/api/upload', (req, res) => {
  const { filename, base64 } = req.body;
  if (!filename || !base64) {
    return res.status(400).json({ error: 'Filename and base64 fields are required.' });
  }

  try {
    // Strip headers if they exist (e.g., data:image/png;base64,)
    const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    
    // Create unique filename to prevent collisons
    const ext = path.extname(filename) || '.png';
    const baseName = path.basename(filename, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueFilename = `${baseName}_${Date.now()}${ext}`;
    
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${uniqueFilename}`;
    res.json({ url: relativeUrl });
  } catch (err: any) {
    console.error('Upload fail:', err);
    res.status(500).json({ error: 'Failed to write file. ' + err.message });
  }
});

// 5. Employee Management Endpoints
app.get('/api/employees', (req, res) => {
  const db = loadDatabase();
  res.json(db.employees);
});

app.post('/api/employees', (req, res) => {
  const db = loadDatabase();
  const newEmp: Employee & { password?: string } = req.body;

  if (!newEmp.id) {
    newEmp.id = 'emp-' + Date.now();
  }

  // Check unique email/username
  if (db.employees.some(e => e.email === newEmp.email)) {
    return res.status(400).json({ error: 'An employee with this email or username already exists' });
  }

  const { password, ...employeeObject } = newEmp;
  
  db.employees.push(employeeObject);
  db.passwords[newEmp.email] = password || newEmp.email; // Default password to email if not provided
  
  saveDatabase(db);
  res.status(201).json(employeeObject);
});

app.put('/api/employees/:id', (req, res) => {
  const db = loadDatabase();
  const empId = req.params.id;
  const updatedData: Partial<Employee> = req.body;

  const index = db.employees.findIndex(e => e.id === empId);
  if (index === -1) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  const currentEmp = db.employees[index];
  
  // If email changes, make sure to migrate password
  if (updatedData.email && updatedData.email !== currentEmp.email) {
    if (db.employees.some(e => e.email === updatedData.email && e.id !== empId)) {
      return res.status(400).json({ error: 'Username/Email already taken by another employee' });
    }
    const oldPassword = db.passwords[currentEmp.email] || currentEmp.email;
    db.passwords[updatedData.email] = oldPassword;
    delete db.passwords[currentEmp.email];
  }

  const merged = { ...currentEmp, ...updatedData };
  db.employees[index] = merged;
  
  saveDatabase(db);
  res.json(merged);
});

app.delete('/api/employees/:id', (req, res) => {
  const db = loadDatabase();
  const empId = req.params.id;

  const emp = db.employees.find(e => e.id === empId);
  if (!emp) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  db.employees = db.employees.filter(e => e.id !== empId);
  delete db.passwords[emp.email];
  
  saveDatabase(db);
  res.json({ success: true });
});

// 6. Auth Login Endpoint
app.post('/api/auth/login', (req, res) => {
  const { username: reqUsername, password: reqPassword } = req.body;
  if (!reqUsername || !reqPassword) {
    return res.status(400).json({ error: 'Username/Email and password are required' });
  }

  const db = loadDatabase();
  const cleanUser = reqUsername.trim();
  const cleanPass = reqPassword.trim();

  // Check password store
  const storedPass = db.passwords[cleanUser];
  if (storedPass && storedPass === cleanPass) {
    // Check if it is standard admin
    if (cleanUser === 'admin') {
      return res.json({
        user: { id: 'emp-1', name: 'Bole Administrator', email: 'admin', role: 'Admin', isAvailable: true },
        success: true
      });
    }

    // Check if they are listed in employees
    const emp = db.employees.find(e => e.email === cleanUser);
    if (emp) {
      return res.json({
        user: emp,
        success: true
      });
    }

    // Fallback if they are in passwords list but not employees (e.g. freshly deleted but left-over, shouldn't happen)
    return res.json({
      user: { id: 'emp-generic', name: cleanUser, email: cleanUser, role: 'Viewer', isAvailable: true },
      success: true
    });
  }

  // Double check hardcoded admin default fallback
  if (cleanUser === 'admin' && cleanPass === 'admin') {
    return res.json({
      user: { id: 'emp-1', name: 'Bole Administrator', email: 'admin', role: 'Admin', isAvailable: true },
      success: true
    });
  }

  res.status(401).json({ error: 'Invalid username or password!' });
});

// 7. Auth Change Password Endpoint
app.post('/api/auth/change-password', (req, res) => {
  const { username: reqUsername, currentPassword, newPassword } = req.body;
  if (!reqUsername || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing password fields' });
  }

  const db = loadDatabase();
  const storedPass = db.passwords[reqUsername] || (reqUsername === 'admin' ? 'admin' : null);

  if (!storedPass || storedPass !== currentPassword) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  db.passwords[reqUsername] = newPassword;
  saveDatabase(db);
  res.json({ success: true, message: 'Password updated successfully!' });
});


// ==========================================
// FRONTEND BINDING VIA VITE MIDDLEWARE / STATIC
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wow Burger Full-Stack dev server started on http://localhost:${PORT}`);
  });
}

startServer();
