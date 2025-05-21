import { API_URL } from "@/config/env";
import { fetchWithCache } from "@/utils/fetchWithCache";

const apiEndpoint = `${API_URL}/locations`;

export const locationsService = {
  getCities: async () => {
    return fetchWithCache(`${apiEndpoint}/cities`);
  },

  getCityById: async (id: number) => {
    return fetchWithCache(`${apiEndpoint}/cities/${id}`);
  },

  getRegions: async () => {
    return fetchWithCache(`${apiEndpoint}/regions`);
  },

  getRegionById: async (id: number) => {
    return fetchWithCache(`${apiEndpoint}/regions/${id}`);
  },
};
