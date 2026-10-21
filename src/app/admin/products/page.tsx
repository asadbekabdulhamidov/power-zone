'use client';

import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useFitnesFlow } from '@/context/fitnes-context';
import { Product, ProductCategory } from '@/types';
import { formatUZS } from '@/lib/utils';

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleProductActive } =
    useFitnesFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Add Product form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('water');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(10000);
  const [formStock, setFormStock] = useState<number>(20);
  const [formUnit, setFormUnit] = useState('dona');
  const [formError, setFormError] = useState<string | null>(null);

  // Category labels map
  const categoryLabels: Record<ProductCategory, string> = {
    water: 'Suv',
    vitamins: 'Vitaminlar',
    sports_drinks: 'Sport ichimliklari',
    accessories: 'Aksessuarlar',
    other: 'Boshqa',
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        categoryFilter === 'all' || p.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  // Inventory stats
  const totalStockValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stockQuantity <= 10).length;
  }, [products]);

  // Handle Add Product Submission
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Mahsulot nomi kiritilishi shart');
      return;
    }
    if (!formPrice || formPrice <= 0) {
      setFormError('Narx 0 dan katta bo‘lishi shart');
      return;
    }

    const defaultImg =
      formImageUrl.trim() ||
      'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80';

    addProduct({
      name: formName.trim(),
      category: formCategory,
      categoryLabel: categoryLabels[formCategory],
      imageUrl: defaultImg,
      description: formDescription.trim(),
      price: Number(formPrice),
      stockQuantity: Number(formStock),
      isActive: true,
      unit: formUnit,
    });

    // Reset and close
    setFormName('');
    setFormImageUrl('');
    setFormDescription('');
    setFormPrice(10000);
    setFormStock(20);
    setIsAddModalOpen(false);
  };

  // Handle Edit Product Submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      category: editingProduct.category,
      categoryLabel: categoryLabels[editingProduct.category],
      imageUrl: editingProduct.imageUrl,
      description: editingProduct.description,
      price: Number(editingProduct.price),
      stockQuantity: Number(editingProduct.stockQuantity),
      isActive: editingProduct.isActive,
      unit: editingProduct.unit,
    });

    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Mahsulotlar Katalogi</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-lime-400 font-bold border border-zinc-700">
              {products.length} ta mahsulot
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Zal qabulxonasidagi ichimliklar, vitaminlar, kokteyllar va sport aksessuarlari ombori.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="shadow-lg shadow-lime-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Mahsulot Qo‘shish</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#101726]/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Faol Mahsulotlar
            </p>
            <div className="text-2xl font-black text-lime-400 mt-1">
              {products.filter((p) => p.isActive).length} ta
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Mijozlar saytida ko‘rinadi</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-lime-500/10 border border-lime-500/25 text-lime-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101726]/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Ombordagi Mahsulotlar Qiymati
            </p>
            <div className="text-2xl font-black text-white mt-1">
              {formatUZS(totalStockValue)}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Barcha tovarlar summasi</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101726]/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Kam Qolgan Tovarlar
            </p>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {lowStockCount} ta
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Qoldig‘i 10 donadan kam</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#111827]/80 border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1">
          <Input
            placeholder="Mahsulot nomi yoki tavsifi bo‘yicha izlash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-zinc-400" />}
            className="bg-[#090d16]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'water', label: 'Suv' },
            { id: 'vitamins', label: 'Vitaminlar' },
            { id: 'sports_drinks', label: 'Sport ichimliklari' },
            { id: 'accessories', label: 'Aksessuarlar' },
            { id: 'other', label: 'Boshqa' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${
                categoryFilter === cat.id
                  ? 'bg-lime-500 text-zinc-950 border-lime-400 shadow-sm'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#111827]/70 backdrop-blur-md overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mahsulot</TableHead>
              <TableHead>Kategoriya</TableHead>
              <TableHead>Narxi</TableHead>
              <TableHead>Ombordagi Qoldiq</TableHead>
              <TableHead>Holati</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                {/* Photo & Name */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {product.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 line-clamp-1 max-w-xs">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {product.categoryLabel}
                  </span>
                </TableCell>

                {/* Price */}
                <TableCell className="font-black text-sm text-lime-400">
                  {formatUZS(product.price)}
                </TableCell>

                {/* Stock Quantity */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold text-xs ${
                        product.stockQuantity === 0
                          ? 'text-rose-400'
                          : product.stockQuantity <= 10
                          ? 'text-amber-400'
                          : 'text-zinc-200'
                      }`}
                    >
                      {product.stockQuantity} {product.unit || 'dona'}
                    </span>
                    {product.stockQuantity <= 10 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800">
                        Kam qoldi
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Active / Inactive status */}
                <TableCell>
                  <button
                    onClick={() => toggleProductActive(product.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      product.isActive
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        product.isActive ? 'bg-emerald-400' : 'bg-zinc-500'
                      }`}
                    />
                    <span>{product.isActive ? 'Faol (Saytda bor)' : 'Faol emas'}</span>
                  </button>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1.5">
                    {/* Edit */}
                    <button
                      onClick={() => setEditingProduct(product)}
                      title="Tahrirlash"
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Haqiqatan ham "${product.name}" mahsulotini o‘chirishni xohlaysizmi?`
                          )
                        ) {
                          deleteProduct(product.id);
                        }
                      }}
                      title="O‘chirish"
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950 hover:text-rose-400 text-zinc-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-zinc-400 text-xs">
                  Mahsulotlar topilmadi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ADD PRODUCT MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yangi Mahsulot Qo‘shish"
        description="Fitnes bar yoki resepshn uchun yangi tovar kartasini yarating."
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {formError}
            </div>
          )}

          <Input
            label="Mahsulot Nomi"
            placeholder="Masalan: Whey Protein Shokolad 1000g"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategoriya"
              options={[
                { label: 'Suv (Mineral va gazsiz)', value: 'water' },
                { label: 'Vitaminlar va qo‘shimchalar', value: 'vitamins' },
                { label: 'Sport ichimliklari (Izotoniklar)', value: 'sports_drinks' },
                { label: 'Aksessuarlar (Sochiq, shayker)', value: 'accessories' },
                { label: 'Boshqa (Batonchiklar, gazaklar)', value: 'other' },
              ]}
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
            />

            <Input
              label="Narxi (UZS)"
              type="number"
              value={formPrice}
              onChange={(e) => setFormPrice(Number(e.target.value))}
              min={1000}
              step={1000}
              required
              helperText={`Formatlangan: ${formatUZS(formPrice)}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ombordagi Miqdor"
              type="number"
              value={formStock}
              onChange={(e) => setFormStock(Number(e.target.value))}
              min={0}
              required
            />

            <Select
              label="O‘lchov Birligi"
              options={[
                { label: 'dona', value: 'dona' },
                { label: 'banka', value: 'banka' },
                { label: 'quti', value: 'quti' },
                { label: 'litr', value: 'litr' },
              ]}
              value={formUnit}
              onChange={(e) => setFormUnit(e.target.value)}
            />
          </div>

          <Input
            label="Rasm Havolasi (URL)"
            placeholder="https://images.unsplash.com/..."
            value={formImageUrl}
            onChange={(e) => setFormImageUrl(e.target.value)}
            helperText="Bo‘sh qoldirilsa, avtomatik mos rasm tanlanadi."
          />

          <Input
            label="Qisqacha Tavsif"
            placeholder="Mahsulot tarkibi va maqsadi..."
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />

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
              <span>Mahsulotni Saqlash</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <Modal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          title="Mahsulotni Tahrirlash"
          maxWidth="lg"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Mahsulot Nomi"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Kategoriya"
                options={[
                  { label: 'Suv', value: 'water' },
                  { label: 'Vitaminlar', value: 'vitamins' },
                  { label: 'Sport ichimliklari', value: 'sports_drinks' },
                  { label: 'Aksessuarlar', value: 'accessories' },
                  { label: 'Boshqa', value: 'other' },
                ]}
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value as ProductCategory,
                  })
                }
              />

              <Input
                label="Narxi (UZS)"
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: Number(e.target.value),
                  })
                }
                min={1000}
                required
                helperText={`So'mda: ${formatUZS(editingProduct.price)}`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ombordagi Miqdor"
                type="number"
                value={editingProduct.stockQuantity}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stockQuantity: Number(e.target.value),
                  })
                }
                min={0}
                required
              />

              <Input
                label="O‘lchov Birligi"
                value={editingProduct.unit || 'dona'}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, unit: e.target.value })
                }
              />
            </div>

            <Input
              label="Rasm URL"
              value={editingProduct.imageUrl}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
              }
            />

            <Input
              label="Tavsif"
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
            />

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="editIsActive"
                checked={editingProduct.isActive}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    isActive: e.target.checked,
                  })
                }
                className="rounded border-zinc-700 bg-zinc-900 text-lime-500 focus:ring-lime-500"
              />
              <label
                htmlFor="editIsActive"
                className="text-xs text-zinc-300 font-medium cursor-pointer"
              >
                Mahsulot faol va jamoatchilik saytida ko‘rinsin
              </label>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingProduct(null)}
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
    </div>
  );
}
