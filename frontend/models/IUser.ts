export interface IUser {
  iin: string;
  first_name: string;
  last_name: string;
  patronymic?: string | null;
  date_of_birth: string;
  city_id: number;
  phone_number: string;
  email: string;
  role: "user" | "admin" | "manager";
}
