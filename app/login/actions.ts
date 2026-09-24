'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE, hashPassword, safeEqual, safeNextPath } from '@/lib/site-auth';

export async function loginAction(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  const next = safeNextPath(String(formData.get('next') ?? '/'));
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=1`);
  }

  const [got, expected] = await Promise.all([
    hashPassword(password),
    hashPassword(sitePassword),
  ]);
  if (!safeEqual(got, expected)) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=1`);
  }

  const jar = await cookies();
  jar.set(AUTH_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(next);
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE);
  redirect('/login');
}
