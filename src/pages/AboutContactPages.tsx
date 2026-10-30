import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Award, ChefHat, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

export function AboutPage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { language } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Intro */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest">
          Our Heritage & Craft
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white font-brand">
          The Story of YŌKOSO
        </h1>
        <p className="text-xs sm:text-sm text-[#9090a8] leading-relaxed">
          Bringing the serene beauty and culinary rigor of Japan and Pan-Asia to Mirboxtula, Sylhet.
        </p>
      </div>

      {/* Main Narrative Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-[#a0a0b8] leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-brand">
            Culinary Precision Meets Omotenashi
          </h2>
          <p>
            Established on the 2nd Floor of Al-Madani Tower in Mirboxtula, YŌKOSO was born from a singular passion: to offer Sylhet an authentic, uncompromised Pan-Asian and Japanese dining sanctuary.
          </p>
          <p>
            In Japanese, <em>Yōkoso</em> (ようこそ) means &quot;Welcome&quot;. To us, it signifies an earnest oath of hospitality—anticipating each guest&apos;s need, presenting seafood at peak ocean freshness, and ensuring every steaming ramen broth has been slow-cooked with deep respect for craft.
          </p>
          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => onNavigate('reservations')}
              className="px-5 py-2.5 bg-[#c5a059] text-[#0d0d12] font-semibold text-xs rounded hover:bg-[#d8b56f]"
            >
              Reserve a Table
            </button>
            <button
              onClick={() => onNavigate('menu')}
              className="px-5 py-2.5 bg-[#1a1a26] text-white border border-[#2e2e42] text-xs rounded hover:border-[#c5a059]"
            >
              Explore Menu
            </button>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-[#252538] bg-[#14141e] shadow-xl">
          <img
            src="/src/assets/images/hero_japanese_dining_1793346958891.jpg"
            alt="Interior Atmosphere"
            referrerPolicy="no-referrer"
            className="w-full h-72 object-cover"
          />
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#12121a] border border-[#222230] rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
            <ChefHat className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-brand">Authentic Recipes</h3>
          <p className="text-xs text-[#808098] leading-relaxed">
            Our broth master cooks tonkotsu & shoyu dashi for 14 hours. We use genuine nori, Japanese rice, and micro-filleted fresh fish.
          </p>
        </div>

        <div className="bg-[#12121a] border border-[#222230] rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-brand">100% Halal Integrity</h3>
          <p className="text-xs text-[#808098] leading-relaxed">
            Every poultry and beef cut is certified Halal. Strict kitchen segregation and hygiene standards ensure peace of mind for all diners.
          </p>
        </div>

        <div className="bg-[#12121a] border border-[#222230] rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-brand">Shoji Private Suites</h3>
          <p className="text-xs text-[#808098] leading-relaxed">
            Designed for Sylhet families and business executives who seek privacy, ambient acoustic comfort, and attentive service.
          </p>
        </div>
      </div>
    </div>
  );
}

import { RestaurantSettings } from '../data/restaurantData.ts';

export function ContactPage({ settings }: { settings?: RestaurantSettings | null }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const contactPhone = settings?.phone || '+8801841965676';
  const contactEmail = settings?.email || 'yokoso.syl@gmail.com';
  const contactAddress = settings?.address_line || '2nd Floor, Al-Madani Tower, Mirboxtula, Sylhet, Bangladesh';
  const contactHours = settings?.opening_hours_en || 'Everyday: 12:30 PM – 11:00 PM (BST)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest">
          Direct Inquiries
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white font-brand">
          Contact YŌKOSO Sylhet
        </h1>
        <p className="text-xs text-[#808098]">
          Have questions regarding reservations, private party catering, or home delivery?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 bg-[#12121a] border border-[#222232] rounded-xl p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
            Restaurant Headquarters
          </h3>

          <div className="space-y-4 text-xs text-[#a0a0b8]">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">Address</p>
                <p className="mt-0.5 leading-relaxed">
                  {contactAddress}
                </p>
                <p className="text-[11px] text-[#707085] mt-0.5">
                  (Elevator access available to the 2nd Floor)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">Direct Telephone & WhatsApp</p>
                <a href={`tel:${contactPhone}`} className="text-[#c5a059] hover:underline font-mono text-sm">
                  {contactPhone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">Email Correspondence</p>
                <a href={`mailto:${contactEmail}`} className="text-white hover:text-[#c5a059]">
                  {contactEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">Service Hours</p>
                <p className="mt-0.5">{contactHours}</p>
              </div>
            </div>
          </div>

          {/* Interactive Map preview representation */}
          <div className="p-4 bg-[#171724] border border-[#252538] rounded-lg space-y-2">
            <p className="text-xs font-semibold text-white">Google Maps Pin</p>
            <p className="text-[11px] text-[#757590]">
              Coordinates: 24.8949° N, 91.8687° E · Mirboxtula Point
            </p>
            <a
              href="https://maps.google.com/?q=Mirboxtula,+Sylhet"
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-1 text-xs text-[#c5a059] hover:underline font-medium"
            >
              Open in Google Maps &rarr;
            </a>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-[#12121a] border border-[#222232] rounded-xl p-6 sm:p-8 space-y-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
            Send a Direct Message
          </h3>

          {sent && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Thank you! Your message has been sent to our concierge team.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[#a0a0b8]">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asif Mahmud"
                  className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#a0a0b8]">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801841965676"
                  className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#a0a0b8]">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a0a0b8]">Your Message / Inquiry *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you with catering, reservations, or feedback?"
                className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#c5a059] hover:bg-[#d8b56f] text-[#0d0d12] font-semibold rounded text-xs transition-colors"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
