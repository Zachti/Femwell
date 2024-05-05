import { collection, doc, getDoc, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

export const userPostQueries = {
  getUserPosts: (userProfile: { id: string; username: string }) =>
    query(
      collection(firestore, "posts"),
      where("createdBy", "==", userProfile.id),
      where("username", "==", userProfile.username),
    ),
  getMyPosts: (userProfile: { id: string }) =>
    query(
      collection(firestore, "posts"),
      where("createdBy", "==", userProfile.id),
    ),
  getLikedPosts: async (userProfile: { id: string }) => {
    const userDoc = await getDoc(doc(firestore, "users", userProfile.id));

    if (userDoc.exists()) {
      const likedPosts = userDoc.data().likedPosts;
      return query(
        collection(firestore, "posts"),
        where("__name__", "in", likedPosts),
      );
    }
  },
  getRandomPosts: () => {
    query(collection(firestore, "posts"));
  },
};

export const queryTypes = {
  USER_POSTS: "USER_POSTS",
  MY_POSTS: "MY_POSTS",
  LIKED_POSTS: "LIKED_POSTS",
  RANDOM_POSTS: "RANDOM_POSTS",
};
