import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../firebase/firebase";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";

const useEditPost = () => {
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const editPost = usePostStore((state) => state.editPost);
  const showToast = useShowToast();

  const handleEditPost = async (updatedPost: any, originalPost: any) => {
    if (isLoadingEdit || !authUser || !originalPost.postId) return;

    if (
      updatedPost.content === originalPost.content &&
      updatedPost.imgURL === originalPost.imgURL
    )
      return;

    setIsLoadingEdit(true);

    try {
      const postDocRef = doc(firestore, "posts", originalPost.postId);
      const postSnapshot = await getDoc(postDocRef);
      if (postSnapshot.exists()) {
        const postData = postSnapshot.data();

        if (postData?.createdBy !== authUser.id) {
          throw new Error("You are not authorized to edit this post");
        }

        if (updatedPost.imgURL !== originalPost.imgURL) {
          const imageRef = ref(storage, `posts/${originalPost.id}/image`);
          if (postData?.imgURL) await deleteObject(imageRef);

          if (updatedPost.imgURL) {
            await uploadString(imageRef, updatedPost.imgURL, "data_url");
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(postDocRef, {
              imgURL: downloadURL,
              content: updatedPost.content,
            });

            updatedPost.imgURL = downloadURL;
          } else {
            await updateDoc(postDocRef, {
              imgURL: null,
              content: updatedPost.content,
            });
          }
        } else {
          await updateDoc(postDocRef, {
            content: updatedPost.content,
          });
        }

        editPost(originalPost.postId, updatedPost.content, updatedPost.imgURL);
        showToast("Success", "Post editted successfully", "success");
      }
    } catch (error: any) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoadingEdit(false);
    }
  };

  return { isLoadingEdit, handleEditPost };
};

export default useEditPost;
