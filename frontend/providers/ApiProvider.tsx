"use client";

import React, { createContext, useContext } from "react";
import { apiClient } from "@/services/apiClient";

const ApiContext = createContext(apiClient);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>
  );
};

export const useApiClient = () => useContext(ApiContext);
