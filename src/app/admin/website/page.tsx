'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  Layout,
  BarChart3,
  Sparkles,
  Building2,
  Phone,
  Save,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Flame,
  CheckCircle2,
  Dumbbell,
  Users,
  HeartPulse,
  Wind,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useFitnesFlow } from '@/context/fitnes-context';
import { WebsiteFeature, WebsiteStat } from '@/types';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';

type WebsiteTab = 'hero' | 'stats' | 'features' | 'banner' | 'contact';

const AVAILABLE_ICONS = [
  { id: 'Dumbbell', label: 'Trenajyor (Gantel)', icon: Dumbbell },
  { id: 'Users', label: 'Murabbiylar (Odamlar)', icon: Users },
  { id: 'HeartPulse', label: 'Kardio (Yurak)', icon: HeartPulse },
  { id: 'Wind', label: 'Toza Havo (Ventilyatsiya)', icon: Wind },
  { id: 'Sparkles', label: 'Sauna (Yulduzlar)', icon: Sparkles },
  { id: 'ShieldCheck', label: 'Shaffoflik (Qalqon)', icon: ShieldCheck },
  { id: 'Flame', label: 'Energiya (Olov)', icon: Flame },
  { id: 'Trophy', label: 'Natija (Kubok)', icon: Trophy },
] as const;

