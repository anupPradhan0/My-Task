import { loginAction } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith('/') ? params.next : '/';
  const bad = params.error === '1';

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#e8eef8] px-4">
      <form
        action={loginAction}
        className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-slate-900">FocusTrack</h1>
        <p className="mt-1 text-sm text-slate-500">Enter the site password to continue.</p>
        {bad ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Wrong password.</p>
        ) : null}
        <input type="hidden" name="next" value={next} />
        <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
