'use client';

import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'strength' | 'cardio' | 'lounge';
  categoryLabel: string;
  imageUrl: string;
}

export function LandingGallery() {
  const [filter, setFilter] = useState<'all' | 'strength' | 'cardio' | 'lounge'>('all');

  const galleryItems: GalleryItem[] = [
    {
      id: 'g-1',
      title: 'Og‘ir atletika va gantellar qatori',
      category: 'strength',
      categoryLabel: 'Kuch Trenajyorlari',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'g-2',
      title: 'Keng panoramali kardio zonasi',
      category: 'cardio',
      categoryLabel: 'Kardio Zona',
      imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'g-3',
      title: 'Funksional krossfit maydoni',
      category: 'strength',
      categoryLabel: 'Krossfit',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'g-4',
      title: 'Fin saunasi va relaksatsiya',
      category: 'lounge',
      categoryLabel: 'Sauna va Dush',
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'g-5',
      title: 'Fitnes bar va qabulxona',
      category: 'lounge',
      categoryLabel: 'Fitnes Bar',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'g-6',
      title: 'Ergonomik yugurish yo‘lakchalari',
      category: 'cardio',
      categoryLabel: 'Kardio Zona',
      imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const filteredItems = filter === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === filter);

  return (
    <section id="galereya" className="py-24 bg-[#090d16] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/25 text-lime-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>Fotogalereya</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              FitnesFlow Atmosferasi
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl">
              Yuqori darajadagi gigiyena, qulay yorug‘lik va jahon standartlariga mos sport maydoni.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Barchasi' },
              { id: 'strength', label: 'Kuch zonalari' },
              { id: 'cardio', label: 'Kardio' },
              { id: 'lounge', label: 'Sauna va Bar' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as 'all' | 'strength' | 'cardio' | 'lounge')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  filter === tab.id
                    ? 'bg-lime-500 text-zinc-950 font-bold shadow-md shadow-lime-500/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-900 aspect-[4/3] cursor-pointer shadow-lg"
            >
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Content on hover / bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform">
                <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400 bg-lime-950/80 border border-lime-700/50 px-2 py-0.5 rounded-full inline-block mb-1.5">
                  {item.categoryLabel}
                </span>
                <h4 className="text-base font-bold text-white leading-snug">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
