'use client';

import { useCallback, useEffect, useState } from 'react';
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

// ---------------------------------------------------------------------------
// Section grouping: cluster lettered subsections under their parent number
// ---------------------------------------------------------------------------

interface SectionNode {
  /** The section key (e.g. 'section13A') or null for a parent-only header. */
  key: SF86Section | null;
  /** Display label. */
  label: string;
  /** Child subsections, if any. */
  children: { key: SF86Section; label: string }[];
}

/**
 * Extracts the numeric root and optional letter suffix from a section key.
 * e.g. 'section13A' → { root: '13', suffix: 'A' }
 *      'section1'   → { root: '1', suffix: '' }
 */
function parseSectionKey(key: string): { root: string; suffix: string } {
  const m = key.match(/^section(\d+)([A-E]?)$/);
  if (!m) return { root: key, suffix: '' };
  return { root: m[1], suffix: m[2] || '' };
}

/** Parent labels for sections that have subsections. */
const PARENT_LABELS: Record<string, string> = {
  '13': 'Section 13 - Employment',
  '20': 'Section 20 - Foreign Activities',
};

/**
 * Groups sections within a group, nesting lettered subsections under parents.
 * - Sections 13A/B/C → grouped under "Section 13 - Employment"
 * - Sections 20A/B/C → grouped under "Section 20 - Foreign Activities"
 * - Section 21 + 21A-E → Section 21 is the parent, 21A-E are children
 */
