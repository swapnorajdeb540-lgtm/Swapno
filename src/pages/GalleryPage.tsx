import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import { INITIAL_GALLERY } from '../data/restaurantData.ts';

export function GalleryPage() {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Interior' | 'Dishes'>('All');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const galleryItems = INITIAL_GALLERY.filter((item) => {
    if (selectedFilter === 'All') return true;
    return item.category === selectedFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase text-[#c5a059] tracking-widest">
          Visual Journey
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white font-brand">
          Restaurant Atmosphere & Culinary Art
        </h1>
        <p className="text-xs text-[#808098]">
          Glimpses into our Al-Madani Tower dining spaces, private tatami suites, and handcrafted Pan-Asian plates.
        </p>

        {/* Filter */}
        <div className="flex justify-center gap-2 pt-2">
          {['All', 'Interior', 'Dishes'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat as 'All' | 'Interior' | 'Dishes')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedFilter === cat
                  ? 'bg-[#c5a059] text-[#0d0d12] font-semibold'
                  : 'bg-[#161622] text-[#9090a8] border border-[#242436] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxImg(item.image_url)}
            className="group relative rounded-xl overflow-hidden bg-[#161622] border border-[#242436] cursor-pointer aspect-4/3 shadow-lg"
          >
            <img
              src={item.image_url}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <span className="text-[10px] font-mono uppercase text-[#c5a059] tracking-wider">
                {item.category}
              </span>
              <h3 className="text-sm font-semibold text-white font-brand mt-0.5">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={lightboxImg}
            alt="Enlarged view"
            referrerPolicy="no-referrer"
            className="max-w-4xl max-h-[85vh] object-contain rounded-lg shadow-2xl border border-[#2d2d42]"
          />
        </div>
      )}
    </div>
  );
}
