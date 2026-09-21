'use client';

import { useEffect } from 'react';
import { prefetchFormOptions } from '@/components/formOptions';

/** Warm create/edit task dropdowns as soon as the app loads. */
export function PrefetchFormOptions() {
  useEffect(() => {
    prefetchFormOptions();
  }, []);
  return null;
}
