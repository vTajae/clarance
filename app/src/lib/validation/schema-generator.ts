import { z } from "zod/v4";
import type {
  FieldDefinition,
  SF86Section,
  UiFieldType,
} from "@/lib/field-registry/types";

/**
 * Generates a Zod schema for a single field based on its definition.
 *
 * Every schema is nullable to accommodate the initial atom state (`null`).
 * "Required" validation (i.e. must be non-null/non-empty) is handled
 * separately by the completion-tracking atoms; Zod focuses on *format*
 * validation — ensuring that when a value IS provided it has the correct
 * shape, pattern, and option membership.
 */
function fieldToZodSchema(field: FieldDefinition): z.ZodType {
  let schema: z.ZodType;

  switch (field.uiFieldType as UiFieldType) {
    case "text":
    case "textarea":
    case "email":
    case "phone":
    case "telephone":
    case "name":
    case "location":
    case "country":
    case "state":
    case "height":
    case "signature": {
      let s = z.string();
      if (field.maxLength) {
        s = s.max(field.maxLength);
      }
      if (field.pattern) {
        s = s.regex(new RegExp(field.pattern));
      }
      if (field.uiFieldType === "email") {
        s = s.email();
      }
      schema = s.nullable().optional();
      break;
    }

    case "ssn": {
      // Allow null/empty; validate format only when a value is present.
      const s = z.union([
        z.string().regex(/^\d{9}$/, "SSN must be 9 digits"),
        z.literal(""),
      ]);
      schema = s.nullable().optional();
      break;
    }

    case "date":
    case "dateRange": {
      // Allow null/empty; validate format only when a value is present.
      const s = z.union([
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
        z.literal(""),
      ]);
      schema = s.nullable().optional();
      break;
    }

    case "checkbox": {
      schema = z.boolean().nullable().optional();
      break;
    }

    case "radio":
    case "select": {
      if (field.options && field.options.length > 0) {
        const [first, ...rest] = field.options;
        // Allow null/empty for untouched state; validate option membership
        // only when a non-empty value is provided.
        const s = z.union([z.enum([first, ...rest]), z.literal("")]);
        schema = s.nullable().optional();
      } else {
        schema = z.string().nullable().optional();
      }
      break;
    }

    case "branch": {
      const b = z.union([z.enum(["yes", "no"]), z.literal("")]);
      schema = b.nullable().optional();
      break;
    }

    case "collection": {
      schema = z.array(z.record(z.string(), z.unknown())).nullable().optional();
      break;
    }

    case "notApplicable": {
      schema = z
        .object({
          notApplicable: z.boolean(),
          value: z.unknown().optional(),
        })
        .nullable()
        .optional();
      break;
    }

    default: {
      schema = z.unknown();
    }
  }

  return schema;
}

/**
 * Generates a Zod schema for an entire section based on its field definitions.
 */
export function generateSectionSchema(
  fields: FieldDefinition[]
): z.ZodObject<Record<string, z.ZodType>> {
  const shape: Record<string, z.ZodType> = {};

  for (const field of fields) {
    shape[field.semanticKey] = fieldToZodSchema(field);
  }

  return z.object(shape);
}

/**
 * Generates Zod schemas for all sections given a grouped field map.
 */
export function generateAllSectionSchemas(
  fieldsBySection: Record<SF86Section, FieldDefinition[]>
): Record<SF86Section, z.ZodObject<Record<string, z.ZodType>>> {
  const schemas = {} as Record<
    SF86Section,
    z.ZodObject<Record<string, z.ZodType>>
  >;

  for (const [section, fields] of Object.entries(fieldsBySection)) {
    schemas[section as SF86Section] = generateSectionSchema(fields);
  }

  return schemas;
}