function buildSectionTree(sections: SF86Section[]): SectionNode[] {
  const nodes: SectionNode[] = [];
  const grouped = new Map<string, SF86Section[]>();

  // First pass: identify which roots have multiple lettered subsections
  for (const sec of sections) {
    const { root, suffix } = parseSectionKey(sec);
    if (suffix) {
      if (!grouped.has(root)) grouped.set(root, []);
      grouped.get(root)!.push(sec);
    }
  }

  // Second pass: build the tree
  const consumed = new Set<SF86Section>();

  for (const sec of sections) {
    if (consumed.has(sec)) continue;

    const { root, suffix } = parseSectionKey(sec);

    // Check if this root has lettered subsections
    const subsections = grouped.get(root);

    if (subsections && subsections.length > 0) {
      // This root has subsections
      if (!suffix) {
        // This is the parent section itself (e.g. section21)
        // Its children are the lettered subsections
        const children = subsections.map((sub) => {
          consumed.add(sub);
          const meta = SECTION_META[sub]!;
          const { suffix: s } = parseSectionKey(sub);
          return {
            key: sub,
            label: meta.title.replace(/^Section \d+[A-E] - /, `${s} - `),
          };
        });

        const meta = SECTION_META[sec]!;
        nodes.push({
          key: sec,
          label: meta.title,
          children,
        });
        consumed.add(sec);
      } else if (!consumed.has(sec)) {
        // Lettered section without a standalone parent (e.g. 13A, 13B, 13C)
        // Create a virtual parent node
        const parentLabel = PARENT_LABELS[root] || `Section ${root}`;
        const children = subsections.map((sub) => {
          consumed.add(sub);
          const meta = SECTION_META[sub]!;
          const { suffix: s } = parseSectionKey(sub);
          return {
            key: sub,
            label: meta.title.replace(/^Section \d+[A-E] - /, `${s} - `),
          };
        });

        nodes.push({
          key: null, // virtual parent (no navigable section)
          label: parentLabel,
          children,
        });
      }
    } else {
      // Simple section, no subsections
      const meta = SECTION_META[sec]!;
      nodes.push({
        key: sec,
        label: meta.title,
        children: [],
      });
      consumed.add(sec);
    }
  }

  return nodes;
}

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

  // Auto-expand the active group when navigation changes.
  useEffect(() => {
    setExpanded((prev) => {
      if (prev.has(currentGroup)) return prev;
      const next = new Set(prev);
      next.add(currentGroup);
      return next;
    });
  }, [currentGroup]);

  // Track which parent sections with subsections are expanded.
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    new Set([parseSectionKey(currentSection).root]),
  );

  // Auto-expand the parent of the active subsection.
  useEffect(() => {
    const root = parseSectionKey(currentSection).root;
    setExpandedParents((prev) => {
      if (prev.has(root)) return prev;
      const next = new Set(prev);
      next.add(root);
      return next;
    });
  }, [currentSection]);

  const toggleGroup = useCallback((group: SF86SectionGroup) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }, []);

  const toggleParent = useCallback((root: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(root)) next.delete(root);
      else next.add(root);
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

          const tree = buildSectionTree(sections);

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

              {/* Sections within group */}
              {isExpanded && (
                <ul className="ml-6 border-l border-gray-200">
                  {tree.map((node) => {
                    const hasChildren = node.children.length > 0;
                    const { root } = node.key ? parseSectionKey(node.key) : { root: '' };
                    const parentRoot = hasChildren
                      ? (node.key ? parseSectionKey(node.key).root : node.label.match(/Section (\d+)/)?.[1] || '')
                      : '';
                    const isParentExpanded = expandedParents.has(parentRoot);

                    // Is this node or any of its children the active section?
                    const isActive = node.key === currentSection;
                    const hasActiveChild = node.children.some((c) => c.key === currentSection);

                    if (!hasChildren) {
                      // Simple section — just a link
                      return (
                        <li key={node.key}>
                          <Link
                            href={`/${submissionId}/${group}/${node.key}`}
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
                            {node.label}
                          </Link>
                        </li>
                      );
                    }

                    // Section with subsections
                    return (
                      <li key={node.key || parentRoot}>
                        {/* Parent row: clickable label + expand toggle */}
                        <div className="flex items-center">
                          {node.key ? (
                            // Parent has its own section (e.g. section21)
                            <Link
                              href={`/${submissionId}/${group}/${node.key}`}
                              aria-current={isActive ? 'step' : undefined}
                              className={`
                                flex-1 pl-4 pr-1 py-2 text-left text-sm transition-colors
                                ${
                                  isActive
                                    ? 'bg-blue-100 text-blue-800 font-medium border-l-2 border-blue-600 -ml-px'
                                    : hasActiveChild
                                      ? 'text-blue-700 font-medium'
                                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }
                              `}
                            >
                              {node.label}
                            </Link>
                          ) : (
                            // Virtual parent (e.g. "Section 13")
                            <span
                              className={`
                                flex-1 pl-4 pr-1 py-2 text-left text-sm
                                ${hasActiveChild ? 'text-blue-700 font-medium' : 'text-gray-600 font-medium'}
                              `}
                            >
                              {node.label}
                            </span>
                          )}

                          {/* Expand/collapse chevron for subsections */}
                          <button
                            type="button"
                            onClick={() => toggleParent(parentRoot)}
                            aria-expanded={isParentExpanded}
                            className="p-1.5 mr-2 text-gray-400 hover:text-gray-600 rounded"
                            aria-label={`${isParentExpanded ? 'Collapse' : 'Expand'} subsections`}
                          >
                            <svg
                              className={`h-3 w-3 transition-transform ${isParentExpanded ? 'rotate-90' : ''}`}
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
                          </button>
                        </div>

                        {/* Subsections */}
                        {isParentExpanded && (
                          <ul className="ml-4 border-l border-gray-100">
                            {node.children.map((child) => {
                              const isChildActive = child.key === currentSection;
                              return (
                                <li key={child.key}>
                                  <Link
                                    href={`/${submissionId}/${group}/${child.key}`}
                                    aria-current={isChildActive ? 'step' : undefined}
                                    className={`
                                      block w-full pl-4 pr-4 py-1.5 text-left text-xs transition-colors
                                      ${
                                        isChildActive
                                          ? 'bg-blue-100 text-blue-800 font-medium border-l-2 border-blue-600 -ml-px'
                                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                      }
                                    `}
                                  >
                                    {child.label}
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
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
