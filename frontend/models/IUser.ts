export interface IUser {
  user_id?: number;
  iin: string;
  first_name: string;
  last_name: string;
  patronymic?: string | null;
  date_of_birth: string;
  region: string;
  city: string;
  phone_number: string;
  email: string;
  password_hash: string;
  role: "user" | "admin" | "manager";
}
