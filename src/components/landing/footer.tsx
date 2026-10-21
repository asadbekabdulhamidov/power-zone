'use client';

import React from 'react';
import Link from 'next/link';
import { Dumbbell, Shield, Send, ArrowUpRight, Globe, Share2 } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-[#060910] text-zinc-400 border-t border-zinc-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-400">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                POWER <span className="text-lime-400">ZONE</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              Farg‘ona viloyati, Quva tumani, Akbarobod markazidagi yuqori darajadagi fitnes klubi. Zamonaviy trenajyorlar, individual murabbiy nazorati, fin saunasi va sport bar.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Instagram"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://fitnesflow.uz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Veb-sayt"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Bo‘limlar
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#haqimizda" className="hover:text-lime-400 transition-colors">
                  Biz haqimizda
                </a>
              </li>
              <li>
                <a href="#galereya" className="hover:text-lime-400 transition-colors">
                  Zal fotogalereyasi
                </a>
              </li>
              <li>
                <a href="#tariflar" className="hover:text-lime-400 transition-colors">
                  A’zolik tariflari
                </a>
              </li>
              <li>
                <a href="#mahsulotlar" className="hover:text-lime-400 transition-colors">
                  Fitnes bar mahsulotlari
                </a>
              </li>
              <li>
                <a href="#manzil" className="hover:text-lime-400 transition-colors">
                  Manzil va xarita
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Tariflar linklari */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Tarif Rejalari
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#tariflar" className="hover:text-lime-400 transition-colors">
                  Haftasiga 3 kun — 200,000 UZS
                </a>
              </li>
              <li>
                <a href="#tariflar" className="hover:text-lime-400 transition-colors">
                  Oylik cheklanmagan — 300,000 UZS
                </a>
              </li>
              <li>
                <a href="#tariflar" className="hover:text-lime-400 transition-colors">
                  Bir martalik mashg‘ulot — 20,000 UZS
                </a>
              </li>
              <li>
                <a href="#tariflar" className="hover:text-lime-400 transition-colors">
                  Shaxsiy murabbiy dasturi
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Visible Admin Portal Link (Important Requirement) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Ma’muriyat
            </h4>
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-lime-400 text-xs font-bold">
                <Shield className="w-4 h-4" />
                <span>Admin Boshqaruvi</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Klub egalari va ma’murlar uchun yopiq boshqaruv tizimi.
              </p>
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-between w-full px-3 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm"
              >
                <span>Tizimga kirish</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Power Zone. Barcha huquqlar himoyalangan. Farg‘ona viloyati, Quva tumani, Akbarobod.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-400 cursor-pointer">Maxfiylik siyosati</span>
            <span className="hover:text-zinc-400 cursor-pointer">Foydalanish qoidalari</span>
            <Link href="/admin/login" className="text-lime-400/80 hover:text-lime-300 font-semibold">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
