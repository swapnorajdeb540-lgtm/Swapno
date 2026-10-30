import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { FoodDetailModal } from './components/FoodDetailModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { MenuPage } from './pages/MenuPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderTrackingPage } from './pages/OrderTrackingPage.tsx';
import { ReservationPage } from './pages/ReservationPage.tsx';
import { GalleryPage } from './pages/GalleryPage.tsx';
import { ReviewsPage } from './pages/ReviewsPage.tsx';
import { AboutPage, ContactPage } from './pages/AboutContactPages.tsx';
import { CustomerDashboard } from './pages/CustomerDashboard.tsx';
import { PrivacyPolicyPage, TermsPage } from './pages/LegalPages.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  Product,
  Category,
  Review,
  RestaurantSettings,
} from './data/restaurantData.ts';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('YKS-928172');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const { addItem, setIsCartOpen } = useCart();

  // Load live data from server APIs
  const refreshAppData = () => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories) setCategories(data.categories);
      })
      .catch(() => {});

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) setProducts(data.products);
      })
      .catch(() => {});

    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reviews) setReviews(data.reviews);
      })
      .catch(() => {});

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshAppData();

    // Support hash navigation (e.g. #admin, #menu)
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentTab(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (tab: string, categoryId?: string) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (orderNo: string) => {
    setTrackingOrderNumber(orderNo);
    setCurrentTab('tracking');
    window.location.hash = 'tracking';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d12] text-[#e5e5eb] selection:bg-[#c5a059] selection:text-[#0d0d12]">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => handleNavigate(tab)}
        openAuth={openAuth}
        settings={settings}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            products={products}
            categories={categories}
            reviews={reviews}
            settings={settings}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigate={handleNavigate}
            onAddToCart={(p) => addItem(p, 1)}
          />
        )}

        {currentTab === 'menu' && (
          <MenuPage
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => setSelectedCategory(catId)}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={handleOrderSuccess}
            onNavigateToMenu={() => handleNavigate('menu')}
            settings={settings}
          />
        )}

        {currentTab === 'tracking' && (
          <OrderTrackingPage initialOrderNumber={trackingOrderNumber} />
        )}

        {currentTab === 'reservations' && <ReservationPage />}

        {currentTab === 'gallery' && <GalleryPage />}

        {currentTab === 'reviews' && (
          <ReviewsPage
            reviews={reviews}
            onReviewAdded={(rev) => setReviews([rev, ...reviews])}
          />
        )}

        {currentTab === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {currentTab === 'contact' && <ContactPage settings={settings} />}

        {currentTab === 'dashboard' && (
          <CustomerDashboard
            onNavigateToTracking={(ordNo) => {
              setTrackingOrderNumber(ordNo);
              handleNavigate('tracking');
            }}
            onNavigateToMenu={() => handleNavigate('menu')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            categories={categories}
            products={products}
            settings={settings}
            onRefreshData={refreshAppData}
            onRefreshSettings={refreshAppData}
          />
        )}

        {currentTab === 'privacy' && <PrivacyPolicyPage />}

        {currentTab === 'terms' && <TermsPage />}
      </main>

      {/* Footer */}
      {currentTab !== 'admin' && (
        <Footer setCurrentTab={(tab) => handleNavigate(tab)} settings={settings} />
      )}

      {/* Cart Drawer */}
      <CartDrawer onCheckout={() => handleNavigate('checkout')} />

      {/* Food Customization Modal */}
      <FoodDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => handleNavigate('dashboard')}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
