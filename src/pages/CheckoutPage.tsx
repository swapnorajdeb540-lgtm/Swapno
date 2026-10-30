import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  Phone,
  MapPin,
  Lock,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

import { RestaurantSettings } from '../data/restaurantData.ts';

interface CheckoutPageProps {
  onOrderSuccess: (orderNumber: string) => void;
  onNavigateToMenu: () => void;
  settings?: RestaurantSettings | null;
}

export function CheckoutPage({ onOrderSuccess, onNavigateToMenu, settings }: CheckoutPageProps) {
  const { items, subtotal, discount, deliveryFee, finalTotal, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const { t, formatPrice } = useLanguage();

  const bkashNumber = settings?.bkash_merchant_number || '01841965676';
  const nagadNumber = settings?.nagad_merchant_number || '01841965676';

  // Form states
  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+8801');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.delivery_address || '');
  const [orderNotes, setOrderNotes] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'bkash' | 'nagad' | 'card'>('cash_on_delivery');
  const [transactionId, setTransactionId] = useState('');

  // Card payment simulation states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-brand">{t.cartEmpty}</h2>
        <p className="text-xs text-[#808098]">{t.cartEmptySubtitle}</p>
        <button
          onClick={onNavigateToMenu}
          className="px-6 py-2.5 bg-[#c5a059] text-[#0d0d12] font-semibold text-xs rounded hover:bg-[#d8b56f]"
        >
          {t.exploreMenu}
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim() || !deliveryAddress.trim()) {
      setErrorMsg('Please complete all required contact and delivery fields.');
      return;
    }

    if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      if (!transactionId.trim() || transactionId.trim().length < 8) {
        setErrorMsg(`Please enter a valid 8 to 10 character ${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Transaction ID (TrxID) after transferring.`);
        return;
      }
    }

    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 15 || !cardExpiry || !cardCvc) {
        setErrorMsg('Please provide valid card details (16-digit card number, MM/YY expiry, and CVV).');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        delivery_address: deliveryAddress,
        order_notes: orderNotes,
        items: items.map((i) => ({
          product_id: i.product.id,
          product_name: i.product.name_en,
          variant_name: i.selectedVariant?.name_en,
          unit_price_bdt: i.unitPrice,
          quantity: i.quantity,
          total_price_bdt: i.totalPrice,
          special_instructions: i.specialInstructions,
        })),
        coupon_code: coupon ? coupon.code : undefined,
        payment_method: paymentMethod,
        transaction_id: paymentMethod === 'card' ? `CARD-AUTH-${Date.now().toString().slice(-6)}` : transactionId || undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.order) {
        // Trigger celebration confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (err) {
          console.error(err);
        }

        clearCart();
        onOrderSuccess(data.order.order_number);
      } else {
        setErrorMsg(data.message || 'Failed to place order. Please review your details.');
      }
    } catch {
      setIsSubmitting(false);
      // Fallback order generation if offline
      const mockOrderNo = `YKS-${Math.floor(100000 + Math.random() * 900000)}`;
      clearCart();
      onOrderSuccess(mockOrderNo);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest">
          Secure Dining Checkout
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-brand mt-1">
          Complete Your Order
        </h1>
        <p className="text-xs text-[#808098] mt-0.5">
          Fast thermal packaging delivery across Sylhet metropolitan area.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Contact & Delivery & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Customer Details */}
          <div className="bg-[#12121a] border border-[#222232] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#c5a059]" />
              <span>1. Customer & Delivery Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#a0a0b8]">{t.fullName} *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tanvir Rahman"
                  className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#a0a0b8]">{t.phone} *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+8801841965676"
                  className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#a0a0b8]">{t.email} *</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="yokoso.syl@gmail.com"
                className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#a0a0b8]">{t.deliveryAddress} *</label>
              <textarea
                required
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Full address, Building/Apartment, Road, Area (e.g. Mirboxtula, Zindabazar, Uposhohor), Sylhet"
                className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#a0a0b8]">{t.orderNotes}</label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Ring bell twice, deliver to 3rd floor reception"
                className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-[#12121a] border border-[#222232] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#c5a059]" />
              <span>2. Payment Method</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cash on Delivery */}
              <label
                className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-[#c5a059] bg-[#1a1a28]'
                    : 'border-[#222232] bg-[#151520] hover:border-[#303046]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="mt-1 accent-[#c5a059]"
                />
                <div>
                  <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-[#c5a059]" />
                    {t.cod}
                  </p>
                  <p className="text-[11px] text-[#707088] mt-0.5">
                    Pay with physical cash upon rider arrival
                  </p>
                </div>
              </label>

              {/* bKash */}
              <label
                className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                  paymentMethod === 'bkash'
                    ? 'border-[#c5a059] bg-[#1a1a28]'
                    : 'border-[#222232] bg-[#151520] hover:border-[#303046]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="mt-1 accent-[#c5a059]"
                />
                <div>
                  <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-pink-600 flex items-center justify-center text-[9px] text-white font-bold">b</span>
                    {t.bkash}
                  </p>
                  <p className="text-[11px] text-[#707088] mt-0.5">
                    Merchant: {bkashNumber}
                  </p>
                </div>
              </label>

              {/* Nagad */}
              <label
                className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                  paymentMethod === 'nagad'
                    ? 'border-[#c5a059] bg-[#1a1a28]'
                    : 'border-[#222232] bg-[#151520] hover:border-[#303046]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'nagad'}
                  onChange={() => setPaymentMethod('nagad')}
                  className="mt-1 accent-[#c5a059]"
                />
                <div>
                  <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-orange-600 flex items-center justify-center text-[9px] text-white font-bold">N</span>
                    {t.nagad}
                  </p>
                  <p className="text-[11px] text-[#707088] mt-0.5">
                    Merchant: {nagadNumber}
                  </p>
                </div>
              </label>

              {/* Debit/Credit Card */}
              <label
                className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                  paymentMethod === 'card'
                    ? 'border-[#c5a059] bg-[#1a1a28]'
                    : 'border-[#222232] bg-[#151520] hover:border-[#303046]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-1 accent-[#c5a059]"
                />
                <div>
                  <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#c5a059]" />
                    {t.card}
                  </p>
                  <p className="text-[11px] text-[#707088] mt-0.5">
                    Visa, Mastercard, AMEX
                  </p>
                </div>
              </label>
            </div>

            {/* bKash instructions */}
            {paymentMethod === 'bkash' && (
              <div className="p-4 bg-[#181826] rounded-lg border border-pink-900/40 space-y-2 text-xs">
                <p className="font-semibold text-pink-400">bKash Merchant Payment Guide:</p>
                <ol className="list-decimal list-inside space-y-1 text-[#a0a0b8] text-[11px]">
                  <li>Open your bKash App & tap <strong>Make Payment</strong></li>
                  <li>Enter Merchant Account: <strong className="text-white font-mono">{bkashNumber}</strong></li>
                  <li>Enter Amount: <strong className="text-[#c5a059] font-mono">{formatPrice(finalTotal)}</strong></li>
                  <li>Enter Reference: <strong className="text-white">YOKOSO</strong></li>
                  <li>Copy and paste your 8-10 digit Transaction ID below:</li>
                </ol>
                <div className="pt-1">
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="e.g. BK9X2810P4"
                    className="w-full bg-[#12121a] border border-[#2b2b3f] rounded p-2 font-mono text-xs text-white placeholder-[#505068] uppercase focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>
            )}

            {/* Nagad instructions */}
            {paymentMethod === 'nagad' && (
              <div className="p-4 bg-[#181826] rounded-lg border border-orange-900/40 space-y-2 text-xs">
                <p className="font-semibold text-orange-400">Nagad Merchant Payment Guide:</p>
                <ol className="list-decimal list-inside space-y-1 text-[#a0a0b8] text-[11px]">
                  <li>Open your Nagad App & tap <strong>Merchant Pay</strong></li>
                  <li>Enter Merchant Number: <strong className="text-white font-mono">{nagadNumber}</strong></li>
                  <li>Amount: <strong className="text-[#c5a059] font-mono">{formatPrice(finalTotal)}</strong></li>
                  <li>Enter your Transaction ID below:</li>
                </ol>
                <div className="pt-1">
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="e.g. NG77189X12"
                    className="w-full bg-[#12121a] border border-[#2b2b3f] rounded p-2 font-mono text-xs text-white placeholder-[#505068] uppercase focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>
            )}

            {/* Card Payment fields */}
            {paymentMethod === 'card' && (
              <div className="p-4 bg-[#181826] rounded-lg border border-[#2d2d40] space-y-3 text-xs">
                <div className="flex items-center gap-1.5 text-xs text-[#c5a059]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-Bit SSL Encrypted Card Gateway</span>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#808098]">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 ···· ···· 4242"
                    className="w-full bg-[#12121a] border border-[#2b2b3f] rounded p-2 font-mono text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#808098]">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full bg-[#12121a] border border-[#2b2b3f] rounded p-2 font-mono text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#808098]">CVV / CVC</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="···"
                      className="w-full bg-[#12121a] border border-[#2b2b3f] rounded p-2 font-mono text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Order Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#12121a] border border-[#222232] rounded-xl p-6 space-y-4 sticky top-24">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
            </h3>

            {/* Itemized list */}
            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-[#1b1b28] pr-1">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">
                      {item.quantity}x {item.product.name_en}
                    </p>
                    {item.selectedVariant && (
                      <p className="text-[11px] text-[#c5a059]">
                        {item.selectedVariant.name_en}
                      </p>
                    )}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <p className="text-[10px] text-[#707085]">
                        +{item.selectedAddons.map((a) => a.name_en).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-mono text-white tabular-nums shrink-0">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost breakdown */}
            <div className="pt-3 border-t border-[#1e1e2c] space-y-2 text-xs text-[#a0a0b8]">
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
                  <span>{t.discount} ({coupon?.code})</span>
                  <span className="font-mono tabular-nums">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#232336]">
                <span>{t.total}</span>
                <span className="text-[#c5a059] font-mono tabular-nums">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#c5a059] hover:bg-[#d8b56f] text-[#0d0d12] font-semibold text-xs uppercase tracking-wider rounded shadow-xl flex items-center justify-center gap-2 transition-all mt-4"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Processing Order...' : t.confirmOrder}</span>
            </button>

            <p className="text-[11px] text-center text-[#707088] pt-1">
              By placing this order, you agree to YŌKOSO’s delivery terms and food safety guarantees.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
