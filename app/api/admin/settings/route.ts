import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { settingSchema } from '@/lib/validators';

export async function PUT(req: Request) {
  await requireAdmin();
  try {
    const b = settingSchema.parse(await req.json());
    const old = await prisma.siteSetting.findFirst();
    const s = old
      ? await prisma.siteSetting.update({ where: { id: old.id }, data: b })
      : await prisma.siteSetting.create({ data: b });
    return NextResponse.json(s);
  } catch {
    return NextResponse.json({ message: 'يرجى التأكد من كل الحقول المطلوبة' }, { status: 400 });
  }
}
