enum Role {
  Admin = "1",
  User = "2",
  SuperUser = "3",
}

 type userLogin = {
username: string;
password: string;
};


export type { userLogin, Role}