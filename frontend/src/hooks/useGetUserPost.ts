import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { Post } from "../models";
import useProfileStore from "../store/profileStore";
import { queryTypes, userPostQueries } from "../utils/userPostQueries";

const useGetUserPost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { posts, setPosts, queryType } = usePostStore();
  const userProfile = useProfileStore((state) => state.userProfile);
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
      } catch (error: any) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    getPosts();
  }, [setPosts, userProfile, queryType]);

  return { isLoading, posts };
};

export default useGetUserPost;

// import { useEffect, useState } from "react";
// import usePostStore from "../store/postStore";
// import useShowToast from "./useShowToast";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { firestore } from "../firebase/firebase";
// import { Post } from "../models";
// import useProfileStore from "../store/profileStore";

// const useGetUserPost = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { posts, setPosts } = usePostStore();
//   const userProfile = useProfileStore((state) => state.userProfile);
//   const showToast = useShowToast();

//   useEffect(() => {
//     const getPosts = async () => {
//       if (!userProfile) return;
//       setIsLoading(true);
//       setPosts([]);
//       try {
//         const q = query(
//           collection(firestore, "posts"),
//           where("createdBy", "==", userProfile.id),
//           where("username", "==", userProfile.username),
//         );
//         const qSnapshot = await getDocs(q);
//         const posts: Post[] = [];

//         qSnapshot.forEach((doc) => {
//           posts.push({
//             ...(doc.data() as Post),
//             id: doc.id,
//             pfpURL: userProfile.pfpURL,
//           });
//         });
//         posts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
//         setPosts(posts);
//       } catch (error: any) {
//         showToast("Error", error.message, "error");
//         setPosts([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getPosts();
//   }, [setPosts, userProfile]);

//   return { isLoading, posts };
// };

// export default useGetUserPost;
