import { useState } from "react";
import useShowToast from "./useShowToast";
import {
  arrayRemove,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../firebase/firebase";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";

import { deleteObject, ref } from "firebase/storage";

const useDeletePost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const deletePost = usePostStore((state) => state.deletePost);
  const showToast = useShowToast();

  const handleDeletePost = async (postId: string) => {
    if (isLoading) return;
    if (postId && authUser) {
      setIsLoading(true);

      try {
        const postDocRef = doc(firestore, "posts", postId);
        const postSnapshot = await getDoc(postDocRef);
        if (postSnapshot.exists()) {
          const postData = postSnapshot.data();

          if (postData?.createdBy !== authUser.id) {
            throw new Error("You are not authorized to delete this post");
          }

          if (postData?.imgURL) {
            const imageRef = ref(storage, `posts/${postId}/image`);
            await deleteObject(imageRef);
          }
          const userDocRef = doc(firestore, "users", authUser.id);
          await updateDoc(userDocRef, {
            posts: arrayRemove(postId),
          });
          await deleteDoc(postDocRef);
          deletePost(postId);
          showToast("Success", "Post deleted successfully", "success");
        }
      } catch (error: any) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { isLoading, handleDeletePost };
};

export default useDeletePost;
