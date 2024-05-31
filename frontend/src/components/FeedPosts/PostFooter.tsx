import {
  Box,
  Flex,
  InputGroup,
  Text,
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
import { Comment } from "../../models/comment.model";
import PostComment from "./PostComment";
import useLike from "../../hooks/useLike";
import useCreateComment from "../../hooks/useCreateComment";

interface PostFooterProps {
  likes: string[]; //will be array of userIDs who liked the post
  comments?: Comment[]; //will be array of comments
  postId: string;
}

const PostFooter: FC<PostFooterProps> = ({ likes, comments, postId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikes] = useState(likes.length);
  const { handleLikePost, isLoading } = useLike();
  const { handleCreateComment, isLoading: isLoadingComment } =
    useCreateComment();
  const [showComments, setShowComments] = useState(false);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(10);
  const [commentActive, setCommentActive] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const handleLike = async () => {
    const res = await handleLikePost(postId);
    if (res) {
      setLiked(!liked);
      liked ? setLikes(likeCount - 1) : setLikes(likeCount + 1);
    }
  };
  const handleComment = () => {
    setCommentActive(!commentActive);
    setShowEmojiPicker(false);
  };

  const postComment = async () => {
    if (inputValue.length > 0) {
      const res = await handleCreateComment({ postId, content: inputValue });
      if (res) {
        setInputValue("");
      }
    }
  };

  const addEmoji = (emoji: string) => {
    setInputValue(inputValue + emoji);
  };

  const handleShowMoreComments = () => {
    setVisibleCommentsCount(visibleCommentsCount + 10);
  };

  return (
    <>
      <Flex alignItems={"center"} gap={4} w={"full"} pt={0} mt={2}>
        <Box
          onClick={isLoading ? undefined : handleLike}
          cursor={"pointer"}
          fontSize={20}
        >
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
        <Text
          _hover={{ color: "pink.200" }}
          cursor={"pointer"}
          onClick={() => {
            if (comments && comments?.length > 0)
              setShowComments(!showComments);
          }}
        >
          {`View all comments (${comments?.length})`}
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
              onClick={postComment}
              isLoading={isLoadingComment}
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
              className="msg-box"
              onChange={(e) => setInputValue(e.target.value)}
            />
          </InputGroup>
        </Flex>
      )}

      {showEmojiPicker ? <EmojiPicker Func={addEmoji} /> : null}

      <Flex w={"full"} direction={"column"} gap={3} pt={showComments ? 3 : 0}>
        {showComments &&
          comments
            ?.slice(0, visibleCommentsCount)
            .map((comment) => (
              <PostComment key={comment.id} comment={comment} />
            ))}

        {showComments &&
          comments &&
          comments?.length > visibleCommentsCount && (
            <Text
              _hover={{ color: "pink.200" }}
              cursor={"pointer"}
              onClick={handleShowMoreComments}
            >
              Show more comments...
            </Text>
          )}
      </Flex>
    </>
  );
};

export default PostFooter;
