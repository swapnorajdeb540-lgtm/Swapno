import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Package, Calendar, LogOut, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Order, Reservation } from '../../server.ts';

interface CustomerDashboardProps {
  onNavigateToTracking: (orderNumber: string) => void;
  onNavigateToMenu: () => void;
}

export function CustomerDashboard({ onNavigateToTracking, onNavigateToMenu }: CustomerDashboardProps) {
  const { user, logout, updateProfile } = useAuth();
  const { formatPrice } = useLanguage();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'reservations'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  // Profile edit fields
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.delivery_address || '');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) setOrders(data.orders);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/reservations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reservations) {
          const userRes = data.reservations.filter(
            (r: Reservation) => r.customer_email.toLowerCase() === user.email.toLowerCase()
          );
          setReservations(userRes);
        }
      })
      .catch(console.error);
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfile({ full_name: fullName, phone, delivery_address: address });
    if (res.success) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-sm text-[#9090a8]">Please sign in to access your customer dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Header bar */}
      <div className="bg-[#12121a] border border-[#222232] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#c5a059]/20 border border-[#c5a059] flex items-center justify-center text-[#c5a059] font-bold text-lg font-brand">
            {user.full_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-brand">{user.full_name}</h1>
            <p className="text-xs text-[#808098] font-mono">{user.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 border border-rose-900/40 rounded transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#20202e] gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-[#c5a059] text-[#c5a059] font-semibold'
              : 'border-transparent text-[#808098] hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'reservations'
              ? 'border-[#c5a059] text-[#c5a059] font-semibold'
              : 'border-transparent text-[#808098] hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Table Bookings ({reservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-[#c5a059] text-[#c5a059] font-semibold'
              : 'border-transparent text-[#808098] hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Address</span>
        </button>
      </div>

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-[#12121a] border border-[#20202e] rounded-xl space-y-3">
              <Package className="w-8 h-8 text-[#505068] mx-auto" />
              <p className="text-sm text-white font-medium">You haven&apos;t placed any orders yet</p>
              <button
                onClick={onNavigateToMenu}
                className="px-4 py-2 bg-[#c5a059] text-[#0d0d12] text-xs font-semibold rounded hover:bg-[#d8b56f]"
              >
                Browse Menu & Order
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#12121a] border border-[#20202e] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold text-white">
                        #{ord.order_number}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          ord.order_status === 'delivered'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : ord.order_status === 'cancelled'
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                            : 'bg-[#1e1e2d] text-[#c5a059] border border-[#c5a059]/40'
                        }`}
                      >
                        {ord.order_status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#808098]">
                      {new Date(ord.created_at).toLocaleDateString()} · {ord.items.length} Items ·{' '}
                      <span className="text-white font-mono font-semibold">{formatPrice(ord.total_bdt)}</span>
                    </p>
                    <p className="text-[11px] text-[#606078] truncate max-w-md">
                      {ord.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigateToTracking(ord.order_number)}
                    className="px-3.5 py-1.5 bg-[#1b1b28] hover:bg-[#252538] border border-[#2b2b3d] text-xs text-[#e5e5eb] rounded flex items-center gap-1.5"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Reservations */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="text-center py-16 bg-[#12121a] border border-[#20202e] rounded-xl space-y-2">
              <Calendar className="w-8 h-8 text-[#505068] mx-auto" />
              <p className="text-sm text-white font-medium">No table reservations on record</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-[#12121a] border border-[#20202e] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold text-white">
                        {res.reservation_code}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#1e1e2d] text-[#c5a059] border border-[#c5a059]/40">
                        {res.status}
                      </span>
                    </div>
                    <p className="text-xs text-white">
                      {res.reservation_date} at {res.reservation_time} · {res.number_of_guests} Guests
                    </p>
                    <p className="text-[11px] text-[#808098]">{res.table_type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-[#12121a] border border-[#20202e] rounded-xl p-6 sm:p-8 max-w-xl space-y-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
            Personal Information & Default Delivery Address
          </h3>

          {profileSaved && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[#a0a0b8]">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a0a0b8]">Email (Permanent)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-[#12121a] border border-[#20202e] rounded p-2 text-[#707085] cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a0a0b8]">Primary Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801841965676"
                className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a0a0b8]">Default Delivery Address in Sylhet</label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, Road, Area (e.g. Mirboxtula, Shahjalal Uposhohor), Sylhet"
                className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-[#c5a059] hover:bg-[#d8b56f] text-[#0d0d12] font-semibold rounded text-xs transition-colors"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
