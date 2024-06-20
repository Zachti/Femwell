import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
// import usePostStore from "../store/postStore";
import {
  CREATE_LIKE_MUTATION,
  DELETE_LIKE_MUTATION,
  CreateOrDeleteLikeInput,
} from "../utils/wolverineRequests";
import axios from "axios";
import { print } from "graphql";

const useLike = () => {
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  // const posts = usePostStore((state) => state.posts);
  const setUser = useAuthStore((state) => state.setUser);
  const showToast = useShowToast();

  const handleLikePost = async (postId: string) => {
    if (isLoading) return;
    if (postId && authUser) {
      setIsLoading(true);

      try {
        let flag = true; //remove this later on
        let updatedLikesArray: string[];
        let CreateOrDeleteLikeInput: CreateOrDeleteLikeInput = {
          postId,
          userId: authUser.id,
        };
        console.log("likeInput", CreateOrDeleteLikeInput);
        console.log(!authUser.likes?.includes(postId));
        if (!authUser.likes?.includes(postId)) {
          const createLikeResponse = await axios.post(
            `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
            {
              query: print(CREATE_LIKE_MUTATION),
              variables: { CreateOrDeleteLikeInput },
            },
            {
              headers: {
                authorization: authUser.jwt,
              },
            },
          );

          const createLikeResult = await createLikeResponse.data.data
            .createLike;
          console.log("createLikeResult", createLikeResult);
          console.log("--------------------");
          updatedLikesArray = [postId, ...(authUser.likes || [])];
        } else {
          flag = false;
          const deleteLikeResponse = await axios.post(
            `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
            {
              query: print(DELETE_LIKE_MUTATION),
              variables: { CreateOrDeleteLikeInput },
            },
            {
              headers: {
                authorization: authUser.jwt,
              },
            },
          );

          const deleteLikeResult = await deleteLikeResponse.data.data;

          console.log("deleteLikeResult", deleteLikeResult);
          console.log("--------------------");
          updatedLikesArray =
            authUser.likes?.filter((likedPost) => likedPost !== postId) || [];
        }
        console.log("updatedLikesArray", updatedLikesArray);

        setUser({
          ...authUser,
          likes: updatedLikesArray,
        });

        flag
          ? showToast("Success", "Like created successfully", "success")
          : showToast("Success", "Like deleted successfully", "success");
        return true;
      } catch (error: any) {
        showToast("Error", error.message, "error");
        return false;
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { isLoading, handleLikePost };
};

export default useLike;
