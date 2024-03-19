import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";
import userAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { User } from "../models/user.model";

const useLogin = () => {
  const [signInWithEmailAndPassword, , isLoggingIn, errorLI] =
    useSignInWithEmailAndPassword(auth);
  const showToast = useShowToast();
  const loginUser = userAuthStore((state) => state.login);
  const login = async (data: any) => {
    if (!data.email || !data.password) {
      showToast("Error", "Please enter all the fields", "error");
      return false;
    }
    try {
      const userCred = await signInWithEmailAndPassword(
        data.email,
        data.password,
      );
      if (userCred) {
        const docRef = doc(firestore, "users", userCred.user.uid);
        const docSnap = await getDoc(docRef);
        const userDoc = docSnap.data() as User;
        localStorage.setItem("user", JSON.stringify(userDoc));
        loginUser(userDoc);
        showToast("Success", "Logged in successfully", "success");
        return true;
      } else {
        showToast("Error", "Failed to login", "error");
        return false;
      }
    } catch (error: any) {
      showToast("Error", error.message, "error");
      return false;
    }
  };
  return { login, isLoggingIn, errorLI };
};

export default useLogin;
