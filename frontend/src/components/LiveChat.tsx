import { FC, useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Textarea,
  IconButton,
  Button,
  useMediaQuery,
  Spinner,
  VStack,
  Slide,
  ScaleFade,
  Fade,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpRightAndDownLeftFromCenter,
  faDownLeftAndUpRightToCenter,
  faPaperPlane,
  faSmile,
  faPaperclip,
  faFilePdf,
  faFileImage,
} from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import "../index.css";
import { ChatMsg } from "../models/chatMsg.model";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { emojis } from "../utils/emojis";
import { MimeType } from "../utils/mimeTypes";

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveChat: FC<LiveChatProps> = ({ isOpen, onClose }) => {
  const [isLargerThan650] = useMediaQuery("(min-width: 650px)");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => {
          handleSndRcvMessage({
            sender: "them",
            message: "Hello there Zachary!",
          });
        }, 1000);
      }, 3000);
    }
  }, [isOpen]);

  const onExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSndRcvMessage = (msg: ChatMsg) => {
    setMessages([...messages, msg]);
  };

  const addEmoji = (emoji: string) => {
    setInputValue(inputValue + emoji);
  };

  const onSendMessage = (msg: ChatMsg) => {
    if (!(inputValue.trim() === "" || inputValue.length > 200)) {
      handleSndRcvMessage(msg);
      setInputValue("");
    }
  };

  const onFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && Object.values(MimeType).includes(file.type)) {
      setSelectedFile(file);
    }
  };

  const chat = (
    <Fade in={isOpen}>
      <Box
        position="fixed"
        right={isLargerThan650 ? "1rem" : "0"}
        bottom="1rem"
        top={isLargerThan650 ? "unset" : isExpanded ? "10vh" : "unset"}
        width={
          isLargerThan650
            ? isExpanded
              ? "450px"
              : "300px"
            : isExpanded
            ? "100%"
            : "300px"
        }
        height={
          isLargerThan650
            ? isExpanded
              ? "600px"
              : "400px"
            : isExpanded
            ? "90vh"
            : "400px"
        }
        bg="white"
        boxShadow="0 0 10px rgba(0, 0, 0, 0.35)"
        borderRadius={"10px"}
        zIndex="5"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Flex
          align="center"
          justify="space-between"
          p="3"
          pb="2"
          borderBottom="2px solid var(--secondary-color)"
        >
          {isLoading ? (
            <Spinner
              thickness="2px"
              speed="0.65s"
              emptyColor="gray.200"
              color="var(--secondary-color)"
              size="lg"
            />
          ) : (
            <Flex align="center">
              <Avatar
                size="sm"
                name="John Doe"
                bgColor="var(--secondary-color)"
                //   src="link"
              />
              <Text ml="2">John Doe</Text>
            </Flex>
          )}

          <Flex>
            <IconButton
              aria-label="Expand"
              variant="ghost"
              icon={
                isExpanded ? (
                  <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} />
                ) : (
                  <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
                )
              }
              onClick={onExpand}
            />

            <IconButton
              ml="1"
              variant="ghost"
              aria-label="Close"
              icon={<SmallCloseIcon />}
              onClick={() => {
                setIsLoading(true);
                onClose();
              }}
            />
          </Flex>
        </Flex>
        <Flex direction="column" overflowY="auto" px="3" py="2" flex="1">
          {messages.map((msg, index) => (
            <Box
              key={index}
              bg={msg.sender === "You" ? "pink.200" : "gray.200"}
              alignSelf={msg.sender === "You" ? "flex-start" : "flex-end"}
              borderRadius="lg"
              p="2"
              mt="2"
              maxW="70%"
            >
              <Text>{msg.message}</Text>
            </Box>
          ))}
        </Flex>
        <Flex
          as="footer"
          pt="3"
          pb="2"
          pr="2"
          pl="2"
          borderTop="2px solid var(--secondary-color)"
        >
          <VStack w="100%">
            <Textarea
              isDisabled={isLoading}
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
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Flex justify="space-between" width="100%">
              <Flex>
                <IconButton
                  aria-label="Emoji"
                  isDisabled={isLoading}
                  variant="ghost"
                  icon={<FontAwesomeIcon icon={faSmile} />}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={onFileChange}
                />
                <IconButton
                  aria-label="Attach file"
                  variant="ghost"
                  icon={<FontAwesomeIcon icon={faPaperclip} />}
                  ml="2"
                  onClick={onFileButtonClick}
                />
                {selectedFile && (
                  <IconButton
                    aria-label="Added file"
                    variant="ghost"
                    icon={
                      selectedFile.type === MimeType.PDF ? (
                        <FontAwesomeIcon icon={faFilePdf} />
                      ) : (
                        <FontAwesomeIcon icon={faFileImage} />
                      )
                    }
                    ml="2"
                    onClick={() => setSelectedFile(null)}
                  />
                )}
                {showEmojiPicker ? (
                  <Box
                    position="absolute"
                    bottom="60px"
                    right="0"
                    zIndex="10"
                    p={2}
                    bg="white"
                    boxShadow="lg"
                    borderRadius="md"
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
                <Text
                  mt={2}
                  mr={0}
                  color={inputValue.length > 200 ? "red" : "black"}
                >{`${inputValue.length}/200`}</Text>
                <Button
                  aria-label="Send"
                  variant="ghost"
                  leftIcon={<FontAwesomeIcon icon={faPaperPlane} />}
                  ml="2"
                  onClick={() => {
                    onSendMessage({ sender: "You", message: inputValue });
                  }}
                >
                  Send
                </Button>
              </Flex>
            </Flex>
          </VStack>
        </Flex>
      </Box>
    </Fade>
  );

  return createPortal(chat, document.body);
};

export default LiveChat;
