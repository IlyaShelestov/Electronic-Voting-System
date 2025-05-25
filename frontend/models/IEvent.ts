export interface IEvent {
    id?: number;
    name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    location: string;
    image: string;
}