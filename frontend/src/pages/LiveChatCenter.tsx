import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Tabs,
  useMediaQuery,
  Avatar,
  Skeleton,
  useColorModeValue,
  AvatarBadge,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { ChatMsg } from "../models";
// import { faMessage } from "@fortawesome/free-solid-svg-icons";

import ChatInterface from "../components/ChatInterface";
import { AvatarProps } from "../models/avatarProps.model";
import useChatStore from "../store/chatStore";
import useGetLiveChats from "../hooks/useGetLiveChats";
import useCreateChatMessage from "../hooks/useCreateChatMessage";
import usePadullaJoinChat from "../hooks/usePadullaJoinChat";

const LiveChatCenter: FC<{}> = () => {
  const [isLargerThan650] = useMediaQuery("(min-width: 650px)");
  const [isLargerThan930] = useMediaQuery("(min-width: 930px)");

  const [tabIndex, setTabIndex] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [avatars, setAvatars] = useState<AvatarProps[]>([
    { username: "a" },
    { username: "b" },
    { username: "c" },
    { username: "d" },
    { username: "e" },
    { username: "f" },
    { username: "g" },
    { username: "h" },
    { username: "i" },
    { username: "j" },
  ]);

  const authUser = useAuthStore((state) => state.user);
  const { handleGetChats } = useGetLiveChats();
  const { handleJoinChat } = usePadullaJoinChat();
  const { handleCreateChatMessage } = useCreateChatMessage();
  const chats = useChatStore((state) => state.chats);

  const panelBackgoundColor = useColorModeValue("white", "#533142");

  const [isLoading, setIsLoading] = useState(true);

  const handleSelectUser = async (username: string, chatId: number) => {
    addPadullaToChat(chatId);
    setSelectedUser(username);
    const newTabIndex = avatars.findIndex(
      (avatar) => avatar.username === username,
    );
    setTabIndex(newTabIndex);
  };

  const addPadullaToChat = async (chatId: number) => {
    const chat = chats.find((chat) => chat.id === chatId);
    if (chat && !chat.users.some((user) => user.id === authUser?.id)) {
      console.log(!chat.users.some((user) => user.id === authUser?.id));
      await handleJoinChat(chatId);
    }
  };
  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  const addMessage = async (data: any) => {
    await handleCreateChatMessage(data);
  };

  useEffect(() => {
    const fetchChats = async () => {
      await handleGetChats();
    };

    fetchChats();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      const newAvatars: AvatarProps[] = chats.map((chat) => ({
        username: chat.users[chat.users.length - 1].username,
        profilePic: chat.users[chat.users.length - 1].profilePic,
      }));
      setAvatars(newAvatars);
      setSelectedUser(chats[0].users[chats[0].users.length - 1].username);
      addPadullaToChat(chats[0].id);
    }
  }, [chats]);

  return (
    <div className="page">
      <Box
        p={isLargerThan650 ? 5 : 0}
        maxWidth={isLargerThan930 ? "1400px" : "100%"}
        mx="auto"
      >
        <Skeleton fadeDuration={1} isLoaded={!isLoading}>
          <Tabs
            orientation={isLargerThan650 ? "vertical" : "horizontal"}
            ml={isLargerThan930 ? 20 : isLargerThan650 ? 6 : ""}
            mr={isLargerThan930 ? 20 : isLargerThan650 ? 6 : ""}
            width={isLargerThan650 ? "" : "100%"}
            colorScheme="green"
            index={tabIndex}
            onChange={handleTabChange}
          >
            <TabList
              hidden={!isLargerThan650}
              justifyContent={isLargerThan650 ? "start" : "center"}
              bgColor={panelBackgoundColor}
              borderRadius={5}
              whiteSpace={isLargerThan650 ? "nowrap" : "normal"}
              minWidth={"200px"}
            >
              {chats.map((chat, index) => (
                <Tab py={4} key={chat.id}>
                  {" "}
                  <Avatar size={"sm"} mr={3} src={avatars[index].profilePic}>
                    <AvatarBadge boxSize="1.25em" bg="green.500" />
                  </Avatar>
                  <Text>{`Chat with ${avatars[index].username}`}</Text>
                </Tab>
              ))}

              {/* <Tab py={4}>
                <Box position="relative" display="inline-block">
                  <Avatar size={"sm"} mr={3}>
                    <AvatarBadge boxSize="1.25em" bg="green.500" />
                  </Avatar>
                  <Box position="absolute" top="-2" right="0">
                    <FontAwesomeIcon icon={faMessage} color="crimson" />
                  </Box>
                </Box>
                Chat with A
              </Tab> */}
            </TabList>

            <TabPanels
              ml={isLargerThan650 ? 5 : 0}
              bgColor={panelBackgoundColor}
              borderRadius={5}
              minHeight={isLargerThan650 ? "85vh" : "100vh"}
            >
              {chats.map((chat, index) => (
                <TabPanel
                  key={chat.id}
                  display={"flex"}
                  h={"100%"}
                  position={"relative"}
                >
                  <ChatInterface
                    chat={chat}
                    user={avatars[index].username}
                    avatars={avatars}
                    selectedUser={selectedUser}
                    handleSelectUser={handleSelectUser}
                    addMessage={addMessage}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Skeleton>
      </Box>
    </div>
  );
};

export default LiveChatCenter;
