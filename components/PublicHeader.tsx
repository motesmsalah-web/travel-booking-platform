import { Plane, Phone } from 'lucide-react';

export default function PublicHeader({ officeName, logoUrl }: { officeName: string; logoUrl?: string | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center bg-transparent">
            {logoUrl ? (
              <img src={logoUrl} alt={officeName} className="h-full w-full object-contain" />
            ) : (
              <Plane />
            )}
          </div>
          <div>
            <h1 className="font-black text-navy">{officeName}</h1>
            <p className="text-xs text-slate-500">حجز سفريات وسياحة</p>
          </div>
        </div>
        <a href="#booking" className="btn-gold"><Phone size={18}/> احجز الآن</a>
      </div>
    </header>
  );
}
