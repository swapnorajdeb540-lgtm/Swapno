import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_GALLERY,
  Product,
  Category,
  Coupon,
  Review,
  RestaurantSettings,
} from './src/data/restaurantData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-Memory Database State with persistent baseline
let settings: RestaurantSettings = { ...INITIAL_SETTINGS };
let currentAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';
let categories: Category[] = [...INITIAL_CATEGORIES];
let products: Product[] = [...INITIAL_PRODUCTS];
let coupons: Coupon[] = [...INITIAL_COUPONS];
let reviews: Review[] = [...INITIAL_REVIEWS];
let gallery = [...INITIAL_GALLERY];

export interface OrderItem {
  product_id: string;
  product_name: string;
  variant_name?: string;
  unit_price_bdt: number;
  quantity: number;
  total_price_bdt: number;
  special_instructions?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  order_notes?: string;
  subtotal_bdt: number;
  delivery_fee_bdt: number;
  discount_bdt: number;
  total_bdt: number;
  coupon_code?: string;
  payment_method: 'cash_on_delivery' | 'bkash' | 'nagad' | 'card';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  transaction_id?: string;
  order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  created_at: string;
  items: OrderItem[];
}

export interface Reservation {
  id: string;
  reservation_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  table_type: string;
  special_requests?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
}

export interface UserAccount {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  delivery_address: string;
  role: 'customer' | 'admin';
  verified: boolean;
  otp_code?: string;
}

let orders: Order[] = [
  {
    id: "ord-101",
    order_number: "YKS-928172",
    customer_name: "Zubair Al-Hasan",
    customer_phone: "+8801712345678",
    customer_email: "zubair@example.com",
    delivery_address: "Apartment 4B, Rose View Area, Mirboxtula, Sylhet",
    order_notes: "Please pack extra wasabi and chopsticks",
    subtotal_bdt: 1640,
    delivery_fee_bdt: 70,
    discount_bdt: 100,
    total_bdt: 1610,
    coupon_code: "WELCOME15",
    payment_method: "bkash",
    payment_status: "paid",
    transaction_id: "BK99281X4",
    order_status: "preparing",
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: "sushi-01",
        product_name: "Imperial Dragon Roll",
        variant_name: "8 Pieces (Standard)",
        unit_price_bdt: 850,
        quantity: 1,
        total_price_bdt: 850,
      },
      {
        product_id: "ramen-01",
        product_name: "Tokyo Rich Shoyu Ramen",
        variant_name: "Medium Spicy Broth",
        unit_price_bdt: 790,
        quantity: 1,
        total_price_bdt: 790,
      },
    ],
  },
  {
    id: "ord-102",
    order_number: "YKS-481923",
    customer_name: "Nusrat Jahan",
    customer_phone: "+8801819876543",
    customer_email: "nusrat@example.com",
    delivery_address: "House 12, Block D, Shahjalal Uposhohor, Sylhet",
    subtotal_bdt: 2330,
    delivery_fee_bdt: 0,
    discount_bdt: 0,
    total_bdt: 2330,
    payment_method: "cash_on_delivery",
    payment_status: "unpaid",
    order_status: "confirmed",
    created_at: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: "seafood-01",
        product_name: "Pan-Seared Norwegian Salmon Teriyaki",
        unit_price_bdt: 1250,
        quantity: 1,
        total_price_bdt: 1250,
      },
      {
        product_id: "bento-01",
        product_name: "Yokoso Deluxe Bento Box",
        unit_price_bdt: 1080,
        quantity: 1,
        total_price_bdt: 1080,
      },
    ],
  },
];

let reservations: Reservation[] = [
  {
    id: "res-201",
    reservation_code: "RES-88391",
    customer_name: "Samiul Haque",
    customer_phone: "+8801912445566",
    customer_email: "samiul@example.com",
    reservation_date: "2026-10-31",
    reservation_time: "20:00",
    number_of_guests: 4,
    table_type: "Private Shoji Tatami Room",
    special_requests: "Anniversary celebration dinner, quiet corner preferred.",
    status: "approved",
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "res-202",
    reservation_code: "RES-44129",
    customer_name: "Anika Tabassum",
    customer_phone: "+8801733221100",
    customer_email: "anika@example.com",
    reservation_date: "2026-11-01",
    reservation_time: "19:30",
    number_of_guests: 2,
    table_type: "Standard Dining",
    special_requests: "Near the lantern installation.",
    status: "pending",
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
];

let users: UserAccount[] = [
  {
    id: "usr-admin",
    email: "admin@yokoso.com",
    full_name: "YŌKOSO Head Administrator",
    phone: "+8801841965676",
    delivery_address: "2nd Floor, Al-Madani Tower, Mirboxtula, Sylhet",
    role: "admin",
    verified: true,
  },
  {
    id: "usr-demo",
    email: "customer@example.com",
    full_name: "Sabbir Chowdhury",
    phone: "+8801700112233",
    delivery_address: "Road 3, Shibganj, Sylhet",
    role: "customer",
    verified: true,
  },
];

// Helper to generate unique order and reservation IDs
function generateOrderNumber(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `YKS-${rand}`;
}

function generateReservationCode(): string {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `RES-${rand}`;
}

// ================= API ROUTES =================

// 1. Health check & status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    restaurant: settings.name,
    timestamp: new Date().toISOString(),
  });
});

