# منصة حجز سفريات وسياحة إلكترونية - نسخة PostgreSQL مصححة

نسخة عربية RTL لمكتب سفريات واحد، مع واجهة حجز عبر واتساب ولوحة تحكم كاملة. تم حذف خيار الشعار من إعدادات الموقع حسب الطلب.

## التشغيل المحلي باستخدام PostgreSQL عبر Docker

```bash
docker compose up -d
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

ثم افتح:

```text
http://localhost:3000
http://localhost:3000/admin/login
```

## بيانات دخول الأدمن

```text
admin@example.com
admin123456
```

غيّر كلمة المرور و `AUTH_SECRET` قبل النشر.

## ربط المشروع مع Supabase

الخطأ: `Can't reach database server` يعني أن التطبيق لا يستطيع الوصول إلى رابط قاعدة البيانات الموجود داخل `.env`. هذا ليس خطأ في صفحة الحجز نفسها؛ غالبًا السبب أن رابط Supabase غير صحيح، أو كلمة المرور غير صحيحة، أو المشروع في Supabase متوقف/Paused، أو أنك استخدمت رابط Pooler غير مناسب للمكان الصحيح.

افتح ملف `.env` وضع القيم بهذه الصورة:

```env
DATABASE_URL="ضع هنا رابط Supabase pooled connection الخاص بالتطبيق"
DIRECT_URL="ضع هنا رابط Supabase direct/session connection الخاص بالمهاجرات"
AUTH_SECRET="ضع مفتاحًا طويلًا وعشوائيًا"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

بعد تعديل `.env` نفّذ:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

ملاحظات مهمة عند استخدام Supabase:

1. لا تستخدم رابطًا قديمًا من مشروع آخر.
2. تأكد أن كلمة مرور قاعدة البيانات صحيحة، وإذا غيرتها في Supabase انسخ الرابط من جديد.
3. استخدم `DIRECT_URL` للمهاجرات وليس فقط `DATABASE_URL`.
4. إذا لم يعمل الرابط، جرّب تشغيل المشروع محليًا أولًا عبر Docker للتأكد أن الكود سليم.
5. لا تنشر ملف `.env` علنًا لأنه يحتوي بيانات اتصال قاعدة البيانات.

## هيكل المشروع المختصر

```text
app/
  page.tsx
  admin/
  api/
components/
  BookingForm.tsx
  PublicHeader.tsx
  Footer.tsx
  WhatsAppButton.tsx
  admin/
lib/
  db.ts
  auth.ts
  validators.ts
prisma/
  schema.prisma
  seed.ts
docker-compose.yml
```

## ملاحظات الإصلاح

- المشروع يستخدم PostgreSQL وليس SQLite.
- تم حذف حقل الشعار من واجهة إعدادات الموقع.
- تم تجهيز `.env` و `.env.example` بقيم PostgreSQL محلية وبحقل `DIRECT_URL` المطلوب من Prisma.
- تم منع محاولة توليد صفحات قاعدة البيانات كصفحات ثابتة أثناء البناء عبر `force-dynamic`.
