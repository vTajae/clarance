import {
  createHotContext
} from "/build/_shared/chunk-6OUMGZ45.js";
import {
  __publicField
} from "/build/_shared/chunk-RODUX5XG.js";

// api/models/api-result.ts
var ApiResult = class {
  content;
  pageable;
  last;
  totalElements;
  totalPages;
  size;
  number;
  first;
  numberOfElements;
  sort;
  constructor(content, totalElements, totalPages, pageSize, pageNumber, paged) {
    this.content = content;
    this.pageable = new Pageable(pageSize, pageNumber, paged);
    this.last = false;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
    this.numberOfElements = content.length;
  }
};
var Pageable = class {
  sort;
  offset;
  pageSize;
  pageNumber;
  unpaged;
  paged;
  constructor(pageSize, pageNumber, paged) {
    this.sort = new Sort(false);
    this.offset = 0;
    this.pageSize = pageSize;
    this.pageNumber = pageNumber;
    this.paged = paged;
    this.unpaged = !paged;
  }
};
var Sort = class {
  sorted;
  unsorted;
  constructor(sorted) {
    this.sorted = sorted;
    this.unsorted = !sorted;
  }
};

// api/services/secure_service.ts
var SecureService = class {
  static getRequestOptions(method, body) {
    let options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders
      }
      // Removed 'credentials' field
    };
    if (body)
      options.body = JSON.stringify(body);
    return options;
  }
  static getRaw(url) {
    const options = this.getRequestOptions("GET");
    return fetch(`${this.root}/${url}`, options).then((response) => this.handleResponse(response)).catch((error) => {
      console.log(error.message, url, error.stack);
      return [];
    });
  }
  static getPaginated(url, page, filter) {
    url = `${this.root}/${url}?page=${page}${filter ? `&${filter}` : ""}`;
    const options = this.getRequestOptions("GET");
    return fetch(url, options).then((response) => this.handleResponse(response)).catch((error) => {
      console.log(error.message, url, error.stack);
      return new ApiResult([], 0, 0, 20, 0, true);
    });
  }
  static post(url, body) {
    const options = this.getRequestOptions("POST", body);
    return this.retrieve(`${this.root}/${url}`, options);
  }
  static patch(url, body) {
    const options = this.getRequestOptions("PATCH", body);
    return this.retrieve(`${this.root}/${url}`, options);
  }
  static authenticate(url, credentials) {
    const options = this.getRequestOptions("POST", credentials);
    return fetch(`${this.root}/${url}`, options).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return this.handleResponse(response);
    });
  }
  static async getSingle(url) {
    const options = this.getRequestOptions("GET");
    let test = await this.retrieve(`${this.root}/${url}`, options);
    return test;
  }
  static retrieve(url, options) {
    return fetch(url, options).then((response) => this.handleResponse(response)).catch((error) => {
      console.log(error.message, url, error.stack);
      throw error;
    });
  }
  static async handleResponse(response) {
    if (response.status !== 200) {
      console.log(`Bad response code ${response.status} returned`);
      throw new Error(`Response returned status ${response.status}`);
    }
    return await response.json();
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
};
__publicField(SecureService, "root", "http://localhost:8000");
__publicField(SecureService, "defaultHeaders");

// app/props/credentials.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/props/credentials.ts"
  );
  import.meta.hot.lastModified = "1703724946237.183";
}
var Credentials = class {
  username;
  password;
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
};

// api/services/user_service.ts
var UserService = class extends SecureService {
  static setDefaultHeaders(cookieHeader) {
    this.defaultHeaders = {
      "Cookie": cookieHeader
    };
  }
  static async registerUser(login, password) {
    return this.post("register", new Credentials(login, password));
  }
  static async getUserProfile() {
    try {
      return await this.getSingle("user/profile");
    } catch (error) {
      return console.error("Error fetching user profile:", error);
      ;
    }
  }
  static async MyRefresh() {
    try {
      const response = await this.post("refresh", {});
      if (response) {
        console.log(response.message);
        return response.message;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }
  static async loginUser(login, password) {
    return this.authenticate("login", new Credentials(login, password));
  }
  static async getUserByUsername(username) {
    return this.getSingle(`users/${username}`);
  }
};

export {
  UserService
};
//# sourceMappingURL=/build/_shared/chunk-XXQJOG4O.js.map
