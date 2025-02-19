"use client";

import { Provider } from "react-redux";
import { store } from "./reduxStore";

import { ReactNode } from "react";

export function MultiProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
