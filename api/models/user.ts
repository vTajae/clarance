export class User {
  id!: number;
  username!: string;
}


export class LoginResponse {
  user!: User;
  tokens!: Tokens;
}

export class Tokens {
  access_token!: string;
  refresh_token!: string;
}
