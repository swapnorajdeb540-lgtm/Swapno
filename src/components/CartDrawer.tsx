import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, Tag, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    coupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    deliveryFee,
    finalTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const { t, formatPrice } = useLanguage();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponFeedback(null);
    const result = await applyCoupon(couponInput.trim());
    setIsApplying(false);
    if (result.success) {
      setCouponFeedback({ type: 'success', message: result.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111118] border-l border-[#242434] shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#202030] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
              <h2 className="text-base font-semibold tracking-wide text-white uppercase font-brand">
                {t.cart} ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#9a9ab0] hover:text-white rounded hover:bg-[#1c1c28]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery threshold indicator */}
          <div className="bg-[#181824] px-6 py-2.5 border-b border-[#222232] text-xs">
            {subtotal >= 2000 ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Congratulations! You qualify for Free Sylhet Delivery
              </span>
            ) : (
              <span className="text-[#a0a0b8]">
                Add <span className="text-[#c5a059] font-semibold">{formatPrice(2000 - subtotal)}</span> more for Free Delivery!
              </span>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-[#1e1e2d]">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#1b1b26] flex items-center justify-center text-[#c5a059]">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-base font-medium text-white">{t.cartEmpty}</h3>
                <p className="text-xs text-[#808098] max-w-xs mx-auto leading-relaxed">
                  {t.cartEmptySubtitle}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-[#0d0d12] bg-[#c5a059] rounded"
                >
                  {t.exploreMenu}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name_en}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded bg-[#181822] shrink-0 border border-[#232332]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-white truncate">
                        {item.product.name_en}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#75758a] hover:text-red-400 p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedVariant && (
                      <p className="text-xs text-[#c5a059] mt-0.5">
                        {item.selectedVariant.name_en}
                      </p>
                    )}

                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <p className="text-[11px] text-[#9090a8] mt-0.5 truncate">
                        + {item.selectedAddons.map((a) => a.name_en).join(', ')}
                      </p>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[10px] text-[#808096] italic mt-0.5 truncate">
                        &quot;{item.specialInstructions}&quot;
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-[#2a2a3c] rounded bg-[#161622]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-white text-[#9090a6]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono tabular-nums text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-white text-[#9090a6]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-white font-mono tabular-nums">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Summary */}
          {items.length > 0 && (
            <div className="px-6 py-4 bg-[#14141e] border-t border-[#222232] space-y-3">
              {/* Coupon Form */}
              {coupon ? (
                <div className="flex items-center justify-between p-2 rounded bg-[#1c1c2b] border border-[#c5a059]/40 text-xs">
                  <div className="flex items-center gap-1.5 text-[#c5a059]">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-mono font-semibold">{coupon.code}</span>
                    <span className="text-[#a0a0b8]">applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t.couponPlaceholder}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-[#1a1a26] border border-[#2a2a3e] rounded px-3 py-1.5 text-xs text-white placeholder-[#686880] focus:outline-none focus:border-[#c5a059]"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-3 py-1.5 bg-[#252538] hover:bg-[#32324a] text-xs font-medium text-[#e5e5eb] rounded transition-colors"
                    >
                      {isApplying ? '...' : t.applyCoupon}
                    </button>
                  </div>
                  {couponFeedback && (
                    <p
                      className={`text-[11px] ${
                        couponFeedback.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {couponFeedback.message}
                    </p>
                  )}
                </form>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-[#a0a0b6] pt-1">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="text-white font-mono tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.deliveryFee}</span>
                  <span className="text-white font-mono tabular-nums">
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>{t.discount}</span>
                    <span className="font-mono tabular-nums">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#252536]">
                  <span>{t.total}</span>
                  <span className="text-[#c5a059] font-mono tabular-nums">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full py-3 bg-[#c5a059] hover:bg-[#d4b067] text-[#0d0d12] font-semibold text-sm rounded shadow-lg flex items-center justify-center gap-2 transition-all mt-2"
              >
                <span>{t.checkout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
