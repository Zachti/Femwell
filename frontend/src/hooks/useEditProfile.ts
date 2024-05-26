import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firestore, storage } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";

const useEditProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const showToast = useShowToast();

  const editProfile = async (data: any, selectedFile: string | null) => {
    if (isUpdating || !authUser) return false;
    if (
      data.email === authUser.email &&
      data.username === authUser.username &&
      data.phone === authUser.phone &&
      data.profilePic === authUser.profilePic
    )
      return false;
    setIsUpdating(true);

    const storageRef = ref(storage, `profilePics/${authUser.id}`);
    const userDocRef = doc(firestore, "users", authUser.id);
    let URL = "";
    try {
      if (selectedFile) {
        await uploadString(storageRef, selectedFile, "data_url");
        URL = await getDownloadURL(storageRef);
      }

      const updatedUser = {
        ...authUser,
        email: authUser.email,
        username: data.username || authUser.username,
        phone: data.phone || authUser.phone,
        profilePic: URL || authUser.profilePic,
      };

      if (data.email !== authUser.email && auth.currentUser) {
        updateEmail(auth.currentUser, data.email)
          .then(() => {
            showToast(
              "Success",
              "Email address updated successfully",
              "success",
            );
          })
          .catch((error: any) => {
            showToast("Error", error.message, "error");
          });
      }

      await updateDoc(userDocRef, updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAuthUser(updatedUser);

      showToast("Success", "Profile updated successfully", "success");
      setIsUpdating(false);
      return true;
    } catch (error: any) {
      showToast("Error", error.message, "error");
      setIsUpdating(false);
      return false;
    }
  };

  return { isUpdating, editProfile };
};

export default useEditProfile;
