import { SecureService } from "./secure_service";
import type { LoginResponse, User } from "../models/user";
import { Credentials } from "~/props/credentials";

export class UserService extends SecureService {

  static setDefaultHeaders(cookieHeader: string) {
    this.defaultHeaders = {
      'Cookie': cookieHeader,
    };
  }

  static async registerUser(
    login: string,
    password: string
  ): Promise<void | User> {
    //return this.authenticate("login",new Credentials(login, password));
    return this.post<User>("register", new Credentials(login, password));
  }

  static async getUserProfile(): Promise<void | User> {
    try {
      return await this.getSingle<User>("user/profile");
        // Return the user data directly
    } catch (error) {
      return console.error("Error fetching user profile:", error);; // Return null or handle the error gracefully
    }
  }
  

  static async MyRefresh(): Promise<void | string> {
    try {
      // Pass an empty object as the body if your post method requires it
      const response = await this.post<{ message: string }>("refresh", {});
      if (response) {
        console.log(response.message); // Log the response message only if response is not void
        return response.message; // Return the message string
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      // Handle the error appropriately
      throw error;
    }
  }

  static async loginUser(
    login: string,
    password: string
  ): Promise<LoginResponse> {
    return this.authenticate("login", new Credentials(login, password));
  }


  static async getUserByUsername(username: string): Promise<void | User> {
    return this.getSingle<User>(`users/${username}`);
  }
}
