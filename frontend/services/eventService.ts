import { IEvent } from "@/models/IEvent";

import { apiClient } from "./apiClient";

export class EventService {
  private static apiEndpoint = "/events";

  public static async getAll(): Promise<IEvent[]> {
    const { data } = await apiClient.get<IEvent[]>(this.apiEndpoint);
    return data;
  }

  public static async getUpcoming(): Promise<IEvent[]> {
    const events = await this.getAll();
    if (!events || events.length === 0) {
      return [];
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((event) => {
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort(
        (a, b) =>
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      );
  }
}
