'use client';
import { useState } from 'react';

type SettingsFormProps = { initial: any };

export default function SettingsForm({ initial }: SettingsFormProps) {
  const [f, setF] = useState(initial);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initial?.logoUrl ?? null);
  const [credentials, setCredentials] = useState({ username: '', newPassword: '', currentPassword: '' });
  const [msg, setMsg] = useState('');
  const [credentialMsg, setCredentialMsg] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingCredentials, setSavingCredentials] = useState(false);

  function onLogoChange(file?: File) {
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp'];
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

    if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(extension)) {
      setMsg('صيغة الشعار غير مدعومة. المسموح فقط: PNG / JPG / JPEG / WEBP');
      setLogoFile(null);
      setLogoPreview(initial?.logoUrl ?? null);
      return;
    }

    setMsg('');
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function uploadLogoIfNeeded() {
    if (!logoFile) return f.logoUrl ?? null;
    const formData = new FormData();
    formData.append('logo', logoFile);

    const res = await fetch('/api/admin/settings/logo', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'تعذر رفع الشعار');
    return data.logoUrl as string;
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setSavingSettings(true);
    try {
      const logoUrl = await uploadLogoIfNeeded();
      const payload = { ...f, logoUrl };
      const r = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || 'حدث خطأ');
      setF(data);
      setLogoFile(null);
      setLogoPreview(data.logoUrl ?? null);
      setMsg('تم حفظ الإعدادات والشعار داخل قاعدة البيانات بنجاح');
    } catch (error) {
      setMsg(error instanceof Error ? error.message : 'حدث خطأ');
    } finally {
      setSavingSettings(false);
    }
  }

  async function saveCredentials(e: React.FormEvent) {
    e.preventDefault();
    setCredentialMsg('');
    setSavingCredentials(true);
    try {
      const r = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || 'تعذر تحديث بيانات الدخول');
      window.location.href = '/admin/login';
    } catch (error) {
      setCredentialMsg(error instanceof Error ? error.message : 'حدث خطأ');
    } finally {
      setSavingCredentials(false);
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={saveSettings} className="card grid gap-4 p-6 md:grid-cols-2">
        <h1 className="md:col-span-2 text-3xl font-black text-navy">إعدادات الموقع</h1>

        <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <span className="label">الشعار</span>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-3xl bg-navy text-white">
              {logoPreview ? <img src={logoPreview} alt="الشعار" className="h-full w-full object-contain p-2" /> : <span className="text-xs">بدون شعار</span>}
            </div>
            <div className="flex-1">
              <input className="input" type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" onChange={(e) => onLogoChange(e.target.files?.[0])} />
              <p className="mt-2 text-xs leading-6 text-slate-500">سيتم حفظ صورة الشعار نفسها داخل قاعدة البيانات كـ Base64، وليس داخل public/uploads. الصيغ المسموحة فقط: PNG / JPG / JPEG / WEBP. ويظهر الشعار بدل أيقونة الطائرة مع تصغير تلقائي داخل مربع الشعار بدون تشويه.</p>
            </div>
          </div>
        </div>

        {[
          ['officeName', 'اسم المكتب'],
          ['siteTitle', 'عنوان الموقع'],
          ['whatsappNumber', 'رقم واتساب الحجز'],
          ['primaryColor', 'اللون الأساسي'],
          ['secondaryColor', 'اللون الثانوي'],
        ].map(([k, l]) => (
          <label key={k}>
            <span className="label">{l}</span>
            <input className="input" value={f[k] || ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
          </label>
        ))}

        <label className="md:col-span-2">
          <span className="label">النص الترحيبي</span>
          <textarea className="input min-h-28" value={f.welcomeText || ''} onChange={(e) => setF({ ...f, welcomeText: e.target.value })} />
        </label>

        <label className="md:col-span-2">
          <span className="label">نص الفوتر</span>
          <input className="input" value={f.footerText || ''} onChange={(e) => setF({ ...f, footerText: e.target.value })} />
        </label>

        <button className="btn-primary w-fit" disabled={savingSettings}>{savingSettings ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</button>
        {msg && <p className={msg.includes('بنجاح') ? 'font-bold text-green-700' : 'font-bold text-red-600'}>{msg}</p>}
      </form>

      <form onSubmit={saveCredentials} className="card grid gap-4 p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 text-2xl font-black text-navy">تغيير بيانات دخول الأدمن</h2>
        <label>
          <span className="label">اسم المستخدم الجديد</span>
          <input className="input" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} autoComplete="username" />
        </label>
        <label>
          <span className="label">كلمة المرور الجديدة</span>
          <input className="input" type="password" value={credentials.newPassword} onChange={(e) => setCredentials({ ...credentials, newPassword: e.target.value })} autoComplete="new-password" />
        </label>
        <label className="md:col-span-2">
          <span className="label">كلمة المرور الحالية للتأكيد</span>
          <input className="input" type="password" value={credentials.currentPassword} onChange={(e) => setCredentials({ ...credentials, currentPassword: e.target.value })} autoComplete="current-password" />
        </label>
        <button className="btn-primary w-fit" disabled={savingCredentials}>{savingCredentials ? 'جاري التحديث...' : 'حفظ بيانات الدخول'}</button>
        {credentialMsg && <p className="font-bold text-red-600">{credentialMsg}</p>}
      </form>
    </div>
  );
}
