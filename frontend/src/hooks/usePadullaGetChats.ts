import { useState } from "react";
import useShowToast from "./useShowToast";
import useProfileStore from "../store/profileStore";
import {} from "../utils/wolverineRequests";
import axios from "axios";
import { print } from "graphql";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";
import useChatStore from "../store/chatStore";

const usePadullaGetChats = () => {
  const [isLoading, setIsLoading] = useState(false);

  const userProfile = useProfileStore((state) => state.userProfile);
  const authUser = useAuthStore((state) => state.user);
  const setChats = useChatStore((state) => state.setChats);
  const chats = useChatStore((state) => state.chats);
  const showToast = useShowToast();

  const getChats = async () => {
    if (!authUser) return;

    setIsLoading(true);
    //setChats([]);
    try {
      let chatsLen;

      const getChatsResponse = await axios.post(
        `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
        {
          query: print(),
          variables: {},
        },
        {
          headers: {
            authorization: authUser.jwt,
          },
        },
      );

      //   const getUserChatsResult = await getChatsResponse.data.data.something;
      //   console.log("getUserChatsResult", getUserChatsResult);
      console.log("--------------------");

      //   setChats(getUserChatsResult);
      //   chatsLen = getUserChatsResult.length;

      //   if (chatsLen <= 0) {
      //     showToast("Error", "User doesn't exist or has no posts", "error");
      //     return;
      //   }

      // posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error: any) {
      console.log(error);
      showToast("Error", error.message, "error");
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getChats };
};

export default usePadullaGetChats;
