'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE, hashPassword } from '@/lib/site-auth';

export async function loginAction(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  const nextRaw = String(formData.get('next') ?? '/');
  const next = nextRaw.startsWith('/') ? nextRaw : '/';
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword || password !== sitePassword) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=1`);
  }

  const jar = await cookies();
  jar.set(AUTH_COOKIE, await hashPassword(sitePassword), {
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
