import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";
import { useLocation } from "react-router-dom";
import {
  CREATE_COMMENT_MUTATION,
  CreateCommentInput,
} from "../utils/wolverineRequests";
import axios from "axios";
import { print } from "graphql";

const useCreateComment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const createComment = usePostStore((state) => state.createComment);
  const showToast = useShowToast();

  const handleCreateComment = async (data: any) => {
    if (isLoading) return;
    if (data.postId && data.content.length > 0 && authUser) {
      setIsLoading(true);

      try {
        const createCommentInput: CreateCommentInput = {
          userId: authUser.id,
          postId: data.postId,
          content: data.content,
        };
        console.log("createCommentInput", createCommentInput);
        const createCommentResponse = await axios.post(
          `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
          {
            query: print(CREATE_COMMENT_MUTATION),
            variables: { createCommentInput },
          },
          {
            headers: {
              authorization: authUser.jwt,
            },
          },
        );

        const createCommentResult = await createCommentResponse.data;
        console.log("createCommentResult", createCommentResult);
        console.log("--------------------");

        const newComment = {
          id: createCommentResult.id,
          userId: authUser.id,
          user: {
            username: createCommentResult.user.username,
            profilePic: createCommentResult.user.username || "",
          },
          content: createCommentResult.content,
        };

        console.log("newComment", newComment);

        createComment(newComment, data.postId);

        setIsLoading(false);
        showToast("Success", "Post created successfully", "success");
        return true;
      } catch (error: any) {
        showToast("Error", error.message, "error");
        setIsLoading(false);
        return false;
      }
    }
  };

  return { isLoading, handleCreateComment };
};

export default useCreateComment;
