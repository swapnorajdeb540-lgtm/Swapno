import React, { useState } from 'react';
import { Search, Flame, Clock, Filter, Plus, Check, ShoppingBag } from 'lucide-react';
import { Product, Category } from '../data/restaurantData.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useCart } from '../context/CartContext.tsx';

interface MenuPageProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export function MenuPage({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
}: MenuPageProps) {
  const { language, t, formatPrice } = useLanguage();
  const { addItem, setIsCartOpen } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const dietaryFilters = ['all', 'Halal', 'Chef Special', 'Seafood', 'Vegetarian'];

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description_en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDietary =
      selectedDietary === 'all' || (p.dietary_tags && p.dietary_tags.includes(selectedDietary));

    return matchesCategory && matchesSearch && matchesDietary;
  });

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    // If product has required variants or complex addons, open modal
    if (product.variants && product.variants.length > 1) {
      onSelectProduct(product);
      return;
    }
    const defaultVariant = product.variants ? product.variants[0] : undefined;
    addItem(product, 1, defaultVariant);
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header & Search */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest">
          Authentic Pan-Asian Kitchen
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white font-brand">
          {t.menu}
        </h1>
        <p className="text-xs sm:text-sm text-[#9090a8] leading-relaxed">
          {language === 'bn'
            ? 'খাঁটি জাপানিজ ও প্যান-এশিয়ান রেসিপিতে তৈরি তাজা সুশি, ১২ ঘণ্টার জ্বাল দেয়া রামেন ও বাও।'
            : 'Every dish is made to order using imported ingredients, wild-caught seafood, and authentic Japanese tare reductions.'}
        </p>

        {/* Search bar */}
        <div className="relative max-w-lg mx-auto pt-2">
          <Search className="w-4 h-4 text-[#707088] absolute left-3.5 top-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-[#14141e] border border-[#262638] rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#606078] focus:outline-none focus:border-[#c5a059]"
          />
        </div>
      </div>

      {/* Category Tabs (All 12 categories) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#c5a059] text-[#0d0d12] font-semibold'
                : 'bg-[#14141e] text-[#a0a0b8] border border-[#242436] hover:text-white hover:border-[#38384f]'
            }`}
          >
            {t.allCategories} ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#c5a059] text-[#0d0d12] font-semibold'
                    : 'bg-[#14141e] text-[#a0a0b8] border border-[#242436] hover:text-white hover:border-[#38384f]'
                }`}
              >
                <span>{language === 'bn' ? cat.name_bn : cat.name_en}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Dietary Preferences Secondary Filter */}
        <div className="flex items-center gap-2 text-xs text-[#808098] pt-1 border-t border-[#1a1a27]">
          <span className="flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#c5a059]" />
            Dietary:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {dietaryFilters.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedDietary(tag)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  selectedDietary === tag
                    ? 'bg-[#222232] text-[#c5a059] font-medium border border-[#c5a059]/40'
                    : 'text-[#808098] hover:text-white'
                }`}
              >
                {tag === 'all' ? 'All' : tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Food Items Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#12121a] border border-[#20202e] rounded-xl space-y-3">
          <p className="text-base text-white font-medium">No dishes found matching your criteria</p>
          <p className="text-xs text-[#707085]">Try clearing search or choosing another category</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDietary('all');
              onSelectCategory('all');
            }}
            className="px-4 py-2 bg-[#252538] text-xs text-[#e5e5eb] rounded hover:bg-[#32324a]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isJustAdded = recentlyAddedId === product.id;
            return (
              <div
                key={product.id}
                className={`bg-[#13131c] border rounded-xl overflow-hidden shadow-lg transition-all flex flex-col justify-between group ${
                  product.is_available
                    ? 'border-[#222230] hover:border-[#c5a059]/50'
                    : 'border-[#222230]/50 opacity-60'
                }`}
              >
                {/* Image */}
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
                  {!product.is_available && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="px-3 py-1 bg-red-950/80 border border-red-700 text-red-300 text-xs font-semibold rounded">
                        Currently Sold Out
                      </span>
                    </div>
                  )}
                  {product.dietary_tags && product.dietary_tags.length > 0 && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#0d0d12]/85 text-[#c5a059] text-[10px] font-mono tracking-wider uppercase rounded backdrop-blur-xs border border-[#c5a059]/30">
                      {product.dietary_tags[0]}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div onClick={() => onSelectProduct(product)} className="cursor-pointer space-y-1">
                    <div className="flex items-center justify-between text-xs text-[#808098] font-mono">
                      <span className="uppercase">{product.category_id}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#c5a059]" />
                        {product.preparation_time_minutes}m
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-brand group-hover:text-[#c5a059] transition-colors truncate">
                      {language === 'bn' ? product.name_bn : product.name_en}
                    </h3>

                    <p className="text-xs text-[#88889c] line-clamp-2 leading-relaxed">
                      {language === 'bn' ? product.description_bn : product.description_en}
                    </p>

                    {product.spicy_level > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-amber-400 pt-0.5">
                        <Flame className="w-3 h-3" />
                        <span>{'🌶️'.repeat(product.spicy_level)} Spicy</span>
                      </div>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-[#1e1e2c] flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-white font-mono tabular-nums">
                        {formatPrice(product.price_bdt)}
                      </span>
                      {product.variants && product.variants.length > 1 && (
                        <p className="text-[10px] text-[#707085]">Multiple sizes</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="px-2.5 py-1.5 text-xs text-[#b0b0c2] hover:text-white bg-[#1b1b26] rounded border border-[#2b2b3d]"
                      >
                        {t.viewDetails}
                      </button>
                      <button
                        disabled={!product.is_available}
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1 ${
                          isJustAdded
                            ? 'bg-emerald-500 text-white'
                            : !product.is_available
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-[#c5a059] hover:bg-[#d8b56f] text-[#0d0d12]'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>{t.add}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
