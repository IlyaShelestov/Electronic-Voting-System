import { API_URL } from "@/config/env";
import { ICity } from "@/models/ICity";
import { IRegion } from "@/models/IRegion";
import { fetchWithCache } from "@/utils/fetchWithCache";

const apiEndpoint = `${API_URL}/locations`;

export class LocationsService {
  public static async getCities(): Promise<ICity[]> {
    return fetchWithCache<ICity[]>(`${apiEndpoint}/cities`);
  }

  public static async getCityById(id: number): Promise<ICity> {
    return fetchWithCache<ICity>(`${apiEndpoint}/cities/${id}`);
  }

  public static async getRegions(): Promise<IRegion[]> {
    return fetchWithCache<IRegion[]>(`${apiEndpoint}/regions`);
  }

  public static async getRegionById(id: number): Promise<IRegion> {
    return fetchWithCache<IRegion>(`${apiEndpoint}/regions/${id}`);
  }
}
