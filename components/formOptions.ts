import { getTaskFormOptions } from '@/app/actions';

// ponytail: module cache — reopen modal skips the DB round-trip
let cache: ReturnType<typeof getTaskFormOptions> | null = null;

export function loadFormOptions() {
  if (!cache) cache = getTaskFormOptions();
  return cache;
}
