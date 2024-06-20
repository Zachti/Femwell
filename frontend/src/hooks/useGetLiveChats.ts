import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { GET_CHATS_FOR_PADULLA } from "../utils/wolverineRequests";
import axios from "axios";
import { print } from "graphql";
import useChatStore from "../store/chatStore";

const useGetLiveChats = () => {
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const setChats = useChatStore((state) => state.setChats);
  // const chats = useChatStore((state) => state.chats);
  const showToast = useShowToast();

  const handleGetChats = async () => {
    if (isLoadingChats || !authUser || authUser?.role !== "Padulla") return;
    setIsLoadingChats(true);

    try {
      const getChatsResponse = await axios.post(
        `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
        {
          query: print(GET_CHATS_FOR_PADULLA),
          variables: { userId: authUser.id },
        },
        {
          headers: {
            authorization: authUser.jwt,
          },
        },
      );
      const getChatsResult = await getChatsResponse.data.data
        .getLiveChatsForPadulla;
      console.log("getChatsResult", getChatsResult);
      console.log("--------------------");

      setChats(getChatsResult);

      setIsLoadingChats(false);
      showToast("Success", "Chat Fetched successfully", "success");
    } catch (error: any) {
      showToast("Error", error.message, "error");
      setIsLoadingChats(false);
    }
  };

  return { isLoadingChats, handleGetChats };
};

export default useGetLiveChats;

// import { useState } from "react";
// import useShowToast from "./useShowToast";
// import useAuthStore from "../store/authStore";
// import {
//   GET_CHATS_FOR_PADULLA,
//   GET_LIVE_CHAT_QUERY,
// } from "../utils/wolverineRequests";
// import axios from "axios";
// import { print } from "graphql";
// import useChatStore from "../store/chatStore";

// const useGetLiveChats = () => {
//   const [isLoadingChats, setIsLoadingChats] = useState(false);
//   const authUser = useAuthStore((state) => state.user);
//   const setChats = useChatStore((state) => state.setChats);
//   // const chats = useChatStore((state) => state.chats);
//   const showToast = useShowToast();

//   const handleGetChats = async () => {
//     if (isLoadingChats || !authUser || authUser?.role !== "Padulla") return;
//     setIsLoadingChats(true);

//     try {
//       const getChatsResponse = await axios.post(
//         `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
//         {
//           query: print(GET_LIVE_CHAT_QUERY),
//           variables: { liveChatId: 22 },
//         },
//         {
//           headers: {
//             authorization: authUser.jwt,
//           },
//         },
//       );
//       const getChatsResult = await getChatsResponse.data.data.getLiveChat;
//       console.log("getChatsResult", getChatsResult);
//       console.log("--------------------");
//       setChats([getChatsResult]);

//       setIsLoadingChats(false);
//       showToast("Success", "Chat Fetched successfully", "success");
//     } catch (error: any) {
//       showToast("Error", error.message, "error");
//       setIsLoadingChats(false);
//       setChats([]);
//     }
//   };

//   return { isLoadingChats, handleGetChats };
// };

// export default useGetLiveChats;
