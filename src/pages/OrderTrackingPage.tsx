import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle,
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Phone,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Order } from '../../server.ts';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
}

export function OrderTrackingPage({ initialOrderNumber }: OrderTrackingPageProps) {
  const { t, formatPrice } = useLanguage();
  const [searchInput, setSearchInput] = useState(initialOrderNumber || 'YKS-928172');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  const fetchOrder = async (queryNumber: string) => {
    if (!queryNumber.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setCancelFeedback(null);

    try {
      const res = await fetch(`/api/orders/${queryNumber.trim()}`);
      const data = await res.json();
      setLoading(false);
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setErrorMsg('Order not found. Please verify the order number (e.g. YKS-928172).');
        setOrder(null);
      }
    } catch {
      setLoading(false);
      setErrorMsg('Could not connect to tracking server. Please try again.');
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      setSearchInput(initialOrderNumber);
      fetchOrder(initialOrderNumber);
    } else {
      fetchOrder('YKS-928172');
    }
  }, [initialOrderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchInput);
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      const res = await fetch(`/api/orders/${order.id}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        setCancelFeedback('Your order has been cancelled.');
      } else {
        setCancelFeedback(data.message || 'Unable to cancel this order.');
      }
    } catch {
      setCancelFeedback('Failed to cancel order.');
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'preparing', label: 'Kitchen Preparing', icon: ChefHat },
    { key: 'ready', label: 'Packed & Ready', icon: PackageCheck },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Bike },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    return statusSteps.findIndex((s) => s.key === status);
  };

  const currentStepIndex = order ? getStepIndex(order.order_status) : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest">
          Real-Time Dispatch
        </span>
        <h1 className="text-3xl font-bold text-white font-brand">
          {t.trackingTitle}
        </h1>
        <p className="text-xs text-[#808098]">
          Enter your unique YŌKOSO order code (e.g. YKS-928172 or YKS-481923)
        </p>

        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#707085] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              placeholder="e.g. YKS-928172"
              className="w-full bg-[#14141e] border border-[#242436] rounded pl-10 pr-3 py-2 text-xs font-mono tracking-wider text-white placeholder-[#55556a] focus:outline-none focus:border-[#c5a059]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#c5a059] text-[#0d0d12] text-xs font-semibold rounded hover:bg-[#d8b56f] transition-colors"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {errorMsg && (
        <div className="p-4 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {cancelFeedback && (
        <div className="p-4 rounded bg-[#181826] border border-[#c5a059] text-[#c5a059] text-xs">
          {cancelFeedback}
        </div>
      )}

      {order && (
        <div className="bg-[#12121a] border border-[#222232] rounded-xl overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1f1f2e]">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-mono font-bold text-white tracking-wider">
                  #{order.order_number}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-mono uppercase font-semibold ${
                    order.order_status === 'cancelled'
                      ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                      : order.order_status === 'delivered'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : 'bg-[#1e1e2d] text-[#c5a059] border border-[#c5a059]/40'
                  }`}
                >
                  {order.order_status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-[#707088] mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Placed on {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            {/* Cancel Button if eligible */}
            {order.order_status === 'pending' && (
              <button
                onClick={handleCancelOrder}
                className="px-3 py-1.5 text-xs text-rose-400 border border-rose-800/80 rounded hover:bg-rose-950/30 transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>

          {/* Stepper Timeline (if not cancelled) */}
          {order.order_status === 'cancelled' ? (
            <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-lg text-center space-y-1">
              <XCircle className="w-6 h-6 text-rose-400 mx-auto" />
              <p className="text-xs font-semibold text-rose-300">This order has been cancelled.</p>
              <p className="text-[11px] text-[#808098]">Please contact our hotline (+8801841965676) for any inquiries.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase text-[#c5a059] tracking-wider">
                Live Kitchen & Dispatch Timeline
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {statusSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={step.key}
                      className={`p-3 rounded-lg border text-center space-y-2 transition-all ${
                        isCurrent
                          ? 'bg-[#1e1e2d] border-[#c5a059] shadow-md'
                          : isDone
                          ? 'bg-[#151520] border-emerald-900/50 text-[#a0a0b8]'
                          : 'bg-[#111118] border-[#1c1c28] text-[#555568]'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                          isCurrent
                            ? 'bg-[#c5a059] text-[#0d0d12]'
                            : isDone
                            ? 'bg-emerald-900/40 text-emerald-400'
                            : 'bg-[#1a1a26] text-[#444458]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            isCurrent
                              ? 'text-white'
                              : isDone
                              ? 'text-[#d0d0e2]'
                              : 'text-[#606078]'
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <span className="text-[10px] text-[#c5a059] font-mono">Current Stage</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Details & Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1f1f2e]">
            {/* Delivery address */}
            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-white uppercase tracking-wider font-mono">
                Delivery Details
              </h4>
              <div className="bg-[#151520] border border-[#222232] rounded p-3 space-y-1.5 text-[#a0a0b8]">
                <p className="text-white font-medium">{order.customer_name}</p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                  {order.customer_phone}
                </p>
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>{order.delivery_address}</span>
                </p>
                {order.order_notes && (
                  <p className="text-[11px] text-[#707085] italic pt-1">
                    Note: &quot;{order.order_notes}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-white uppercase tracking-wider font-mono">
                Payment Summary
              </h4>
              <div className="bg-[#151520] border border-[#222232] rounded p-3 space-y-1.5 text-[#a0a0b8]">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="text-white uppercase font-mono">{order.payment_method.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span
                    className={`font-semibold uppercase font-mono ${
                      order.payment_status === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </div>
                {order.transaction_id && (
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-white">{order.transaction_id}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold pt-1 border-t border-[#232334]">
                  <span>Total Paid:</span>
                  <span className="text-[#c5a059] font-mono">{formatPrice(order.total_bdt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Items Ordered ({order.items.length})
            </h4>
            <div className="divide-y divide-[#1e1e2d] border border-[#20202e] rounded-lg bg-[#14141e] overflow-hidden">
              {order.items.map((it, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-white font-medium">
                      {it.quantity}x {it.product_name}
                    </p>
                    {it.variant_name && (
                      <p className="text-[11px] text-[#c5a059]">{it.variant_name}</p>
                    )}
                    {it.special_instructions && (
                      <p className="text-[10px] text-[#707085] italic">
                        &quot;{it.special_instructions}&quot;
                      </p>
                    )}
                  </div>
                  <span className="font-mono font-semibold text-white">
                    {formatPrice(it.total_price_bdt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