export default function WebsiteAdminPage() {
  const {
    websiteContent,
    updateWebsiteHero,
    updateWebsiteStats,
    addWebsiteFeature,
    updateWebsiteFeature,
    deleteWebsiteFeature,
    updateWebsiteBanner,
    updateWebsiteContact,
  } = useFitnesFlow();

  const [activeTab, setActiveTab] = useState<WebsiteTab>('hero');

  // Hero form state
  const [heroBadge, setHeroBadge] = useState(websiteContent.hero.badge);
  const [heroTitle, setHeroTitle] = useState(websiteContent.hero.title);
  const [heroSubtitle, setHeroSubtitle] = useState(websiteContent.hero.subtitle);
  const [heroBullets, setHeroBullets] = useState<string[]>([...websiteContent.hero.bullets]);
  const [heroBgImage, setHeroBgImage] = useState(websiteContent.hero.backgroundImage || '/images/hero/hero-bg.webp');

  // Stats form state
  const [statsData, setStatsData] = useState<WebsiteStat[]>([...websiteContent.stats]);

  // Banner form state
  const [bannerBadge, setBannerBadge] = useState(websiteContent.banner.badge);
  const [bannerTitle, setBannerTitle] = useState(websiteContent.banner.title);
  const [bannerDesc, setBannerDesc] = useState(websiteContent.banner.desc);
  const [bannerLinkText, setBannerLinkText] = useState(websiteContent.banner.linkText);
  const [bannerImageUrl, setBannerImageUrl] = useState(websiteContent.banner.imageUrl || '/images/about/coach-training.webp');

  // Contact form state
  const [contactPhone, setContactPhone] = useState(websiteContent.contact.phone);
  const [contactEmail, setContactEmail] = useState(websiteContent.contact.email);
  const [contactAddress, setContactAddress] = useState(websiteContent.contact.address);
  const [contactLandmark, setContactLandmark] = useState(websiteContent.contact.landmark);
  const [workingWeekdays, setWorkingWeekdays] = useState(websiteContent.contact.workingHoursWeekdays);
  const [workingSunday, setWorkingSunday] = useState(websiteContent.contact.workingHoursSunday);
  const [telegramChannel, setTelegramChannel] = useState(websiteContent.contact.telegramChannel);
  const [telegramAdmin, setTelegramAdmin] = useState(websiteContent.contact.telegramAdmin);
  const [instagram, setInstagram] = useState(websiteContent.contact.instagram);

  // Feature Modals
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<WebsiteFeature | null>(null);
  const [featureToDelete, setFeatureToDelete] = useState<WebsiteFeature | null>(null);

  const [featTitle, setFeatTitle] = useState('');
  const [featDesc, setFeatDesc] = useState('');
  const [featIcon, setFeatIcon] = useState<WebsiteFeature['iconName']>('Dumbbell');

  // Handle Hero Save
  const handleHeroSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteHero({
      badge: heroBadge.trim(),
      title: heroTitle.trim(),
      subtitle: heroSubtitle.trim(),
      bullets: heroBullets.filter((b) => b.trim().length > 0),
      backgroundImage: heroBgImage.trim() || '/images/hero/hero-bg.webp',
    });
  };

  // Handle Hero Bullet changes
  const handleBulletChange = (idx: number, val: string) => {
    const updated = [...heroBullets];
    updated[idx] = val;
    setHeroBullets(updated);
  };

  const handleAddBullet = () => {
    setHeroBullets([...heroBullets, 'Yangi imkoniyat']);
  };

  const handleRemoveBullet = (idx: number) => {
    if (heroBullets.length <= 1) return;
    setHeroBullets(heroBullets.filter((_, i) => i !== idx));
  };

  // Handle Stats Save
  const handleStatsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteStats(statsData);
  };

  const handleStatChange = (id: string, field: 'value' | 'label', val: string) => {
    setStatsData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  // Handle Feature Add
  const handleAddFeatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featTitle.trim()) return;

    addWebsiteFeature({
      title: featTitle.trim(),
      desc: featDesc.trim(),
      iconName: featIcon,
    });

    setFeatTitle('');
    setFeatDesc('');
    setFeatIcon('Dumbbell');
    setIsAddFeatureOpen(false);
  };

  // Handle Feature Edit
  const handleEditFeatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature) return;

    updateWebsiteFeature(editingFeature.id, {
      title: editingFeature.title.trim(),
      desc: editingFeature.desc.trim(),
      iconName: editingFeature.iconName,
    });

    setEditingFeature(null);
  };

  // Handle Banner Save
  const handleBannerSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteBanner({
      badge: bannerBadge.trim(),
      title: bannerTitle.trim(),
      desc: bannerDesc.trim(),
      linkText: bannerLinkText.trim(),
      imageUrl: bannerImageUrl.trim() || '/images/about/coach-training.webp',
    });
  };

  // Handle Contact Save
  const handleContactSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContact({
      phone: contactPhone.trim(),
      email: contactEmail.trim(),
      address: contactAddress.trim(),
      landmark: contactLandmark.trim(),
      workingHoursWeekdays: workingWeekdays.trim(),
      workingHoursSunday: workingSunday.trim(),
      telegramChannel: telegramChannel.trim(),
      telegramAdmin: telegramAdmin.trim(),
      instagram: instagram.trim(),
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Globe className="w-5 h-5 text-lime-400" />
            <span>Sayt Boshqaruvi & Kontent CRUD</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Foydalanuvchilar ko‘radigan landing sahifasidagi matnlar, sarlavhalar, statistika, qulayliklar va aloqa ma’lumotlarini dinamik yangilang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-white transition-colors"
          >
            <span>Saytni jonli ko‘rish</span>
            <ExternalLink className="w-3.5 h-3.5 text-lime-400" />
          </Link>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-zinc-800">
        {[
          { id: 'hero', label: 'Hero (Bosh sahifa)', icon: Layout },
          { id: 'stats', label: 'Zal Statistikasi', icon: BarChart3 },
          { id: 'features', label: 'Klub Qulayliklari (CRUD)', icon: Sparkles },
          { id: 'banner', label: 'Aksiya Banneri', icon: Building2 },
          { id: 'contact', label: 'Aloqa & Ijtimoiy Tarmoqlar', icon: Phone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as WebsiteTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-lime-500 text-zinc-950 shadow-md shadow-lime-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO BO'LIMI */}
      {activeTab === 'hero' && (
        <Card className="border-zinc-800 bg-[#111827]/80">
          <CardHeader className="p-6 pb-4 border-b border-zinc-800">
            <CardTitle className="text-base font-bold text-white flex items-center justify-between">
              <span>Hero Bo‘limi Sozlamalari</span>
              <span className="text-[11px] font-normal text-zinc-400">
                O‘zgarishlar asosiy saytda darhol aks etadi
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleHeroSave} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Yuqori Badge Matni (Kichik sarlavha)
                </label>
                <Input
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  placeholder="Masalan: Farg‘ona, Quva • Akbaroboddagi Eng Zamonaviy Fitnes Klubi"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Asosiy Katta Sarlavha (Headline)
                </label>
                <Input
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="O‘zingizning Eng Kuchli Versiyangizni Yarating"
                  required
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Maslahat: &ldquo;Kuchli&rdquo; so‘zi avtomatik tarzda yashil (lime) rangda ajratib ko‘rsatiladi.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Tavsif Matni (Subtitle)
                </label>
                <textarea
                  rows={3}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors resize-none"
                  required
                />
              </div>

              {/* Bullet highlights list */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-300">
                    Sarlavha ostidagi afzalliklar (Bullet points)
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddBullet}
                    className="text-xs py-1 h-7 border-zinc-700"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    <span>Qo‘shish</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  {heroBullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="text-lime-400 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <Input
                        value={bullet}
                        onChange={(e) => handleBulletChange(idx, e.target.value)}
                        placeholder={`Afzallik #${idx + 1}`}
                        required
                      />
                      {heroBullets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(idx)}
                          className="p-2 text-zinc-500 hover:text-rose-400 transition-colors"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Hero Fon Rasmi (URL yoki lokal yo‘l)
                </label>
                <Input
                  value={heroBgImage}
                  onChange={(e) => setHeroBgImage(e.target.value)}
                  placeholder="/images/hero/hero-bg.webp"
                />
                <div className="mt-2.5 relative w-full max-w-md h-36 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroBgImage || '/images/hero/hero-bg.webp'}
                    alt="Hero preview"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <Button type="submit" variant="lime" size="md">
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Hero Ma’lumotlarini Saqlash</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: ZAL STATISTIKASI */}
      {activeTab === 'stats' && (
        <Card className="border-zinc-800 bg-[#111827]/80">
          <CardHeader className="p-6 pb-4 border-b border-zinc-800">
            <CardTitle className="text-base font-bold text-white flex items-center justify-between">
              <span>Zal Statistikasi Bloklari (4 ta ko‘rsatkich)</span>
              <span className="text-[11px] font-normal text-zinc-400">
                Hero ostida joylashgan asosiy parametrlar
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleStatsSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {statsData.map((stat, idx) => (
                  <div
                    key={stat.id}
                    className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-lime-400">
                      <span>Ko‘rsatkich #{idx + 1}</span>
                      <span className="text-zinc-500 text-[10px]">Blok ID: {stat.id}</span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Qiymati (Raqam / Vaqt)
                      </label>
                      <Input
                        value={stat.value}
                        onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                        placeholder="Masalan: 1,200+ yoki 07:00 – 23:00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Sarlavhasi (Tavsifi)
                      </label>
                      <Input
                        value={stat.label}
                        onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                        placeholder="Masalan: Kvadrat metr maydon"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Button type="submit" variant="lime" size="md">
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Statistikani Yangilash</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: KLUB QULAYLIKLARI (FEATURES CRUD) */}
      {activeTab === 'features' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Klub Qulayliklari & Imkoniyatlari ({websiteContent.features.length} ta)
              </h3>
              <p className="text-xs text-zinc-400">
                &ldquo;Klub Haqida&rdquo; bo‘limida chiqadigan kartochkalarni tahrirlash, qo‘shish va o‘chirish.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddFeatureOpen(true)}
              className="shadow-md shadow-lime-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Qulaylik Qo‘shish</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {websiteContent.features.map((item) => {
              const iconObj = AVAILABLE_ICONS.find((i) => i.id === item.iconName) || AVAILABLE_ICONS[0];
              const IconComp = iconObj.icon;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#111827]/80 border border-zinc-800 hover:border-lime-500/40 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400 flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setEditingFeature(item)}
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setFeatureToDelete(item)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-lime-300 transition-colors mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Ikonka: {iconObj.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: AKSIYA BANNERI */}
      {activeTab === 'banner' && (
        <Card className="border-zinc-800 bg-[#111827]/80">
          <CardHeader className="p-6 pb-4 border-b border-zinc-800">
            <CardTitle className="text-base font-bold text-white">
              Aksiya & Individual Yondashuv Banneri
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleBannerSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Yuqori Kichik Badge
                </label>
                <Input
                  value={bannerBadge}
                  onChange={(e) => setBannerBadge(e.target.value)}
                  placeholder="Individual Yondashuv"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Asosiy Banner Sarlavhasi
                </label>
                <Input
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="Birinchi Mashg‘ulotda Murabbiy Maslahati Mutlaqo Bepul"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Banner Tavsifi
                </label>
                <textarea
                  rows={3}
                  value={bannerDesc}
                  onChange={(e) => setBannerDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Havola Matni (Tugma)
                </label>
                <Input
                  value={bannerLinkText}
                  onChange={(e) => setBannerLinkText(e.target.value)}
                  placeholder="Tariflar bilan tanishing va a’zo bo‘ling"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Banner Rasmi (URL yoki lokal yo‘l)
                </label>
                <Input
                  value={bannerImageUrl}
                  onChange={(e) => setBannerImageUrl(e.target.value)}
                  placeholder="/images/about/coach-training.webp"
                />
                <div className="mt-2.5 relative w-full max-w-sm h-40 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bannerImageUrl || '/images/about/coach-training.webp'}
                    alt="Banner preview"
                    className="w-full h-full object-cover object-[center_30%]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="lime" size="md">
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Banner Ma’lumotlarini Saqlash</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: ALOQA & IJTIMOIY TARMOQLAR */}
      {activeTab === 'contact' && (
        <Card className="border-zinc-800 bg-[#111827]/80">
          <CardHeader className="p-6 pb-4 border-b border-zinc-800">
            <CardTitle className="text-base font-bold text-white flex items-center justify-between">
              <span>Aloqa va Ijtimoiy Tarmoqlar Rekvizitlari</span>
              <span className="text-[11px] font-normal text-zinc-400">
                Saytning barcha tugmalari va havolalari shunga bog‘langan
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleContactSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Zal Telefoni (Call-markaz)
                  </label>
                  <Input
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+998 (90) 123-45-67"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Email Manzili
                  </label>
                  <Input
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="info@powerzone.uz"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Telegram Kanal Havolasi
                  </label>
                  <Input
                    value={telegramChannel}
                    onChange={(e) => setTelegramChannel(e.target.value)}
                    placeholder="https://t.me/powerzone_quva"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Telegram Admin / Menejer Profili
                  </label>
                  <Input
                    value={telegramAdmin}
                    onChange={(e) => setTelegramAdmin(e.target.value)}
                    placeholder="https://t.me/powerzone_admin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Instagram Sahifasi Havolasi
                  </label>
                  <Input
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/powerzone_quva"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    To‘liq Manzil
                  </label>
                  <Input
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    placeholder="Farg‘ona viloyati, Quva tumani, Akbarobod markazi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Mo‘ljal (Landmark)
                  </label>
                  <Input
                    value={contactLandmark}
                    onChange={(e) => setContactLandmark(e.target.value)}
                    placeholder="Akbarobod markazi, asosiy yo‘l bo‘yida"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Ish Vaqti (Dushanba – Shanba)
                  </label>
                  <Input
                    value={workingWeekdays}
                    onChange={(e) => setWorkingWeekdays(e.target.value)}
                    placeholder="06:30 – 23:00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Ish Vaqti (Yakshanba)
                  </label>
                  <Input
                    value={workingSunday}
                    onChange={(e) => setWorkingSunday(e.target.value)}
                    placeholder="08:00 – 22:00"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="lime" size="md">
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Aloqa Rekvizitlarini Saqlash</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* MODAL: ADD FEATURE */}
      <Modal
        isOpen={isAddFeatureOpen}
        onClose={() => setIsAddFeatureOpen(false)}
        title="Yangi Qulaylik Kartochkasi Qo‘shish"
      >
        <form onSubmit={handleAddFeatureSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Qulaylik Sarlavhasi
            </label>
            <Input
              value={featTitle}
              onChange={(e) => setFeatTitle(e.target.value)}
              placeholder="Masalan: Fin Saunasi va Dush"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Tavsifi (Batafsil ma’lumot)
            </label>
            <textarea
              rows={3}
              value={featDesc}
              onChange={(e) => setFeatDesc(e.target.value)}
              placeholder="Mashg‘ulotdan so‘ng mushaklarni tiklash va dam olish uchun..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Ikonka Tanlang
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const IconC = item.icon;
                const isSelected = featIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFeatIcon(item.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-lime-500 bg-lime-500/15 text-lime-400'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <IconC className="w-5 h-5" />
                    <span className="text-[10px] text-center">{item.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddFeatureOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" variant="lime" size="sm">
              Qo‘shish
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: EDIT FEATURE */}
      <Modal
        isOpen={!!editingFeature}
        onClose={() => setEditingFeature(null)}
        title="Qulaylik Kartochkasini Tahrirlash"
      >
        {editingFeature && (
          <form onSubmit={handleEditFeatureSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Qulaylik Sarlavhasi
              </label>
              <Input
                value={editingFeature.title}
                onChange={(e) =>
                  setEditingFeature({ ...editingFeature, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Tavsifi
              </label>
              <textarea
                rows={3}
                value={editingFeature.desc}
                onChange={(e) =>
                  setEditingFeature({ ...editingFeature, desc: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-500 transition-colors resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Ikonka Tanlang
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AVAILABLE_ICONS.map((item) => {
                  const IconC = item.icon;
                  const isSelected = editingFeature.iconName === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setEditingFeature({ ...editingFeature, iconName: item.id })
                      }
                      className={`p-2.5 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-lime-500 bg-lime-500/15 text-lime-400'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <IconC className="w-5 h-5" />
                      <span className="text-[10px] text-center">{item.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingFeature(null)}
              >
                Bekor qilish
              </Button>
              <Button type="submit" variant="lime" size="sm">
                Saqlash
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Facility Confirmation Modal */}
      {featureToDelete && (
        <ConfirmDeleteModal
          isOpen={!!featureToDelete}
          onClose={() => setFeatureToDelete(null)}
          onConfirm={() => {
            if (featureToDelete) {
              deleteWebsiteFeature(featureToDelete.id);
              setFeatureToDelete(null);
            }
          }}
          title="Qulaylikni O‘chirish"
          description="Haqiqatan ham ushbu qulaylik kartochkasini saytdan olib tashlamoqchimisiz?"
          itemType="Zal Qulayligi"
          itemName={featureToDelete.title}
          itemDetails={
            <div className="text-xs text-zinc-300">
              <p className="text-zinc-400">{featureToDelete.desc}</p>
            </div>
          }
          warningText="Ushbu blok o‘chirilgach, u asosiy sahifadagi 'Biz Haqimizda' qulayliklar bo‘limidan butunlay olib tashlanadi."
          confirmText="Ha, o‘chirilsin"
        />
      )}

    </div>
  );
}
