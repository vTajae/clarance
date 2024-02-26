// import { drizzle } from "drizzle-orm/node-postgres";
// import { users } from "../../database/schemas/users";

// export interface Env {
//   // If you set another name in wrangler.toml as the value for 'binding',
//   // replace "DB" with the variable name you defined.
//   DB: D1Database;
// }

// export const onRequest = async (
//   request: Request,
//   env: Env,
//   ctx: ExecutionContext
// ): Promise<Response> => {
//   const db = drizzle(env.DB);
//   const result = await db.select().from(users).all();
//   // Clean up the client, ensuring we don't kill the worker before that is completed.
//   return new Response(JSON.stringify(result));
//   // // If you did not use `clarance` as your binding name, change it here
//   // const { results } = await env.DB
//   //   .prepare("SELECT * FROM Customers WHERE CompanyName = ?")
//   //   .bind("Bs Beverages")
//   //   .all();
//   // return Response.json(results);
// };

// // import { sql } from "drizzle-orm";
// // import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

// // const users = sqliteTable('users', {
// //   id: text('id'),
// //   textModifiers: text('text_modifiers').notNull().default(sql`CURRENT_TIMESTAMP`),
// //   intModifiers: integer('int_modifiers', { mode: 'boolean' }).notNull().default(false),
// // });
