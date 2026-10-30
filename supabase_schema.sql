-- ==============================================================================
-- YŌKOSO RESTAURANT – COMPLETE SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- Location: 2nd Floor, Al-Madani Tower, Mirboxtula, Sylhet, Bangladesh
-- Currency: BDT (৳) | Timezone: Asia/Dhaka
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER ROLES & PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  delivery_address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('customer', 'staff', 'manager', 'admin', 'super_admin')) DEFAULT 'customer' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, role)
);

-- 3. FOOD CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. PRODUCTS / FOOD MENU
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  name_en TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_bn TEXT NOT NULL,
  price_bdt NUMERIC(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  preparation_time_minutes INT DEFAULT 20,
  spicy_level INT DEFAULT 0,
  dietary_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. PRODUCT VARIANTS & ADDONS
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name_en TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  additional_price_bdt NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
  is_default BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.product_addons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name_en TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  price_bdt NUMERIC(10, 2) NOT NULL
);

-- 6. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  order_notes TEXT,
  subtotal_bdt NUMERIC(10, 2) NOT NULL,
  delivery_fee_bdt NUMERIC(10, 2) DEFAULT 70.00 NOT NULL,
  discount_bdt NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
  total_bdt NUMERIC(10, 2) NOT NULL,
  coupon_code TEXT,
  payment_method TEXT CHECK (payment_method IN ('cash_on_delivery', 'bkash', 'nagad', 'card')) NOT NULL,
  payment_status TEXT CHECK (payment_status IN ('unpaid', 'paid', 'refunded')) DEFAULT 'unpaid' NOT NULL,
  order_status TEXT CHECK (order_status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')) DEFAULT 'pending' NOT NULL,
  estimated_delivery_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant_name TEXT,
  unit_price_bdt NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL,
  total_price_bdt NUMERIC(10, 2) NOT NULL,
  special_instructions TEXT
);

-- 7. TABLE RESERVATIONS
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reservation_code TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TEXT NOT NULL,
  number_of_guests INT NOT NULL,
  table_type TEXT DEFAULT 'standard',
  special_requests TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')) DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. CUSTOMER REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_avatar TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  order_item_reference TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. DISCOUNT COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percentage INT,
  discount_amount_bdt NUMERIC(10, 2),
  minimum_spend_bdt NUMERIC(10, 2) DEFAULT 0.00,
  valid_until DATE,
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INT DEFAULT 0
);

-- 10. RESTAURANT SETTINGS
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
  id TEXT PRIMARY KEY,
  restaurant_name TEXT DEFAULT 'YŌKOSO' NOT NULL,
  tagline_en TEXT DEFAULT 'Authentic Japanese & Pan-Asian Gastronomy',
  tagline_bn TEXT DEFAULT 'সিলেটের বুকে সেরা জাপানিজ ও প্যান-এশিয়ান খাবার',
  address TEXT DEFAULT '2nd Floor, Al-Madani Tower, Mirboxtula, Sylhet, Bangladesh' NOT NULL,
  phone TEXT DEFAULT '+8801841965676' NOT NULL,
  email TEXT DEFAULT 'yokoso.syl@gmail.com' NOT NULL,
  currency TEXT DEFAULT 'BDT',
  currency_symbol TEXT DEFAULT '৳',
  delivery_charge_bdt NUMERIC(10, 2) DEFAULT 70.00,
  free_delivery_min_bdt NUMERIC(10, 2) DEFAULT 2000.00,
  opening_hours TEXT DEFAULT '12:00 PM – 11:30 PM (Daily)',
  is_ordering_open BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Dishes',
  image_url TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0
);

-- 13. PAYMENT TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  provider TEXT CHECK (provider IN ('bkash', 'nagad', 'card', 'cash')) NOT NULL,
  transaction_id TEXT,
  amount_bdt NUMERIC(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('initiated', 'completed', 'failed')) DEFAULT 'initiated' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 14. ADMIN ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can read products, categories, approved reviews, gallery, restaurant_settings
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (is_available = true OR auth.role() = 'authenticated');
CREATE POLICY "Public Read Approved Reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public Read Gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.restaurant_settings FOR SELECT USING (true);

-- Customers can read and update their own profile
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Customers can view their own orders
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id OR customer_email = auth.email());
