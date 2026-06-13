'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) router.push('/admin');
      else setMsg((await res.json()).message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-navy p-4">
      <form onSubmit={submit} className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-black text-navy">تسجيل دخول الأدمن</h1>
        <p className="mt-2 text-slate-500">ادخل بيانات لوحة التحكم.</p>

        <label className="mt-6 block">
          <span className="label">اسم المستخدم</span>
          <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </label>

        <label className="mt-4 block">
          <span className="label">كلمة المرور</span>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>

        {msg && <p className="mt-4 text-red-600">{msg}</p>}
        <button className="btn-primary mt-6 w-full" disabled={loading}>{loading ? 'جاري الدخول...' : 'دخول'}</button>
      </form>
    </main>
  );
}
