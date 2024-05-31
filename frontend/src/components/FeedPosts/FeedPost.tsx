import { FC, useEffect, useRef, useState } from "react";
import PostHeader from "./PostHeader";
import { Box, Image, Text, Flex, useMediaQuery } from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import { Comment } from "../../models/comment.model";

interface PostProps {
  id: string;
  username: string;
  imageUrl?: string;
  profilePic?: string;
  content: string;
  createdAt: Date;
  userId: string;
  likes: string[];
  comments?: Comment[];
  isAnonymous: boolean;
}

const FeedPost: FC<PostProps> = ({
  id,
  username,
  imageUrl,
  profilePic,
  content,
  createdAt,
  userId,
  likes,
  comments,
  isAnonymous,
}) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");

  const toggleTextExpanded = () => {
    setIsTextExpanded(!isTextExpanded);
  };

  useEffect(() => {
    const textHeight = textRef.current ? textRef.current.offsetHeight : 0;
    const textSpaceHeight = imageUrl ? 72 : 288;
    setShouldShowButton(textHeight >= textSpaceHeight);
  }, [textRef]);

  return (
    <Box
      margin={"auto"}
      maxW={isLargerThan500 ? "" : "300px"}
      justifyContent={"center"}
      alignItems={"space-between"}
      p={3}
      borderRadius={5}
      background={"var(--quaternary-color)"}
      marginBottom={4}
    >
      <PostHeader
        id={id}
        username={username}
        profilePic={profilePic}
        createdAt={createdAt}
        userId={userId}
        content={content}
        imageUrl={imageUrl}
        isAnonymous={isAnonymous}
      />
      <Box h={"fit-content"} minH={"80px"} bg={"white"} borderRadius={4}>
        {imageUrl && (
          <Image
            maxH={"450px"}
            width={"full"}
            borderTopLeftRadius={4}
            borderTopRightRadius={4}
            objectFit={"cover"}
            src={imageUrl}
            alt="post image"
          />
        )}
        <Flex direction={"column"} p={2}>
          <Box
            ref={textRef}
            css={{
              WebkitLineClamp: isTextExpanded ? "none" : imageUrl ? "3" : "12",
              WebkitBoxOrient: "vertical",
            }}
            overflow="hidden"
            textOverflow="ellipsis"
            display="-webkit-box"
            color={"black"}
          >
            {content}
          </Box>
          {shouldShowButton && (
            <Text
              fontWeight={"600"}
              color={"black"}
              cursor={"pointer"}
              onClick={toggleTextExpanded}
              mt={2}
            >
              {isTextExpanded ? "Read Less" : "Read More"}
            </Text>
          )}
        </Flex>
      </Box>
      <PostFooter likes={likes} comments={comments} postId={id} />
    </Box>
  );
};

export default FeedPost;
