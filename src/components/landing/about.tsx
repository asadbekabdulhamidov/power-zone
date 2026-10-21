'use client';

import React from 'react';
import {
  Dumbbell,
  ShieldCheck,
  HeartPulse,
  Sparkles,
  Wind,
  Users,
  Flame,
  Trophy,
} from 'lucide-react';
import { useFitnesFlow } from '@/context/fitnes-context';

const ICON_MAP = {
  Dumbbell,
  Users,
  HeartPulse,
  Wind,
  Sparkles,
  ShieldCheck,
  Flame,
  Trophy,
};

export function LandingAbout() {
  const { websiteContent } = useFitnesFlow();
  const { features, banner } = websiteContent;

  return (
    <section id="haqimizda" className="py-24 bg-[#0d131f] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/25 text-lime-400 text-xs font-bold uppercase tracking-wider mb-3">
            Klub Haqida
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Natijaga Intiluvchilar Uchun Mukammal Makon
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Biz shunchaki sport zali emasmiz. Power Zone — bu sog‘lom turmush tarzi, yuqori kayfiyat va o‘z maqsadlariga erishayotgan hamfikrlar hamjamiyati.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => {
            const Icon = (item.iconName && ICON_MAP[item.iconName]) || Dumbbell;
            return (
              <div
                key={item.id}
                className="p-7 rounded-2xl bg-[#111827]/70 border border-zinc-800/80 hover:border-lime-500/40 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(132,204,22,0.15)]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-lime-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Highlight Image Banner */}
        {banner && (
          <div className="mt-14 relative rounded-3xl overflow-hidden border border-zinc-800">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 sm:p-12 flex flex-col justify-center bg-gradient-to-br from-zinc-900 to-[#101726]">
                <span className="text-xs font-bold uppercase tracking-wider text-lime-400 mb-2">
                  {banner.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                  {banner.title}
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  {banner.desc}
                </p>
                <div>
                  <a
                    href="#tariflar"
                    className="inline-flex items-center gap-2 text-sm font-bold text-lime-400 hover:text-lime-300 hover:underline"
                  >
                    <span>{banner.linkText || 'Tariflar bilan tanishing va a’zo bo‘ling'}</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              <div className="relative min-h-[300px] lg:min-h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000&q=80"
                  alt="Power Zone mashg'ulot maydoni"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
