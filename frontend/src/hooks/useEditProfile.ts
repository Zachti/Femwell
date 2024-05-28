import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import axios from "axios";
import { print } from "graphql";
import {
  UPDATE_USER_MUTATION,
  UpdateUserInput,
} from "../utils/wolverineRequests";

const useEditProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const showToast = useShowToast();

  const editProfile = async (data: any, preflightFile: File | null) => {
    if (isUpdating || !authUser) return false;
    if (
      data.email === authUser.email &&
      data.username === authUser.username &&
      data.phone === authUser.phoneNumber &&
      !preflightFile
    ) {
      return false;
    }
    console.log(data, preflightFile);
    setIsUpdating(true);
    console.log(authUser.jwt);
    let URL = "";
    try {
      if (preflightFile) {
        const formData = new FormData();
        formData.append("file", preflightFile);
        formData.append("path", authUser.id);

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

      //   if (data.email !== authUser.email) {
      //     update email with vault and wolverine
      //   }

      if (
        data.username !== authUser.username ||
        data.phone !== authUser.phoneNumber ||
        URL
      ) {
        let updateUserInput: UpdateUserInput = {
          id: authUser.id,
          username: authUser.username,
        };
        if (authUser.username !== data.username) {
          updateUserInput.newUsername = data.username;
        }
        if (authUser.phoneNumber !== data.phone) {
          updateUserInput.phoneNumber = data.phone;
        }
        if (URL) {
          updateUserInput.profilePic = URL;
        }
        console.log("updateUserInput", updateUserInput);
        const updateUserResponse = await axios.post(
          `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
          {
            query: print(UPDATE_USER_MUTATION),
            variables: { updateUserInput },
          },
          {
            headers: {
              authorization: authUser.jwt,
            },
          },
        );

        const updateUserResult = await updateUserResponse.data;
        console.log("updatedUserResult", updateUserResult);
        console.log("--------------------");
      }

      // if all worked well create an updated user object and set it in the userstore
      const updatedUser = {
        ...authUser,
        email: authUser.email,
        username: data.username || authUser.username,
        phoneNumber: data.phone || authUser.phoneNumber,
        profilePic: URL || authUser.profilePic,
      };

      console.log("updatedUser", updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAuthUser(updatedUser);

      showToast("Success", "Profile updated successfully", "success");
      return true;
    } catch (error: any) {
      showToast("Error", error.message, "error");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, editProfile };
};

export default useEditProfile;
