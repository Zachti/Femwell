import { FC, useState, useEffect } from "react";
import "../assets/App.css";
import Sidebar from "../components/Menus/SideBar";
import FeedPost from "../components/FeedPosts/FeedPost";
import { Container, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import useGetUserPost from "../hooks/useGetUserPost";
import SkeletonPost from "../components/FeedPosts/SkeletonPost";
import usePostStore from "../store/postStore";

const CommunityHub: FC<{}> = ({}) => {
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");
  const [noPostFound, setNoPostFound] = useState(false);

  const { isLoading } = useGetUserPost();
  const posts = usePostStore((state) => state.posts);

  useEffect(() => {
    setNoPostFound(!isLoading && posts.length === 0);
  }, [posts, isLoading]);

  return (
    <div className="page">
      <Flex minH="100vh" className="main-element">
        <Sidebar />

        <Container
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
                  username={post.user.username}
                  profilePic={post.user.profilePic}
                  content={post.content}
                  imageUrl={post.imageUrl}
                  createdAt={post.createdAt}
                  userId={post.userId}
                  likes={post.likes}
                  comments={post.comments}
                  isAnonymous={post.isAnonymous}
                />
              ))}
            </>
          )}
        </Container>
      </Flex>

      <svg
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="svg"
      >
        <path d="M0,64L34.3,101.3C68.6,139,137,213,206,202.7C274.3,192,343,96,411,85.3C480,75,549,149,617,149.3C685.7,149,754,75,823,48C891.4,21,960,43,1029,74.7C1097.1,107,1166,149,1234,144C1302.9,139,1371,85,1406,58.7L1440,32L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
      </svg>
    </div>
  );
};

export default CommunityHub;
