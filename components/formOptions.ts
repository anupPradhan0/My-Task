import { getTaskFormOptions } from '@/app/actions';

export type FormOptions = Awaited<ReturnType<typeof getTaskFormOptions>>;

// ponytail: module cache — reopen modal skips the DB round-trip
let inflight: Promise<FormOptions> | null = null;
let resolved: FormOptions | null = null;

export function peekFormOptions() {
  return resolved;
}

export function loadFormOptions() {
  if (resolved) return Promise.resolve(resolved);
  if (!inflight) {
    inflight = getTaskFormOptions()
      .then((data) => {
        resolved = data;
        return data;
      })
      .catch((err) => {
        inflight = null;
        throw err;
      });
  }
  return inflight;
}

/** Warm the cache before the user opens the modal. */
export function prefetchFormOptions() {
  void loadFormOptions();
}
