/**
 * Rasm hajmini mijoz brauzerida optimallashtirish va siqish yordamchisi.
 * Katta hajmdagi rasmlarni (5MB-15MB) 800px kenglikda ~150-250KB JPEG qilib siqadi.
 * Bu orqali tarmoq trafigi tejaladi, baza hajmi o'smaydi va 413 Payload Too Large xatosi oldi olinadi.
 */
export async function compressImageFile(file: File, maxWidth = 800, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Faqat rasm formatidagi fayllarni yuklash mumkin'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Faylni o‘qishda xatolik yuz berdi'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Rasm formatini aniqlab bo‘lmadi'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Agar rasm o'lchami maxWidth dan katta bo'lsa, mutanosib ravishda kichraytiramiz
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(typeof reader.result === 'string' ? reader.result : '');
        }

        // Tasvirni sifatli chizish
        ctx.drawImage(img, 0, 0, width, height);

        // JPEG formatida siqib olish
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };

    reader.readAsDataURL(file);
  });
}
