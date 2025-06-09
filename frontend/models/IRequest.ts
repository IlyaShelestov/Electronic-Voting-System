import { IUser } from "./IUser";
import { RequestStatusEnum } from "./RequestStatus";

export interface IRequest {
  request_id: number;
  user_id: number;
  field_name: string;
  old_value: string | null;
  new_value: string;
  status: RequestStatusEnum;
  created_at: string;
  updated_at: string;
}

export interface IRequestWithUserData extends IRequest {
  user?: IUser;
  first_name?: string;
  last_name?: string;
  iin?: string;
}
