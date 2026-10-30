import React, { useState } from 'react';
import { ShoppingBag, User, Globe, Shield, Menu, X, Clock, MapPin, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

import { RestaurantSettings } from '../data/restaurantData.ts';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuth: (mode?: 'login' | 'register') => void;
  settings?: RestaurantSettings | null;
}

export function Navbar({ currentTab, setCurrentTab, openAuth, settings }: NavbarProps) {
  const { items, setIsCartOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const navLinks = [
    { id: 'home', label: t.home },
    { id: 'menu', label: t.menu },
    { id: 'reservations', label: t.reserveTable },
    { id: 'tracking', label: t.trackOrder },
    { id: 'gallery', label: t.gallery },
    { id: 'reviews', label: t.reviews },
    { id: 'about', label: t.about },
    { id: 'contact', label: t.contact },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const phoneDisplay = settings?.phone || '+8801841965676';
  const addressDisplay = settings?.address_line || '2nd Floor, Al-Madani Tower, Mirboxtula, Sylhet';
  const hoursDisplay = settings?.opening_hours_en || '12:30 PM – 11:00 PM Daily';

  return (
    <>
      {/* Top Notification Strip */}
      <div className="bg-[#14141c] border-b border-[#252533] text-xs text-[#a0a0b8] px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 truncate max-w-md">
              <MapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
              <span className="truncate">{addressDisplay}</span>
            </span>
            <span className="flex items-center gap-1.5 shrink-0">
              <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
              {hoursDisplay}
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a href={`tel:${phoneDisplay}`} className="flex items-center gap-1.5 text-[#e5e5eb] hover:text-[#c5a059] transition-colors font-mono">
              <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
              {phoneDisplay}
            </a>
            <span className="text-[#3b3b4f]">|</span>
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-1 text-[#c5a059] hover:underline"
            >
              <Shield className="w-3 h-3" />
              {isAdmin ? 'Admin Dashboard' : 'Admin Access'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0d0d12]/95 backdrop-blur-md border-b border-[#232330]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Brand Wordmark & Dynamic Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group shrink-0"
          >
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt="YŌKOSO Restaurant Logo"
                referrerPolicy="no-referrer"
                className="w-9 h-9 object-contain rounded bg-[#161622] border border-[#c5a059]/40"
              />
            ) : (
              <div className="w-9 h-9 rounded-sm bg-[#c5a059]/15 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] font-brand font-bold text-lg group-hover:border-[#c5a059] transition-all">
                羊
              </div>
            )}
            <div>
              <span className="font-brand text-xl sm:text-2xl font-bold tracking-wider text-white">
                {settings?.name || 'YŌKOSO'}
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] tracking-widest text-[#c5a059] uppercase font-mono">
                SYLHET
              </span>
            </div>
          </button>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#b5b5c6]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
                  currentTab === link.id ? 'text-[#c5a059] font-semibold' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title="Toggle English / বাংলা"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-[#c5a059] bg-[#1a1a24] border border-[#2b2b3b] hover:border-[#c5a059]/50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg text-[#e5e5eb] bg-[#181822] border border-[#272736] hover:border-[#c5a059]/60 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#c5a059] text-[#0d0d12] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Account / Login */}
            {user ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-[#1a1a24] border border-[#323246] rounded hover:border-[#c5a059] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#c5a059]" />
                <span className="max-w-[100px] truncate">{user.full_name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#e5e5eb] hover:text-white transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </button>
            )}

            {/* Primary Order Now Action */}
            <button
              onClick={() => handleNavClick('menu')}
              className="px-4 py-2 text-xs font-semibold text-[#0d0d12] bg-[#c5a059] hover:bg-[#d8b56f] transition-all rounded shadow-sm whitespace-nowrap shrink-0"
            >
              {t.orderNow}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#12121a] border-b border-[#252535] px-6 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#20202e]">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left text-sm py-1.5 px-2 rounded hover:bg-[#1c1c28] ${
                    currentTab === link.id ? 'text-[#c5a059] font-medium' : 'text-[#b0b0c2]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleNavClick('admin')}
                className="text-xs text-[#c5a059] flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </button>
              {!user && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth('login');
                  }}
                  className="text-xs text-white"
                >
                  {t.login} / {t.register}
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
