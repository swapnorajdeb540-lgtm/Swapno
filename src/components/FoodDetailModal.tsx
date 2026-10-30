import React, { useState } from 'react';
import { X, Clock, Flame, ShieldCheck, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Product, ProductVariant, ProductAddon } from '../data/restaurantData.ts';
import { useCart } from '../context/CartContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface FoodDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function FoodDetailModal({ product, onClose }: FoodDetailModalProps) {
  const { addItem, setIsCartOpen } = useCart();
  const { language, t, formatPrice } = useLanguage();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(() => {
    return product?.variants ? product.variants.find((v) => v.is_default) || product.variants[0] : undefined;
  });
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const toggleAddon = (addon: ProductAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const variantExtra = selectedVariant ? selectedVariant.additional_price_bdt : 0;
  const addonsExtra = selectedAddons.reduce((sum, a) => sum + a.price_bdt, 0);
  const unitPrice = product.price_bdt + variantExtra + addonsExtra;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant, selectedAddons, specialInstructions);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
      setIsCartOpen(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative bg-[#12121a] border border-[#262638] rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Food Image */}
        <div className="md:w-1/2 relative bg-[#181824] min-h-[240px] md:min-h-full">
          <img
            src={product.image_url}
            alt={product.name_en}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent md:hidden" />
        </div>

        {/* Food Details & Customization */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#c5a059] uppercase tracking-wider font-mono">
                <span>{product.category_id}</span>
                {product.dietary_tags.map((tag) => (
                  <span key={tag} className="text-[#a0a0b8]">· {tag}</span>
                ))}
              </div>
              <h3 className="text-xl font-bold text-white font-brand mt-1">
                {language === 'bn' ? product.name_bn : product.name_en}
              </h3>
              <p className="text-sm font-semibold text-[#c5a059] mt-1 font-mono">
                {formatPrice(product.price_bdt)}
              </p>
            </div>

            <p className="text-xs text-[#a0a0b5] leading-relaxed">
              {language === 'bn' ? product.description_bn : product.description_en}
            </p>

            {/* Preparation & Spicy indicators */}
            <div className="flex items-center gap-4 text-xs text-[#8e8ea6] pt-2 border-t border-[#1e1e2c]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                {product.preparation_time_minutes} mins
              </span>
              {product.spicy_level > 0 && (
                <span className="flex items-center gap-1 text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  {'🌶️'.repeat(product.spicy_level)}
                </span>
              )}
              {product.calories && (
                <span>{product.calories} kcal</span>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#1e1e2c]">
                <label className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  {t.selectVariant}
                </label>
                <div className="space-y-1.5">
                  {product.variants.map((v) => (
                    <label
                      key={v.id}
                      className={`flex items-center justify-between p-2.5 rounded text-xs cursor-pointer border transition-colors ${
                        selectedVariant?.id === v.id
                          ? 'border-[#c5a059] bg-[#1a1a28] text-white'
                          : 'border-[#232332] text-[#9090a6] hover:border-[#323246]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="variant"
                          checked={selectedVariant?.id === v.id}
                          onChange={() => setSelectedVariant(v)}
                          className="accent-[#c5a059]"
                        />
                        <span>{language === 'bn' ? v.name_bn : v.name_en}</span>
                      </div>
                      {v.additional_price_bdt > 0 && (
                        <span className="font-mono text-[#c5a059]">+{formatPrice(v.additional_price_bdt)}</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Addons */}
            {product.addons && product.addons.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#1e1e2c]">
                <label className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  {t.optionalAddons}
                </label>
                <div className="space-y-1.5">
                  {product.addons.map((a) => {
                    const isSelected = selectedAddons.some((x) => x.id === a.id);
                    return (
                      <label
                        key={a.id}
                        className={`flex items-center justify-between p-2.5 rounded text-xs cursor-pointer border transition-colors ${
                          isSelected
                            ? 'border-[#c5a059] bg-[#1a1a28] text-white'
                            : 'border-[#232332] text-[#9090a6] hover:border-[#323246]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleAddon(a)}
                            className="accent-[#c5a059] rounded"
                          />
                          <span>{language === 'bn' ? a.name_bn : a.name_en}</span>
                        </div>
                        <span className="font-mono text-[#c5a059]">+{formatPrice(a.price_bdt)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-1 pt-2 border-t border-[#1e1e2c]">
              <label className="text-xs font-medium text-[#9a9ab2]">
                {t.specialInstructions}
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Less spicy, extra ginger, separate sauce..."
                className="w-full bg-[#161622] border border-[#272738] rounded p-2 text-xs text-white placeholder-[#5a5a72] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          {/* Bottom Actions: Quantity & Add Button */}
          <div className="pt-4 border-t border-[#222232] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9090a8]">Quantity</span>
              <div className="flex items-center border border-[#2a2a3e] rounded bg-[#161622]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-[#9090a6] hover:text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-mono font-bold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-[#9090a6] hover:text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3 rounded font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                isAdded
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#c5a059] hover:bg-[#d4b067] text-[#0d0d12]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isAdded ? t.added : `${t.add} · ${formatPrice(totalPrice)}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
