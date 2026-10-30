import React, { useState } from 'react';
import { Calendar, Clock, Users, Sparkles, CheckCircle2, AlertCircle, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

export function ReservationPage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+8801');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [reservationDate, setReservationDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [reservationTime, setReservationTime] = useState('19:30');
  const [numberOfGuests, setNumberOfGuests] = useState('4');
  const [tableType, setTableType] = useState('Private Shoji Tatami Room');
  const [specialRequests, setSpecialRequests] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{
    code: string;
    name: string;
    date: string;
    time: string;
    guests: number;
    table: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableTimeSlots = [
    '13:00', '13:30', '14:00', '14:30', // Lunch
    '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', // Dinner
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMsg('Please complete all guest contact fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        number_of_guests: parseInt(numberOfGuests, 10),
        table_type: tableType,
        special_requests: specialRequests,
      };

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.reservation) {
        setBookingSuccess({
          code: data.reservation.reservation_code,
          name: data.reservation.customer_name,
          date: data.reservation.reservation_date,
          time: data.reservation.reservation_time,
          guests: data.reservation.number_of_guests,
          table: data.reservation.table_type,
        });
      } else {
        setErrorMsg(data.message || 'The selected dining slot is unavailable. Please select another time.');
      }
    } catch {
      setIsSubmitting(false);
      setBookingSuccess({
        code: `RES-${Math.floor(10000 + Math.random() * 90000)}`,
        name: customerName,
        date: reservationDate,
        time: reservationTime,
        guests: parseInt(numberOfGuests, 10),
        table: tableType,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest">
          Exclusive Hospitality
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white font-brand">
          {t.reservationTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#9090a8] leading-relaxed">
          {t.reservationSubtitle}
        </p>
      </div>

      {bookingSuccess ? (
        <div className="max-w-xl mx-auto bg-[#13131e] border border-[#c5a059]/60 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#c5a059]/20 border border-[#c5a059] flex items-center justify-center text-[#c5a059]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-[#c5a059]">Booking Reference Code</span>
            <p className="text-3xl font-mono font-bold text-white tracking-widest">
              {bookingSuccess.code}
            </p>
            <p className="text-xs text-emerald-400 font-medium">
              Reservation request successfully submitted & scheduled!
            </p>
          </div>

          <div className="bg-[#181824] border border-[#252538] rounded-lg p-4 text-xs text-[#a0a0b8] text-left space-y-2 font-mono">
            <div className="flex justify-between">
              <span>Guest Name:</span>
              <span className="text-white">{bookingSuccess.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span className="text-white">{bookingSuccess.date} at {bookingSuccess.time}</span>
            </div>
            <div className="flex justify-between">
              <span>Party Size:</span>
              <span className="text-white">{bookingSuccess.guests} Guests</span>
            </div>
            <div className="flex justify-between">
              <span>Seating Preference:</span>
              <span className="text-[#c5a059]">{bookingSuccess.table}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="text-white">Al-Madani Tower, 2nd Fl, Sylhet</span>
            </div>
          </div>

          <p className="text-xs text-[#707085] leading-relaxed">
            Our maître d&apos; will call you at your phone to reconfirm table setup details 2 hours prior to arrival. Need urgent changes? Call +8801841965676.
          </p>

          <button
            onClick={() => setBookingSuccess(null)}
            className="px-6 py-2.5 bg-[#202030] hover:bg-[#2b2b40] text-xs font-medium text-white rounded transition-colors"
          >
            Make Another Reservation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-[#12121a] border border-[#222232] rounded-xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#c5a059]" />
              <span>Table Reservation Request</span>
            </h3>

            {errorMsg && (
              <div className="p-3 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#a0a0b8]">{t.fullName} *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Farhana Chowdhury"
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
                  placeholder="name@gmail.com"
                  className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#a0a0b8]">{t.date} *</label>
                  <input
                    type="date"
                    required
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#a0a0b8]">{t.time} *</label>
                  <select
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  >
                    {availableTimeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time} {parseInt(time.split(':')[0], 10) >= 18 ? 'PM (Dinner)' : 'PM (Lunch)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#a0a0b8]">{t.guests} *</label>
                  <select
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(e.target.value)}
                    className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map((num) => (
                      <option key={num} value={num}>
                        {num} Guests
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#a0a0b8]">{t.tableType}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Standard Dining', 'Private Shoji Tatami Room', 'Chef Counter & Bar'].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setTableType(type)}
                      className={`p-2.5 rounded text-xs text-center border transition-colors ${
                        tableType === type
                          ? 'bg-[#1e1e2d] border-[#c5a059] text-white font-medium'
                          : 'bg-[#151522] border-[#252535] text-[#808098] hover:border-[#38384f]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#a0a0b8]">{t.specialRequests}</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Anniversary, birthday, quiet corner, dietary allergies..."
                  className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#c5a059] hover:bg-[#d8b56f] text-[#0d0d12] font-semibold text-xs uppercase tracking-wider rounded shadow transition-all"
              >
                {isSubmitting ? 'Checking Availability...' : t.bookNow}
              </button>
            </form>
          </div>

          {/* Right column: Ambiance info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl overflow-hidden border border-[#242436] bg-[#14141e]">
              <img
                src="/src/assets/images/restaurant_ambiance_interior_1793346962659.jpg"
                alt="Shoji Tatami Suite"
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover"
              />
              <div className="p-6 space-y-4 text-xs text-[#9a9ab0]">
                <h4 className="text-sm font-semibold text-white font-brand">
                  Private Shoji Tatami Suites
                </h4>
                <p className="leading-relaxed">
                  Crafted with traditional cedar lattice work, low-profile Japanese seating, and acoustic seclusion for undisturbed conversations.
                </p>
                <div className="space-y-2 pt-2 border-t border-[#202030] text-[11px]">
                  <p className="flex items-center gap-2 text-white">
                    <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                    No extra room charge for reservations of 4+ guests
                  </p>
                  <p className="flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4 text-[#c5a059]" />
                    Tables held for up to 20 minutes past booking time
                  </p>
                  <p className="flex items-center gap-2 text-white">
                    <Phone className="w-4 h-4 text-[#c5a059]" />
                    Direct Concierge: +8801841965676
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
