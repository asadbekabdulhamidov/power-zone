'use client';

import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  Car,
  Compass,
  ExternalLink,
} from 'lucide-react';

export function LandingLocationContact() {
  return (
    <section id="manzil" className="py-24 bg-[#0d131f] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/25 text-lime-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Manzil va Aloqa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Bizni Oson Toping
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Toshkentning markaziy qismida, metro va asosiy yo‘llar kesishmasida joylashganmiz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact & Hours Info Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-[#111827]/75 border border-zinc-800 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/25 text-lime-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Manzilimiz</h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    Toshkent shahri, Yunusobod tumani, Amir Temur shox ko‘chasi, 42-uy
                  </p>
                  <p className="text-[11px] text-lime-400 font-semibold mt-1">
                    Mo‘ljal: Bodomzor metro bekati yonida, Orient Business Center 1-qavat
                  </p>
                </div>
              </div>

              {/* Parking */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2.5 text-xs text-zinc-400">
                <Car className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>Klub a’zolari uchun 2 soatlik bepul avtoturargoh</span>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="p-6 rounded-2xl bg-[#111827]/75 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Ish Vaqti</h4>
                  <p className="text-xs text-zinc-400">Dam olish kunlarisiz xizmatingizdamiz</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-zinc-800">
                  <span className="text-zinc-400">Dushanba – Shanba:</span>
                  <span className="font-bold text-white">06:30 – 23:00</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-zinc-400">Yakshanba:</span>
                  <span className="font-bold text-lime-400">08:00 – 22:00</span>
                </div>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="p-6 rounded-2xl bg-[#111827]/75 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Aloqa Uchun</h4>
                  <p className="text-xs text-zinc-400">Menejerlarimiz barcha savollaringizga javob beradi</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 text-xs">
                <a
                  href="tel:+998712004422"
                  className="flex items-center gap-2 text-zinc-300 hover:text-lime-400 transition-colors font-medium py-1"
                >
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <span>+998 (71) 200-44-22 (Call-markaz)</span>
                </a>
                <a
                  href="mailto:info@fitnesflow.uz"
                  className="flex items-center gap-2 text-zinc-300 hover:text-lime-400 transition-colors font-medium py-1"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>info@fitnesflow.uz</span>
                </a>
              </div>
            </div>
          </div>

          {/* Map Graphic Placeholder (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-zinc-800 bg-[#070b12] relative flex flex-col justify-between min-h-[420px] shadow-2xl">
            {/* Custom stylized vector grid representing a modern dark map */}
            <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#070b12]/60 to-[#070b12]" />

            {/* Stylized streets layout graphic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-1 bg-zinc-700/60 rotate-12 transform absolute" />
              <div className="w-full h-2 bg-zinc-700/80 -rotate-25 transform absolute" />
              <div className="h-full w-2 bg-zinc-700/80 -rotate-6 transform absolute" />
              <div className="h-full w-1 bg-zinc-700/60 rotate-45 transform absolute" />

              {/* Pin Center Marker */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-lime-500/20 animate-ping absolute" />
                  <div className="w-12 h-12 rounded-full bg-lime-500/30 flex items-center justify-center border-2 border-lime-400 shadow-[0_0_30px_rgba(132,204,22,0.8)]">
                    <MapPin className="w-6 h-6 text-zinc-950 fill-lime-400" />
                  </div>
                </div>
                <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-zinc-950/95 border border-lime-500/50 shadow-2xl backdrop-blur-md text-center">
                  <span className="font-extrabold text-xs text-white block">
                    FITNES<span className="text-lime-400">FLOW</span>
                  </span>
                  <span className="text-[10px] text-zinc-400">Yunusobod, Amir Temur 42</span>
                </div>
              </div>
            </div>

            {/* Map Top Bar */}
            <div className="relative z-10 p-5 flex items-center justify-between">
              <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-semibold text-zinc-300 flex items-center gap-2 backdrop-blur-md">
                <Navigation className="w-3.5 h-3.5 text-lime-400" />
                <span>Interaktiv Xarita Plaseholder</span>
              </div>
            </div>

            {/* Map Bottom Bar with Navigator Links */}
            <div className="relative z-10 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-white">Yo‘nalishni ochish:</p>
                <p className="text-[11px] text-zinc-400">Yandex Go yoki Google Xaritalar orqali</p>
              </div>

              <div className="flex items-center gap-2.5">
                <a
                  href="https://maps.google.com/?q=Amir+Temur+Street+Tashkent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>

                <a
                  href="https://yandex.uz/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-lime-500/20"
                >
                  <span>Yandex Xarita</span>
                  <ExternalLink className="w-3 h-3 text-zinc-950" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
