import { Credentials } from "~/props/credentials";
import { CloudService } from "./cloud_service";
import { LoginResponse, User } from "../../models/user";

// Define a custom environment type
interface EnvWithKV {
  USER_STATE: KVNamespace;
  // Add other bindings if needed
}

export class UserCloudService extends CloudService {
  static setDefaultHeaders(cookieHeader: string) {
    this.defaultHeaders = {
      Cookie: cookieHeader,
    };
  }
  static async loginUser(
    username: string,
    password: string
  ): Promise<LoginResponse | null> {
    const credentials = new Credentials(username, password);
    // Call the authenticate method of CloudService
    return this.authenticate("login", credentials);
  }

  static async fetchUserStateFromKV({ request, env }: { request: Request, env: EnvWithKV }): Promise<User | null> {
    const cookieHeader = request.headers.get("Cookie");
    const userId = this.getUserIdFromCookie(cookieHeader);

    if (userId) {
      const userDataString = await env.USER_STATE.get(`user_${userId}`);

      console.log("User data string:", userDataString);
      return userDataString ? JSON.parse(userDataString) : null;
    } else {
      return null;
    }
  };

  static getUserIdFromCookie(cookieHeader: string | null): string | null {
    if (!cookieHeader) {
      return null; // Return null if cookieHeader is null
    }

    const matches = cookieHeader.match(/userId=([^;]+)/);
    return matches ? matches[1] : null;
  }
}
