'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#090d16]">
      {/* Background Photography with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85"
          alt="Power Zone zamonaviy fitnes zali"
          className="w-full h-full object-cover object-center brightness-[0.25] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/75 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-400 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-lime-400" />
            <span>Farg‘ona, Quva • Akbaroboddagi Eng Zamonaviy Fitnes Klubi</span>
          </div>

          {/* Main Uzbek Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08]">
            O‘zingizning Eng <span className="text-lime-400">Kuchli</span> Versiyangizni Yarating
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-zinc-300 leading-relaxed font-normal max-w-2xl">
            Power Zone — zamonaviy Italiya va Germaniya trenajyorlari, individual yondashuv va qulay sharoitlar bilan Farg‘ona viloyati Quva tumani (Akbarobod markazi)dagi yangi avlod sport zali. Haftalik va oylik moslashuvchan tariflar bilan mashg‘ulotlarni bugunoq boshlang.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a href="#tariflar">
              <Button
                variant="lime"
                size="lg"
                className="w-full sm:w-auto text-base shadow-xl shadow-lime-500/25 py-3.5 px-8"
              >
                <span>A’zolikni boshlash</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>

            <a href="#haqimizda">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base border-zinc-700 hover:border-zinc-500 py-3.5 px-8"
              >
                <span>Zal bilan tanishish</span>
              </Button>
            </a>
          </div>

          {/* Bullet highlights */}
          <div className="mt-8 pt-8 border-t border-zinc-800/80 flex flex-wrap gap-6 text-xs text-zinc-300 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
              <span>Haftasiga istalgan 3 kun erkin tanlov</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
              <span>Dush, sauna va shaxsiy shkafchalar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
              <span>Professional trenerlar nazorati</span>
            </div>
          </div>
        </div>

        {/* Stats Grid Under Hero */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#111827]/70 border border-zinc-800/80 backdrop-blur-xl">
          <div className="p-4 text-center sm:text-left">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              1,200<span className="text-lime-400">+</span>
            </div>
            <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider">
              Kvadrat metr maydon
            </p>
          </div>

          <div className="p-4 text-center sm:text-left border-l border-zinc-800">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              60<span className="text-lime-400">+</span>
            </div>
            <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider">
              Zamonaviy trenajyorlar
            </p>
          </div>

          <div className="p-4 text-center sm:text-left border-t sm:border-t-0 sm:border-l border-zinc-800">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              15<span className="text-lime-400">+</span>
            </div>
            <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider">
              Malakali murabbiylar
            </p>
          </div>

          <div className="p-4 text-center sm:text-left border-t sm:border-t-0 sm:border-l border-zinc-800">
            <div className="text-3xl sm:text-4xl font-black text-lime-400 tracking-tight">
              07:00 – 23:00
            </div>
            <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider">
              Haftasiga 7 kun ochiq
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
