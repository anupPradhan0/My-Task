export const AUTH_COOKIE = 'ft_session';

export async function hashPassword(password: string) {
  const data = new TextEncoder().encode(`focustrack:${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sessionMatches(cookieValue: string | undefined, sitePassword: string) {
  if (!cookieValue || !sitePassword) return false;
  const expected = await hashPassword(sitePassword);
  if (expected.length !== cookieValue.length) return false;
  let ok = 0;
  for (let i = 0; i < expected.length; i++) {
    ok |= expected.charCodeAt(i) ^ cookieValue.charCodeAt(i);
  }
  return ok === 0;
}
