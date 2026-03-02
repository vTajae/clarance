'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/state/stores/app-store';
import {
  ALL_SECTION_GROUPS,
  SECTION_GROUPS,
  SECTION_META,
  type SF86Section,
  type SF86SectionGroup,
} from '@/lib/field-registry/types';

/** Human-readable titles for section groups. */
const GROUP_LABELS: Record<SF86SectionGroup, string> = {
  identification: 'Identification',
  citizenship: 'Citizenship',
  history: 'History',
  military: 'Military',
  relationships: 'Relationships',
  foreign: 'Foreign Activities',
  financial: 'Financial',
  substance: 'Substance Use',
  legal: 'Legal',
  psychological: 'Psychological',
  review: 'Review & Sign',
};

interface SectionSidebarProps {
  submissionId: string;
  /** Optional completion percentages (0-1) keyed by section group. */
  groupCompletions?: Partial<Record<SF86SectionGroup, number>>;
}

export function SectionSidebar({
  submissionId,
  groupCompletions = {},
}: SectionSidebarProps) {
  const currentSection = useAppStore((s) => s.currentSection);
  const currentGroup = useAppStore((s) => s.currentSectionGroup);

  // Track which groups are expanded (default: current group).
  const [expanded, setExpanded] = useState<Set<SF86SectionGroup>>(
    new Set([currentGroup]),
  );

  const toggleGroup = useCallback((group: SF86SectionGroup) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  }, []);

  return (
    <nav className="py-4" aria-label="Form sections">
      <ul className="space-y-1">
        {ALL_SECTION_GROUPS.map((group) => {
          const sections = SECTION_GROUPS[group];
          const isExpanded = expanded.has(group);
          const isActiveGroup = group === currentGroup;
          const completion = groupCompletions[group] ?? 0;
          const pct = Math.round(completion * 100);

          return (
            <li key={group}>
              {/* Group header */}
              <button
                type="button"
                onClick={() => toggleGroup(group)}
                aria-expanded={isExpanded}
                className={`
                  flex w-full items-center justify-between px-4 py-2.5 text-left text-sm
                  transition-colors
                  ${
                    isActiveGroup
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50 font-medium'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {/* Expand/collapse chevron */}
                  <svg
                    className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {GROUP_LABELS[group]}
                </span>

                {/* Completion badge */}
                <span
                  className={`
                    inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                    ${
                      pct === 100
                        ? 'bg-green-100 text-green-700'
                        : pct > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-500'
                    }
                  `}
                >
                  {pct}%
                </span>
              </button>

              {/* Child sections */}
              {isExpanded && (
                <ul className="ml-6 border-l border-gray-200">
                  {sections.map((sectionKey: SF86Section) => {
                    const meta = SECTION_META[sectionKey]!;
                    const isActive = sectionKey === currentSection;

                    return (
                      <li key={sectionKey}>
                        <Link
                          href={`/${submissionId}/${group}/${sectionKey}`}
                          aria-current={isActive ? 'step' : undefined}
                          className={`
                            block w-full pl-4 pr-4 py-2 text-left text-sm transition-colors
                            ${
                              isActive
                                ? 'bg-blue-100 text-blue-800 font-medium border-l-2 border-blue-600 -ml-px'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          {meta.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
