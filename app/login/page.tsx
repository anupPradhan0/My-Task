import { LoginForm } from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith('/') ? params.next : '/';
  const bad = params.error === '1';
  const needsConfig = params.error === 'config';

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#e8eef8] px-4">
      <LoginForm next={next} bad={bad} needsConfig={needsConfig} />
    </div>
  );
}
