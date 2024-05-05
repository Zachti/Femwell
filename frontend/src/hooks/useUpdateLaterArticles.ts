import { useState } from "react";
import useAuthStore from "../store/authStore";
import { firestore } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

const useUpdateLaterArticles = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);

  const editLaterArticles = async (articleId: string) => {
    if (isUpdating || !authUser || !articleId) return false;
    setIsUpdating(true);

    const userDocRef = doc(firestore, "users", authUser.id);

    try {
      let updatedLaterArticles;
      if (authUser.laterArticles?.includes(articleId))
        updatedLaterArticles = authUser.laterArticles.filter(
          (id) => id !== articleId,
        );
      else
        updatedLaterArticles = [...(authUser.laterArticles || []), articleId];

      const updatedUser = {
        ...authUser,
        laterArticles: updatedLaterArticles,
      };

      await updateDoc(userDocRef, updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAuthUser(updatedUser);

      setIsUpdating(false);
      return true;
    } catch (error: any) {
      setIsUpdating(false);
      return false;
    }
  };

  return { isUpdating, editLaterArticles };
};

export default useUpdateLaterArticles;
