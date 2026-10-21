'use client';

import React, { useState } from 'react';
import {
  Plus,
  CheckCircle,
  Archive,
  Edit3,
  Trash2,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useFitnesFlow } from '@/context/fitnes-context';
import { MembershipPlan, AccessType } from '@/types';
import { formatUZS, parseNumericInput } from '@/lib/utils';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';

export default function MembershipsPage() {
  const { plans, members, addPlan, updatePlan, deletePlan, togglePlanStatus } = useFitnesFlow();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [editPrice, setEditPrice] = useState<number | ''>(0);
  const [editDurationDays, setEditDurationDays] = useState<number | ''>(30);
  const [planToDelete, setPlanToDelete] = useState<MembershipPlan | null>(null);

  // Add plan form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>(250000);
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState<number | ''>(30);
  const [accessType, setAccessType] = useState<AccessType>('monthly_unlimited');
  const [addFeatures, setAddFeatures] = useState<string[]>([
    'Barcha kardio va kuch trenajyorlari',
    'Kiyinish xonasi va dush',
    'Bepul ichimlik suvi dispenseridan foydalanish',
  ]);
  const [addPopular, setAddPopular] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Add form feature helpers
  const handleAddFeatureChange = (index: number, val: string) => {
    const updated = [...addFeatures];
    updated[index] = val;
    setAddFeatures(updated);
  };

  const handleAddFeatureAppend = () => {
    setAddFeatures([...addFeatures, '']);
  };

  const handleAddFeatureRemove = (index: number) => {
    if (addFeatures.length <= 1) return;
    setAddFeatures(addFeatures.filter((_, i) => i !== index));
  };

  // Edit form feature helpers
  const handleEditFeatureChange = (index: number, val: string) => {
    if (!editingPlan) return;
    const updated = [...(editingPlan.features || [])];
    updated[index] = val;
    setEditingPlan({ ...editingPlan, features: updated });
  };

  const handleAddEditFeature = () => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      features: [...(editingPlan.features || []), ''],
    });
  };

  const handleRemoveEditFeature = (index: number) => {
    if (!editingPlan) return;
    const current = editingPlan.features || [];
    if (current.length <= 1) return;
    setEditingPlan({
      ...editingPlan,
      features: current.filter((_, i) => i !== index),
    });
  };

  const handleOpenEdit = (plan: MembershipPlan) => {
    setEditingPlan({
      ...plan,
      features: plan.features ? [...plan.features] : [],
    });
    setEditPrice(plan.price);
    setEditDurationDays(plan.durationDays);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const numPrice = price === '' ? 0 : Number(price);
    const numDuration = durationDays === '' ? 30 : Number(durationDays);

    if (!name.trim()) {
      setFormError('Tarif nomi kiritilishi shart');
      return;
    }
    if (numPrice <= 0) {
      setFormError('Narx 0 dan katta bo‘lishi shart');
      return;
    }

    const cleanedFeatures = addFeatures
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    if (cleanedFeatures.length === 0) {
      setFormError('Kamida bitta imkoniyat (bullet point) kiritilishi shart');
      return;
    }

    addPlan({
      name: name.trim(),
      price: numPrice,
      description: description.trim(),
      durationDays: numDuration,
      accessType,
      status: 'active',
      features: cleanedFeatures,
      popular: addPopular,
    });

    // Reset and close
    setName('');
    setPrice(250000);
    setDescription('');
    setAddFeatures([
      'Barcha kardio va kuch trenajyorlari',
      'Kiyinish xonasi va dush',
      'Bepul ichimlik suvi dispenseridan foydalanish',
    ]);
    setAddPopular(false);
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    const cleanedFeatures = (editingPlan.features || [])
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const numPrice = editPrice === '' ? 0 : Number(editPrice);
    const numDuration = editDurationDays === '' ? 30 : Number(editDurationDays);

    updatePlan(editingPlan.id, {
      name: editingPlan.name.trim(),
      price: numPrice,
      description: editingPlan.description.trim(),
      durationDays: numDuration,
      accessType: editingPlan.accessType,
      status: editingPlan.status,
      features: cleanedFeatures.length > 0 ? cleanedFeatures : ['Barcha trenajyorlar'],
      popular: editingPlan.popular,
    });

    setEditingPlan(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Tarif Rejalari (Abonementlar)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-lime-400 font-bold border border-zinc-700">
              {plans.length} ta tarif
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Fitnes klub a’zolik turlari, muddatlari va narx siyosatini boshqarish.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="shadow-lg shadow-lime-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Tarif Yaratish</span>
        </Button>
      </div>

      {/* Historical price preservation notice */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-3 backdrop-blur-md">
        <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/20 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-white text-sm mb-0.5">
            Tarixiy Narxlar Daxlsizligi Qoidasi
          </h4>
          <p className="text-zinc-400 leading-relaxed">
            Mavjud a’zolar bilan kelishilgan narxlar qat’iy saqlanadi. Tarif narxini yoki shartlarini o‘zgartirganingizda, avvalroq ro‘yxatdan o‘tgan a’zolarning kelishilgan to‘lov narxi avtomatik o‘zgarmaydi. Narx o‘zgarishi faqat yangi kiritiladigan to‘lovlar va kelgusi a’zoliklar uchun amal qiladi.
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const membersUsingThisPlan = members.filter(
            (m) => m.membershipPlanId === plan.id
          ).length;

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col justify-between border transition-all duration-200 ${
                plan.status === 'archived'
                  ? 'border-zinc-800/50 opacity-60 bg-zinc-950/40'
                  : plan.popular
                  ? 'border-lime-500/40 bg-[#121926]/90 shadow-lg shadow-lime-500/5'
                  : 'border-zinc-800 bg-[#101726]/80'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-lime-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-zinc-950" />
                    Ommabop Tarif
                  </span>
                </div>
              )}

              <CardHeader className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-white">
                      {plan.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {plan.durationDays} kunlik
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-zinc-400">
                        {plan.accessType === 'weekly_3_days'
                          ? 'Haftasiga 3 kun'
                          : plan.accessType === 'single_visit'
                          ? '1 martalik tashrif'
                          : 'Cheklanmagan kirish'}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant={plan.status === 'active' ? 'active' : 'neutral'}
                  >
                    {plan.status === 'active' ? 'Faol' : 'Arxivlangan'}
                  </Badge>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800/80">
                  <div className="text-2xl font-black text-lime-400 tracking-tight">
                    {formatUZS(plan.price)}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 min-h-[36px]">
                    {plan.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0 flex-1">
                <div className="space-y-2 mt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Imkoniyatlar:
                  </p>
                  <ul className="space-y-1.5">
                    {plan.features.map((feat, i) => (
                      <li
                        key={i}
                        className="text-xs text-zinc-300 flex items-start gap-2"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-4 border-t border-zinc-800/60 bg-zinc-950/30 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">
                  Biriktirilgan a’zolar: <strong className="text-white">{membersUsingThisPlan} ta</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(plan)}
                    title="Tahrirlash"
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => togglePlanStatus(plan.id)}
                    title={plan.status === 'active' ? 'Arxivlash' : 'Faollashtirish'}
                    className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPlanToDelete(plan)}
                    title="O‘chirish"
                    className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* CREATE PLAN MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yangi Tarif Rejasi Yaratish"
        description="Mijozlar uchun yangi a’zolik turini va narx parametrlarini belgilang."
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {formError}
            </div>
          )}

          <Input
            label="Tarif Nomi"
            placeholder="Masalan: Yillik VIP Cheklanmagan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Narxi (UZS)"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseNumericInput(e.target.value))}
              min={0}
              step={5000}
              required
              helperText={`Formatlangan: ${formatUZS(price)}`}
            />

            <Input
              label="Davomiyligi (kun)"
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(parseNumericInput(e.target.value))}
              min={1}
              required
            />
          </div>

          <Select
            label="Kirish (Ruxsat) Turi"
            options={[
              { label: 'Oylik cheklanmagan (Har kuni)', value: 'monthly_unlimited' },
              { label: 'Haftasiga 3 kun (Haftada max 3 tashrif)', value: 'weekly_3_days' },
              { label: 'Bir martalik mashg‘ulot (1 kunlik)', value: 'single_visit' },
            ]}
            value={accessType}
            onChange={(e) => setAccessType(e.target.value as AccessType)}
          />

          <Input
            label="Qisqacha Tavsif"
            placeholder="Kimlar uchun mo‘ljallangan va afzalliklari..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* BULLET POINTS (TARIF IMKONIATLARI) EDITOR */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Tarif Imkoniyatlari (Bullet Pointlar)
                </label>
                <p className="text-[11px] text-zinc-400">
                  Landing sahifasida har bir punkt yashil tasdiq belgisi bilan chiqadi.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFeatureAppend}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Punkt qo‘shish</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 mt-2">
              {addFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-lime-500/15 border border-lime-500/30 text-lime-400 flex items-center justify-center shrink-0 text-[11px] font-bold">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => handleAddFeatureChange(idx, e.target.value)}
                    placeholder={`Imkoniyat ${idx + 1}...`}
                    className="flex-1 bg-[#0d131f] border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFeatureRemove(idx)}
                    disabled={addFeatures.length <= 1}
                    className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                    title="Ushbu punktni o‘chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Toggle */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-zinc-800">
            <input
              type="checkbox"
              id="addPlanPopular"
              checked={addPopular}
              onChange={(e) => setAddPopular(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-lime-500 focus:ring-lime-500 cursor-pointer"
            />
            <label
              htmlFor="addPlanPopular"
              className="text-xs text-zinc-300 font-semibold cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>Eng ommabop tarif deb belgilash (&ldquo;ENG OMMABOP TANLOV&rdquo; yorlig‘i)</span>
            </label>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" variant="primary">
              <Plus className="w-4 h-4" />
              <span>Tarifni Saqlash</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT PLAN MODAL */}
      {editingPlan && (
        <Modal
          isOpen={!!editingPlan}
          onClose={() => setEditingPlan(null)}
          title="Tarif Rejasini Tahrirlash"
          maxWidth="lg"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Tarif Nomi"
              value={editingPlan.name}
              onChange={(e) =>
                setEditingPlan({ ...editingPlan, name: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Narxi (UZS)"
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(parseNumericInput(e.target.value))}
                min={0}
                required
                helperText={`So'mda: ${formatUZS(editPrice)}`}
              />

              <Input
                label="Davomiyligi (kun)"
                type="number"
                value={editDurationDays}
                onChange={(e) => setEditDurationDays(parseNumericInput(e.target.value))}
                min={1}
                required
              />
            </div>

            <Select
              label="Kirish Turi"
              options={[
                { label: 'Oylik cheklanmagan', value: 'monthly_unlimited' },
                { label: 'Haftasiga 3 kun', value: 'weekly_3_days' },
                { label: 'Bir martalik mashg‘ulot', value: 'single_visit' },
              ]}
              value={editingPlan.accessType}
              onChange={(e) =>
                setEditingPlan({
                  ...editingPlan,
                  accessType: e.target.value as AccessType,
                })
              }
            />

            <Input
              label="Qisqacha Tavsif"
              value={editingPlan.description}
              onChange={(e) =>
                setEditingPlan({ ...editingPlan, description: e.target.value })
              }
            />

            {/* BULLET POINTS (TARIF IMKONIATLARI) EDITOR */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Tarif Imkoniyatlari (Bullet Pointlar)
                  </label>
                  <p className="text-[11px] text-zinc-400">
                    Klub kartasida ko‘rinadigan barcha punktlar ro‘yxati.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddEditFeature}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Punkt qo‘shish</span>
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 mt-2">
                {(editingPlan.features || []).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-lime-500/15 border border-lime-500/30 text-lime-400 flex items-center justify-center shrink-0 text-[11px] font-bold">
                      {idx + 1}
                    </div>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleEditFeatureChange(idx, e.target.value)}
                      placeholder={`Imkoniyat ${idx + 1} (masalan: Barcha trenajyorlar)...`}
                      className="flex-1 bg-[#0d131f] border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveEditFeature(idx)}
                      disabled={(editingPlan.features || []).length <= 1}
                      className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                      title="Ushbu punktni o‘chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Toggle */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-zinc-800">
              <input
                type="checkbox"
                id="editPlanPopular"
                checked={editingPlan.popular || false}
                onChange={(e) =>
                  setEditingPlan({ ...editingPlan, popular: e.target.checked })
                }
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-lime-500 focus:ring-lime-500 cursor-pointer"
              />
              <label
                htmlFor="editPlanPopular"
                className="text-xs text-zinc-300 font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                <span>Eng ommabop tarif deb belgilash (&ldquo;ENG OMMABOP TANLOV&rdquo; yorlig‘i)</span>
              </label>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs">
              Eslatma: Narx o‘zgarishi mavjud a’zolarning o‘tgan kelishuvlariga ta’sir qilmaydi.
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingPlan(null)}
              >
                Bekor qilish
              </Button>
              <Button type="submit" variant="primary">
                O‘zgarishlarni Saqlash
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Membership Plan Confirmation Modal */}
      {planToDelete && (
        <ConfirmDeleteModal
          isOpen={!!planToDelete}
          onClose={() => setPlanToDelete(null)}
          onConfirm={() => {
            if (planToDelete) {
              deletePlan(planToDelete.id);
              setPlanToDelete(null);
            }
          }}
          title="Tarif Rejasini O‘chirish"
          description="Haqiqatan ham ushbu tarif rejasini tizimdan butunlay o‘chirmoqchimisiz?"
          itemType="Tarif Rejasi"
          itemName={planToDelete.name}
          itemDetails={
            <div className="space-y-1 text-xs text-zinc-300">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Oylik narx:</span>
                <span className="font-extrabold text-lime-400 text-sm">
                  {formatUZS(planToDelete.price)} / oy
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Davomiyligi:</span>
                <span className="text-zinc-200 font-medium">
                  {planToDelete.durationDays} kun (
                  {planToDelete.accessType === 'monthly_unlimited'
                    ? 'Oylik cheklanmagan'
                    : planToDelete.accessType === 'weekly_3_days'
                    ? 'Haftasiga 3 kun'
                    : 'Bir martalik'}
                  )
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-zinc-800/80">
                <span className="text-zinc-400">Biriktirilgan a’zolar:</span>
                <span className="text-white font-bold">
                  {members.filter((m) => m.membershipPlanId === planToDelete.id).length} ta a’zo
                </span>
              </div>
            </div>
          }
          warningText="Tarif o‘chirilganda mavjud a’zolarning kelishilgan narxlari o‘zgarmaydi, ammo yangi a’zolar ushbu tarifni tanlay olmaydi."
          confirmText="Ha, tarifni o‘chirish"
        />
      )}
    </div>
  );
}
