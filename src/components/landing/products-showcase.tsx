'use client';

import React, { useState } from 'react';
import { ShoppingBag, Coffee } from 'lucide-react';
import { useFitnesFlow } from '@/context/fitnes-context';
import { formatUZS } from '@/lib/utils';

export function LandingProductsShowcase() {
  const { products, showToast } = useFitnesFlow();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Display ACTIVE products only!
  const activeProducts = products.filter((p) => p.isActive);

  const filteredProducts =
    selectedCategory === 'all'
      ? activeProducts
      : activeProducts.filter((p) => p.category === selectedCategory);

  const handleBuyClick = (productName: string) => {
    showToast(
      `"${productName}" klub resepshnida mavjud! Mashg‘ulotga kelganingizda xarid qilishingiz mumkin.`,
      'info'
    );
  };

  return (
    <section id="mahsulotlar" className="py-24 bg-[#090d16] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/25 text-lime-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Coffee className="w-3.5 h-3.5" />
              <span>Fitnes Bar va Resepshn</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Sport Ozuqalari va Salqin Ichimliklar
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl">
              Mashg‘ulotdan oldin va keyin tanani tiklash uchun sertifikatlangan oqsillar, vitaminlar va energiya ichimliklari.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Barchasi' },
              { id: 'water', label: 'Suv' },
              { id: 'vitamins', label: 'Vitaminlar' },
              { id: 'sports_drinks', label: 'Sport ichimliklari' },
              { id: 'accessories', label: 'Aksessuarlar' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-lime-500 text-zinc-950 font-bold shadow-md shadow-lime-500/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-[#111827]/70 border border-zinc-800/80 hover:border-lime-500/40 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group shadow-lg"
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-4 border border-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-lime-400 px-2 py-0.5 rounded-full border border-white/10">
                      {product.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <h4 className="text-base font-bold text-white group-hover:text-lime-300 transition-colors line-clamp-1">
                  {product.name}
                </h4>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 min-h-[32px]">
                  {product.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                    Klub narxi
                  </span>
                  <div className="text-base font-black text-lime-400">
                    {formatUZS(product.price)}
                  </div>
                </div>

                <button
                  onClick={() => handleBuyClick(product.name)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-lime-500 text-zinc-200 hover:text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Xarid</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-zinc-500 text-xs">
            Ushbu toifada faol mahsulotlar mavjud emas.
          </div>
        )}
      </div>
    </section>
  );
}
