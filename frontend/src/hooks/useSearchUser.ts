import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useProfileStore from "../store/profileStore";
import usePostStore from "../store/postStore";

const useSearchUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setUserProfile = useProfileStore((state) => state.setUserProfile);
  const setPostsQuery = usePostStore((state) => state.setPostsQuery);
  const showToast = useShowToast();

  const getUserProfile = async (username: string, queryType: string) => {
    setIsLoading(true);
    try {
      const q = query(
        collection(firestore, "users"),
        where("username", "==", username),
      );

      const qSnapshot = await getDocs(q);
      if (qSnapshot.empty) return showToast("Error", "User not found", "error");

      const data = qSnapshot.docs[0].data();
      const profileData = {
        id: data.id,
        username: data.username,
        posts: data.posts,
        pfpURL: data.pfpURL,
      };

      setUserProfile(profileData);
      setPostsQuery(queryType);
    } catch (error: any) {
      showToast("Error", error.message, "error");
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getUserProfile };
};

export default useSearchUser;
