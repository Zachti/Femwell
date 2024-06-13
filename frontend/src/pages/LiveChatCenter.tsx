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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatMsg } from "../models";
import { faMessage } from "@fortawesome/free-solid-svg-icons";

import ChatInterface from "../components/ChatInterface";
import { AvatarProps } from "../models/avatarProps.model";
import useChatStore from "../store/chatStore";

const messages1: ChatMsg[] = [
  {
    username: "User1",
    userId: "1",
    content: "Hello, this is a message from User1",
    seen: false,
  },
  {
    username: "You",
    userId: "1",
    content: "Hello, this is a message to User1",
    seen: false,
  },
];

const messages2: ChatMsg[] = [
  {
    username: "User2",
    userId: "1",
    content: "Hello, this is a message from User2",
    seen: false,
  },
  {
    username: "You",
    userId: "1",
    content: "Hello, this is a message to User2",
    seen: false,
  },
];

const LiveChatCenter: FC<{}> = () => {
  const [isLargerThan650] = useMediaQuery("(min-width: 650px)");
  const [isLargerThan930] = useMediaQuery("(min-width: 930px)");
  const [chats, setChats] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [avatars, setAvatars] = useState<AvatarProps[]>([
    { name: "a" },
    { name: "b" },
    { name: "c" },
    { name: "d" },
    { name: "e" },
    { name: "f" },
    { name: "g" },
    { name: "h" },
    { name: "i" },
    { name: "j" },
  ]);

  const authUser = useAuthStore((state) => state.user);
  // const chats = useChatStore((state) => state.chats);
  const panelBackgoundColor = useColorModeValue("white", "#533142");

  const [isLoading, setIsLoading] = useState(true);

  const handleSelectUser = (username: string) => {
    setSelectedUser(username);
    const newTabIndex = avatars.findIndex((avatar) => avatar.name === username);
    setTabIndex(newTabIndex);
  };

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  useEffect(() => {
    console.log("fetching chats...");
    let isCancelled = false;

    const fetchChats = async () => {
      // const chatData = await handleCreateChat();
      // if (!isCancelled && chatData) {
      //   setChatId(chatData.id);
      //   setMessages(chatData.messages);
      // }
    };

    fetchChats();
    setIsLoading(false);
    return () => {
      isCancelled = true;
    };
  }, []);

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
              {/* {chats.map((chat) => (
                <Tab py={4} key={chat.id}>chat with someone</Tab>
              ))} */}

              <Tab py={4}>
                <Box position="relative" display="inline-block">
                  <Avatar size={"sm"} mr={3}>
                    <AvatarBadge boxSize="1.25em" bg="green.500" />
                  </Avatar>
                  <Box position="absolute" top="-2" right="0">
                    <FontAwesomeIcon icon={faMessage} color="crimson" />
                  </Box>
                </Box>
                Chat with A
              </Tab>
              <Tab py={4}>
                {" "}
                <Avatar size={"sm"} mr={3}>
                  <AvatarBadge boxSize="1.25em" bg="green.500" />
                </Avatar>
                <Text>Chat with B</Text>
              </Tab>
              <Tab py={4}>
                {" "}
                <Avatar size={"sm"} mr={3}>
                  <AvatarBadge boxSize="1.25em" bg="green.500" />
                </Avatar>
                Chat with C
              </Tab>
            </TabList>

            <TabPanels
              ml={isLargerThan650 ? 5 : 0}
              bgColor={panelBackgoundColor}
              borderRadius={5}
              minHeight={isLargerThan650 ? "85vh" : "100vh"}
            >
              <TabPanel display={"flex"} h={"100%"} position={"relative"}>
                <ChatInterface
                  chatId={1}
                  user={"a"}
                  msgs={messages1}
                  avatars={avatars}
                  selectedUser={selectedUser}
                  handleSelectUser={handleSelectUser}
                />
              </TabPanel>

              <TabPanel display={"flex"} h={"100%"} position={"relative"}>
                <ChatInterface
                  chatId={2}
                  user={"b"}
                  msgs={messages2}
                  avatars={avatars}
                  selectedUser={selectedUser}
                  handleSelectUser={handleSelectUser}
                />
              </TabPanel>

              <TabPanel></TabPanel>
            </TabPanels>
          </Tabs>
        </Skeleton>
      </Box>
    </div>
  );
};

export default LiveChatCenter;
