import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Comment } from "../../models/comment.model";
import { FC } from "react";

interface CommentProps {
  comment: Comment;
}

const PostComment: FC<CommentProps> = ({ comment }) => {
  return (
    <Box
      key={comment.id}
      w={"full"}
      backgroundColor={"var(--strong-pink-color)"}
      borderRadius={5}
      boxShadow="lg"
    >
      <Flex
        p={2}
        justifyContent={"flex-start"}
        alignItems={"center"}
        fontSize={12}
        fontWeight={"bold"}
      >
        <Avatar
          name={comment.user.username}
          src={comment.user.profilePic ? comment.user.profilePic : ""}
          size={"xs"}
          bgColor={"pink.300"}
          color={"white"}
          mr={2}
        />
        {comment.user.username}
      </Flex>
      <Text px={2} pb={2}>
        {comment.content}
      </Text>
    </Box>
  );
};

export default PostComment;
