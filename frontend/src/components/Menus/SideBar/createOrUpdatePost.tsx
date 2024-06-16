import {
  Button,
  Image,
  Text,
  Checkbox,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Box,
} from "@chakra-ui/react";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useEffect, useRef, useState } from "react";
import EmojiPicker from "../../EmojiPicker";
import useAuthStore from "../../../store/authStore";
import usePreviewImg from "../../../hooks/usePreviewImg";
import useCreatePost from "../../../hooks/useCreatePost";
import { CloseIcon } from "@chakra-ui/icons";
import useEditPost from "../../../hooks/useEditPost";

interface createOrUpdatePostProps {
  isWinOpen: boolean;
  onWinOpen: () => void;
  onWinClose: () => void;
  mode: "create" | "update";
  userId?: string;
  content?: string;
  imageUrl?: string;
  postId?: string;
}

const createOrUpdatePost: FC<createOrUpdatePostProps> = ({
  isWinOpen,
  onWinClose,
  mode,
  userId,
  content,
  imageUrl,
  postId,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [removedImage, setRemovedImage] = useState(false);
  const [postText, setPostText] = useState("");
  const [isAnon, setIsAnon] = useState(false);

  const authUser = useAuthStore((state) => state.user);
  const imageRef = useRef<HTMLInputElement>(null);

  const {
    selectedFile,
    setSelectedFile,
    handleImageChange,
    preflightFile,
    setPreflightFile,
  } = usePreviewImg();
  const { handleCreatePost, isLoadingPost } = useCreatePost();
  const { handleEditPost, isLoadingEdit } = useEditPost();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.currentTarget.value);
    setCursorPosition(e.target.selectionStart);
  };
  const handleCursorClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };
  const addEmoji = (emoji: string) => {
    const textBeforeCursor = postText.substring(0, cursorPosition);
    const textAfterCursor = postText.substring(cursorPosition);
    setPostText(textBeforeCursor + emoji + textAfterCursor);
    setCursorPosition(cursorPosition + emoji.length);
  };

  useEffect(() => {
    content ? setPostText(content) : "";
  }, []);

  const handlePostCreation = async () => {
    if (authUser && postText !== "") {
      const postUsername = isAnon ? "Anonymous" : authUser?.username;
      await handleCreatePost({
        content: postText,
        imageUrl: preflightFile,
        username: postUsername,
        isAnonymous: isAnon,
      });
      setSelectedFile(null);
      setPreflightFile(null);
      setPostText("");
      onWinClose();
      setIsAnon(false);
    }
  };

  const handlePostUpdate = async () => {
    if (authUser && postText !== "") {
      await handleEditPost(
        {
          content: postText,
          imageUrl: preflightFile
            ? preflightFile
            : removedImage
            ? null
            : imageUrl,
          deleteImage: removedImage,
        },
        {
          content,
          imageUrl,
          postId,
          userId,
        },
      );
      onWinClose();
    }
  };

  const handRemoveImage = () => {
    setRemovedImage(true);
    setSelectedFile(null);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (mode === "create") {
      handlePostCreation();
    } else if (mode === "update") {
      handlePostUpdate();
    }
  };

  return (
    <>
      <Modal
        preserveScrollBarGap
        isOpen={isWinOpen}
        onClose={() => {
          onWinClose();
          setSelectedFile(null);
          setRemovedImage(false);
          setShowEmojiPicker(false);
          setPostText(content ? content : "");
        }}
        motionPreset="slideInLeft"
      >
        <ModalOverlay />
        <ModalContent maxW={"400px"} bgColor={"var(--quaternary-color)"}>
          <ModalHeader>
            {mode === "create" ? "Create New Post" : "Update Post"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {(selectedFile || imageUrl) && !removedImage && (
              <Box position="relative">
                <Image
                  maxH={"450px"}
                  width={"full"}
                  borderTopLeftRadius={4}
                  borderTopRightRadius={4}
                  objectFit={"cover"}
                  src={selectedFile ? selectedFile : imageUrl}
                  alt="post image"
                />
                <IconButton
                  icon={<CloseIcon />}
                  colorScheme="blackAlpha"
                  size="sm"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={handRemoveImage}
                  aria-label={"remove-image"}
                />
              </Box>
            )}
            <Textarea
              ref={textAreaRef}
              placeholder="What are you thinking about?"
              size="sm"
              resize="none"
              focusBorderColor="pink.500"
              className="msg-box"
              mt={2}
              value={postText}
              onChange={handleTextChange}
              onClick={handleCursorClick}
            />
            <Input
              type="file"
              hidden
              ref={imageRef}
              onChange={(e) => {
                setRemovedImage(false);
                handleImageChange(e);
              }}
            />
            <IconButton
              aria-label="Upload Image"
              variant="ghost"
              _hover={{ bg: "transparent", color: "white" }}
              icon={<FontAwesomeIcon icon={faImage} />}
              onClick={() => {
                imageRef.current ? imageRef.current.click() : null;
              }}
              colorScheme="pink"
              mt={2}
            />
            <IconButton
              aria-label="Emoji"
              variant="ghost"
              color="pink.200"
              _hover={{ bg: "transparent", color: "white" }}
              icon={<FontAwesomeIcon icon={faSmile} />}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              mt={2}
            />
            {showEmojiPicker ? <EmojiPicker Func={addEmoji} /> : null}
          </ModalBody>
          <ModalFooter
            justifyContent={mode === "create" ? "space-between" : "flex-end"}
          >
            {mode === "create" && (
              <Checkbox
                colorScheme={"pink"}
                onChange={(e) => setIsAnon(e.target.checked)}
              >
                <Text color={"var(--dim-color)"}>Post Anonymously?</Text>
              </Checkbox>
            )}
            <Button
              colorScheme="pink"
              onClick={() => {
                handleClick();
              }}
              isLoading={mode === "create" ? isLoadingPost : isLoadingEdit}
            >
              {mode === "create" ? `Post` : `Update`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default createOrUpdatePost;
