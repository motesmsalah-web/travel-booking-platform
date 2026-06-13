import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { adminCredentialsSchema } from '@/lib/validators';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req: Request) {
  try {
    const session = await requireAdmin();
    const data = adminCredentialsSchema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { id: session.id } });

    if (!user || !(await bcrypt.compare(data.currentPassword, user.passwordHash))) {
      return NextResponse.json({ message: 'كلمة المرور الحالية غير صحيحة' }, { status: 401 });
    }

    const existing = await prisma.user.findFirst({
      where: { username: data.username.trim(), NOT: { id: user.id } },
    });

    if (existing) {
      return NextResponse.json({ message: 'اسم المستخدم مستخدم من قبل' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        username: data.username.trim(),
        passwordHash,
      },
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.delete('admin_session');
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر تحديث بيانات الدخول';
    return NextResponse.json({ message }, { status: 400 });
  }
}
