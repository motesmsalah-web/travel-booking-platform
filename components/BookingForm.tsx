'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import { Calendar, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

type TripType = 'GROUP_TRANSPORT' | 'PRIVATE_VEHICLE';

type Item = {
  id: string;
  name: string;
};

type Data = {
  settings: {
    whatsappNumber: string;
  };
  departures: Item[];
  destinations: Item[];
  companies: Item[];
  vehicles: Item[];
};

export default function BookingForm({ data }: { data: Data }) {
  const [form, setForm] = useState({
    name: '',
    code: '+967',
    phone: '',
    departureCityId: '',
    destinationCityId: '',
    date: '',
    tripType: 'GROUP_TRANSPORT' as TripType,
    transportCompanyId: '',
    vehicleTypeId: '',
    passengers: '1',
  });

  const [price, setPrice] = useState<number | null>(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(key: keyof typeof form, value: string) {
    const next = { ...form, [key]: value };

    if (key === 'tripType') {
      next.transportCompanyId = '';
      next.vehicleTypeId = '';
    }

    setForm(next);
    setPrice(null);
    setMsg('');
  }

  async function fetchPrice() {
    setLoading(true);
    setMsg('');
    setPrice(null);

    const body = {
      tripType: form.tripType,
      departureCityId: form.departureCityId,
      destinationCityId: form.destinationCityId,
      transportCompanyId: form.transportCompanyId || null,
      vehicleTypeId: form.vehicleTypeId || null,
    };

    const response = await fetch('/api/public/price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    setLoading(false);

    if (result.pricePerPassenger) {
      setPrice(result.pricePerPassenger);
    } else {
      setMsg(
        result.message ||
          'عذرًا، لا يوجد سعر متاح لهذا المسار حاليًا، يرجى اختيار خيار آخر أو التواصل معنا.'
      );
    }
  }

  const total = useMemo(() => {
    return price ? price * Number(form.passengers) : 0;
  }, [price, form.passengers]);

  const canFetchPrice = Boolean(
    form.departureCityId &&
      form.destinationCityId &&
      ((form.tripType === 'GROUP_TRANSPORT' && form.transportCompanyId) ||
        (form.tripType === 'PRIVATE_VEHICLE' && form.vehicleTypeId))
  );

  function submit() {
    if (
      !form.name ||
      !form.phone ||
      !form.departureCityId ||
      !form.destinationCityId ||
      !form.date ||
      !form.tripType
    ) {
      setMsg('يرجى تعبئة كل الحقول المطلوبة');
      return;
    }

    if (form.tripType === 'GROUP_TRANSPORT' && !form.transportCompanyId) {
      setMsg('يرجى اختيار شركة النقل');
      return;
    }

    if (form.tripType === 'PRIVATE_VEHICLE' && !form.vehicleTypeId) {
      setMsg('يرجى اختيار نوع السيارة');
      return;
    }

    if (!price) {
      setMsg('لا يوجد سعر متاح لهذا المسار');
      return;
    }

    const dep = data.departures.find((x) => x.id === form.departureCityId)?.name;
    const des = data.destinations.find((x) => x.id === form.destinationCityId)?.name;
    const comp = data.companies.find((x) => x.id === form.transportCompanyId)?.name;
    const veh = data.vehicles.find((x) => x.id === form.vehicleTypeId)?.name;

    const text =
      form.tripType === 'GROUP_TRANSPORT'
        ? `مرحبًا، أريد حجز رحلة عبر مكتبكم.

بيانات الحجز:
الاسم: ${form.name}
رقم الجوال: ${form.code}${form.phone}

من: ${dep}
إلى: ${des}
تاريخ الرحلة: ${form.date}

نوع الرحلة: نقل جماعي
شركة النقل: ${comp}

عدد الركاب: ${form.passengers}
سعر الراكب الواحد: ${price}
السعر الإجمالي: ${total}

يرجى تأكيد توفر الحجز.`
        : `مرحبًا، أريد حجز رحلة بسيارة خاصة عبر مكتبكم.

بيانات الحجز:
الاسم: ${form.name}
رقم الجوال: ${form.code}${form.phone}

من: ${dep}
إلى: ${des}
تاريخ الرحلة: ${form.date}

نوع الرحلة: سيارة خاصة
نوع السيارة: ${veh}

عدد الركاب: ${form.passengers}
سعر الراكب الواحد: ${price}
السعر الإجمالي: ${total}

يرجى تأكيد توفر الحجز.`;

    window.open(
      `https://wa.me/${data.settings.whatsappNumber}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  }

  return (
    <section id="booking" className="card p-5 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <Calendar className="text-gold" />
        <div>
          <h2 className="text-2xl font-black text-navy">نموذج الحجز</h2>
          <p className="text-slate-500">اختر بيانات الرحلة وسيظهر السعر تلقائيًا.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Field label="الاسم">
          <input
            className="input"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="اكتب اسمك"
          />
        </Field>

        <Field label="مفتاح الدولة">
          <select
            aria-label="مفتاح الدولة"
            className="input"
            value={form.code}
            onChange={(e) => updateField('code', e.target.value)}
          >
            <option value="+967">🇾🇪 +967</option>
            <option value="+966">🇸🇦 +966</option>
          </select>
        </Field>

        <Field label="رقم الجوال">
          <input
            className="input"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="700000000"
          />
        </Field>

        <Field label="من">
          <select
            aria-label="مدينة الانطلاق"
            className="input"
            value={form.departureCityId}
            onChange={(e) => updateField('departureCityId', e.target.value)}
          >
            <option value="">اختر مدينة الانطلاق</option>
            {data.departures.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="إلى">
          <select
            aria-label="وجهة الوصول"
            className="input"
            value={form.destinationCityId}
            onChange={(e) => updateField('destinationCityId', e.target.value)}
          >
            <option value="">اختر وجهة الوصول</option>
            {data.destinations.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="تاريخ الرحلة">
          <input
           aria-label="تاريخ الرحلة"
            className="input"
            type="date"
            value={form.date}
            onChange={(e) => updateField('date', e.target.value)}
          />
        </Field>

        <Field label="نوع الرحلة">
          <select
            aria-label="نوع الرحلة"
            className="input"
            value={form.tripType}
            onChange={(e) => updateField('tripType', e.target.value as TripType)}
          >
            <option value="GROUP_TRANSPORT">نقل جماعي</option>
            <option value="PRIVATE_VEHICLE">سيارة خاصة</option>
          </select>
        </Field>

        {form.tripType === 'GROUP_TRANSPORT' ? (
          <Field label="شركة النقل">
            <select
              aria-label="شركة النقل"
              className="input"
              value={form.transportCompanyId}
              onChange={(e) => updateField('transportCompanyId', e.target.value)}
            >
              <option value="">اختر الشركة</option>
              {data.companies.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <Field label="نوع السيارة">
            <select
              aria-label="نوع السيارة"
              className="input"
              value={form.vehicleTypeId}
              onChange={(e) => updateField('vehicleTypeId', e.target.value)}
            >
              <option value="">اختر نوع السيارة</option>
              {data.vehicles.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="عدد الركاب">
          <select
            aria-label="عدد الركاب"
            className="input"
            value={form.passengers}
            onChange={(e) => updateField('passengers', e.target.value)}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                {i + 1}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-3xl bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-slate-500">سعر الراكب الواحد</p>
          <b className="text-xl text-navy">
            {loading ? 'جاري البحث...' : formatPrice(price)}
          </b>
        </div>

        <div>
          <p className="text-slate-500">السعر الإجمالي</p>
          <b className="text-2xl text-gold">{formatPrice(total)}</b>
        </div>

        <button
          type="button"
          onClick={fetchPrice}
          disabled={!canFetchPrice || loading}
          className="btn-light"
        >
          تحديث السعر
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={!price}
          className="btn-primary"
        >
          <MessageCircle />
          احجز الآن
        </button>
      </div>

      {msg && (
        <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-amber-800">{msg}</p>
      )}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