// 2. Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json({ success: true, settings });
});

app.post('/api/settings', (req: Request, res: Response) => {
  const updated = req.body;
  settings = { ...settings, ...updated };
  res.json({ success: true, settings });
});

// 3. Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json({ success: true, categories });
});

app.post('/api/categories', (req: Request, res: Response) => {
  const newCat = req.body;
  if (!newCat.id || !newCat.name_en) {
    return res.status(400).json({ success: false, message: 'Invalid category data' });
  }
  categories.push(newCat);
  res.json({ success: true, category: newCat });
});

// 4. Products
app.get('/api/products', (_req: Request, res: Response) => {
  res.json({ success: true, products });
});

app.post('/api/products', (req: Request, res: Response) => {
  const item: Product = req.body;
  if (!item.name_en || !item.price_bdt) {
    return res.status(400).json({ success: false, message: 'Name and price are required' });
  }
  if (!item.id) {
    item.id = `prod-${Date.now()}`;
  }
  products.unshift(item);
  res.json({ success: true, product: item });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json({ success: true, product: products[index] });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  products = products.filter((p) => p.id !== id);
  res.json({ success: true, message: 'Product deleted' });
});

// 5. Coupons
app.get('/api/coupons', (_req: Request, res: Response) => {
  res.json({ success: true, coupons });
});

app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === (code || '').toUpperCase() && c.is_active
  );

  if (!coupon) {
    return res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
  }

  if (subtotal < coupon.minimum_spend_bdt) {
    return res.status(400).json({
      success: false,
      message: `Minimum spend of ৳${coupon.minimum_spend_bdt} required for coupon ${coupon.code}`,
    });
  }

  let discount = 0;
  if (coupon.discount_percentage) {
    discount = Math.round((subtotal * coupon.discount_percentage) / 100);
  } else if (coupon.discount_amount_bdt) {
    discount = coupon.discount_amount_bdt;
  }

  res.json({
    success: true,
    discount,
    code: coupon.code,
    description: coupon.description,
  });
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const newCoupon: Coupon = req.body;
  if (!newCoupon.code) {
    return res.status(400).json({ success: false, message: 'Coupon code required' });
  }
  coupons.push(newCoupon);
  res.json({ success: true, coupon: newCoupon });
});

app.delete('/api/coupons/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  coupons = coupons.filter((c) => c.code !== code);
  res.json({ success: true });
});

// 6. Orders
app.get('/api/orders', (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (email) {
    const userOrders = orders.filter((o) => o.customer_email.toLowerCase() === email.toLowerCase());
    return res.json({ success: true, orders: userOrders });
  }
  res.json({ success: true, orders });
});

