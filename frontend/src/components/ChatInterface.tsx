import {
  Box,
  Button,
  VStack,
  Text,
  useMediaQuery,
  Flex,
  Avatar,
  useColorModeValue,
  AvatarBadge,
  IconButton,
  Textarea,
  AvatarGroup,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPaperPlane,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import { FC, useEffect, useRef, useState } from "react";
import { Chat, ChatMsg } from "../models";
import { emojis } from "../utils/emojis";
import { Colors } from "../utils/colorsConstants";
import "../assets/App.css";
import { AvatarProps } from "../models/avatarProps.model";
import useCreateChatMessage from "../hooks/useCreateChatMessage";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import {
  NEW_MESSAGE_SUBSCRIPTION,
  USER_EXIT_LIVE_CHAT_SUBSCRIPTION,
} from "../utils/wolverineSubscriptions";
import { useSubscription } from "@apollo/client";

interface ChatProps {
  chat: Chat;
  chatId?: number;
  showEmojiPicker?: boolean;
  user: string;
  msgs?: ChatMsg[];
  avatars?: AvatarProps[];
  selectedUser?: string;
  handleSelectUser: (username: string, chatId: number) => void;
  addMessage: (data: any) => void;
}

const ChatInterface: FC<ChatProps> = ({
  chat,
  user,
  avatars,
  selectedUser,
  handleSelectUser,
  addMessage,
}) => {
  const [isLargerThan650] = useMediaQuery("(min-width: 650px)");
  const [messages, setMessages] = useState<ChatMsg[]>(chat.messages);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const bgColor = useColorModeValue("white", Colors.color5);
  const msgBgColor1 = useColorModeValue("pink.200", "pink.700");
  const msgBgColor2 = useColorModeValue("gray.200", "gray.500");

  // const chats = useChatStore((state) => state.chats);
  const createMessage = useChatStore((state) => state.createMessage);

  const {
    data: messageData,
    // loading: messageLoading,
    error: messageError,
  } = useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
    variables: { liveChatId: chat.id },
    skip: !chat.id,
  });

  const {
    data: exitData,
    // loading: exitLoading,
    error: exitError,
  } = useSubscription(USER_EXIT_LIVE_CHAT_SUBSCRIPTION, {
    variables: { liveChatId: chat.id },
    skip: !chat.id,
  });

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const authUser = useAuthStore((state) => state.user);
  const { isLoading } = useCreateChatMessage();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.currentTarget.value);
    setCursorPosition(e.target.selectionStart);
  };
  const handleCursorClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };
  const addEmoji = (emoji: string) => {
    const textBeforeCursor = inputValue.substring(0, cursorPosition);
    const textAfterCursor = inputValue.substring(cursorPosition);
    setInputValue(textBeforeCursor + emoji + textAfterCursor);
    setCursorPosition(cursorPosition + emoji.length);
  };

  //this will be different since there will be more than one chat
  //I probably need to create a chatStore...

  //this will later on be a hook ofc
  const onSendMessage = async () => {
    if (!(inputValue.trim() === "" || inputValue.length > 200)) {
      addMessage({ chatId: chat.id, content: inputValue });
      setInputValue("");
    }
  };

  useEffect(() => {
    console.log("something was received");
    if (messageData?.newMessage) {
      console.log("received message", messageData, messageError);
      const newMessage = {
        id: messageData?.newMessage.id,
        userId: messageData?.newMessage.user.id,
        username: messageData?.newMessage.user.username,
        content: messageData?.newMessage.content,
        seen: messageData?.newMessage.seen,
        createdAt: messageData?.newMessage.createdAt,
      };

      createMessage(newMessage, chat.id);
    }
  }, [messageData, messageError]);

  useEffect(() => {
    console.log("user has left");
    if (exitData?.newMessage) {
      console.log("user", exitData, messageError);
      //set the color of the user that left to gray
    }
  }, [exitData, exitError]);

  useEffect(() => {
    setMessages(chat.messages);
  }, [chat]);

  return (
    <Box
      w={"100%"}
      h={isLargerThan650 ? "80vh" : "85vh"}
      display={"flex"}
      flexDirection="column"
      justifyContent={"space-between"}
      flex="1"
    >
      <Flex
        align="center"
        p="1"
        pb="3"
        borderBottom="2px solid var(--secondary-color)"
        justifyContent="space-between"
      >
        <Flex alignItems={"center"}>
          <Avatar size="sm" name={user}>
            <AvatarBadge boxSize="1.25em" bg="green.500" />
          </Avatar>
          <Text ml="2">{user}</Text>
        </Flex>
        {avatars && !isLargerThan650 && (
          <AvatarGroup size="sm" max={10} spacing={"-4px"}>
            {avatars.map((avatar) => (
              <Avatar
                bg="gray"
                key={avatar.username}
                name={avatar.username}
                src={avatar.profilePic}
                cursor={"pointer"}
                onClick={() => {
                  handleSelectUser(avatar.username, chat.id);
                }}
                style={
                  avatar.username === selectedUser
                    ? { transform: "translateY(-10px)" }
                    : {}
                }
              />
            ))}
          </AvatarGroup>
        )}
      </Flex>

      <Flex
        className="msg-box"
        direction="column"
        overflowY="auto"
        px="3"
        py="2"
        flex="1" // Add this line
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            bg={
              msg.userId === authUser?.id ? `${msgBgColor1}` : `${msgBgColor2}`
            }
            alignSelf={msg.userId === authUser?.id ? "flex-start" : "flex-end"}
            borderRadius="lg"
            p="2"
            mt="2"
            maxW="80%"
          >
            <Text>{msg.content}</Text>
          </Box>
        ))}
      </Flex>

      <Flex
        as="footer"
        pt="2"
        pb="1"
        pr="2"
        pl="2"
        borderTop="2px solid var(--secondary-color)"
      />
      <VStack w="100%">
        <Textarea
          ref={textAreaRef}
          // isDisabled={isLoading}
          placeholder="Type a message"
          variant="filled"
          flex="1"
          ml="2"
          mr="2"
          minH="60px"
          resize="none"
          _focus={{
            borderColor: "var(--secondary-color)",
          }}
          value={inputValue}
          className="msg-box"
          onChange={handleTextChange}
          onClick={handleCursorClick}
        />
        <Flex justify="space-between" w="100%">
          <Flex>
            <IconButton
              aria-label="Emoji"
              // isDisabled={isLoading}
              variant="ghost"
              icon={<FontAwesomeIcon icon={faSmile} />}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            <Text
              mt={2}
              ml={2}
              color={inputValue.length > 200 ? "red" : ""}
            >{`${inputValue.length}/200`}</Text>
            {showEmojiPicker ? (
              <Box
                position="absolute"
                bottom="100px"
                zIndex="10"
                p={2}
                bg={`${bgColor}`}
                boxShadow="lg"
                borderRadius="md"
                right={"2"}
                left={"2"}
              >
                <Flex wrap="wrap">
                  {emojis.map((emoji) => (
                    <Button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      variant="ghost"
                      p={1}
                      fontSize="20px"
                    >
                      {emoji}
                    </Button>
                  ))}
                </Flex>
              </Box>
            ) : null}
          </Flex>
          <Flex>
            <Button
              aria-label="Unread"
              variant="ghost"
              leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
              ml="2"
              onClick={() => {}}
            >
              Mark Unread
            </Button>
            <Button
              aria-label="Send"
              variant="ghost"
              isLoading={isLoading}
              leftIcon={<FontAwesomeIcon icon={faPaperPlane} />}
              ml="2"
              onClick={() => {
                onSendMessage();
              }}
            >
              Send
            </Button>
          </Flex>
        </Flex>
      </VStack>
    </Box>
  );
};

export default ChatInterface;
