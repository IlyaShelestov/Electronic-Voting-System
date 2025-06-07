import { IReport } from './IReport';

export interface IElection {
  election_id?: number;
  title: string;
  start_date: string;
  end_date: string;
  region_id: number;
  city_id: number;
  report?: IReport[];
}
