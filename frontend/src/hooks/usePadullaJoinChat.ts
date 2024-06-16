import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { ADD_PADULLA_TO_LIVE_CHAT_MUTATION } from "../utils/wolverineRequests";
import axios from "axios";
import { print } from "graphql";
import useChatStore from "../store/chatStore";

const usePadullaJoinChat = () => {
  const [isLoadingJoinChat, setIsLoadingJoinChat] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const setChats = useChatStore((state) => state.setChats);
  const showToast = useShowToast();

  const handleJoinChat = async (liveChatId: number) => {
    if (isLoadingJoinChat || !authUser || authUser?.role !== "Padulla") return;
    console.log("joining chat...", liveChatId);
    setIsLoadingJoinChat(true);
    liveChatId = +liveChatId;
    try {
      const joinChatsResponse = await axios.post(
        `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
        {
          query: print(ADD_PADULLA_TO_LIVE_CHAT_MUTATION),
          variables: { liveChatId, userId: authUser.id },
        },
        {
          headers: {
            authorization: authUser.jwt,
          },
        },
      );

      const joinChatsResult = await joinChatsResponse.data.data
        .addPadullaToLiveChat;
      console.log("joinChatsResult", joinChatsResult);
      console.log("--------------------");

      setChats([joinChatsResult]);

      setIsLoadingJoinChat(false);
      showToast("Success", "Chat Joined successfully", "success");
    } catch (error: any) {
      showToast("Error", error.message, "error");
      setIsLoadingJoinChat(false);
    }
  };

  return { isLoadingJoinChat, handleJoinChat };
};

export default usePadullaJoinChat;
