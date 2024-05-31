// import { useEffect, useState } from "react";
// import usePostStore from "../store/postStore";
// import useShowToast from "./useShowToast";
// import { Post } from "../models";
// import useProfileStore from "../store/profileStore";
// import { queryTypes, userPostQueries } from "../utils/userPostQueries";
// import { GET_POSTS_QUERY, PostsFilter } from "../utils/wolverineRequests";
// import axios from "axios";
// import { print } from "graphql";
// import useAuthStore from "../store/authStore";

// const useGetUserPost = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { setPosts, queryType } = usePostStore();
//   const userProfile = useProfileStore((state) => state.userProfile);
//   const authUser = useAuthStore((state) => state.user);
//   const prevQueryType = usePostStore((state) => state.prevQueryType);
//   const setPrevPostsQuery = usePostStore((state) => state.setPrevPostsQuery);
//   const showToast = useShowToast();

//     const getPosts = async () => {
//       if (!userProfile || !queryType || !authUser) return;
//       console.log("queryType", queryType, "userProfile", userProfile);
//       setIsLoading(true);
//       setPosts([]);
//       try {
//         let q;
//         if (queryType === queryTypes.USER_POSTS) {
//           const filter: PostsFilter = {
//             ids: [userProfile.id],
//           };
//           const userPostsResponse = await axios.post(
//             `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
//             {
//               query: print(GET_POSTS_QUERY),
//               variables: { filter },
//             },
//             {
//               headers: {
//                 authorization: authUser.jwt,
//               },
//             },
//           );
//         } else if (queryType === queryTypes.MY_POSTS) {
//           q = userPostQueries.getMyPosts(userProfile);
//         } else if (queryType === queryTypes.LIKED_POSTS) {
//           q = await userPostQueries.getLikedPosts(userProfile);
//         } else if (queryType === queryTypes.RANDOM_POSTS) {
//           q = userPostQueries.getRandomPosts();
//         }

//         if (!q) return;

//         const posts: Post[] = [];

//         qSnapshot.forEach((doc) => {
//           posts.push({
//             ...(doc.data() as Post),
//             id: doc.id,
//             profilePic:
//               doc.data().username == "Anonymous" ? "" : userProfile.profilePic,
//           });
//         });

//         // posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

//         setPosts(posts);
//         setPrevPostsQuery(queryType);
//       } catch (error: any) {
//         showToast("Error", error.message, "error");
//         setPosts([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     // if (queryType !== prevQueryType) getPosts();
//   }, [setPosts, userProfile, queryType]);

//   return { isLoading };
// };

// export default useGetUserPost;

import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useShowToast from "./useShowToast";
import { Post } from "../models";
import useProfileStore from "../store/profileStore";
import { queryTypes, userPostQueries } from "../utils/userPostQueries";
import { GET_POSTS_QUERY, PostsFilter } from "../utils/wolverineRequests";
import axios from "axios";
import { print } from "graphql";
import useAuthStore from "../store/authStore";

const useGetUserPost = () => {
  const [isLoading, setIsLoading] = useState(false);

  const userProfile = useProfileStore((state) => state.userProfile);
  const authUser = useAuthStore((state) => state.user);
  const prevQueryType = usePostStore((state) => state.prevQueryType);
  const setPrevPostsQuery = usePostStore((state) => state.setPrevPostsQuery);
  const queryType = usePostStore((state) => state.queryType);
  const setPosts = usePostStore((state) => state.setPosts);
  const posts = usePostStore((state) => state.posts);
  const showToast = useShowToast();

  const getPosts = async (data: any) => {
    if (!data.queryType || !authUser) return;

    setIsLoading(true);
    setPosts([]);
    try {
      let postLen;
      let q;
      if (data.queryType === queryTypes.USER_POSTS) {
        const filter: PostsFilter = {
          usernames: [data.username],
        };
        const userPostsResponse = await axios.post(
          `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
          {
            query: print(GET_POSTS_QUERY),
            variables: { filter },
          },
          {
            headers: {
              authorization: authUser.jwt,
            },
          },
        );

        const userPostsResult = await userPostsResponse.data;
        console.log("userPostsResult", userPostsResult.data.getPosts);
        console.log("--------------------");
        const filteredPosts = userPostsResult.data.getPosts.filter(
          (post: any) => !post.isAnonymous,
        );
        console.log("Filtered posts", filteredPosts);
        setPosts(filteredPosts);
        postLen = filteredPosts.length;
      } else if (data.queryType === queryTypes.MY_POSTS) {
        const filter: PostsFilter = {
          ids: authUser.posts,
        };
        console.log("filter", filter);
        const userPostsResponse = await axios.post(
          `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
          {
            query: print(GET_POSTS_QUERY),
            variables: { filter },
          },
          {
            headers: {
              authorization: authUser.jwt,
            },
          },
        );
        const userPostsResult = await userPostsResponse.data;
        console.log("userPostsResult", userPostsResult.data.getPosts);
        console.log("--------------------");
        setPosts(userPostsResult.data.getPosts);
        postLen = userPostsResult.data.getPosts.length;
      } else if (data.queryType === queryTypes.LIKED_POSTS) {
        const filter: PostsFilter = {
          ids: authUser.likes,
        };
        console.log("filter", filter);
        const userPostsResponse = await axios.post(
          `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
          {
            query: print(GET_POSTS_QUERY),
            variables: { filter },
          },
          {
            headers: {
              authorization: authUser.jwt,
            },
          },
        );
        const userPostsResult = await userPostsResponse.data;
        console.log("userPostsResult", userPostsResult.data.getPosts);
        console.log("--------------------");
        setPosts(userPostsResult.data.getPosts);
        postLen = userPostsResult.data.getPosts.length;
      } else if (data.queryType === queryTypes.RANDOM_POSTS) {
        q = userPostQueries.getRandomPosts();
      }

      if (postLen <= 0) {
        showToast("Error", "User doesn't exist or has no posts", "error");
        return;
      }

      // posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setPrevPostsQuery(queryType);
    } catch (error: any) {
      console.log(error);
      showToast("Error", error.message, "error");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getPosts };
};

export default useGetUserPost;
