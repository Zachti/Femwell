import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import userAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { Response } from "../models/reponse.model";

const useSignupEmailPassword = () => {
  const [createUserWithEmailAndPassword, , isSigningUp, errorSU] =
    useCreateUserWithEmailAndPassword(auth);
  const showToast = useShowToast();
  const loginUser = userAuthStore((state) => state.login);
  const signup = async (data: any) => {
    console.log(data);
    if (
      !data.email ||
      !data.username ||
      !data.password ||
      !data.confirmPassword
    ) {
      showToast("Error", "Please enter all required fields", "error");
      return false;
    }
    try {
      const newUser = await createUserWithEmailAndPassword(
        data.email,
        data.password,
      );
      if (!newUser) {
        showToast("Error", "Email already in use", "error");
        return false;
      }
      if (newUser) {
        let dtoQuestionnaire = undefined;
        if (data.responses.some((response: Response) => response.answer)) {
          dtoQuestionnaire = {
            responses: data.responses,
            username: data.username,
            userId: newUser.user.uid,
          };
        }
        let userDoc: any = {
          id: newUser.user.uid,
          email: data.email,
          username: data.username,
          phone: data.phone,
          posts: [],
          pfpURL: "",
          laterArticles: [],
        };
        if (dtoQuestionnaire) userDoc.questionnaire = dtoQuestionnaire;
        await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
        localStorage.setItem("user", JSON.stringify(userDoc));
        loginUser(userDoc);
        showToast("Success", "Account created successfully", "success");
        return true;
      }
    } catch (error: any) {
      showToast("Error", error.message, "error");
      return false;
    }
  };
  return { signup, isSigningUp, errorSU };
};

export default useSignupEmailPassword;
