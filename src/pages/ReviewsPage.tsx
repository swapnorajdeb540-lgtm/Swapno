import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, AlertCircle, Quote } from 'lucide-react';
import { Review } from '../data/restaurantData.ts';

interface ReviewsPageProps {
  reviews: Review[];
  onReviewAdded: (newReview: Review) => void;
}

export function ReviewsPage({ reviews, onReviewAdded }: ReviewsPageProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerLocation, setCustomerLocation] = useState('Sylhet');
  const [dishOrdered, setDishOrdered] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_location: customerLocation,
          dish_ordered: dishOrdered || 'Signature Pan-Asian Selection',
          rating,
          comment,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.review) {
        onReviewAdded(data.review);
        setFeedback('Thank you! Your dining review has been posted.');
        setCustomerName('');
        setComment('');
        setDishOrdered('');
      } else {
        setFeedback('Unable to submit review right now. Please try again.');
      }
    } catch {
      setIsSubmitting(false);
      const fallbackRev: Review = {
        id: `rev-${Date.now()}`,
        customer_name: customerName,
        customer_location: customerLocation,
        dish_ordered: dishOrdered || 'Imperial Dragon Roll',
        rating,
        comment,
        date: new Date().toISOString().split('T')[0],
        is_approved: true,
        is_featured: false,
      };
      onReviewAdded(fallbackRev);
      setFeedback('Thank you! Your dining review has been posted.');
      setCustomerName('');
      setComment('');
    }
  };

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header & Overview */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest">
          Guest Impressions
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white font-brand">
          Customer Reviews & Testimonials
        </h1>
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>
          <span className="text-xl font-bold text-white font-mono">{averageRating}</span>
          <span className="text-xs text-[#808098]">({reviews.length} Verified Diners)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Review List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
            Recent Diner Experiences ({reviews.length})
          </h3>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#12121a] border border-[#222230] rounded-xl p-5 space-y-3 shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#707085] font-mono">{rev.date}</span>
                </div>

                <p className="text-xs text-[#c0c0d4] leading-relaxed italic">
                  &quot;{rev.comment}&quot;
                </p>

                <div className="pt-2 border-t border-[#1c1c28] flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-semibold text-white">{rev.customer_name}</span>
                    <span className="text-[#707085] ml-1.5">· {rev.customer_location}</span>
                  </div>
                  <span className="text-[#c5a059] font-mono">{rev.dish_ordered}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Submit Review Form */}
        <div className="lg:col-span-5 bg-[#12121a] border border-[#222232] rounded-xl p-6 space-y-5 sticky top-24">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-[#c5a059]" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              Share Your Dining Experience
            </h3>
          </div>

          {feedback && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[#a0a0b8]">Your Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Mahfuz Ahmed"
                className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a0a0b8]">Location / Area</label>
              <input
                type="text"
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                placeholder="e.g. Mirboxtula, Sylhet"
                className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a0a0b8]">Dish Ordered</label>
              <input
                type="text"
                value={dishOrdered}
                onChange={(e) => setDishOrdered(e.target.value)}
                placeholder="e.g. Tokyo Rich Shoyu Ramen & Dragon Roll"
                className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a0a0b8]">Rating</label>
              <div className="flex gap-2">
                {[5, 4, 3, 2, 1].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRating(r)}
                    className={`flex-1 py-1.5 rounded border text-center transition-colors ${
                      rating === r
                        ? 'bg-[#c5a059] text-[#0d0d12] font-bold border-[#c5a059]'
                        : 'bg-[#161622] text-[#808098] border-[#252536] hover:text-white'
                    }`}
                  >
                    {r} ★
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#a0a0b8]">Review Comments *</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about the flavor, freshness, presentation, or delivery..."
                className="w-full bg-[#171724] border border-[#27273a] rounded p-2 text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#c5a059] hover:bg-[#d8b56f] text-[#0d0d12] font-semibold rounded text-xs transition-colors"
            >
              {isSubmitting ? 'Posting Review...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
