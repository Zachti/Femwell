// import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
// import { auth, firestore } from "../firebase/firebase";
// import { doc, setDoc } from "firebase/firestore";
// import { set } from "date-fns";
import userAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
// import { Response } from "../models/reponse.model";

// const useSignupEmailPassword = () => {
//   const [createUserWithEmailAndPassword, , isSigningUp, errorSU] =
//     useCreateUserWithEmailAndPassword(auth);
//   const showToast = useShowToast();
//   const loginUser = userAuthStore((state) => state.login);
//   const signup = async (data: any) => {
//     console.log(data);
//     if (
//       !data.email ||
//       !data.username ||
//       !data.password ||
//       !data.confirmPassword
//     ) {
//       showToast("Error", "Please enter all required fields", "error");
//       return false;
//     }
//     try {
//       const newUser = await createUserWithEmailAndPassword(
//         data.email,
//         data.password,
//       );
//       if (!newUser) {
//         showToast("Error", "Email already in use", "error");
//         return false;
//       }
//       if (newUser) {
//         let dtoQuestionnaire = undefined;
//         if (data.responses.some((response: Response) => response.answer)) {
//           dtoQuestionnaire = {
//             responses: data.responses,
//             username: data.username,
//             userId: newUser.user.uid,
//           };
//         }
//         let userDoc: any = {
//           id: newUser.user.uid,
//           email: data.email,
//           username: data.username,
//           phone: data.phone,
//           posts: [],
//           pfpURL: "",
//           laterArticles: [],
//         };
//         if (dtoQuestionnaire) userDoc.questionnaire = dtoQuestionnaire;
//         await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
//         localStorage.setItem("user", JSON.stringify(userDoc));
//         loginUser(userDoc);
//         showToast("Success", "Account created successfully", "success");
//         return true;
//       }
//     } catch (error: any) {
//       showToast("Error", error.message, "error");
//       return false;
//     }
//   };
//   return { signup, isSigningUp, errorSU };
// };

// export default useSignupEmailPassword;

import axios from "axios";
import { useEffect, useState } from "react";
import { print } from "graphql";
import {
  CONFIRM_USER_MUTATION,
  REGISTER_REQUEST_MUTATION,
} from "../utils/vaultRequests";
import { GET_USER_PROFILE_QUERY } from "../utils/wolverineRequests";

const useSignupEmailPassword = () => {
  const loginUser = userAuthStore((state) => state.login);
  const showToast = useShowToast();

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isConfirmingCode, setIsConfirmingCode] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showEmailVerifyPage, setShowEmailVerifyPage] = useState(false);

  const signup = async (data: any) => {
    if (
      !data.email ||
      !data.username ||
      !data.password ||
      !data.confirmPassword
    ) {
      showToast("Error", "Please enter all required fields", "error");
      return false;
    }
    setEmail(data.email);
    setPassword(data.password);
    setIsSigningUp(true);
    const registerRequest = {
      profileUsername: data.username,
      email: data.email,
      password: data.password,
      phoneNumber: data.phone || "",
    };
    console.log("registerRequest", registerRequest);
    try {
      const registerResponse = await axios.post(
        `${import.meta.env.VITE_VAULT_ENDPOINT}/graphql`,
        {
          query: print(REGISTER_REQUEST_MUTATION),
          variables: { registerRequest },
        },
      );

      if (registerResponse.status !== 200) {
        throw new Error("Failed to create user in vault");
      }

      setShowEmailVerifyPage(true);
      console.log("HERE", registerResponse.data);
    } catch (error: any) {
      showToast("Error", "User creation failed", "error");
      setShowEmailVerifyPage(false);
      setIsSigningUp(false);
      throw new Error(error.message);
    }
  };

  const handleVerification = async (code: string) => {
    setIsConfirmingCode(true);
    try {
      const confirmUserResponse = await axios.post(
        `${import.meta.env.VITE_VAULT_ENDPOINT}/graphql`,
        {
          query: print(CONFIRM_USER_MUTATION),
          variables: {
            confirmUserRequest: { code, email, password },
          },
        },
      );

      if (confirmUserResponse.status !== 200) {
        showToast("Error", "invalid code", "error");
        throw new Error("Failed to verify user in vault");
      }

      const confirmResult = await confirmUserResponse.data;

      const getUserResponse = await axios({
        method: "get",
        url: `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
        headers: {
          authorization: `Bearer ${confirmResult.jwt}`,
        },
        data: {
          query: print(GET_USER_PROFILE_QUERY),
          variables: {
            ID: { id: confirmResult.id },
          },
        },
      });

      if (getUserResponse.status !== 200) {
        throw new Error("Unexpected error");
      }

      const userResult = await getUserResponse.data;
      console.log(userResult);

      if (userResult) {
        localStorage.setItem("user", JSON.stringify(userResult));
        loginUser(userResult);
      }

      setShowEmailVerifyPage(false);
      return true;
    } catch (error: any) {
      showToast("Error", "User verification failed", "error");
      throw new Error(error.message);
    } finally {
      setIsSigningUp(false);
      setIsConfirmingCode(false);
      setShowEmailVerifyPage(false);
      return false;
    }
  };

  return {
    signup,
    isSigningUp,
    isConfirmingCode,
    showEmailVerifyPage,
    setShowEmailVerifyPage,
    handleVerification,
  };
};

export default useSignupEmailPassword;
