import { ICity } from "@/models/ICity";
import { IRegion } from "@/models/IRegion";

import { apiClient } from "./apiClient";

export class LocationsService {
  private static apiEndpoint = "/locations";

  public static async getCities(): Promise<ICity[]> {
    const { data } = await apiClient.get<ICity[]>(`${this.apiEndpoint}/cities`);
    return data;
  }

  public static async getCityById(id: number): Promise<ICity> {
    const { data } = await apiClient.get<ICity>(
      `${this.apiEndpoint}/cities/${id}`
    );
    return data;
  }

  public static async getRegions(): Promise<IRegion[]> {
    const { data } = await apiClient.get<IRegion[]>(
      `${this.apiEndpoint}/regions`
    );
    return data;
  }

  public static async getRegionById(id: number): Promise<IRegion> {
    const { data } = await apiClient.get<IRegion>(
      `${this.apiEndpoint}/regions/${id}`
    );
    return data;
  }
}
