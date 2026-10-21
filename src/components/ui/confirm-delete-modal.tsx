'use client';

import React, { useEffect } from 'react';
import { X, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemType?: string;
  itemName?: string;
  itemDetails?: React.ReactNode;
  warningText?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning';
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'O‘chirishni Tasdiqlang',
  description = 'Ushbu ma’lumotni tizimdan o‘chirishni xohlaysizmi?',
  itemType,
  itemName,
  itemDetails,
  warningText = 'Ushbu amalni ortga qaytarib bo‘lmaydi. Barcha unga tegishli ma’lumotlar butunlay o‘chiriladi.',
  confirmText = 'Ha, o‘chirilsin',
  cancelText = 'Bekor qilish',
  isLoading = false,
  variant = 'danger',
}: ConfirmDeleteModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          'relative w-full max-w-md bg-[#0e1422] border rounded-2xl shadow-2xl text-slate-100 z-10 overflow-hidden my-auto animate-in zoom-in-95 duration-200',
          isDanger
            ? 'border-rose-900/60 shadow-rose-950/40'
            : 'border-amber-900/60 shadow-amber-950/40'
        )}
      >
        {/* Glow Accent Header */}
        <div
          className={cn(
            'p-5 border-b flex items-start gap-3.5',
            isDanger
              ? 'bg-rose-950/30 border-rose-900/40'
              : 'bg-amber-950/30 border-amber-900/40'
          )}
        >
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-inner',
              isDanger
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            )}
          >
            {isDanger ? (
              <Trash2 className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <RefreshCw className="w-5 h-5 stroke-[2.2]" />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Item Preview Card */}
          {(itemName || itemType || itemDetails) && (
            <div
              className={cn(
                'p-3.5 rounded-xl border bg-zinc-950/70',
                isDanger ? 'border-rose-900/40' : 'border-amber-900/40'
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                {itemType && (
                  <span
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border',
                      isDanger
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                        : 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                    )}
                  >
                    {itemType}
                  </span>
                )}
                <span className="text-[10px] text-zinc-500">O‘chiriladigan ma’lumot</span>
              </div>

              {itemName && (
                <h4 className="text-sm sm:text-base font-extrabold text-white mt-1 break-words">
                  {itemName}
                </h4>
              )}

              {itemDetails && <div className="mt-2 pt-2 border-t border-zinc-800/80">{itemDetails}</div>}
            </div>
          )}

          {/* Warning Banner */}
          <div
            className={cn(
              'p-3 rounded-xl border flex items-start gap-2.5 text-xs',
              isDanger
                ? 'bg-rose-950/40 border-rose-900/50 text-rose-300'
                : 'bg-amber-950/40 border-amber-900/50 text-amber-300'
            )}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{warningText}</p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 px-5 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={isDanger ? 'destructive' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className={cn(
              'font-bold shadow-lg',
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/60 text-white'
                : 'bg-amber-500 hover:bg-amber-400 shadow-amber-950/60 text-zinc-950 font-black'
            )}
          >
            {isDanger && <Trash2 className="w-3.5 h-3.5 mr-1" />}
            <span>{confirmText}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
