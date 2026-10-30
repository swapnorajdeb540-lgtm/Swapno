import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Calendar,
  Tag,
  Star,
  Settings,
  Image as ImageIcon,
  Lock,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  X,
  Clock,
  Search,
  Phone,
  MapPin,
  RefreshCw,
  LogOut,
  ChevronRight,
  CreditCard,
  Globe,
  KeyRound,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Product, Category, Coupon, Review, RestaurantSettings } from '../data/restaurantData.ts';
import { Order, Reservation } from '../../server.ts';

interface AdminDashboardProps {
  categories: Category[];
  products: Product[];
  settings?: RestaurantSettings | null;
  onRefreshData: () => void;
  onRefreshSettings?: () => void;
}

export function AdminDashboard({
  categories,
  products,
  settings: initialSettings,
  onRefreshData,
  onRefreshSettings,
}: AdminDashboardProps) {
  const { isAdmin, adminLogin, adminLogout } = useAuth();
  const { formatPrice } = useLanguage();

  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Section
  const [activeSection, setActiveSection] = useState<
    'dashboard' | 'menu' | 'orders' | 'reservations' | 'coupons' | 'reviews' | 'settings'
  >('dashboard');

  // Backend state
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings | null>(
    initialSettings || null
  );
  const [loading, setLoading] = useState(false);

  // Search & filter states
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Modals for Products
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Product Form State
  const [productForm, setProductForm] = useState<{
    id?: string;
    name_en: string;
    name_bn: string;
    category_id: string;
    price_bdt: number;
    image_url: string;
    description_en: string;
    description_bn: string;
    preparation_time_minutes: number;
    spicy_level: number;
    is_available: boolean;
    is_featured: boolean;
    is_popular: boolean;
    dietary_tags: string[];
  }>({
    name_en: '',
    name_bn: '',
    category_id: 'sushi',
    price_bdt: 500,
    image_url: '/src/assets/images/food_sushi_platter_1793346959147.jpg',
    description_en: '',
    description_bn: '',
    preparation_time_minutes: 15,
    spicy_level: 0,
    is_available: true,
    is_featured: false,
    is_popular: false,
    dietary_tags: ['Halal'],
  });

  // Coupons
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('10');
  const [newCouponMin, setNewCouponMin] = useState('1000');

  // Password Change State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passFeedback, setPassFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Feedback notifications
  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);

  // Load all admin datasets
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [ordRes, resRes, coupRes, revRes, setRes] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/reservations').then((r) => r.json()),
        fetch('/api/coupons').then((r) => r.json()),
        fetch('/api/reviews').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json()),
      ]);

      if (ordRes.success) setOrders(ordRes.orders);
      if (resRes.success) setReservations(resRes.reservations);
      if (coupRes.success) setCoupons(coupRes.coupons);
      if (revRes.success) setReviews(revRes.reviews);
      if (setRes.success) setRestaurantSettings(setRes.settings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(null);
    const res = await adminLogin(password);
    setIsLoggingIn(false);
    if (!res.success) {
      setAuthError(res.message || 'Invalid administrator password');
    }
  };

  // Status updates
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateReservationStatus = async (resId: string, status: string) => {
    try {
      const res = await fetch(`/api/reservations/${resId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setReservations((prev) => prev.map((r) => (r.id === resId ? data.reservation : r)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Product CRUD
  const openCreateProduct = () => {
    setProductForm({
      name_en: '',
      name_bn: '',
      category_id: categories[0]?.id || 'sushi',
      price_bdt: 650,
      image_url: '/src/assets/images/food_sushi_platter_1793346959147.jpg',
      description_en: '',
      description_bn: '',
      preparation_time_minutes: 15,
      spicy_level: 0,
      is_available: true,
      is_featured: false,
      is_popular: false,
      dietary_tags: ['Halal'],
    });
    setEditingProduct(null);
    setIsCreatingProduct(true);
  };

  const openEditProduct = (prod: Product) => {
    setProductForm({
      id: prod.id,
      name_en: prod.name_en,
      name_bn: prod.name_bn,
      category_id: prod.category_id,
      price_bdt: prod.price_bdt,
      image_url: prod.image_url,
      description_en: prod.description_en,
      description_bn: prod.description_bn,
      preparation_time_minutes: prod.preparation_time_minutes,
      spicy_level: prod.spicy_level,
      is_available: prod.is_available,
      is_featured: prod.is_featured || false,
      is_popular: prod.is_popular || false,
      dietary_tags: prod.dietary_tags || ['Halal'],
    });
    setEditingProduct(prod);
    setIsCreatingProduct(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update product
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm),
        });
        const data = await res.json();
        if (data.success) {
          setEditingProduct(null);
          onRefreshData();
        }
      } else {
        // Create product
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm),
        });
        const data = await res.json();
        if (data.success) {
          setIsCreatingProduct(false);
          onRefreshData();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleProductAvailability = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !product.is_available }),
      });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this food item?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (e) {
      console.error(e);
    }
  };

  // Coupon create & delete
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode.toUpperCase(),
          discount_percentage: parseInt(newCouponDiscount, 10),
          minimum_spend_bdt: parseInt(newCouponMin, 10),
          description: `${newCouponDiscount}% off orders above ৳${newCouponMin}`,
          is_active: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons([...coupons, data.coupon]);
        setNewCouponCode('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    try {
      await fetch(`/api/coupons/${code}`, { method: 'DELETE' });
      setCoupons(coupons.filter((c) => c.code !== code));
    } catch (e) {
      console.error(e);
    }
  };

  // Settings update
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantSettings) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurantSettings),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsFeedback('All restaurant settings, branding, and contact details successfully saved and updated across the site!');
        setTimeout(() => setSettingsFeedback(null), 4000);
        if (onRefreshSettings) onRefreshSettings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Change Admin Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassFeedback(null);

    if (newPass !== confirmPass) {
      setPassFeedback({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    if (newPass.length < 4) {
      setPassFeedback({ type: 'error', message: 'New password must be at least 4 characters.' });
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });
      const data = await res.json();
      setIsChangingPass(false);

      if (data.success) {
        setPassFeedback({ type: 'success', message: 'Administrator password changed successfully.' });
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
      } else {
        setPassFeedback({ type: 'error', message: data.message || 'Failed to update password.' });
      }
    } catch {
      setIsChangingPass(false);
      setPassFeedback({ type: 'error', message: 'Server communication error.' });
    }
  };

  // If not logged in as admin, show strictly protected login screen WITHOUT ANY HINTS
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-[#12121a] border border-[#27273a] rounded-xl max-w-sm w-full p-8 shadow-2xl space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white font-brand">Administrator Access</h1>
            <p className="text-xs text-[#808098] mt-1">YŌKOSO Sylhet Management Console</p>
          </div>

          {authError && (
            <div className="p-3 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs text-[#a0a0b8]">Master Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-[#171724] border border-[#28283a] rounded p-2.5 text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 bg-[#c5a059] hover:bg-[#d8b56f] text-[#0d0d12] font-semibold text-xs rounded transition-all"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === 'all' || o.order_status === orderFilter;
    const matchesSearch =
      orderSearch.trim() === '' ||
      o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_phone.includes(orderSearch);
    return matchesFilter && matchesSearch;
  });

  // Filtered products for admin
  const filteredProducts = products.filter((p) => {
    return (
      productSearch.trim() === '' ||
      p.name_en.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category_id.toLowerCase().includes(productSearch.toLowerCase())
    );
  });

  const availableImagePresets = [
    { label: 'Sushi & Sashimi Platter', url: '/src/assets/images/food_sushi_platter_1793346959147.jpg' },
    { label: 'Steaming Tonkotsu Ramen', url: '/src/assets/images/food_ramen_bowl_1793346960761.jpg' },
    { label: 'Handcrafted Dim Sum Basket', url: '/src/assets/images/food_dimsum_bento_1793346960828.jpg' },
    { label: 'Grand Dining Hall Interior', url: '/src/assets/images/hero_japanese_dining_1793346958891.jpg' },
    { label: 'Shoji Private Lounge', url: '/src/assets/images/restaurant_ambiance_interior_1793346962659.jpg' },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d12] text-[#e5e5eb] pb-20">
      {/* Admin Top Bar */}
      <div className="bg-[#12121a] border-b border-[#20202e] px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-brand font-bold text-white tracking-wider text-lg">
            YŌKOSO ADMIN
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-mono">
            PORTAL ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={loadAdminData}
            className="flex items-center gap-1.5 text-[#a0a0b8] hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={adminLogout}
            className="flex items-center gap-1 text-rose-400 hover:text-rose-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-1 bg-[#12121a] border border-[#20202e] rounded-xl p-3 h-fit">
          {[
            { id: 'dashboard', label: 'Dashboard & KPIs', icon: LayoutDashboard },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'reservations', label: `Reservations (${reservations.length})`, icon: Calendar },
            { id: 'menu', label: `Food Menu & Pictures (${products.length})`, icon: UtensilsCrossed },
            { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
            { id: 'settings', label: 'Logo, Banner & Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#c5a059] text-[#0d0d12] font-semibold'
                    : 'text-[#a0a0b8] hover:text-white hover:bg-[#181824]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* SECTION 1: DASHBOARD OVERVIEW */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#12121a] border border-[#20202e] rounded-xl p-4 space-y-1">
                  <span className="text-[11px] text-[#808098] font-mono uppercase">Total Revenue</span>
                  <p className="text-xl font-bold font-mono text-[#c5a059] tabular-nums">
                    {formatPrice(orders.filter((o) => o.order_status !== 'cancelled').reduce((s, o) => s + o.total_bdt, 0))}
                  </p>
                  <span className="text-[10px] text-emerald-400">All Completed & Active Orders</span>
                </div>

                <div className="bg-[#12121a] border border-[#20202e] rounded-xl p-4 space-y-1">
                  <span className="text-[11px] text-[#808098] font-mono uppercase">Total Orders</span>
                  <p className="text-xl font-bold font-mono text-white tabular-nums">
                    {orders.length}
                  </p>
                  <span className="text-[10px] text-[#808098] font-mono">
                    {orders.filter((o) => o.order_status === 'pending').length} Pending Kitchen
                  </span>
                </div>

                <div className="bg-[#12121a] border border-[#20202e] rounded-xl p-4 space-y-1">
                  <span className="text-[11px] text-[#808098] font-mono uppercase">Table Bookings</span>
                  <p className="text-xl font-bold font-mono text-white tabular-nums">
                    {reservations.length}
                  </p>
                  <span className="text-[10px] text-[#808098] font-mono">
                    {reservations.filter((r) => r.status === 'pending').length} Pending Approval
                  </span>
                </div>
              </div>

              {/* Quick Summary Strip */}
              <div className="p-4 bg-[#14141f] border border-[#232332] rounded-xl flex flex-wrap gap-6 text-xs text-[#a0a0b8]">
                <div>
                  <span className="text-white font-semibold">Active bKash Number:</span>{' '}
                  <span className="font-mono text-[#c5a059]">{restaurantSettings?.bkash_merchant_number || '01841965676'}</span>
                </div>
                <div>
                  <span className="text-white font-semibold">Active Nagad Number:</span>{' '}
                  <span className="font-mono text-[#c5a059]">{restaurantSettings?.nagad_merchant_number || '01841965676'}</span>
                </div>
                <div>
                  <span className="text-white font-semibold">Support Phone:</span>{' '}
                  <span className="font-mono text-white">{restaurantSettings?.phone || '+8801841965676'}</span>
                </div>
              </div>

              {/* Recent Orders in Dashboard */}
              <div className="bg-[#12121a] border border-[#20202e] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                    Live Dispatch Queue
                  </h3>
                  <button
                    onClick={() => setActiveSection('orders')}
                    className="text-xs text-[#c5a059] hover:underline"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="divide-y divide-[#1c1c28]">
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="py-3 first:pt-0 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white">#{ord.order_number}</span>
                          <span className="text-[#a0a0b8]">· {ord.customer_name}</span>
                        </div>
                        <p className="text-[11px] text-[#707085]">
                          {ord.items.length} items · {ord.payment_method.toUpperCase()} ({ord.payment_status})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-[#c5a059]">
                          {formatPrice(ord.total_bdt)}
                        </span>
                        <select
                          value={ord.order_status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-[#181826] border border-[#28283a] rounded text-[11px] text-white p-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: ORDER MANAGEMENT */}
          {activeSection === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-white font-brand">Orders Management</h2>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search order #, name, phone..."
                    className="bg-[#14141e] border border-[#242436] rounded px-3 py-1.5 text-xs text-white placeholder-[#606078]"
                  />
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="bg-[#14141e] border border-[#242436] rounded px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#12121a] border border-[#20202e] rounded-xl p-5 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1c1c28]">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white text-sm">
                            #{ord.order_number}
                          </span>
                          <span className="text-xs text-[#a0a0b8]">{ord.customer_name}</span>
                          <span className="text-xs text-[#707085] font-mono">{ord.customer_phone}</span>
                        </div>
                        <p className="text-[11px] text-[#606078] mt-0.5">
                          Placed: {new Date(ord.created_at).toLocaleString()} · {ord.delivery_address}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-white text-sm">
                          {formatPrice(ord.total_bdt)}
                        </span>
                        <select
                          value={ord.order_status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-[#1a1a28] border border-[#2a2a3e] rounded text-xs text-[#c5a059] p-1.5 font-medium"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-medium text-[#c0c0d2]">
                        Items: {ord.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                      </p>
                      {ord.order_notes && (
                        <p className="text-[11px] text-[#808098] italic">Note: &quot;{ord.order_notes}&quot;</p>
                      )}
                      <p className="text-[11px] text-[#707085]">
                        Payment: <span className="text-white uppercase">{ord.payment_method}</span> ({ord.payment_status}) {ord.transaction_id && `· TrxID: ${ord.transaction_id}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: RESERVATIONS */}
          {activeSection === 'reservations' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white font-brand">Table Reservations</h2>

              <div className="space-y-3">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-[#12121a] border border-[#20202e] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-white text-sm">
                          {res.reservation_code}
                        </span>
                        <span className="text-white font-medium">{res.customer_name}</span>
                        <span className="text-[#808098]">{res.customer_phone}</span>
                      </div>
                      <p className="text-xs text-[#c5a059]">
                        {res.reservation_date} at {res.reservation_time} · {res.number_of_guests} Guests ({res.table_type})
                      </p>
                      {res.special_requests && (
                        <p className="text-[11px] text-[#707085] italic">
                          Special: &quot;{res.special_requests}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateReservationStatus(res.id, 'approved')}
                        className={`px-3 py-1.5 rounded text-xs font-semibold ${
                          res.status === 'approved'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#1a1a26] text-emerald-400 border border-emerald-900/60 hover:bg-emerald-950'
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateReservationStatus(res.id, 'rejected')}
                        className={`px-3 py-1.5 rounded text-xs font-semibold ${
                          res.status === 'rejected'
                            ? 'bg-rose-600 text-white'
                            : 'bg-[#1a1a26] text-rose-400 border border-rose-900/60 hover:bg-rose-950'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: FOOD MENU & PRODUCT PICTURE MANAGEMENT */}
          {activeSection === 'menu' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white font-brand">Food Catalog & Pictures ({products.length})</h2>
                  <p className="text-xs text-[#808098]">Change food pictures, prices, and descriptions anytime</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search dish or category..."
                    className="bg-[#14141e] border border-[#242436] rounded px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    onClick={openCreateProduct}
                    className="px-3 py-1.5 bg-[#c5a059] text-[#0d0d12] text-xs font-semibold rounded flex items-center gap-1 hover:bg-[#d8b56f]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Food Item</span>
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#12121a] border border-[#20202e] rounded-xl p-4 flex gap-3.5 items-start justify-between group"
                  >
                    <div className="relative w-20 h-20 rounded overflow-hidden shrink-0 bg-[#181822] border border-[#28283a]">
                      <img
                        src={p.image_url}
                        alt={p.name_en}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => openEditProduct(p)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-medium transition-opacity"
                      >
                        Change Pic
                      </button>
                    </div>

                    <div className="flex-1 min-w-0 text-xs space-y-1">
                      <span className="text-[10px] font-mono text-[#c5a059] uppercase">{p.category_id}</span>
                      <h4 className="font-bold text-white truncate">{p.name_en}</h4>
                      <p className="font-mono text-white font-semibold">{formatPrice(p.price_bdt)}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => openEditProduct(p)}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1e1e2d] text-[#c5a059] border border-[#c5a059]/40 hover:bg-[#28283d] flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit & Pic</span>
                        </button>
                        <button
                          onClick={() => handleToggleProductAvailability(p)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            p.is_available
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {p.is_available ? 'Available' : 'Sold Out'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-rose-400 hover:text-rose-300 p-0.5"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDIT OR CREATE PRODUCT MODAL */}
          {(editingProduct || isCreatingProduct) && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#12121a] border border-[#27273a] rounded-xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingProduct(false);
                  }}
                  className="absolute top-4 right-4 text-[#808098] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <h3 className="font-brand text-lg font-bold text-white">
                    {editingProduct ? 'Edit Food & Change Product Picture' : 'Add New Food Product'}
                  </h3>
                  <p className="text-xs text-[#808098]">
                    Set the food photo URL, pricing in BDT (৳), and item details.
                  </p>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                  {/* Food Picture URL & Live Preview */}
                  <div className="p-3 bg-[#171724] border border-[#28283a] rounded-lg space-y-3">
                    <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#c5a059]" />
                      <span>Food Product Picture (Image URL)</span>
                    </label>

                    <div className="flex gap-3 items-center">
                      <img
                        src={productForm.image_url}
                        alt="Product Preview"
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded object-cover border border-[#303046] bg-black shrink-0"
                      />
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          required
                          value={productForm.image_url}
                          onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                          placeholder="Paste image link: https://... or /src/assets/images/..."
                          className="w-full bg-[#12121a] border border-[#2c2c40] rounded p-2 text-white font-mono text-[11px] focus:outline-none focus:border-[#c5a059]"
                        />
                        <span className="text-[10px] text-[#707085]">
                          Paste any direct image URL or choose a preset below:
                        </span>
                      </div>
                    </div>

                    {/* Preset buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {availableImagePresets.map((preset) => (
                        <button
                          type="button"
                          key={preset.label}
                          onClick={() => setProductForm({ ...productForm, image_url: preset.url })}
                          className="px-2 py-1 bg-[#1e1e2d] hover:bg-[#28283d] rounded text-[10px] text-[#b0b0c8] border border-[#2a2a3e]"
                        >
                          Use {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[#a0a0b8]">Food Name (English) *</label>
                      <input
                        type="text"
                        required
                        value={productForm.name_en}
                        onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[#a0a0b8]">Food Name (বাংলা) *</label>
                      <input
                        type="text"
                        required
                        value={productForm.name_bn}
                        onChange={(e) => setProductForm({ ...productForm, name_bn: e.target.value })}
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[#a0a0b8]">Category *</label>
                      <select
                        value={productForm.category_id}
                        onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name_en}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#a0a0b8]">Price in BDT (৳) *</label>
                      <input
                        type="number"
                        required
                        value={productForm.price_bdt}
                        onChange={(e) => setProductForm({ ...productForm, price_bdt: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#a0a0b8]">Prep Time (Minutes)</label>
                      <input
                        type="number"
                        value={productForm.preparation_time_minutes}
                        onChange={(e) => setProductForm({ ...productForm, preparation_time_minutes: parseInt(e.target.value, 10) || 15 })}
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#a0a0b8]">Description (English)</label>
                    <textarea
                      rows={2}
                      value={productForm.description_en}
                      onChange={(e) => setProductForm({ ...productForm, description_en: e.target.value })}
                      className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#a0a0b8]">Description (বাংলা)</label>
                    <textarea
                      rows={2}
                      value={productForm.description_bn}
                      onChange={(e) => setProductForm({ ...productForm, description_bn: e.target.value })}
                      className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.is_available}
                        onChange={(e) => setProductForm({ ...productForm, is_available: e.target.checked })}
                        className="accent-[#c5a059]"
                      />
                      <span>Item is Available</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.is_featured}
                        onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                        className="accent-[#c5a059]"
                      />
                      <span>Featured Signature Dish</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.is_popular}
                        onChange={(e) => setProductForm({ ...productForm, is_popular: e.target.checked })}
                        className="accent-[#c5a059]"
                      />
                      <span>Popular Favorite</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#222234]">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setIsCreatingProduct(false);
                      }}
                      className="px-4 py-2 bg-[#1b1b26] text-[#b0b0c2] rounded hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#c5a059] text-[#0d0d12] font-semibold rounded hover:bg-[#d8b56f]"
                    >
                      {editingProduct ? 'Save Product Changes' : 'Create Food Item'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* SECTION 5: COUPONS */}
          {activeSection === 'coupons' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-brand">Discount Coupons</h2>

              {/* Create form */}
              <form onSubmit={handleCreateCoupon} className="p-4 bg-[#12121a] border border-[#20202e] rounded-xl flex flex-wrap gap-3 items-end text-xs">
                <div className="space-y-1 flex-1 min-w-[120px]">
                  <label className="text-[#a0a0b8]">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SYLHET20"
                    className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white font-mono uppercase"
                  />
                </div>
                <div className="space-y-1 w-28">
                  <label className="text-[#a0a0b8]">Discount (%)</label>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1 w-32">
                  <label className="text-[#a0a0b8]">Min Spend (৳)</label>
                  <input
                    type="number"
                    required
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(e.target.value)}
                    className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c5a059] text-[#0d0d12] font-semibold rounded text-xs"
                >
                  Create Coupon
                </button>
              </form>

              {/* List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-4 bg-[#12121a] border border-[#20202e] rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-white text-sm">{c.code}</span>
                      <p className="text-[11px] text-[#808098] mt-0.5">{c.description}</p>
                      <p className="text-[10px] text-[#c5a059] font-mono">Min Spend: ৳{c.minimum_spend_bdt}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCoupon(c.code)}
                      className="p-1.5 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: REVIEWS MODERATION */}
          {activeSection === 'reviews' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white font-brand">Reviews Moderation</h2>
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-[#12121a] border border-[#20202e] rounded-xl flex items-start justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{rev.customer_name}</span>
                        <span className="text-[#808098]">({rev.customer_location})</span>
                        <span className="text-amber-400">{'★'.repeat(rev.rating)}</span>
                      </div>
                      <p className="text-[#c0c0d2] italic">&quot;{rev.comment}&quot;</p>
                      <p className="text-[10px] text-[#c5a059] font-mono">{rev.dish_ordered}</p>
                    </div>

                    <button
                      onClick={async () => {
                        await fetch(`/api/reviews/${rev.id}`, { method: 'DELETE' });
                        setReviews(reviews.filter((r) => r.id !== rev.id));
                      }}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: RESTAURANT SETTINGS, PAYMENT NUMBERS, LOGO, BANNER & PASS */}
          {activeSection === 'settings' && restaurantSettings && (
            <div className="space-y-8">
              {settingsFeedback && (
                <div className="p-4 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 shadow-lg">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{settingsFeedback}</span>
                </div>
              )}

              {/* Main Settings Form */}
              <form onSubmit={handleSaveSettings} className="bg-[#12121a] border border-[#20202e] rounded-xl p-6 sm:p-8 space-y-6 text-xs">
                {/* 1. Payment Numbers */}
                <div className="space-y-4 pb-6 border-b border-[#20202e]">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#c5a059]" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                      1. Payment Numbers (bKash & Nagad)
                    </h3>
                  </div>
                  <p className="text-[#808098]">
                    These numbers are dynamically displayed to customers during bKash and Nagad checkout.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[#a0a0b8] font-medium">bKash Merchant / Payment Number *</label>
                      <input
                        type="text"
                        required
                        value={restaurantSettings.bkash_merchant_number}
                        onChange={(e) =>
                          setRestaurantSettings({ ...restaurantSettings, bkash_merchant_number: e.target.value })
                        }
                        placeholder="01841965676"
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#c5a059]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#a0a0b8] font-medium">Nagad Merchant / Payment Number *</label>
                      <input
                        type="text"
                        required
                        value={restaurantSettings.nagad_merchant_number}
                        onChange={(e) =>
                          setRestaurantSettings({ ...restaurantSettings, nagad_merchant_number: e.target.value })
                        }
                        placeholder="01841965676"
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#c5a059]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Website Logo & Hero Banner */}
                <div className="space-y-4 pb-6 border-b border-[#20202e]">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#c5a059]" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                      2. Website Logo & Banner Customization
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Logo URL */}
                    <div className="space-y-2">
                      <label className="text-[#a0a0b8] font-medium">Website Logo URL (Optional Image)</label>
                      <input
                        type="text"
                        value={restaurantSettings.logo_url || ''}
                        onChange={(e) =>
                          setRestaurantSettings({ ...restaurantSettings, logo_url: e.target.value })
                        }
                        placeholder="https://... or leave blank for official gold emblem"
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white font-mono text-xs focus:outline-none focus:border-[#c5a059]"
                      />
                      {restaurantSettings.logo_url && (
                        <div className="flex items-center gap-2 pt-1">
                          <img
                            src={restaurantSettings.logo_url}
                            alt="Logo Preview"
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded object-contain border border-[#303046]"
                          />
                          <span className="text-[10px] text-[#707085]">Logo Image Active</span>
                        </div>
                      )}
                    </div>

                    {/* Hero Banner Image URL */}
                    <div className="space-y-2">
                      <label className="text-[#a0a0b8] font-medium">Homepage Hero Banner Image URL</label>
                      <input
                        type="text"
                        value={restaurantSettings.hero_banner_url}
                        onChange={(e) =>
                          setRestaurantSettings({ ...restaurantSettings, hero_banner_url: e.target.value })
                        }
                        placeholder="/src/assets/images/hero_japanese_dining_1793346958891.jpg"
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white font-mono text-xs focus:outline-none focus:border-[#c5a059]"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setRestaurantSettings({
                              ...restaurantSettings,
                              hero_banner_url: '/src/assets/images/hero_japanese_dining_1793346958891.jpg',
                            })
                          }
                          className="text-[10px] text-[#c5a059] hover:underline"
                        >
                          Reset to Japanese Hall Banner
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() =>
                            setRestaurantSettings({
                              ...restaurantSettings,
                              hero_banner_url: '/src/assets/images/restaurant_ambiance_interior_1793346962659.jpg',
                            })
                          }
                          className="text-[10px] text-[#c5a059] hover:underline"
                        >
                          Use Shoji Tatami Banner
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[#a0a0b8]">Hero Headline Title</label>
                      <input
                        type="text"
                        value={restaurantSettings.hero_title || 'YŌKOSO RESTAURANT'}
                        onChange={(e) =>
                          setRestaurantSettings({ ...restaurantSettings, hero_title: e.target.value })
                        }
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white font-brand"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#a0a0b8]">Tagline (English)</label>
                      <input
                        type="text"
                        value={restaurantSettings.tagline_en}
                        onChange={(e) =>
                          setRestaurantSettings({ ...restaurantSettings, tagline_en: e.target.value })
                        }
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Support Email, Support Number & Address */}
                <div className="space-y-4 pb-6 border-b border-[#20202e]">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#c5a059]" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                      3. Support Telephone & Support Email
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[#a0a0b8]">Support Phone / Hotline *</label>
                      <input
                        type="text"
                        required
                        value={restaurantSettings.phone}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            phone: e.target.value,
                            support_phone: e.target.value,
                          })
                        }
                        placeholder="+8801841965676"
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#a0a0b8]">Support Email *</label>
                      <input
                        type="email"
                        required
                        value={restaurantSettings.email}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            email: e.target.value,
                            support_email: e.target.value,
                          })
                        }
                        placeholder="yokoso.syl@gmail.com"
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#a0a0b8]">Official Restaurant Address *</label>
                    <input
                      type="text"
                      required
                      value={restaurantSettings.address_line}
                      onChange={(e) =>
                        setRestaurantSettings({ ...restaurantSettings, address_line: e.target.value })
                      }
                      placeholder="2nd Floor, Al-Madani Tower, Mirboxtula, Sylhet, Bangladesh"
                      className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white"
                    />
                  </div>
                </div>

                {/* 4. Delivery & Operating Hours */}
                <div className="space-y-4 pb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#c5a059]" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                      4. Delivery Charges & Operating Hours
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[#a0a0b8]">Delivery Fee (BDT)</label>
                      <input
                        type="number"
                        value={restaurantSettings.delivery_charge_bdt}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            delivery_charge_bdt: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#a0a0b8]">Free Delivery Above (BDT)</label>
                      <input
                        type="number"
                        value={restaurantSettings.free_delivery_threshold_bdt}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            free_delivery_threshold_bdt: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#a0a0b8]">Service Hours</label>
                      <input
                        type="text"
                        value={restaurantSettings.opening_hours_en}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            opening_hours_en: e.target.value,
                          })
                        }
                        className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#c5a059] hover:bg-[#d8b56f] text-[#0d0d12] font-semibold text-xs rounded transition-colors shadow-lg flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save All Settings & Branding</span>
                </button>
              </form>

              {/* 5. Change Admin Password Box */}
              <div className="bg-[#12121a] border border-[#20202e] rounded-xl p-6 sm:p-8 space-y-5 text-xs">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#c5a059]" />
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                    5. Change Administrator Password
                  </h3>
                </div>
                <p className="text-[#808098]">
                  Update your master admin portal password. The password is kept completely confidential and never displayed on the login page.
                </p>

                {passFeedback && (
                  <div
                    className={`p-3 rounded text-xs flex items-center gap-2 ${
                      passFeedback.type === 'success'
                        ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                        : 'bg-rose-950/40 border border-rose-800 text-rose-300'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passFeedback.message}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="space-y-1">
                    <label className="text-[#a0a0b8]">Current Password *</label>
                    <input
                      type="password"
                      required
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="Enter existing password"
                      className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#a0a0b8]">New Password *</label>
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Enter strong new password"
                      className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#a0a0b8]">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPass}
                    className="px-5 py-2.5 bg-[#252538] hover:bg-[#32324a] text-white border border-[#37374e] font-semibold text-xs rounded transition-colors"
                  >
                    {isChangingPass ? 'Updating...' : 'Update Admin Password'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
