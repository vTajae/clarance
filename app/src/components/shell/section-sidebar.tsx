'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/state/stores/app-store';
import {
  ALL_SECTIONS,
  SECTION_META,
  type SF86Section,
} from '@/lib/field-registry/types';

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

/** Parent labels for sections that have subsections but no standalone parent section. */
const PARENT_LABELS: Record<string, string> = {
  '13': 'Section 13 - Employment',
  '20': 'Section 20 - Foreign Activities',
};

/**
 * Groups sections, nesting lettered subsections under parents.
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

/** Build a route href for a section. */
function sectionHref(submissionId: string, section: SF86Section): string {
  const meta = SECTION_META[section]!;
  return `/${submissionId}/${meta.group}/${section}`;
}

// Pre-compute the section tree once (ALL_SECTIONS is static)
const SECTION_TREE = buildSectionTree(ALL_SECTIONS);

interface SectionSidebarProps {
  submissionId: string;
}

export function SectionSidebar({ submissionId }: SectionSidebarProps) {
  const currentSection = useAppStore((s) => s.currentSection);

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
      <ul className="space-y-0.5">
        {SECTION_TREE.map((node) => {
          const hasChildren = node.children.length > 0;
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
                  href={sectionHref(submissionId, node.key!)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`
                    block w-full px-4 py-2 text-left text-sm transition-colors
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-800 font-medium border-l-2 border-blue-600'
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
                    href={sectionHref(submissionId, node.key)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`
                      flex-1 px-4 py-2 text-left text-sm transition-colors
                      ${
                        isActive
                          ? 'bg-blue-50 text-blue-800 font-medium border-l-2 border-blue-600'
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
                      flex-1 px-4 py-2 text-left text-sm
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
                          href={sectionHref(submissionId, child.key)}
                          aria-current={isChildActive ? 'step' : undefined}
                          className={`
                            block w-full pl-4 pr-4 py-1.5 text-left text-xs transition-colors
                            ${
                              isChildActive
                                ? 'bg-blue-50 text-blue-800 font-medium border-l-2 border-blue-600 -ml-px'
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
    </nav>
  );
}
