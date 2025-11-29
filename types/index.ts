export type UserRole = "admin" | "user";

export interface UserData {
  username: string;
  role: UserRole;
}
