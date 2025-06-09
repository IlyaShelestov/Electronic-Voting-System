export enum UserRoleEnum {
  ADMIN = "admin",
  MANAGER = "manager",
  USER = "user",
  CANDIDATE = "candidate",
}

export type UserRoleType = `${UserRoleEnum}`;
