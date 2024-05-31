import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";
import {
  UPDATE_POST_MUTATION,
  UpdatePostInput,
} from "../utils/wolverineRequests";
import axios from "axios";
import { print } from "graphql";

const useEditPost = () => {
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const editPost = usePostStore((state) => state.editPost);
  const showToast = useShowToast();

  const handleEditPost = async (updatedPost: any, originalPost: any) => {
    if (isLoadingEdit || !authUser || !originalPost.postId) return;

    if (
      updatedPost.content === originalPost.content &&
      updatedPost.imageUrl === originalPost.imageUrl
    )
      return;

    setIsLoadingEdit(true);

    try {
      if (originalPost.userId !== authUser.id) {
        showToast("Error", "You are not authorized to edit this post", "error");
        return;
      }

      let URL = "";
      if (updatedPost.imageUrl) {
        const formData = new FormData();
        formData.append("file", updatedPost.imageUrl);
        formData.append("path", `PostImages/${originalPost.postId}`);

        const uploadResponse = await axios.post(
          `${import.meta.env.VITE_HEIMDALL_ENDPOINT}/upload`,
          formData,
          {
            headers: {
              authorization: authUser.jwt,
            },
          },
        );

        const uploadResult = await uploadResponse.data;
        console.log("uploadResult", uploadResult.id);
        console.log("--------------------");
        if (uploadResult.id) {
          URL = `${import.meta.env.VITE_S3_BUCKET_URL}/${uploadResult.id}`;
        }
      }

      let updatePostInput: UpdatePostInput = {
        id: originalPost.postId,
        userId: authUser.id,
        content: updatedPost.content,
        imageUrl: URL || originalPost.imageUrl,
        deleteImage: updatedPost.deleteImage,
      };
      console.log("updatePostInput", updatePostInput);
      const updatePostResponse = await axios.post(
        `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
        {
          query: print(UPDATE_POST_MUTATION),
          variables: { updatePostInput },
        },
        {
          headers: {
            authorization: authUser.jwt,
          },
        },
      );

      const updatePostResult = await updatePostResponse.data;
      console.log("updatePostResult", updatePostResult);
      console.log("--------------------");

      console.log("URL", URL);
      editPost(originalPost.postId, updatedPost.content, URL);
      showToast("Success", "Post editted successfully", "success");
    } catch (error: any) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoadingEdit(false);
    }
  };

  return { isLoadingEdit, handleEditPost };
};

export default useEditPost;
