import { create } from "zustand";

interface UIState {}

export const useUIStore = create<UIState>((set) => ({}));
