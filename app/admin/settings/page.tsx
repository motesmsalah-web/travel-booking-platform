import { prisma } from '@/lib/db';
import SettingsForm from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

const defaultSettings = {
  officeName: 'مكتب السفريات',
  siteTitle: 'منصة حجز سفريات وسياحة',
  welcomeText: 'احجز رحلتك بسهولة عبر واتساب، واختر خط السير ونوع الرحلة وعدد الركاب ليظهر السعر تلقائيًا.',
  whatsappNumber: '967700000000',
  primaryColor: '#0B1F3A',
  secondaryColor: '#C8A24A',
  logoUrl: null,
  footerText: 'جميع الحقوق محفوظة لمكتب السفريات',
};

export default async function Page() {
  const settings = await prisma.siteSetting.findFirst();
  return <SettingsForm initial={settings ?? defaultSettings} />;
}
