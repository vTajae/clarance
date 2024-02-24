import type { Config } from "drizzle-kit";

export default {
  schema: "./database/schema.ts",
  out: "./database/tables",
} satisfies Config;