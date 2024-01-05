export interface userSession {
  id: string;
  isValid: boolean;
  refreshToken: string;
  jwt: string;
}
