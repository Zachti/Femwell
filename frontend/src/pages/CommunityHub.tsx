import { FC, useState, useEffect } from "react";
import "../assets/App.css";
import Sidebar from "../components/Menus/SideBar";
import FeedPost from "../components/FeedPosts/FeedPost";
import { Container, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import useGetUserPost from "../hooks/useGetUserPost";
import SkeletonPost from "../components/FeedPosts/SkeletonPost";

const CommunityHub: FC<{}> = ({}) => {
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");
  const [noPostFound, setNoPostFound] = useState(false);

  const { isLoading, posts } = useGetUserPost();

  useEffect(() => {
    setNoPostFound(!isLoading && posts.length === 0);
  }, [posts, isLoading]);

  return (
    <div className="page">
      <Flex minH="100vh">
        <Sidebar />

        <Container
          justifyContent={"center"}
          alignContent={"center"}
          maxW={isLargerThan750 ? "lg" : "md"}
          py={isLargerThan500 ? 10 : 4}
          px={isLargerThan500 ? 7 : 3}
        >
          {isLoading &&
            [0, 1, 2].map((id) => (
              <Flex direction={"column"} key={id} mb={4}>
                <SkeletonPost />
              </Flex>
            ))}

          {noPostFound ? (
            <Flex textAlign={"center"} justifyContent={"center"}>
              <Text fontSize={"2xl"}>No Posts Found :/</Text>
            </Flex>
          ) : (
            <>
              {posts.map((post) => (
                <FeedPost
                  key={post.id}
                  id={post.id}
                  username={post.username}
                  avatarURL={post.pfpURL}
                  content={post.content}
                  imgURL={post.imgURL}
                  createdAt={post.createdAt}
                  createdBy={post.createdBy}
                  likes={post.likes}
                />
              ))}
            </>
          )}
        </Container>
      </Flex>
    </div>
  );
};

export default CommunityHub;
