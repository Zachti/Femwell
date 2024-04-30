import { create } from "zustand";

import { Profile } from "../models/profile.model";

type State = {
  userProfile: Profile | null;
  setUserProfile: (userProfile: Profile | null) => void;
  addPost: (post: any) => void;
};

const useProfileStore = create<State>((set) => ({
  userProfile: null,
  setUserProfile: (userProfile) => set({ userProfile }),
  addPost: (post) =>
    set((state) => {
      if (state.userProfile === null) {
        return state;
      }

      return {
        userProfile: {
          ...state.userProfile,
          posts: [...(state.userProfile.posts || []), post],
        },
      };
    }),
}));

export default useProfileStore;
