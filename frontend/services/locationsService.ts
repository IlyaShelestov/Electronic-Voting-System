import { API_URL } from "@/config/env";
import { ICity } from "@/models/ICity";
import { IRegion } from "@/models/IRegion";
import { fetchWithCache } from "@/utils/fetchWithCache";

const apiEndpoint = `${API_URL}/locations`;

export const locationsService = {
  getCities: async (): Promise<ICity[]> => {
    return fetchWithCache<ICity[]>(`${apiEndpoint}/cities`);
  },

  getCityById: async (id: number): Promise<ICity> => {
    return fetchWithCache<ICity>(`${apiEndpoint}/cities/${id}`);
  },

  getRegions: async (): Promise<IRegion[]> => {
    return fetchWithCache<IRegion[]>(`${apiEndpoint}/regions`);
  },

  getRegionById: async (id: number): Promise<IRegion> => {
    return fetchWithCache<IRegion>(`${apiEndpoint}/regions/${id}`);
  },
};
