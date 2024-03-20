import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import userAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";

const useLogout = () => {
  const [signOut, isLoggingOut, errorLO] = useSignOut(auth);
  const showToast = useShowToast();
  const logoutUser = userAuthStore((state) => state.logout);
  const logout = async () => {
    try {
      await signOut();
      localStorage.removeItem("user");
      logoutUser();
    } catch (error) {
      console.error("Error signing out", error);
    }
  };
  return { logout, isLoggingOut, errorLO };
};

export default useLogout;
