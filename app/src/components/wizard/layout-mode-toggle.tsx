'use client';

import { useAppStore } from '@/lib/state/stores/app-store';
import type { LayoutMode } from '@/lib/state/stores/app-store';

const MODES: Array<{ key: LayoutMode; label: string }> = [
  { key: 'wizard', label: 'Wizard' },
  { key: 'form', label: 'Form' },
  { key: 'pdf', label: 'PDF' },
];

/**
 * 3-way toggle: Wizard | Form | PDF layout modes.
 * Pill group with the active mode highlighted.
 */
export function LayoutModeToggle() {
  const layoutMode = useAppStore((s) => s.layoutMode);
  const setLayoutMode = useAppStore((s) => s.setLayoutMode);

  return (
    <div
      className="inline-flex rounded-md border border-gray-300 bg-white shadow-sm"
      role="radiogroup"
      aria-label="Layout mode"
    >
      {MODES.map(({ key, label }) => {
        const isActive = layoutMode === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setLayoutMode(key)}
            className={`
              px-3 py-1.5 text-xs font-medium transition-colors
              first:rounded-l-md last:rounded-r-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              ${isActive
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
