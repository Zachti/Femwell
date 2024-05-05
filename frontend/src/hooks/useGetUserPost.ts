import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useShowToast from "./useShowToast";
import { getDocs } from "firebase/firestore";
import { Post } from "../models";
import useProfileStore from "../store/profileStore";
import { queryTypes, userPostQueries } from "../utils/userPostQueries";

const useGetUserPost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setPosts, queryType } = usePostStore();
  const userProfile = useProfileStore((state) => state.userProfile);
  const prevQueryType = usePostStore((state) => state.prevQueryType);
  const setPrevPostsQuery = usePostStore((state) => state.setPrevPostsQuery);
  const showToast = useShowToast();

  useEffect(() => {
    const getPosts = async () => {
      if (!userProfile || !queryType) return;
      console.log("queryType", queryType, "userProfile", userProfile);
      setIsLoading(true);
      setPosts([]);
      try {
        let q;
        if (queryType === queryTypes.USER_POSTS) {
          q = userPostQueries.getUserPosts(userProfile);
        } else if (queryType === queryTypes.MY_POSTS) {
          q = userPostQueries.getMyPosts(userProfile);
        } else if (queryType === queryTypes.LIKED_POSTS) {
          q = await userPostQueries.getLikedPosts(userProfile);
        } else if (queryType === queryTypes.RANDOM_POSTS) {
          q = userPostQueries.getRandomPosts();
        }

        if (!q) return;

        const qSnapshot = await getDocs(q);
        const posts: Post[] = [];

        qSnapshot.forEach((doc) => {
          posts.push({
            ...(doc.data() as Post),
            id: doc.id,
            pfpURL:
              doc.data().username == "Anonymous" ? "" : userProfile.pfpURL,
          });
        });

        posts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        setPosts(posts);
        setPrevPostsQuery(queryType);
      } catch (error: any) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (queryType !== prevQueryType) getPosts();
  }, [setPosts, userProfile, queryType]);

  return { isLoading };
};

export default useGetUserPost;
