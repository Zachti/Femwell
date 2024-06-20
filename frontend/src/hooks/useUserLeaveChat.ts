import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { DELETE_LIVE_CHAT_MUTATION } from "../utils/wolverineRequests";
import axios from "axios";
import { print } from "graphql";
import useChatStore from "../store/chatStore";

const useUserLeaveChat = () => {
  const [isLoadingLeave, setIsLoadingLeave] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const setChats = useChatStore((state) => state.setChats);
  const showToast = useShowToast();

  const handleLeaveChat = async (chatId: number) => {
    if (isLoadingLeave || !chatId || !authUser) return;

    setIsLoadingLeave(true);

    try {
      const leaveChatResponse = await axios.post(
        `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
        {
          query: print(DELETE_LIVE_CHAT_MUTATION),
          variables: { liveChatId: chatId },
        },
        {
          headers: {
            authorization: authUser.jwt,
          },
        },
      );

      const leaveChatResult = await leaveChatResponse.data;
      console.log("leaveChatResult", leaveChatResult);
      console.log("--------------------");

      setChats([]);

      setIsLoadingLeave(false);
      showToast("Success", "Left chat successfully", "success");
    } catch (error: any) {
      showToast("Error", error.message, "error");
      setIsLoadingLeave(false);
    }
  };

  return { isLoadingLeave, handleLeaveChat };
};

export default useUserLeaveChat;
