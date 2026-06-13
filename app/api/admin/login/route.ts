import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validators';
import { adminCookieOptions, createSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const data = loginSchema.parse(await req.json());
    const identifier = data.username.trim();
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
        ],
      },
    });

    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      return NextResponse.json({ message: 'بيانات الدخول غير صحيحة' }, { status: 401 });
    }

    const token = await createSession({ id: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_session', token, adminCookieOptions());
    return res;
  } catch {
    return NextResponse.json({ message: 'بيانات الدخول غير صحيحة' }, { status: 400 });
  }
}
