export interface userSession {
  id: string;
  isValid: boolean;
  refreshToken: string;
  jwt: string;
}

export interface signUpUser {
  email: string;
  id: string;
}
