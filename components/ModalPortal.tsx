'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/** Renders children on document.body so overflow/transform ancestors can't clip fixed overlays. */
export function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
