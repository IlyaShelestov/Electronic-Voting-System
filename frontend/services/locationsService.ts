import { API_URL } from "@/config/env";
import { ICity } from "@/models/ICity";
import { IRegion } from "@/models/IRegion";
import { fetchWithCache } from "@/utils/fetchWithCache";

export class LocationsService {
  private static apiEndpoint = `${API_URL}/locations`;

  public static async getCities(): Promise<ICity[]> {
    return fetchWithCache<ICity[]>(`${this.apiEndpoint}/cities`);
  }

  public static async getCityById(id: number): Promise<ICity> {
    return fetchWithCache<ICity>(`${this.apiEndpoint}/cities/${id}`);
  }

  public static async getRegions(): Promise<IRegion[]> {
    return fetchWithCache<IRegion[]>(`${this.apiEndpoint}/regions`);
  }

  public static async getRegionById(id: number): Promise<IRegion> {
    return fetchWithCache<IRegion>(`${this.apiEndpoint}/regions/${id}`);
  }
}
