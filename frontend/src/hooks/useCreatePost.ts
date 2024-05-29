import { useState } from "react";
import useShowToast from "./useShowToast";
import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../firebase/firebase";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";
import { useLocation } from "react-router-dom";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { PostInput } from "../models/postInput.model";

const useCreatePost = () => {
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const createPost = usePostStore((state) => state.createPost);
  const showToast = useShowToast();

  const { pathname } = useLocation();

  const handleCreatePost = async (post: PostInput) => {
    if (isLoadingPost) return;
    if (post && post.content.length > 0 && authUser) {
      setIsLoadingPost(true);
      const newPost = {
        imageURL: "",
        content: post.content,
        username: post.username,
        createdAt: Timestamp.now(),
        createdBy: authUser.id,
        likes: 0,
        comments: [],
      };

      try {
        const postDocRef = await addDoc(
          collection(firestore, "posts"),
          newPost,
        );
        const userDocRef = doc(firestore, "users", authUser.id);
        if (post.imageURL) {
          const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
          await uploadString(imageRef, post.imageURL, "data_url");
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(postDocRef, { imageURL: downloadURL });
          newPost.imageURL = downloadURL;
        }
        await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });

        createPost({
          ...newPost,
          id: postDocRef.id,
          profilePic: post.username === "Anonymous" ? "" : authUser.profilePic,
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
