import { create } from "zustand";
import { User } from "../models";

type State = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  setUser: (userData: User) => void;
};

const useAuthStore = create<State>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
  setUser: (userData) => set({ user: userData }),
}));

export default useAuthStore;
