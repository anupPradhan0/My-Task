'use client';

import { useFormStatus } from 'react-dom';
import { loginAction } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-wait disabled:opacity-80"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Checking…
        </>
      ) : (
        'Unlock'
      )}
    </button>
  );
}

function PendingOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#e8eef8]/90 backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-8 py-7 shadow-lg">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-slate-900" />
        <p className="text-sm font-medium text-slate-800">Signing you in…</p>
        <p className="text-xs text-slate-500">Hang on a second</p>
      </div>
    </div>
  );
}

export function LoginForm({
  next,
  bad,
  needsConfig,
}: {
  next: string;
  bad: boolean;
  needsConfig: boolean;
}) {
  return (
    <form action={loginAction} className="relative w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <PendingOverlay />
      <h1 className="text-xl font-semibold text-slate-900">FocusTrack</h1>
      <p className="mt-1 text-sm text-slate-500">Enter the site password to continue.</p>
      {needsConfig ? (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Set <code className="font-mono">SITE_PASSWORD</code> in Vercel environment variables, then redeploy.
        </p>
      ) : null}
      {bad ? (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Wrong password.</p>
      ) : null}
      <input type="hidden" name="next" value={next} />
      <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="password">
        Password
      </label>
      <PasswordField />
      <SubmitButton />
    </form>
  );
}

function PasswordField() {
  const { pending } = useFormStatus();
  return (
    <input
      id="password"
      name="password"
      type="password"
      required
      autoFocus
      disabled={pending}
      autoComplete="current-password"
      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 disabled:bg-slate-50 disabled:opacity-70"
    />
  );
}
