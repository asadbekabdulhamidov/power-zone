'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Search,
  Phone,
  Copy,
  Trash2,
  CheckCircle,
  ExternalLink,
  Plus,
  Mail,
  Send,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { useFitnesFlow } from '@/context/fitnes-context';
import { MessageStatus, ContactMessage } from '@/types';
import { formatDateUz } from '@/lib/utils';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';

export default function AdminMessagesPage() {
  const {
    contactMessages,
    addContactMessage,
    updateMessageStatus,
    deleteContactMessage,
    showToast,
  } = useFitnesFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MessageStatus>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

  // Manual inquiry form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Telefon orqali murojaat');
  const [message, setMessage] = useState('');

  // Counts
  const totalCount = contactMessages.length;
  const newCount = contactMessages.filter((m) => m.status === 'new').length;
  const readCount = contactMessages.filter((m) => m.status === 'read' || m.status === 'replied').length;

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return contactMessages.filter((m) => {
      const matchSearch =
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.subject && m.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || m.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [contactMessages, searchQuery, statusFilter]);

  const handleCopyPhone = (ph: string) => {
    navigator.clipboard.writeText(ph);
    showToast(`Telefon nusxalandi: ${ph}`);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    addContactMessage({
      fullName: name.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    setName('');
    setPhone('');
    setMessage('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-lime-400" />
            <span>Mijozlar Murojaatlari va Savollari</span>
            {newCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                {newCount} ta yangi
              </span>
            )}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Saytning &ldquo;Aloqa va Murojaat&rdquo; shakli orqali kelib tushgan savollar, qiziqishlar va a’zolik so‘rovlari.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="shadow-md shadow-lime-500/20"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Yangi Murojaat Qayd Etish</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#111827]/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              Jami Murojaatlar
            </p>
            <p className="text-2xl font-black text-white mt-1">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827]/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              Yangi (Kutilayotganlar)
            </p>
            <p className="text-2xl font-black text-rose-400 mt-1">{newCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827]/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              Ko‘rib Chiqilganlar
            </p>
            <p className="text-2xl font-black text-lime-400 mt-1">{readCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-[#111827]/80 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Ism, telefon yoki xabar bo‘yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-zinc-500" />}
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Barchasi', count: totalCount },
            { id: 'new', label: 'Yangi', count: newCount },
            { id: 'read', label: 'Ko‘rib chiqilgan', count: readCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as 'all' | MessageStatus)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-lime-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800 bg-zinc-900 border border-zinc-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <Card className="border-zinc-800 bg-[#111827]/60 text-center py-16">
          <CardContent className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-zinc-500 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-white">Hech qanday murojaat topilmadi</p>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Qidiruv so‘rovingizni o‘zgartiring yoki saytdan yangi xabarlar kelishini kuting.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const isNew = msg.status === 'new';
            const cleanPhone = msg.phone.replace(/[^0-9+]/g, '');

            return (
              <Card
                key={msg.id}
                className={`border transition-all duration-200 ${
                  isNew
                    ? 'border-rose-500/40 bg-[#141b29] shadow-lg shadow-rose-950/20'
                    : 'border-zinc-800/80 bg-[#111827]/70'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-sm font-bold text-white">
                          {msg.fullName}
                        </span>

                        <Badge
                          variant={isNew ? 'expired' : 'active'}
                          className="text-[10px] uppercase font-bold"
                        >
                          {isNew ? 'Yangi Murojaat' : 'Ko‘rib chiqildi'}
                        </Badge>

                        {msg.subject && (
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-lg border font-medium ${
                              msg.subject.toLowerCase().includes('a’zolik') ||
                              msg.subject.toLowerCase().includes('azolik')
                                ? 'bg-lime-500/15 text-lime-400 border-lime-500/30 font-bold'
                                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                            }`}
                          >
                            {msg.subject}
                          </span>
                        )}

                        <span className="text-[11px] text-zinc-500 ml-auto md:ml-0">
                          {formatDateUz(msg.createdAt)}
                        </span>
                      </div>

                      {/* Message Content Body */}
                      <p className="text-xs sm:text-sm text-zinc-300 bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80 leading-relaxed font-normal">
                        &ldquo;{msg.message}&rdquo;
                      </p>

                      {/* Phone & Direct Contacts */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                        <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                          <Phone className="w-3.5 h-3.5 text-lime-400" />
                          <span>{msg.phone}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyPhone(msg.phone)}
                          className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                          title="Telefonni nusxalash"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Nusxalash</span>
                        </button>

                        <a
                          href={`tel:${cleanPhone}`}
                          className="text-[11px] text-lime-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Qo‘ng‘iroq qilish</span>
                        </a>

                        <a
                          href={`https://t.me/+${cleanPhone.replace('+', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Send className="w-3 h-3" />
                          <span>Telegramda yozish</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-zinc-800 pt-3 md:pt-0 md:pl-4">
                      {(msg.subject?.toLowerCase().includes('a’zolik') ||
                        msg.subject?.toLowerCase().includes('azolik')) && (
                        <Link
                          href="/admin/members"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-lime-500/20 w-full"
                          title="Mijoz kelganida a’zolar ro‘yxatiga kiritish va to‘lov olish"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>A’zo qilish</span>
                        </Link>
                      )}

                      {isNew ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => updateMessageStatus(msg.id, 'read')}
                          className="text-xs w-full justify-center"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1 text-lime-400" />
                          <span>O‘qildi</span>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateMessageStatus(msg.id, 'new')}
                          className="text-xs w-full justify-center text-zinc-400 border-zinc-800"
                        >
                          <span>Yangiga qaytarish</span>
                        </Button>
                      )}

                      <button
                        type="button"
                        onClick={() => setMessageToDelete(msg)}
                        className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors ml-auto md:ml-0 cursor-pointer"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* MODAL: MANUAL INQUIRY LOG */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yangi Murojaat yoki Qo‘ng‘iroqni Qayd Etish"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Mijoz Ism-Familiyasi <span className="text-rose-400">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Dilshodbek Aliyev"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Telefon Raqami <span className="text-rose-400">*</span>
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 (90) 123-45-67"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Murojaat Mavzusi
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Telefon orqali / Resepshnda berilgan savol"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Savol yoki Xabar Matni <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mijoz nima haqida so‘radi yoki qanday ma’lumot qoldirdi..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" variant="lime" size="sm">
              Murojaatni Saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Inquiry Confirmation Modal */}
      {messageToDelete && (
        <ConfirmDeleteModal
          isOpen={!!messageToDelete}
          onClose={() => setMessageToDelete(null)}
          onConfirm={() => {
            if (messageToDelete) {
              deleteContactMessage(messageToDelete.id);
              setMessageToDelete(null);
            }
          }}
          title="Murojaatni O‘chirish"
          description="Haqiqatan ham ushbu mijoz murojaatini tizimdan butunlay o‘chirmoqchimisiz?"
          itemType="Mijoz Murojaati"
          itemName={messageToDelete.fullName}
          itemDetails={
            <div className="space-y-1.5 text-xs text-zinc-300">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Telefon:</span>
                <span className="font-bold text-white">{messageToDelete.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Mavzu:</span>
                <span className="text-lime-400 font-medium">{messageToDelete.subject}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs italic">
                &ldquo;{messageToDelete.message}&rdquo;
              </div>
              <div className="text-[11px] text-zinc-500 pt-1">
                Yuborilgan vaqti: {formatDateUz(messageToDelete.createdAt)}
              </div>
            </div>
          }
          warningText="Ushbu murojaat o‘chirilgach, uning yozuvlari va matni qayta tiklanmaydi."
          confirmText="Ha, murojaatni o‘chirish"
        />
      )}
    </div>
  );
}
