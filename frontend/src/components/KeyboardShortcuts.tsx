'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcutsProps {
  searchInputId?: string;
  newEntityHref?: string;
}

export default function KeyboardShortcuts({
  searchInputId = 'buyer-search',
  newEntityHref = '/buyers/new',
}: KeyboardShortcutsProps) {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in inputs/textareas/selects or with modifier keys
      const target = e.target as HTMLElement;
      const tag = target?.tagName?.toLowerCase();
      const isEditable = target?.getAttribute?.('contenteditable') === 'true';
      const inField = tag === 'input' || tag === 'textarea' || tag === 'select' || isEditable;
      const hasMod = e.ctrlKey || e.metaKey || e.altKey;

      if (hasMod) return;

      // '/' focuses search
      if (e.key === '/') {
        if (!inField) {
          e.preventDefault();
          const el = document.getElementById(searchInputId) as HTMLInputElement | null;
          el?.focus();
        }
        return;
      }

      // 'n' opens new buyer
      if (e.key.toLowerCase() === 'n') {
        if (!inField) {
          e.preventDefault();
          router.push(newEntityHref);
        }
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router, searchInputId, newEntityHref]);

  return null;
}
