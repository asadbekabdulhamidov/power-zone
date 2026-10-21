'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Car,
  Compass,
  ExternalLink,
  Send,
  MessageSquare,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFitnesFlow } from '@/context/fitnes-context';

export function LandingLocationContact() {
  const { websiteContent, addContactMessage } = useFitnesFlow();
  const { contact } = websiteContent;

  // Contact Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Umumiy savol');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError('Iltimos, ismingizni kiriting');
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setFormError('Telefon raqamingizni to‘g‘ri kiriting (masalan: +998 90 123-45-67)');
      return;
    }
    if (!message.trim()) {
      setFormError('Savolingiz yoki murojaatingiz matnini yozing');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addContactMessage({
        fullName: fullName.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFullName('');
      setPhone('');
      setMessage('');
    }, 500);
  };

  return (
    <section id="aloqa" className="py-24 bg-[#0d131f] border-t border-zinc-800/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/25 text-lime-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Aloqa va Murojaat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Savolingiz Bormi? Biz Bilan Bog‘laning
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Telefon qiling, Telegram orqali to‘g‘ridan-to‘g‘ri yozing yoki quyidagi shakl orqali murojaatingizni qoldiring.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Phone Call */}
          <a
            href={`tel:${contact.phone?.replace(/[^0-9+]/g, '') || '+998901234567'}`}
            className="p-5 rounded-2xl bg-[#111827]/80 border border-zinc-800 hover:border-lime-500/50 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/25 text-lime-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Zal Telefoni</p>
                <p className="text-sm font-extrabold text-white group-hover:text-lime-300 transition-colors">
                  {contact.phone}
                </p>
              </div>
            </div>
            <span className="text-[11px] text-lime-400 font-semibold flex items-center gap-1">
              <span>To‘g‘ridan-to‘g‘ri qo‘ng‘iroq qilish</span>
              <span>→</span>
            </span>
          </a>

          {/* Telegram Channel */}
          <a
            href={contact.telegramChannel || 'https://t.me/powerzone_quva'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-[#111827]/80 border border-zinc-800 hover:border-sky-500/50 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Telegram Kanal</p>
                <p className="text-sm font-extrabold text-white group-hover:text-sky-300 transition-colors">
                  @powerzone_quva
                </p>
              </div>
            </div>
            <span className="text-[11px] text-sky-400 font-semibold flex items-center gap-1">
              <span>Yangiliklar va aksiyalarga obuna</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>

          {/* Telegram Admin / Direct Chat */}
          <a
            href={contact.telegramAdmin || 'https://t.me/powerzone_admin'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-[#111827]/80 border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Telegram Menejer</p>
                <p className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                  @powerzone_admin
                </p>
              </div>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span>Admin bilan shaxsiy yozishish</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>

          {/* Instagram Profile */}
          <a
            href={contact.instagram || 'https://instagram.com/powerzone_quva'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-[#111827]/80 border border-zinc-800 hover:border-pink-500/50 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/25 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Instagram Sahifa</p>
                <p className="text-sm font-extrabold text-white group-hover:text-pink-300 transition-colors">
                  @powerzone_quva
                </p>
              </div>
            </div>
            <span className="text-[11px] text-pink-400 font-semibold flex items-center gap-1">
              <span>Foto va videolarni tomosha qilish</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>
        </div>

        {/* 2-Columns: Message Form (Left 6 cols) & Location Map / Hours (Right 6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Message Form (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl bg-[#111827]/90 border border-zinc-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-lime-500/15 border border-lime-500/30 text-lime-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Adminga Savol yoki Murojaat Qoldirish</h3>
                <p className="text-xs text-zinc-400">
                  Telefon raqamingizni qoldiring, 15 daqiqa ichida javob beramiz.
                </p>
              </div>
            </div>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-lime-950/40 border border-lime-500/40 text-center space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-lime-500/20 border border-lime-500/40 text-lime-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white">Murojaatingiz Qabul Qilindi!</h4>
                  <p className="text-xs text-zinc-300 mt-1 max-w-sm mx-auto leading-relaxed">
                    Xabaringiz Power Zone boshqaruv tizimiga muvaffaqiyatli yuborildi. Administratorimiz tez orada siz bilan bog‘lanadi.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 text-xs border-lime-500/40 text-lime-400 hover:bg-lime-500/10"
                >
                  Yana boshqa xabar yozish
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      To‘liq Ismingiz <span className="text-rose-400">*</span>
                    </label>
                    <Input
                      placeholder="Masalan: Sardor Rahimov"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Telefon Raqamingiz <span className="text-rose-400">*</span>
                    </label>
                    <Input
                      placeholder="+998 (90) 123-45-67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Mavzu
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-500 transition-colors cursor-pointer"
                  >
                    <option value="Umumiy savol">Umumiy savol</option>
                    <option value="Tariflar va narxlar">Tariflar va narxlar bo‘yicha</option>
                    <option value="Shaxsiy murabbiy">Shaxsiy murabbiy yollash</option>
                    <option value="Ish vaqti va sharoitlar">Ish vaqti va sauna/sharoitlar</option>
                    <option value="Taklif va shikoyat">Taklif yoki shikoyat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Savol yoki Murojaatingiz Matni <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Qiziqtirgan savolingizni batafsil yozib qoldiring..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="lime"
                  size="lg"
                  className="w-full shadow-lg shadow-lime-500/20"
                  isLoading={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>Murojaatni Yuborish</span>
                </Button>
              </form>
            )}
          </div>

          {/* Location & Map Section (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Address & Hours Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address */}
              <div className="p-5 rounded-2xl bg-[#111827]/75 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2.5 text-lime-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Manzil</span>
                </div>
                <p className="text-xs text-zinc-200 font-semibold leading-relaxed">
                  {contact.address}
                </p>
                <p className="text-[11px] text-zinc-400">
                  Mo‘ljal: {contact.landmark}
                </p>
              </div>

              {/* Working Hours */}
              <div className="p-5 rounded-2xl bg-[#111827]/75 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2.5 text-blue-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Ish Tartibi</span>
                </div>
                <div className="text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Dush – Shan:</span>
                    <span className="font-bold text-white">{contact.workingHoursWeekdays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Yakshanba:</span>
                    <span className="font-bold text-lime-400">{contact.workingHoursSunday}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stylized Map Card */}
            <div id="manzil" className="rounded-3xl overflow-hidden border border-zinc-800 bg-[#070b12] relative flex flex-col justify-between min-h-[300px] shadow-2xl scroll-mt-20">
              <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px]" />
              <div className="absolute inset-0 bg-radial from-transparent via-[#070b12]/60 to-[#070b12]" />

              {/* Vector Streets Graphic */}
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
                  <div className="mt-2.5 px-3 py-1 rounded-xl bg-zinc-950/95 border border-lime-500/50 shadow-2xl backdrop-blur-md text-center">
                    <span className="font-extrabold text-xs text-white block">
                      POWER <span className="text-lime-400">ZONE</span>
                    </span>
                    <span className="text-[10px] text-zinc-400">Quva, Akbarobod markazi</span>
                  </div>
                </div>
              </div>

              {/* Map Top Bar */}
              <div className="relative z-10 p-4 flex items-center justify-between">
                <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-semibold text-zinc-300 flex items-center gap-2 backdrop-blur-md">
                  <Navigation className="w-3.5 h-3.5 text-lime-400" />
                  <span>Xaritada belgilangan joy</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-950/80 px-2.5 py-1 rounded-lg border border-zinc-800">
                  <Car className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Bepul avtoturargoh</span>
                </div>
              </div>

              {/* Map Bottom Bar with Navigator Links */}
              <div className="relative z-10 p-5 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-white">Yo‘nalishni ochish:</p>
                  <p className="text-[10px] text-zinc-400">Navigatsiya orqali zalga yetib kelish</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://maps.google.com/?q=Akbarobod+Quva+Fergana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>

                  <a
                    href="https://yandex.uz/maps/?text=Akbarobod+Quva"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-lime-500/20"
                  >
                    <span>Yandex Xarita</span>
                    <ExternalLink className="w-3 h-3 text-zinc-950" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
