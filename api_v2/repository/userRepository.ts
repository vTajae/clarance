import { drizzle } from 'drizzle-orm/d1';
import { user } from '../../database/sqlite/user'; // Adjust the import path as necessary
import { EnvWithKV } from 'api/schemas/kv';
import { eq } from 'drizzle-orm';
import { userLogin } from 'api_v2/types/userLogin';

class UserRepository {
  private db;

  constructor(env: EnvWithKV) {
    this.db = drizzle(env.DB);
  }


  async findUserByUsername(username: string) {
    const result = await this.db
      .select()
      .from(user)
      .where(eq(user.username, username))
      .execute();

    return result.length > 0 ? result[0] : null;
  }

  async addUser(userData: userLogin) {
    const unixTimestamp = Math.floor(Date.now() / 1000); // Convert current time to Unix timestamp

    const result = await this.db
      .insert(user)
      .values({
        ...userData,
        createdAt: unixTimestamp,
        updatedAt: unixTimestamp,
      })
      .returning({ insertedId: user.id }) // Make sure 'id' is a returning field in your model
      .execute();

    return result.length > 0 ? result[0].insertedId : null;
  }
}

export default UserRepository;
