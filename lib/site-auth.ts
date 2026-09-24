export const AUTH_COOKIE = 'ft_session';

export async function hashPassword(password: string) {
  const data = new TextEncoder().encode(`focustrack:${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time string compare (Edge-safe). */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let ok = 0;
  for (let i = 0; i < a.length; i++) {
    ok |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return ok === 0;
}

export async function sessionMatches(cookieValue: string | undefined, sitePassword: string) {
  if (!cookieValue || !sitePassword) return false;
  const expected = await hashPassword(sitePassword);
  return safeEqual(expected, cookieValue);
}

/** Only same-origin relative paths — blocks //evil.com open redirects. */
export function safeNextPath(raw: string | null | undefined, fallback = '/') {
  if (!raw) return fallback;
  if (!raw.startsWith('/')) return fallback;
  if (raw.startsWith('//') || raw.includes('\\') || raw.includes('://')) return fallback;
  return raw;
}