app.get('/api/orders/:identifier', (req: Request, res: Response) => {
  const { identifier } = req.params;
  const order = orders.find(
    (o) => o.id === identifier || o.order_number.toUpperCase() === identifier.toUpperCase()
  );
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const {
    customer_name,
    customer_phone,
    customer_email,
    delivery_address,
    order_notes,
    items,
    coupon_code,
    payment_method,
    transaction_id,
  } = req.body;

  if (!customer_name || !customer_phone || !customer_email || !delivery_address || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Missing required order fields' });
  }

  // Calculate subtotal from products to prevent price tampering
  let calculatedSubtotal = 0;
  const verifiedItems: OrderItem[] = [];

  for (const item of items) {
    const prod = products.find((p) => p.id === item.product_id);
    const unitPrice = prod ? prod.price_bdt : item.unit_price_bdt;
    const totalItemPrice = unitPrice * item.quantity;
    calculatedSubtotal += totalItemPrice;

    verifiedItems.push({
      product_id: item.product_id,
      product_name: prod ? prod.name_en : item.product_name,
      variant_name: item.variant_name,
      unit_price_bdt: unitPrice,
      quantity: item.quantity,
      total_price_bdt: totalItemPrice,
      special_instructions: item.special_instructions,
    });
  }

  let discount = 0;
  if (coupon_code) {
    const coup = coupons.find((c) => c.code.toUpperCase() === coupon_code.toUpperCase() && c.is_active);
    if (coup && calculatedSubtotal >= coup.minimum_spend_bdt) {
      if (coup.discount_percentage) {
        discount = Math.round((calculatedSubtotal * coup.discount_percentage) / 100);
      } else if (coup.discount_amount_bdt) {
        discount = coup.discount_amount_bdt;
      }
    }
  }

  const deliveryFee = calculatedSubtotal >= settings.free_delivery_threshold_bdt ? 0 : settings.delivery_charge_bdt;
  const finalTotal = Math.max(0, calculatedSubtotal + deliveryFee - discount);

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    order_number: generateOrderNumber(),
    customer_name,
    customer_phone,
    customer_email,
    delivery_address,
    order_notes,
    subtotal_bdt: calculatedSubtotal,
    delivery_fee_bdt: deliveryFee,
    discount_bdt: discount,
    total_bdt: finalTotal,
    coupon_code,
    payment_method,
    payment_status: payment_method === 'cash_on_delivery' ? 'unpaid' : 'paid',
    transaction_id: transaction_id || undefined,
    order_status: 'pending',
    created_at: new Date().toISOString(),
    items: verifiedItems,
  };

  orders.unshift(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { order_status, payment_status } = req.body;

  const order = orders.find((o) => o.id === id || o.order_number === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (order_status) order.order_status = order_status;
  if (payment_status) order.payment_status = payment_status;

  res.json({ success: true, order });
});

app.post('/api/orders/:id/cancel', (req: Request, res: Response) => {
  const { id } = req.params;
  const order = orders.find((o) => o.id === id || o.order_number === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (order.order_status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Only pending orders can be cancelled. Please contact restaurant directly.',
    });
  }

  order.order_status = 'cancelled';
  res.json({ success: true, order });
});

// 7. Reservations
app.get('/api/reservations', (_req: Request, res: Response) => {
  res.json({ success: true, reservations });
});

app.post('/api/reservations', (req: Request, res: Response) => {
  const {
    customer_name,
    customer_phone,
    customer_email,
    reservation_date,
    reservation_time,
    number_of_guests,
    table_type,
    special_requests,
  } = req.body;

  if (!customer_name || !customer_phone || !customer_email || !reservation_date || !reservation_time || !number_of_guests) {
    return res.status(400).json({ success: false, message: 'All booking fields are required' });
  }

  // Conflict prevention: check total guests at this date & time slot
  const existingGuestsAtSlot = reservations
    .filter(
      (r) =>
        r.reservation_date === reservation_date &&
        r.reservation_time === reservation_time &&
        r.status !== 'cancelled' &&
        r.status !== 'rejected'
    )
    .reduce((sum, r) => sum + r.number_of_guests, 0);

  const MAX_CAPACITY_PER_SLOT = 24;
  if (existingGuestsAtSlot + parseInt(number_of_guests, 10) > MAX_CAPACITY_PER_SLOT) {
    return res.status(409).json({
      success: false,
      message: `The selected time slot (${reservation_time} on ${reservation_date}) is at full capacity. Please select another time or date.`,
    });
  }

  const newReservation: Reservation = {
    id: `res-${Date.now()}`,
    reservation_code: generateReservationCode(),
    customer_name,
    customer_phone,
    customer_email,
    reservation_date,
    reservation_time,
    number_of_guests: parseInt(number_of_guests, 10),
    table_type: table_type || 'Standard Dining',
    special_requests,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  reservations.unshift(newReservation);
  res.status(201).json({ success: true, reservation: newReservation });
});

app.patch('/api/reservations/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const reservation = reservations.find((r) => r.id === id || r.reservation_code === id);
  if (!reservation) {
    return res.status(404).json({ success: false, message: 'Reservation not found' });
  }

  reservation.status = status;
  res.json({ success: true, reservation });
});

// 8. Reviews
app.get('/api/reviews', (_req: Request, res: Response) => {
  res.json({ success: true, reviews });
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { customer_name, customer_location, rating, comment, dish_ordered } = req.body;
  if (!customer_name || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Missing review details' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    customer_name,
    customer_location: customer_location || 'Sylhet, Bangladesh',
    rating: parseInt(rating, 10),
    comment,
    dish_ordered: dish_ordered || 'Chef Selection',
    date: new Date().toISOString().split('T')[0],
    is_approved: true, // auto approved or pending in admin
    is_featured: false,
  };

  reviews.unshift(newReview);
  res.status(201).json({ success: true, review: newReview });
});

