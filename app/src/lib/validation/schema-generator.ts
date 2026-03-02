import { z } from "zod/v4";
import type {
  FieldDefinition,
  SF86Section,
  UiFieldType,
} from "@/lib/field-registry/types";

/**
 * Generates a Zod schema for a single field based on its definition.
 */
function fieldToZodSchema(field: FieldDefinition): z.ZodType {
  let schema: z.ZodType;

  switch (field.uiFieldType as UiFieldType) {
    case "text":
    case "textarea":
    case "email":
    case "phone":
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
      schema = field.required ? s.min(1) : s.optional();
      break;
    }

    case "ssn": {
      const s = z.string().regex(/^\d{9}$/, "SSN must be 9 digits");
      schema = field.required ? s : s.optional();
      break;
    }

    case "date":
    case "dateRange": {
      const s = z.string().regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Date must be YYYY-MM-DD format"
      );
      schema = field.required ? s : s.optional();
      break;
    }

    case "checkbox": {
      schema = z.boolean();
      break;
    }

    case "radio":
    case "select": {
      if (field.options && field.options.length > 0) {
        const [first, ...rest] = field.options;
        const s = z.enum([first, ...rest]);
        schema = field.required ? s : s.optional();
      } else {
        schema = field.required ? z.string().min(1) : z.string().optional();
      }
      break;
    }

    case "branch": {
      schema = z.enum(["yes", "no"]);
      break;
    }

    case "collection": {
      schema = z.array(z.record(z.string(), z.unknown()));
      break;
    }

    case "notApplicable": {
      schema = z
        .object({
          notApplicable: z.boolean(),
          value: z.unknown().optional(),
        })
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
