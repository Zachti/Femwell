import {
  Box,
  Flex,
  InputGroup,
  Text,
  Input,
  InputRightElement,
  Button,
  IconButton,
  Textarea,
} from "@chakra-ui/react";
import {
  faComment,
  faHeart,
  faSmile,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as filledHeart,
  faComment as filledComment,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState } from "react";
import EmojiPicker from "../EmojiPicker";

interface PostFooterProps {
  likes: number;
}

const PostFooter: FC<PostFooterProps> = ({ likes }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikes] = useState(likes);
  const [commentActive, setCommentActive] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const handleLike = () => {
    setLiked(!liked);
    liked ? setLikes(likeCount - 1) : setLikes(likeCount + 1);
  };
  const handleComment = () => {
    setCommentActive(!commentActive);
    setShowEmojiPicker(false);
  };
  const addEmoji = (emoji: string) => {
    setInputValue(inputValue + emoji);
  };

  return (
    <>
      <Flex alignItems={"center"} gap={4} w={"full"} pt={0} mt={2}>
        <Box onClick={handleLike} cursor={"pointer"} fontSize={20}>
          {!liked ? (
            <FontAwesomeIcon icon={faHeart} />
          ) : (
            <FontAwesomeIcon
              color={"var(--strong-pink-color)"}
              icon={filledHeart}
            />
          )}
        </Box>
        <Box onClick={handleComment} cursor={"pointer"} fontSize={20}>
          {!commentActive ? (
            <FontAwesomeIcon icon={faComment} />
          ) : (
            <FontAwesomeIcon
              color={"var(--strong-pink-color)"}
              icon={filledComment}
            />
          )}
        </Box>
        <Text fontWeight={600} fontSize={"sm"}>
          {likeCount} likes
        </Text>
      </Flex>

      <Flex
        mt={commentActive ? 0 : 2}
        alignItems={"center"}
        justifyContent={"space-between"}
        w="full"
      >
        <Text _hover={{ color: "pink.200" }} cursor={"pointer"}>
          View all xxx comments
        </Text>

        {commentActive && (
          <Flex>
            <IconButton
              aria-label="Emoji"
              variant="ghost"
              color="pink.200"
              _hover={{ bg: "transparent", color: "white" }}
              icon={<FontAwesomeIcon icon={faSmile} />}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              mr={-2}
            />
            <Button
              variant={"ghost"}
              color="pink.200"
              cursor={"pointer"}
              _hover={{ bg: "transparent", color: "white" }}
              mr={-2}
            >
              Post
            </Button>
          </Flex>
        )}
      </Flex>

      {commentActive && (
        <Flex alignItems={"center"} w="full">
          <InputGroup>
            <Textarea
              focusBorderColor={"pink.200"}
              variant={"flushed"}
              placeholder={"Write a comment..."}
              fontSize={16}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </InputGroup>
        </Flex>
      )}

      {showEmojiPicker ? <EmojiPicker Func={addEmoji} /> : null}
    </>
  );
};

export default PostFooter;