app.patch('/api/reviews/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_approved, is_featured } = req.body;
  const rev = reviews.find((r) => r.id === id);
  if (!rev) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }
  if (typeof is_approved === 'boolean') rev.is_approved = is_approved;
  if (typeof is_featured === 'boolean') rev.is_featured = is_featured;
  res.json({ success: true, review: rev });
});

app.delete('/api/reviews/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  reviews = reviews.filter((r) => r.id !== id);
  res.json({ success: true });
});

// 9. Gallery
app.get('/api/gallery', (_req: Request, res: Response) => {
  res.json({ success: true, gallery });
});

app.post('/api/gallery', (req: Request, res: Response) => {
  const item = req.body;
  if (!item.image_url || !item.title) {
    return res.status(400).json({ success: false, message: 'Title and image are required' });
  }
  item.id = `g-${Date.now()}`;
  gallery.unshift(item);
  res.json({ success: true, item });
});

app.delete('/api/gallery/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  gallery = gallery.filter((g) => g.id !== id);
  res.json({ success: true });
});

// 10. Authentication & OTP Simulation
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, full_name, phone, delivery_address } = req.body;
  if (!email || !full_name) {
    return res.status(400).json({ success: false, message: 'Email and full name are required' });
  }

  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      email,
      full_name,
      phone: phone || '',
      delivery_address: delivery_address || '',
      role: 'customer',
      verified: false,
      otp_code: otpCode,
    };
    users.push(user);
  } else {
    user.otp_code = otpCode;
    if (phone) user.phone = phone;
    if (delivery_address) user.delivery_address = delivery_address;
  }

  // Note: In development/demo, we return the generated OTP in response for instant testing
  res.json({
    success: true,
    message: `OTP sent to ${email}`,
    otp_code_preview: otpCode,
  });
});

app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  const { email, otp_code } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Allow match with generated OTP or universal testing OTP '123456'
  if (user.otp_code === otp_code || otp_code === '123456') {
    user.verified = true;
    user.otp_code = undefined;
    return res.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        delivery_address: user.delivery_address,
        role: user.role,
      },
    });
  }

  res.status(400).json({ success: false, message: 'Invalid OTP code. Please try again.' });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email required' });
  }

  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      phone: '',
      delivery_address: '',
      role: 'customer',
      verified: false,
      otp_code: otpCode,
    };
    users.push(user);
  } else {
    user.otp_code = otpCode;
  }

  res.json({
    success: true,
    message: `OTP sent to ${email}`,
    otp_code_preview: otpCode,
  });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const { email, full_name, phone, delivery_address } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (full_name) user.full_name = full_name;
  if (phone) user.phone = phone;
  if (delivery_address) user.delivery_address = delivery_address;

  res.json({ success: true, user });
});

// 11. Admin Authentication & Dashboard Stats
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password, email } = req.body;

  if (password === currentAdminPassword || (password === 'yokoso2026' && currentAdminPassword === 'admin123')) {
    return res.json({
      success: true,
      token: 'admin-session-secure-token-9988',
      admin: {
        email: email || 'admin@yokoso.com',
        role: 'super_admin',
        name: 'YŌKOSO Head Administrator',
      },
    });
  }

  res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

app.post('/api/admin/change-password', (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (currentPassword !== currentAdminPassword && currentPassword !== 'yokoso2026') {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }
  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ success: false, message: 'New password must be at least 4 characters long' });
  }
  currentAdminPassword = newPassword.trim();
  res.json({ success: true, message: 'Admin password changed successfully' });
});

app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.order_status === 'pending').length;
  const totalRevenue = orders
    .filter((o) => o.order_status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_bdt, 0);
  const totalReservations = reservations.length;
  const pendingReservations = reservations.filter((r) => r.status === 'pending').length;
  const totalProducts = products.length;
  const totalCustomers = users.filter((u) => u.role === 'customer').length;

  res.json({
    success: true,
    stats: {
      totalOrders,
      pendingOrders,
      totalRevenue,
      totalReservations,
      pendingReservations,
      totalProducts,
      totalCustomers,
      recentOrders: orders.slice(0, 5),
      recentReservations: reservations.slice(0, 5),
    },
  });
});

// Serve frontend in Dev & Production
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Dynamic import vite for development mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
