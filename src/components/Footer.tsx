import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

import { RestaurantSettings } from '../data/restaurantData.ts';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  settings?: RestaurantSettings | null;
}

export function Footer({ setCurrentTab, settings }: FooterProps) {
  const { t } = useLanguage();

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const phone = settings?.phone || '+8801841965676';
  const email = settings?.email || 'yokoso.syl@gmail.com';
  const address = settings?.address_line || '2nd Floor, Al-Madani Tower, Mirboxtula, Sylhet, Bangladesh';
  const hours = settings?.opening_hours_en || '12:30 PM – 11:00 PM';
  const deliveryFee = settings?.delivery_charge_bdt ?? 70;
  const freeThreshold = settings?.free_delivery_threshold_bdt ?? 2000;

  return (
    <footer className="bg-[#09090d] border-t border-[#1e1e2b] text-[#9a9ab0] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#1c1c28]">
          {/* Brand & Ethos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#c5a059]/20 border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] font-brand font-bold">
                羊
              </div>
              <span className="font-brand text-2xl font-bold tracking-wider text-white">
                YŌKOSO
              </span>
            </div>
            <p className="text-sm text-[#9090a6] leading-relaxed">
              Sylhet&apos;s definitive Japanese and Pan-Asian destination. Handcrafted sushi rolls, 14-hour simmered ramen, and artisanal dim sum at Al-Madani Tower.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#c5a059]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Halal Ingredients & Fresh Seafood</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase font-brand">
              Guest Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav('menu')} className="hover:text-[#c5a059] transition-colors">
                  {t.menu} & Ordering
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('reservations')} className="hover:text-[#c5a059] transition-colors">
                  Table Reservation
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tracking')} className="hover:text-[#c5a059] transition-colors">
                  Live Order Tracking
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-[#c5a059] transition-colors">
                  Atmosphere & Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('reviews')} className="hover:text-[#c5a059] transition-colors">
                  Guest Testimonials
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Hours & Delivery */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase font-brand">
              Dine-in & Delivery
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">{hours}</p>
                  <p className="text-xs text-[#808096]">Open 7 Days a Week (Lunch & Dinner)</p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#1c1c28]">
                <p className="text-xs text-[#c5a059] font-medium">Sylhet City Delivery</p>
                <p className="text-xs text-[#808096] mt-0.5">
                  Flat ৳{deliveryFee} within city · Free delivery on orders over ৳{freeThreshold.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Location & Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase font-brand">
              Visit & Contact
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <span className="text-[#c0c0d2] text-xs leading-relaxed">
                  {address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#c5a059] shrink-0" />
                <a href={`tel:${phone}`} className="text-white hover:text-[#c5a059] text-xs font-mono">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#c5a059] shrink-0" />
                <a href={`mailto:${email}`} className="text-white hover:text-[#c5a059] text-xs">
                  {email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payments & Rights */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#707085]">
          <div className="flex flex-wrap items-center gap-3">
            <span>Accepted Payments:</span>
            <span className="px-2 py-0.5 rounded bg-[#161622] border border-[#232332] text-white">bKash</span>
            <span className="px-2 py-0.5 rounded bg-[#161622] border border-[#232332] text-white">Nagad</span>
            <span className="px-2 py-0.5 rounded bg-[#161622] border border-[#232332] text-white">Cash on Delivery</span>
            <span className="px-2 py-0.5 rounded bg-[#161622] border border-[#232332] text-white">Visa / Master</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors">
              Terms & Conditions
            </button>
            <span>·</span>
            <button onClick={() => handleNav('admin')} className="text-[#c5a059] hover:underline">
              Admin Access
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#555568] flex items-center justify-center gap-1">
          <span>&copy; {new Date().getFullYear()} YŌKOSO Restaurant Sylhet. Crafted with</span>
          <Heart className="w-3 h-3 text-[#c5a059] inline fill-[#c5a059]" />
          <span>for authentic culinary perfection.</span>
        </div>
      </div>
    </footer>
  );
}
