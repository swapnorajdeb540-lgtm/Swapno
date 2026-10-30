import React from 'react';
import { ArrowRight, Clock, MapPin, Phone, ShieldCheck, Star, Sparkles, Utensils, Award, ChefHat, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Product, Category, Review, RestaurantSettings } from '../data/restaurantData.ts';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  settings?: RestaurantSettings | null;
  onSelectProduct: (product: Product) => void;
  onNavigate: (tab: string, categoryId?: string) => void;
  onAddToCart: (product: Product) => void;
}

export function HomePage({
  products,
  categories,
  reviews,
  settings,
  onSelectProduct,
  onNavigate,
  onAddToCart,
}: HomePageProps) {
  const { language, t, formatPrice } = useLanguage();

  const featuredDishes = products.filter((p) => p.is_featured).slice(0, 4);
  const popularDishes = products.filter((p) => p.is_popular).slice(0, 4);

  const heroBannerUrl = settings?.hero_banner_url || '/src/assets/images/hero_japanese_dining_1793346958891.jpg';
  const heroTitle = settings?.hero_title || 'YŌKOSO RESTAURANT';

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden border-b border-[#222232]">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBannerUrl}
            alt={heroTitle}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/80 to-[#0d0d12]/40" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1c28]/90 border border-[#c5a059]/40 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="text-xs uppercase tracking-widest text-[#c5a059] font-mono font-medium">
              Al-Madani Tower · Mirboxtula, Sylhet
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-brand text-balance drop-shadow-md">
            {heroTitle}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#d0d0e2] font-light leading-relaxed">
            {language === 'bn'
              ? (settings?.tagline_bn || 'সিলেটের প্রথম পূর্ণাঙ্গ জাপানিজ ও প্যান-এশিয়ান ফাইন ডাইনিং। খাঁটি সুশি, ১২ ঘণ্টা জ্বাল দেয়া রামেন ও স্টিমিং ডিম সামের অতুলনীয় স্বাদ।')
              : (settings?.tagline_en || 'Sylhet’s definitive culinary sanctuary. Masterfully sliced sushi, slow-simmered rich ramen, and handcrafted dim sum prepared with Japanese reverence.')}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('menu')}
              className="px-7 py-3.5 bg-[#c5a059] hover:bg-[#d4b067] text-[#0d0d12] font-semibold text-sm rounded shadow-xl flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <span>{t.orderNow}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('reservations')}
              className="px-7 py-3.5 bg-[#181824]/90 hover:bg-[#242436] text-white border border-[#35354a] hover:border-[#c5a059] font-medium text-sm rounded backdrop-blur-md transition-all"
            >
              {t.reserveTable}
            </button>

            <button
              onClick={() => onNavigate('menu')}
              className="px-5 py-3.5 text-[#b5b5c6] hover:text-white text-sm font-medium transition-colors"
            >
              {t.exploreMenu} &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#12121a] border border-[#20202e] rounded-xl text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">100% Halal Certified</p>
              <p className="text-xs text-[#808098]">Strictly Halal meats & fresh seafood</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] shrink-0">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Master Japanese Chefs</p>
              <p className="text-xs text-[#808098]">Artisanal sushi & ramen tare</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Fast Sylhet Delivery</p>
              <p className="text-xs text-[#808098]">35-50 mins thermal packaging</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Shoji Private Suites</p>
              <p className="text-xs text-[#808098]">Intimate family & corporate dining</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOOD CATEGORIES STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest">
              Gastronomic Variety
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-brand mt-1">
              {language === 'bn' ? 'আমাদের বিশেষ খাদ্য বিভাগ' : 'Explore Pan-Asian Categories'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs text-[#c5a059] hover:underline font-semibold flex items-center gap-1"
          >
            <span>View Full 12 Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.slice(0, 12).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('menu', cat.id)}
              className="p-4 rounded-lg bg-[#14141e] border border-[#232332] hover:border-[#c5a059]/60 hover:bg-[#1a1a27] text-left transition-all group"
            >
              <div className="w-8 h-8 rounded bg-[#1f1f2e] group-hover:bg-[#c5a059]/20 flex items-center justify-center text-[#c5a059] transition-colors mb-2.5">
                <Utensils className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-[#c5a059] transition-colors truncate">
                {language === 'bn' ? cat.name_bn : cat.name_en}
              </h3>
              <p className="text-[11px] text-[#78788e] mt-0.5 line-clamp-1">
                {language === 'bn' ? cat.description_bn : cat.description_en}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 4. FEATURED SIGNATURE DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest">
            Chef Recommends
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-brand">
            {language === 'bn' ? 'সিগনেচার খাবার সমূহ' : 'Featured Masterpieces'}
          </h2>
          <p className="text-xs text-[#8e8ea2]">
            Signature sushi rolls, slow-simmered broths, and sizzling skillets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDishes.map((product) => (
            <div
              key={product.id}
              className="bg-[#13131c] border border-[#222230] rounded-xl overflow-hidden shadow-lg hover:border-[#c5a059]/50 transition-all flex flex-col justify-between group"
            >
              <div
                onClick={() => onSelectProduct(product)}
                className="cursor-pointer overflow-hidden relative h-48 bg-[#181824]"
              >
                <img
                  src={product.image_url}
                  alt={product.name_en}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.dietary_tags && product.dietary_tags.length > 0 && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#0d0d12]/85 text-[#c5a059] text-[10px] font-mono tracking-wider uppercase rounded backdrop-blur-xs border border-[#c5a059]/30">
                    {product.dietary_tags[0]}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div onClick={() => onSelectProduct(product)} className="cursor-pointer">
                  <div className="flex items-center justify-between text-xs text-[#808098] font-mono uppercase">
                    <span>{product.category_id}</span>
                    <span>{product.preparation_time_minutes} min</span>
                  </div>
                  <h3 className="text-base font-semibold text-white font-brand mt-1 group-hover:text-[#c5a059] transition-colors truncate">
                    {language === 'bn' ? product.name_bn : product.name_en}
                  </h3>
                  <p className="text-xs text-[#88889c] line-clamp-2 mt-1 leading-relaxed">
                    {language === 'bn' ? product.description_bn : product.description_en}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1e1e2c] flex items-center justify-between">
                  <span className="text-base font-bold text-white font-mono tabular-nums">
                    {formatPrice(product.price_bdt)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-2.5 py-1.5 text-xs text-[#b0b0c2] hover:text-white bg-[#1b1b26] rounded border border-[#2b2b3d]"
                    >
                      {t.viewDetails}
                    </button>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#0d0d12] bg-[#c5a059] hover:bg-[#d8b56f] rounded transition-colors"
                    >
                      {t.add}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. RESTAURANT AMBIANCE & STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#12121a] border border-[#202030] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
            <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest">
              The YŌKOSO Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-brand leading-tight">
              An Architectural Sanctuary of Taste in Sylhet
            </h2>
            <p className="text-sm text-[#9a9ab2] leading-relaxed">
              Located on the 2nd Floor of Al-Madani Tower in Mirboxtula, YŌKOSO introduces Sylhet to authentic Omotenashi—the ancient Japanese philosophy of wholehearted hospitality.
            </p>
            <p className="text-sm text-[#9a9ab2] leading-relaxed">
              Every cut of sashimi is precision-filleted, our signature ramen broths simmer for over 14 hours, and our dining chambers feature custom wood lattice Shoji screens to create an atmosphere of serene distinction.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-[#d0d0e2]">
                <Check className="w-4 h-4 text-[#c5a059]" />
                <span>Private Shoji screens for family dinners & meetings</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#d0d0e2]">
                <Check className="w-4 h-4 text-[#c5a059]" />
                <span>Authentic Japanese tare sauces and fresh ingredients</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#d0d0e2]">
                <Check className="w-4 h-4 text-[#c5a059]" />
                <span>Specialized thermal sealed home delivery packaging</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => onNavigate('reservations')}
                className="px-6 py-3 bg-[#c5a059] hover:bg-[#d8b56f] text-[#0d0d12] font-semibold text-xs rounded transition-colors"
              >
                Book a Private Table
              </button>
              <button
                onClick={() => onNavigate('gallery')}
                className="px-5 py-3 text-xs text-white bg-[#1c1c28] hover:bg-[#28283a] rounded border border-[#2f2f42] transition-colors"
              >
                View Restaurant Gallery
              </button>
            </div>
          </div>

          <div className="relative min-h-[340px] lg:min-h-full bg-[#181822]">
            <img
              src="/src/assets/images/restaurant_ambiance_interior_1793346962659.jpg"
              alt="YŌKOSO Private Tatami Suite Sylhet"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. POPULAR DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest">
              Diner Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-brand mt-1">
              {language === 'bn' ? 'সবচেয়ে জনপ্রিয় মেনু' : 'Most Popular in Sylhet'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs text-[#c5a059] hover:underline font-semibold"
          >
            Explore all items &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDishes.map((product) => (
            <div
              key={product.id}
              className="bg-[#13131c] border border-[#222230] rounded-xl overflow-hidden shadow-lg hover:border-[#c5a059]/50 transition-all flex flex-col justify-between group"
            >
              <div
                onClick={() => onSelectProduct(product)}
                className="cursor-pointer overflow-hidden relative h-48 bg-[#181824]"
              >
                <img
                  src={product.image_url}
                  alt={product.name_en}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div onClick={() => onSelectProduct(product)} className="cursor-pointer">
                  <span className="text-[11px] text-[#808098] font-mono uppercase">
                    {product.category_id}
                  </span>
                  <h3 className="text-base font-semibold text-white font-brand mt-0.5 group-hover:text-[#c5a059] transition-colors truncate">
                    {language === 'bn' ? product.name_bn : product.name_en}
                  </h3>
                  <p className="text-xs text-[#88889c] line-clamp-2 mt-1 leading-relaxed">
                    {language === 'bn' ? product.description_bn : product.description_en}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1e1e2c] flex items-center justify-between">
                  <span className="text-base font-bold text-white font-mono tabular-nums">
                    {formatPrice(product.price_bdt)}
                  </span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0d0d12] bg-[#c5a059] hover:bg-[#d8b56f] rounded transition-colors"
                  >
                    {t.add}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest">
            Verified Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-brand">
            {language === 'bn' ? 'সম্মানিত অতিথিদের মতামত' : 'What Our Guests Say'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-xl bg-[#13131d] border border-[#222232] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#b8b8cc] leading-relaxed italic">
                  &quot;{language === 'bn' && rev.comment_bn ? rev.comment_bn : rev.comment}&quot;
                </p>
              </div>

              <div className="pt-3 border-t border-[#1e1e2c]">
                <p className="text-sm font-semibold text-white">{rev.customer_name}</p>
                <p className="text-[11px] text-[#707085]">{rev.customer_location}</p>
                <p className="text-[10px] text-[#c5a059] mt-1 font-mono">
                  Ordered: {rev.dish_ordered}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. VISIT US & LOCATION / OPENING HOURS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#14141f] border border-[#242436] rounded-2xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="space-y-3">
            <span className="text-xs uppercase font-mono text-[#c5a059] tracking-widest">
              Location & Hours
            </span>
            <h3 className="text-2xl font-bold text-white font-brand">
              Visit Us at Mirboxtula
            </h3>
            <p className="text-xs text-[#8e8ea6] leading-relaxed">
              Experience serene Japanese dining in the heart of Sylhet. Ample parking, lift access to the 2nd Floor.
            </p>
          </div>

          <div className="space-y-4 text-xs text-[#a0a0b8]">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">Address</p>
                <p className="mt-0.5">2nd Floor, Al-Madani Tower, Mirboxtula, Sylhet, Bangladesh</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">Opening Hours</p>
                <p className="mt-0.5">12:30 PM – 11:00 PM (Daily)</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">Telephone & WhatsApp</p>
                <a href="tel:+8801841965676" className="text-white hover:text-[#c5a059] font-mono">
                  +8801841965676
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            <button
              onClick={() => onNavigate('reservations')}
              className="w-full py-3 bg-[#c5a059] hover:bg-[#d8b56f] text-[#0d0d12] font-semibold text-xs rounded shadow transition-colors text-center"
            >
              Reserve a Table
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-3 bg-[#1e1e2d] hover:bg-[#28283c] text-white border border-[#303046] text-xs font-medium rounded transition-colors text-center"
            >
              View Location Map & Directions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
