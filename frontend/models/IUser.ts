import { UserRoleEnum } from "./UserRole";

export interface IUser {
  user_id?: number;
  iin: string;
  first_name: string;
  last_name: string;
  patronymic?: string | null;
  date_of_birth: string;
  city_id: number;
  phone_number: string;
  email: string;
  role?: UserRoleEnum;
  created_at?: string;
  updated_at?: string;
}
