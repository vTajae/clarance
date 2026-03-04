'use client';

import { useMemo } from 'react';
import type { SF86Section } from '@/lib/field-registry/types';
import type { FieldDefinition } from '@/lib/field-registry/types';
import { useSectionFields, useRegistryNullable } from '@/lib/field-registry/use-registry';
import { RegistryField } from './registry-field';
import { ConditionalWrapper } from './conditional-wrapper';
import { PdfPageRenderer } from './pdf-page-renderer';

export type LayoutMode = 'wizard' | 'flow' | 'pdf';

interface SectionFormRendererProps {
  section: SF86Section;
  layoutMode?: LayoutMode;
}

/**
 * Group fields by their repeat group and index.
 * Non-repeating fields go into the "main" group.
 */
function groupFields(fields: FieldDefinition[]) {
  const mainFields: FieldDefinition[] = [];
  const repeatGroups = new Map<string, Map<number, FieldDefinition[]>>();

  for (const field of fields) {
    if (field.repeatGroup && field.repeatIndex !== undefined) {
      let group = repeatGroups.get(field.repeatGroup);
      if (!group) {
        group = new Map();
        repeatGroups.set(field.repeatGroup, group);
      }
      let instance = group.get(field.repeatIndex);
      if (!instance) {
        instance = [];
        group.set(field.repeatIndex, instance);
      }
      instance.push(field);
    } else {
      mainFields.push(field);
    }
  }

  return { mainFields, repeatGroups };
}

/**
 * Registry-driven section form renderer.
 * Reads field definitions from the registry and renders the appropriate
 * form primitives. Handles both flat sections and repeating groups.
 */
export function SectionFormRenderer({ section, layoutMode = 'wizard' }: SectionFormRendererProps) {
  const registryLoaded = useRegistryNullable() !== null;
  const fields = useSectionFields(section);

  const visibleFields = useMemo(() => fields.filter(f => !f.omitFromWizard), [fields]);
  const { mainFields, repeatGroups } = useMemo(() => groupFields(visibleFields), [visibleFields]);

  if (fields.length === 0) {
    // If registry is still loading, show nothing (will re-render once loaded)
    if (!registryLoaded) return null;

    return (
      <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        No fields found in the registry for section &ldquo;{section}&rdquo;.
      </div>
    );
  }

  // PDF coordinate layout mode
  if (layoutMode === 'pdf') {
    return <PdfPageRenderer section={section} />;
  }

  return (
    <div className="space-y-6">
      {/* Flat (non-repeating) fields */}
      {mainFields.length > 0 && (
        <div className="space-y-1">
          {mainFields.map((field) => (
            <ConditionalWrapper key={field.semanticKey} field={field}>
              <RegistryField field={field} />
            </ConditionalWrapper>
          ))}
        </div>
      )}

      {/* Repeating groups */}
      {Array.from(repeatGroups.entries()).map(([groupName, instanceMap]) => {
        const sortedInstances = Array.from(instanceMap.entries()).sort(
          ([a], [b]) => a - b,
        );

        return (
          <div key={groupName} className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-200 pb-1">
              {formatGroupName(groupName)}
            </h3>

            {sortedInstances.map(([instanceIndex, instanceFields]) => (
              <div
                key={`${groupName}-${instanceIndex}`}
                className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 space-y-1"
              >
                <div className="text-xs font-medium text-gray-500 mb-2">
                  Entry {instanceIndex + 1}
                </div>
                {instanceFields.map((field) => (
                  <ConditionalWrapper key={field.semanticKey} field={field}>
                    <RegistryField field={field} />
                  </ConditionalWrapper>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/** Convert repeat group internal name to display label. */
function formatGroupName(name: string): string {
  return name
    .replace(/^section_?/i, '')
    .replace(/_/g, '.')
    .replace(/(\d+)/g, ' $1 ')
    .trim();
}
