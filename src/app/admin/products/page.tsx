'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  AlertCircle,
  Camera,
  Upload,
  RefreshCw,
  X,
  Sparkles,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { useFitnesFlow } from '@/context/fitnes-context';
import { Product, ProductCategory } from '@/types';
import { formatUZS, parseNumericInput } from '@/lib/utils';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';

// Verified, high-definition preset photos for gym products
const PRESET_PRODUCT_IMAGES: {
  label: string;
  category: ProductCategory;
  url: string;
}[] = [
  {
    label: 'Mineral Suv',
    category: 'water',
    url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Whey Protein',
    category: 'vitamins',
    url: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Izotonik Ichimlik',
    category: 'sports_drinks',
    url: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'BCAA Kukun',
    category: 'vitamins',
    url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Energetik Ichimlik',
    category: 'sports_drinks',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Sport Sochig‘i',
    category: 'accessories',
    url: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Multivitamin',
    category: 'vitamins',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Protein Batonchik',
    category: 'other',
    url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Shayker',
    category: 'accessories',
    url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80',
  },
];

const CATEGORY_DEFAULT_IMAGES: Record<ProductCategory, string> = {
  water:
    'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80',
  vitamins:
    'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80',
  sports_drinks:
    'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=600&q=80',
  accessories:
    'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80',
  other:
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80',
};

// Resilient product table thumbnail
function AdminProductThumbnail({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500">
        <Package className="w-5 h-5 text-lime-400" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover"
    />
  );
}

