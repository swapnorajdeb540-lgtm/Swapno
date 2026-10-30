import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, ProductAddon, Coupon } from '../data/restaurantData.ts';

export interface CartItem {
  id: string; // unique item composite key
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedAddons?: ProductAddon[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    variant?: ProductVariant,
    addons?: ProductAddon[],
    specialInstructions?: string
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  coupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  finalTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('yokoso_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('yokoso_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('yokoso_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem('yokoso_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('yokoso_coupon');
      }
    } catch (e) {
      console.error(e);
    }
  }, [coupon]);

  const addItem = (
    product: Product,
    quantity = 1,
    variant?: ProductVariant,
    addons?: ProductAddon[],
    specialInstructions?: string
  ) => {
    const variantKey = variant ? variant.id : 'default';
    const addonsKey = addons && addons.length > 0 ? addons.map((a) => a.id).sort().join('-') : 'none';
    const itemId = `${product.id}_${variantKey}_${addonsKey}`;

    const variantExtra = variant ? variant.additional_price_bdt : 0;
    const addonsExtra = addons ? addons.reduce((sum, a) => sum + a.price_bdt, 0) : 0;
    const unitPrice = product.price_bdt + variantExtra + addonsExtra;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * unitPrice,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          quantity,
          selectedVariant: variant,
          selectedAddons: addons,
          specialInstructions,
          unitPrice,
          totalPrice: unitPrice * quantity,
        },
      ];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);

  // Delivery charge rule: ৳70, or free if subtotal >= ৳2,000
  const deliveryFee = subtotal > 0 ? (subtotal >= 2000 ? 0 : 70) : 0;

  let discount = 0;
  if (coupon && subtotal >= coupon.minimum_spend_bdt) {
    if (coupon.discount_percentage) {
      discount = Math.round((subtotal * coupon.discount_percentage) / 100);
    } else if (coupon.discount_amount_bdt) {
      discount = coupon.discount_amount_bdt;
    }
  }

  const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupon({
          code: data.code,
          discount_amount_bdt: data.discount,
          minimum_spend_bdt: 0,
          description: data.description || 'Promotional coupon discount',
          is_active: true,
        });
        return { success: true, message: `Coupon applied: ৳${data.discount} discount!` };
      } else {
        return { success: false, message: data.message || 'Invalid coupon' };
      }
    } catch {
      // Local fallback
      const validCode = code.toUpperCase().trim();
      if (validCode === 'YOKOSO10' && subtotal >= 1000) {
        setCoupon({
          code: 'YOKOSO10',
          discount_percentage: 10,
          minimum_spend_bdt: 1000,
          description: '10% discount applied',
          is_active: true,
        });
        return { success: true, message: 'YOKOSO10 applied (10% discount)!' };
      }
      return { success: false, message: 'Could not validate coupon. Minimum spend may not be reached.' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        coupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        deliveryFee,
        finalTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
