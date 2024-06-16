import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";
import { PostInput } from "../models/postInput.model";
import { v4 as uuidv4 } from "uuid";
import {
  CREATE_POST_MUTATION,
  CreatePostInput,
} from "../utils/wolverineRequests";
import axios from "axios";
import { print } from "graphql";

const useCreatePost = () => {
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const createPost = usePostStore((state) => state.createPost);
  // const posts = usePostStore((state) => state.posts);
  const setUser = useAuthStore((state) => state.setUser);
  const showToast = useShowToast();

  const handleCreatePost = async (post: PostInput) => {
    if (isLoadingPost) return;
    if (post && post.content.length > 0 && authUser) {
      setIsLoadingPost(true);

      try {
        let URL = "";
        const postId = uuidv4();
        if (post.imageUrl) {
          const formData = new FormData();
          formData.append("file", post.imageUrl);
          formData.append("path", `PostImages/${postId}`);

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

        let createPostInput: CreatePostInput = {
          id: postId,
          userId: authUser.id,
          content: post.content,
          imageUrl: URL,
          isAnonymous: post.isAnonymous,
        };
        console.log("createPostInput", createPostInput);
        const createPostResponse = await axios.post(
          `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
          {
            query: print(CREATE_POST_MUTATION),
            variables: { createPostInput },
          },
          {
            headers: {
              authorization: authUser.jwt,
            },
          },
        );

        const createPostResult = await createPostResponse.data.data.createPost;
        console.log("createPostResult", createPostResult);
        console.log("--------------------");

        const newPost = {
          id: createPostResult.id,
          imageUrl: URL || "",
          content: post.content,
          user: {
            username: post.username,
            profilePic: createPostResult.isAnonymous ? "" : authUser.profilePic,
          },
          userId: authUser.id,
          createdAt: createPostResult.createdAt,
          likes: [],
          comments: [],
          isAnonymous: createPostResult.isAnonymous,
        };

        console.log("newPost", newPost);

        createPost(newPost);
        setUser({
          ...authUser,
          posts: [createPostResult.id, ...(authUser.posts || [])],
        });

        setIsLoadingPost(false);
        showToast("Success", "Post created successfully", "success");
      } catch (error: any) {
        showToast("Error", error.message, "error");
        setIsLoadingPost(false);
      }
    }
  };

  return { isLoadingPost, handleCreatePost };
};

export default useCreatePost;