export default function ProductsPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    resetProducts,
  } = useFitnesFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState<number | ''>(0);
  const [editStock, setEditStock] = useState<number | ''>(0);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Add Product form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('water');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number | ''>(10000);
  const [formStock, setFormStock] = useState<number | ''>(20);
  const [formUnit, setFormUnit] = useState('dona');
  const [formError, setFormError] = useState<string | null>(null);

  // Camera & File upload for Add Product
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Camera & File upload for Edit Product
  const [isEditCameraActive, setIsEditCameraActive] = useState(false);
  const [editCameraError, setEditCameraError] = useState<string | null>(null);
  const editVideoRef = useRef<HTMLVideoElement | null>(null);
  const editStreamRef = useRef<MediaStream | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  // Category labels map
  const categoryLabels: Record<ProductCategory, string> = {
    water: 'Suv',
    vitamins: 'Vitaminlar',
    sports_drinks: 'Sport ichimliklari',
    accessories: 'Aksessuarlar',
    other: 'Boshqa',
  };

  // Camera functions for Add Modal
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera texnologiyasi ushbu brauzerda qo‘llab-quvvatlanmaydi.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      setCameraError(
        'Kameraga ulanib bo‘lmadi. Brauzerda kameraga ruxsat berilganligini tekshiring yoki qurilmadan rasm yuklang.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setFormImageUrl(dataUrl);
    }
    stopCamera();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setCameraError('Faqat rasm formatidagi fayllarni yuklash mumkin (JPG, PNG, WebP).');
        return;
      }
      try {
        const { compressImageFile } = await import('@/lib/image-util');
        const compressed = await compressImageFile(file, 800, 0.82);
        setFormImageUrl(compressed);
      } catch {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setFormImageUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Camera functions for Edit Modal
  const startEditCamera = async () => {
    setEditCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera mavjud emas.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      editStreamRef.current = stream;
      setIsEditCameraActive(true);
      setTimeout(() => {
        if (editVideoRef.current) {
          editVideoRef.current.srcObject = stream;
          editVideoRef.current.play();
        }
      }, 100);
    } catch {
      setEditCameraError(
        'Kameraga ulanib bo‘lmadi. Qurilmadan rasm yuklashdan foydalanishingiz mumkin.'
      );
    }
  };

  const stopEditCamera = () => {
    if (editStreamRef.current) {
      editStreamRef.current.getTracks().forEach((track) => track.stop());
      editStreamRef.current = null;
    }
    setIsEditCameraActive(false);
  };

  const captureEditPhoto = () => {
    if (!editVideoRef.current || !editingProduct) return;
    const canvas = document.createElement('canvas');
    canvas.width = editVideoRef.current.videoWidth || 640;
    canvas.height = editVideoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(editVideoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setEditingProduct({ ...editingProduct, imageUrl: dataUrl });
    }
    stopEditCamera();
  };

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      if (!file.type.startsWith('image/')) {
        setEditCameraError('Faqat rasm formatidagi fayllarni yuklash mumkin.');
        return;
      }
      try {
        const { compressImageFile } = await import('@/lib/image-util');
        const compressed = await compressImageFile(file, 800, 0.82);
        setEditingProduct({ ...editingProduct, imageUrl: compressed });
      } catch {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setEditingProduct({ ...editingProduct, imageUrl: reader.result });
          }
        };
        reader.readAsDataURL(file);
      }
    }
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

  // Open edit modal and initialize price/stock states
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setEditPrice(product.price);
    setEditStock(product.stockQuantity);
  };

  // Handle Add Product Submission
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const numPrice = formPrice === '' ? 0 : Number(formPrice);
    const numStock = formStock === '' ? 0 : Number(formStock);

    if (!formName.trim()) {
      setFormError('Mahsulot nomi kiritilishi shart');
      return;
    }
    if (numPrice <= 0) {
      setFormError('Narx 0 dan katta bo‘lishi shart');
      return;
    }

    const defaultImg =
      formImageUrl.trim() ||
      CATEGORY_DEFAULT_IMAGES[formCategory] ||
      CATEGORY_DEFAULT_IMAGES.water;

    addProduct({
      name: formName.trim(),
      category: formCategory,
      categoryLabel: categoryLabels[formCategory],
      imageUrl: defaultImg,
      description: formDescription.trim(),
      price: numPrice,
      stockQuantity: numStock,
      isActive: true,
      unit: formUnit,
    });

    // Reset and close
    setFormName('');
    setFormImageUrl('');
    setFormDescription('');
    setFormPrice(10000);
    setFormStock(20);
    stopCamera();
    setIsAddModalOpen(false);
  };

  // Handle Edit Product Submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name.trim()) {
      setEditCameraError('Mahsulot nomi kiritilishi shart');
      return;
    }

    const finalPrice = editPrice === '' ? 0 : Number(editPrice);
    if (finalPrice <= 0) {
      setEditCameraError('Mahsulot narxi 0 dan katta bo‘lishi shart');
      return;
    }

    const finalStock = editStock === '' ? 0 : Number(editStock);
    if (finalStock < 0) {
      setEditCameraError('Qoldiq soni manfiy bo‘lishi mumkin emas');
      return;
    }

    const finalImg =
      editingProduct.imageUrl.trim() ||
      CATEGORY_DEFAULT_IMAGES[editingProduct.category] ||
      CATEGORY_DEFAULT_IMAGES.water;

    updateProduct(editingProduct.id, {
      name: editingProduct.name.trim(),
      category: editingProduct.category,
      categoryLabel: categoryLabels[editingProduct.category],
      imageUrl: finalImg,
      description: editingProduct.description.trim(),
      price: finalPrice,
      stockQuantity: finalStock,
      isActive: editingProduct.isActive,
      unit: editingProduct.unit,
    });

    stopEditCamera();
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

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setIsResetConfirmOpen(true)}
            className="border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white"
            title="Standart mahsulotlar va rasmlarni yangilash"
          >
            <RefreshCw className="w-4 h-4 text-lime-400" />
            <span>Rasmlarni Yangilash</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              setFormError(null);
              setIsAddModalOpen(true);
            }}
            className="shadow-lg shadow-lime-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Mahsulot Qo‘shish</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#111827]/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Jami Mahsulot Turlari
            </span>
            <div className="text-2xl font-black text-white mt-1">{products.length}</div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Faol tovarlar soni</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 text-lime-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827]/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Ombor Qiymati
            </span>
            <div className="text-2xl font-black text-lime-400 mt-1">
              {formatUZS(totalStockValue)}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Jami tovarlar bahosi</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-lime-500/10 border border-lime-500/20 text-lime-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827]/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Kam Qolgan Tovar
            </span>
            <div className="text-2xl font-black text-amber-400 mt-1">{lowStockCount}</div>
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
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
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
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800 shrink-0">
                      <AdminProductThumbnail
                        src={product.imageUrl}
                        alt={product.name}
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
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
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
                      onClick={() => handleOpenEdit(product)}
                      title="Tahrirlash"
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setProductToDelete(product)}
                      title="O‘chirish"
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950 hover:text-rose-400 text-zinc-400 transition-colors cursor-pointer"
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

      {/* ========================================================= */}
      {/* ADD PRODUCT MODAL */}
      {/* ========================================================= */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          stopCamera();
          setIsAddModalOpen(false);
        }}
        title="Yangi Mahsulot Qo‘shish"
        description="Fitnes bar yoki resepshn uchun yangi tovar kartasini yarating. Rasm qurilmadan yuklanishi, kameradan olinishi yoki havoladan kiritilishi mumkin."
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
              onChange={(e) => {
                const newCat = e.target.value as ProductCategory;
                setFormCategory(newCat);
                // If no image is provided yet, auto-suggest default category image
                if (!formImageUrl) {
                  setFormImageUrl(CATEGORY_DEFAULT_IMAGES[newCat]);
                }
              }}
            />

            <Input
              label="Narxi (UZS)"
              type="number"
              value={formPrice}
              onChange={(e) => setFormPrice(parseNumericInput(e.target.value))}
              min={0}
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
              onChange={(e) => setFormStock(parseNumericInput(e.target.value))}
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

          {/* PRODUCT IMAGE SECTION WITH UPLOAD, CAMERA, PRESETS & URL */}
          <div className="space-y-3 pt-2 pb-1 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-lime-400" />
                <span>Mahsulot Rasmi</span>
              </label>
              {formImageUrl && (
                <button
                  type="button"
                  onClick={() => setFormImageUrl('')}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Rasmni tozalash</span>
                </button>
              )}
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Action buttons: Upload from device / Camera / Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="bg-zinc-900 border-zinc-700 hover:border-lime-500/50 text-xs py-1.5 h-auto text-zinc-200"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5 text-lime-400" />
                <span>Qurilmadan yuklash</span>
              </Button>

              {!isCameraActive ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={startCamera}
                  className="bg-zinc-900 border-zinc-700 hover:border-lime-500/50 text-xs py-1.5 h-auto text-zinc-200"
                >
                  <Camera className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                  <span>Kameradan suratga olish</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={stopCamera}
                  className="bg-rose-950/40 border-rose-800 text-rose-300 text-xs py-1.5 h-auto"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  <span>Kamerani yopish</span>
                </Button>
              )}
            </div>

            {/* Camera error message */}
            {cameraError && (
              <div className="text-xs text-rose-400 bg-rose-950/50 p-2.5 rounded-xl border border-rose-900/60 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Live Camera View */}
            {isCameraActive && (
              <div className="relative rounded-xl overflow-hidden border-2 border-lime-500/50 bg-black aspect-video max-w-sm mx-auto shadow-lg">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3 px-4">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={capturePhoto}
                    className="shadow-lg shadow-lime-500/30 text-xs"
                  >
                    <Camera className="w-3.5 h-3.5 mr-1.5" />
                    <span>Suratga olish</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={stopCamera}
                    className="bg-black/60 backdrop-blur-md text-white text-xs border-zinc-700"
                  >
                    Bekor qilish
                  </Button>
                </div>
              </div>
            )}

            {/* Image Preview & URL input */}
            <div className="flex items-center gap-3">
              {formImageUrl ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-lime-500/50 bg-zinc-900 shrink-0 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formImageUrl}
                    alt="Tanlangan rasm"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 right-1 bg-lime-500 text-zinc-950 rounded-full p-0.5 shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 flex flex-col items-center justify-center text-zinc-600 shrink-0">
                  <ImageIcon className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px]">Rasm yo‘q</span>
                </div>
              )}

              <div className="flex-1">
                <Input
                  placeholder="https://images.unsplash.com/... yoki rasm havolasi"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="text-xs bg-[#090d16]"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Qurilmadan yuklang, kameradan oling yoki internet havolasini kiriting.
                </p>
              </div>
            </div>

            {/* Quick preset chips */}
            <div>
              <span className="text-[11px] font-medium text-zinc-400 block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-lime-400" />
                <span>Tezkor namunaviy rasmlar (1 marta bosishda tanlanadi):</span>
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFormImageUrl(preset.url);
                      setFormCategory(preset.category);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      formImageUrl === preset.url
                        ? 'bg-lime-500/20 border-lime-500 text-lime-300 font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

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
              onClick={() => {
                stopCamera();
                setIsAddModalOpen(false);
              }}
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

      {/* ========================================================= */}
      {/* EDIT PRODUCT MODAL */}
      {/* ========================================================= */}
      {editingProduct && (
        <Modal
          isOpen={!!editingProduct}
          onClose={() => {
            stopEditCamera();
            setEditingProduct(null);
          }}
          title="Mahsulotni Tahrirlash"
          description="Mahsulot narxi, qoldig‘i, nomi va rasmini yangilang."
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
                value={editPrice}
                onChange={(e) => setEditPrice(parseNumericInput(e.target.value))}
                min={0}
                required
                helperText={`So'mda: ${formatUZS(editPrice)}`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ombordagi Miqdor"
                type="number"
                value={editStock}
                onChange={(e) => setEditStock(parseNumericInput(e.target.value))}
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

            {/* EDIT MODAL PRODUCT IMAGE SECTION */}
            <div className="space-y-3 pt-2 pb-1 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-lime-400" />
                  <span>Mahsulot Rasmini O‘zgartirish</span>
                </label>
                {editingProduct.imageUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProduct({ ...editingProduct, imageUrl: '' })
                    }
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Rasmni tozalash</span>
                  </button>
                )}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={editFileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleEditFileChange}
              />

              {/* Buttons: Upload / Camera */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editFileInputRef.current?.click()}
                  className="bg-zinc-900 border-zinc-700 hover:border-lime-500/50 text-xs py-1.5 h-auto text-zinc-200"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5 text-lime-400" />
                  <span>Qurilmadan yangi rasm yuklash</span>
                </Button>

                {!isEditCameraActive ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={startEditCamera}
                    className="bg-zinc-900 border-zinc-700 hover:border-lime-500/50 text-xs py-1.5 h-auto text-zinc-200"
                  >
                    <Camera className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                    <span>Kameradan suratga olish</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={stopEditCamera}
                    className="bg-rose-950/40 border-rose-800 text-rose-300 text-xs py-1.5 h-auto"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    <span>Kamerani yopish</span>
                  </Button>
                )}
              </div>

              {editCameraError && (
                <div className="text-xs text-rose-400 bg-rose-950/50 p-2.5 rounded-xl border border-rose-900/60 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editCameraError}</span>
                </div>
              )}

              {/* Live Camera View for Edit */}
              {isEditCameraActive && (
                <div className="relative rounded-xl overflow-hidden border-2 border-lime-500/50 bg-black aspect-video max-w-sm mx-auto shadow-lg">
                  <video
                    ref={editVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3 px-4">
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={captureEditPhoto}
                      className="shadow-lg shadow-lime-500/30 text-xs"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1.5" />
                      <span>Suratga olish</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={stopEditCamera}
                      className="bg-black/60 backdrop-blur-md text-white text-xs border-zinc-700"
                    >
                      Bekor qilish
                    </Button>
                  </div>
                </div>
              )}

              {/* Preview & URL Input */}
              <div className="flex items-center gap-3">
                {editingProduct.imageUrl ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-lime-500/50 bg-zinc-900 shrink-0 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editingProduct.imageUrl}
                      alt="Mahsulot rasmi"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 bg-lime-500 text-zinc-950 rounded-full p-0.5 shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 flex flex-col items-center justify-center text-zinc-600 shrink-0">
                    <ImageIcon className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px]">Rasm yo‘q</span>
                  </div>
                )}

                <div className="flex-1">
                  <Input
                    label="Rasm Havolasi (URL)"
                    value={editingProduct.imageUrl}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        imageUrl: e.target.value,
                      })
                    }
                    className="text-xs bg-[#090d16]"
                  />
                </div>
              </div>

              {/* Presets in Edit Modal */}
              <div>
                <span className="text-[11px] font-medium text-zinc-400 block mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-lime-400" />
                  <span>Namunaviy rasmga almashtirish:</span>
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setEditingProduct({
                          ...editingProduct,
                          imageUrl: preset.url,
                          category: preset.category,
                        })
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                        editingProduct.imageUrl === preset.url
                          ? 'bg-lime-500/20 border-lime-500 text-lime-300 font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

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
                onClick={() => {
                  stopEditCamera();
                  setEditingProduct(null);
                }}
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

      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <ConfirmDeleteModal
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={() => {
            if (productToDelete) {
              deleteProduct(productToDelete.id);
              setProductToDelete(null);
            }
          }}
          title="Mahsulotni O‘chirish"
          description="Haqiqatan ham ushbu mahsulotni ombordan o‘chirishni xohlaysizmi?"
          itemType="Mahsulot"
          itemName={productToDelete.name}
          itemDetails={
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={productToDelete.imageUrl}
                  alt={productToDelete.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="font-semibold text-white">
                  Kategoriya: <span className="text-lime-400">{categoryLabels[productToDelete.category]}</span>
                </p>
                <p className="text-zinc-400">
                  Narxi: <strong className="text-white">{formatUZS(productToDelete.price)}</strong> • Qoldiq: {productToDelete.stockQuantity} {productToDelete.unit || 'dona'}
                </p>
              </div>
            </div>
          }
          warningText="Ushbu mahsulot o‘chirilgach, u ommaviy landing sahifasidagi 'Fitnes Bar' vitrinasidan ham olib tashlanadi."
          confirmText="Ha, mahsulotni o‘chirish"
        />
      )}

      {/* Reset Default Products Confirmation Modal */}
      {isResetConfirmOpen && (
        <ConfirmDeleteModal
          isOpen={isResetConfirmOpen}
          onClose={() => setIsResetConfirmOpen(false)}
          onConfirm={() => {
            resetProducts();
            setIsResetConfirmOpen(false);
          }}
          title="Standart Mahsulotlarni Qaytarish"
          description="Barcha standart mahsulotlar va rasmlarni dastlabki holatiga qaytarmoqchimisiz?"
          itemType="Zavod Sozlamalari"
          itemName="Standart Mahsulotlar & Yangi Rasmlar"
          warningText="Bu amal barcha mahsulotlar ro‘yxatini asl namunalarga qaytaradi va buzilgan rasmlarni yangilaydi."
          confirmText="Ha, yangilansin"
          variant="warning"
        />
      )}
    </div>
  );
}