import { API_URL } from "@/config/env";
import { IEvent } from "@/models/IEvent";
import { fetchWithCache } from "@/utils/fetchWithCache";

export class EventService {
  private static apiEndpoint = "/events";

  public static async getAll(): Promise<IEvent[]> {
    return await fetchWithCache<IEvent[]>(`${API_URL}${this.apiEndpoint}`);
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
