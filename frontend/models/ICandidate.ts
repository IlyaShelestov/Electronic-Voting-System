import { IUser } from "./IUser";

export interface ICandidate extends IUser {
  candidate_id: number;
  bio: string;
  party: string;
  image_url?: string;
}
