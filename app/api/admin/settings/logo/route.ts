import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp']);

function toBase64DataUrl(fileType: string, buffer: Buffer) {
  return `data:${fileType};base64,${buffer.toString('base64')}`;
}

export async function POST(req: Request) {
  await requireAdmin();

  try {
    const form = await req.formData();
    const file = form.get('logo');

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'يرجى اختيار صورة الشعار' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: 'حجم الشعار يجب ألا يتجاوز 2MB لأن الصورة ستُحفظ داخل قاعدة البيانات' }, { status: 400 });
    }

    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

    if (!ALLOWED_TYPES.has(file.type) || !ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json({ message: 'صيغة الشعار يجب أن تكون PNG أو JPG أو JPEG أو WEBP فقط' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const logoUrl = toBase64DataUrl(file.type, buffer);

    const settings = await prisma.siteSetting.findFirst();

    if (settings) {
      await prisma.siteSetting.update({
        where: { id: settings.id },
        data: { logoUrl },
      });
    } else {
      await prisma.siteSetting.create({
        data: {
          officeName: 'مكتب السفريات',
          siteTitle: 'منصة حجز سفريات وسياحة',
          welcomeText: 'احجز رحلتك بسهولة عبر واتساب، واختر خط السير ونوع الرحلة وعدد الركاب ليظهر السعر تلقائيًا.',
          whatsappNumber: '967700000000',
          logoUrl,
          primaryColor: '#0B1F3A',
          secondaryColor: '#C8A24A',
          footerText: 'جميع الحقوق محفوظة لمكتب السفريات',
        },
      });
    }

    return NextResponse.json({ logoUrl });
  } catch {
    return NextResponse.json({ message: 'تعذر حفظ الشعار داخل قاعدة البيانات' }, { status: 400 });
  }
}
