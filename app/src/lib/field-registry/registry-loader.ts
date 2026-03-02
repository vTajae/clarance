// ---------------------------------------------------------------------------
// SF-86 Field Registry -- Indexed Loader & Lookup Class
// ---------------------------------------------------------------------------

import type { FieldDefinition, SF86Section, SF86SectionGroup } from './types';
import { SECTION_GROUPS } from './types';

/**
 * An indexed, read-only view over the 6,197 field definitions that comprise
 * the SF-86 field registry.
 *
 * All lookups are O(1) or O(n) over the result set only (pre-bucketed).
 * The class is immutable once constructed -- call {@link loadRegistry} to
 * build a new instance from raw JSON data.
 */
export class FieldRegistry {
  // -- Primary storage -------------------------------------------------------
  private readonly fields: ReadonlyArray<FieldDefinition>;

  // -- Indexed maps (built once at construction time) ------------------------
  private readonly bySemanticKey: Map<string, FieldDefinition>;
  private readonly byPdfFieldName: Map<string, FieldDefinition>;
  private readonly bySection: Map<SF86Section, FieldDefinition[]>;
  private readonly byRepeatGroup: Map<string, FieldDefinition[]>;
  private readonly byPage: Map<number, FieldDefinition[]>;

  constructor(definitions: FieldDefinition[]) {
    this.fields = Object.freeze([...definitions]);

    this.bySemanticKey = new Map();
    this.byPdfFieldName = new Map();
    this.bySection = new Map();
    this.byRepeatGroup = new Map();
    this.byPage = new Map();

    for (const field of this.fields) {
      // Semantic key index -- must be unique
      if (this.bySemanticKey.has(field.semanticKey)) {
        console.warn(
          `[FieldRegistry] Duplicate semanticKey "${field.semanticKey}" -- ` +
            `keeping first occurrence.`,
        );
      } else {
        this.bySemanticKey.set(field.semanticKey, field);
      }

      // PDF field name index -- must be unique
      if (this.byPdfFieldName.has(field.pdfFieldName)) {
        console.warn(
          `[FieldRegistry] Duplicate pdfFieldName "${field.pdfFieldName}" -- ` +
            `keeping first occurrence.`,
        );
      } else {
        this.byPdfFieldName.set(field.pdfFieldName, field);
      }

      // Section bucket
      const sectionBucket = this.bySection.get(field.section);
      if (sectionBucket) {
        sectionBucket.push(field);
      } else {
        this.bySection.set(field.section, [field]);
      }

      // Repeat-group bucket
      if (field.repeatGroup) {
        const repeatBucket = this.byRepeatGroup.get(field.repeatGroup);
        if (repeatBucket) {
          repeatBucket.push(field);
        } else {
          this.byRepeatGroup.set(field.repeatGroup, [field]);
        }
      }

      // Page bucket (only fields with coordinates)
      if (field.pdfPage) {
        const pageBucket = this.byPage.get(field.pdfPage);
        if (pageBucket) {
          pageBucket.push(field);
        } else {
          this.byPage.set(field.pdfPage, [field]);
        }
      }
    }
  }

  // -- Accessors -------------------------------------------------------------

  /** Total number of field definitions in the registry. */
  get size(): number {
    return this.fields.length;
  }

  /** Look up a field by its unique semantic key. O(1). */
  getBySemanticKey(key: string): FieldDefinition | undefined {
    return this.bySemanticKey.get(key);
  }

  /** Look up a field by its raw PDF AcroForm field name. O(1). */
  getByPdfFieldName(name: string): FieldDefinition | undefined {
    return this.byPdfFieldName.get(name);
  }

  /** All fields belonging to a given section. */
  getBySection(section: SF86Section): FieldDefinition[] {
    return this.bySection.get(section) ?? [];
  }

  /**
   * All fields belonging to any section within a logical section group.
   * Results are returned in section order.
   */
  getBySectionGroup(group: SF86SectionGroup): FieldDefinition[] {
    const sections = SECTION_GROUPS[group];
    if (!sections) return [];

    const result: FieldDefinition[] = [];
    for (const section of sections) {
      const bucket = this.bySection.get(section);
      if (bucket) {
        result.push(...bucket);
      }
    }
    return result;
  }

  /** All fields belonging to a named repeating group. */
  getByRepeatGroup(group: string): FieldDefinition[] {
    return this.byRepeatGroup.get(group) ?? [];
  }

  /** All fields on a given PDF page number (1-based). */
  getByPage(page: number): FieldDefinition[] {
    return this.byPage.get(page) ?? [];
  }

  /** Required fields for a given section. */
  getRequiredFields(section: SF86Section): FieldDefinition[] {
    return this.getBySection(section).filter((f) => f.required);
  }

  /** Every semantic key in the registry. */
  getAllSemanticKeys(): string[] {
    return Array.from(this.bySemanticKey.keys());
  }

  /** Every raw PDF field name in the registry. */
  getAllPdfFieldNames(): string[] {
    return Array.from(this.byPdfFieldName.keys());
  }

  /** Iterate over all field definitions. */
  [Symbol.iterator](): Iterator<FieldDefinition> {
    return this.fields[Symbol.iterator]();
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Build a {@link FieldRegistry} from an array of field definitions
 * (typically parsed from `field-registry.json`).
 *
 * ```ts
 * import registryData from '@/data/field-registry.json';
 * const registry = loadRegistry(registryData as FieldDefinition[]);
 * ```
 */
export function loadRegistry(data: FieldDefinition[]): FieldRegistry {
  return new FieldRegistry(data);
}
