import { prisma } from "@/lib/db";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BookingForm from "@/components/BookingForm";
import { ShieldCheck, Clock, Headphones, MapPinned } from "lucide-react";

export const dynamic = "force-dynamic";
const defaultSettings = {
  officeName: "مكتب السفريات",
  siteTitle: "منصة حجز سفريات وسياحة",
  welcomeText:
    "احجز رحلتك بسهولة عبر واتساب، واختر خط السير ونوع الرحلة وعدد الركاب ليظهر السعر تلقائيًا.",
  whatsappNumber: "967700000000",
  logoUrl: null,
  primaryColor: "#0B1F3A",
  secondaryColor: "#C8A24A",
  footerText: "جميع الحقوق محفوظة لمكتب السفريات",
};

export default async function Home() {
  const settings = (await prisma.siteSetting.findFirst()) ?? defaultSettings;
  const [departures, destinations, companies, vehicles] = await Promise.all([
    prisma.departureCity.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.destinationCity.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.transportCompany.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.vehicleType.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);
  const data = { settings, departures, destinations, companies, vehicles };
  return (
    <>
      <PublicHeader
        officeName={settings.officeName}
        logoUrl={settings.logoUrl}
      />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-navy via-slate-900 to-slate-800 py-16 text-white">
          <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-gold">
                حجز سفريات وسياحة عبر واتساب
              </span>
              <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
                {settings.siteTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-9 text-slate-200">
                {settings.welcomeText}
              </p>
              <a href="#booking" className="btn-gold mt-8">
                ابدأ الحجز الآن
              </a>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["رحلات واضحة", MapPinned],
                  ["تأكيد عبر واتساب", Headphones],
                  ["أسعار تلقائية", Clock],
                  ["إدارة آمنة", ShieldCheck],
                ].map(([t, I]: any) => (
                  <div key={t} className="rounded-3xl bg-white p-5 text-navy">
                    <I className="mb-4 text-gold" />
                    <b>{t}</b>
                    <p className="mt-2 text-sm text-slate-500">
                      تجربة سهلة وسريعة تناسب الجوال والكمبيوتر.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="container-page -mt-10 relative z-10">
          <BookingForm data={data} />
        </section>
        <section className="container-page mt-16 grid gap-5 md:grid-cols-3">
          <Info
            title="طريقة الحجز"
            text="املأ البيانات، اختر الرحلة، ثم اضغط احجز الآن لفتح واتساب برسالة جاهزة."
          />
          <Info
            title="بدون دفع إلكتروني"
            text="التأكيد والتواصل يتمان مباشرة مع المكتب عبر واتساب فقط."
          />
          <Info
            title="مساعدة"
            text="في حال تريد استفسار عن شي ولم تجده في موقنا يمكنك التواصل معنا واتساب من خلال النقر على الايقونه الطرفيه"
          />
        </section>
      </main>
      <WhatsAppButton number={settings.whatsappNumber} />
      <Footer text={settings.footerText} />
    </>
  );
}
function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="card p-6">
      <h3 className="text-xl font-black text-navy">{title}</h3>
      <p className="mt-3 leading-8 text-slate-600">{text}</p>
    </div>
  );
}
