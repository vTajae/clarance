import { drizzle } from 'drizzle-orm/d1';
import { user } from '../../database/sqlite/user';

export interface Env {
    // If you set another name in wrangler.toml as the value for 'binding',
    // replace "DB" with the variable name you defined.
    DB: D1Database;
  }

  export const onRequest: PagesFunction<Env> = async (context) => {
    const db = drizzle(context.env.DB);
    
    const result = await db.select().from(user).all()

    return new Response(JSON.stringify(result));
  }
