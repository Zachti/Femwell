import { create } from "zustand";
import { AuthUser } from "../models";

type State = {
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
  setUser: (userData: AuthUser) => void;
};

const useAuthStore = create<State>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
  setUser: (userData) => {
    set({ user: userData });
    localStorage.setItem("user", JSON.stringify(userData));
  },
}));

export default useAuthStore;
