import { ApiResult } from "../models/api-result";
import type { LoginResponse } from "../models/user";
import type { Credentials } from "../../app/props/credentials";

export class SecureService {
  private static root = "http://localhost:8000";
  static defaultHeaders: HeadersInit | undefined;

  protected static getRequestOptions(method: string, body?: unknown): RequestInit {
    let options: RequestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
      },
      // Removed 'credentials' field
    };
  
    if (body) options.body = JSON.stringify(body);
    return options;
  }
  

  protected static getRaw<T>(url: string): Promise<T[]> {
    const options = this.getRequestOptions("GET");
    return fetch(`${this.root}/${url}`, options)
      .then((response) => this.handleResponse<T[]>(response))
      .catch((error) => {
        console.log(error.message, url, error.stack);
        return []; // Return an empty array in case of an error
      });
  }

  protected static getPaginated<T>(
    url: string,
    page: number,
    filter?: string
  ): Promise<ApiResult<T>> {
    url = `${this.root}/${url}?page=${page}${filter ? `&${filter}` : ""}`;
    const options = this.getRequestOptions("GET");
    return fetch(url, options)
      .then((response) => this.handleResponse<ApiResult<T>>(response))
      .catch((error) => {
        console.log(error.message, url, error.stack);
        return new ApiResult<T>([], 0, 0, 20, 0, true);
      });
  }

  protected static post<T>(url: string, body: unknown): Promise<void | T> {
    const options = this.getRequestOptions("POST", body);
    return this.retrieve<T>(`${this.root}/${url}`, options);
  }

  protected static patch<T>(url: string, body: unknown): Promise<void | T> {
    const options = this.getRequestOptions("PATCH", body);
    return this.retrieve<T>(`${this.root}/${url}`, options);
  }

  protected static authenticate(url: string, credentials: Credentials): Promise<LoginResponse> {
    const options = this.getRequestOptions("POST", credentials);
    return fetch(`${this.root}/${url}`, options).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return this.handleResponse<LoginResponse>(response);
    });
  }
  

  protected static async getSingle<T>(url: string): Promise<void | T> {
    const options = this.getRequestOptions("GET");
    let test = await this.retrieve<T>(`${this.root}/${url}`, options);
    return test;
  }

  private static retrieve<T>(url: string, options: RequestInit): Promise<T> {
    return fetch(url, options)
      .then((response) => this.handleResponse<T>(response))
      .catch((error) => {
        console.log(error.message, url, error.stack);
        throw error; // Throw the error to be handled by the caller
      });
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (response.status !== 200) {
      console.log(`Bad response code ${response.status} returned`);
      throw new Error(`Response returned status ${response.status}`);
    }

    return await response.json() as Promise<T>;
  }

  // private static showToast(message: string): void {
  //   this.toast.show(
  //     new ToastProps("Service call error", message, ToastType.Warning)
  //   );
  // }

  // private static logError(message: string, url: string, stack: string): void {
  //   console.log(`Service call error "${message}"`);
  //   console.log(`Endpoint is "${url}"`);
  //   console.log(`Stack is "${stack}"`);
  //   console.log(`${message} ${url} `);
  // }
}
