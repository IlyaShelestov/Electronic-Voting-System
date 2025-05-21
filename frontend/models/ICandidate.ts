import { IUser } from "./IUser";

export interface ICandidate extends IUser {
  election_id: number;
  candidate_id: number;
  bio: string;
  party: string;
  avatar_url?: string;
  additional_url_1?: string;
  additional_url_2?: string;
}
