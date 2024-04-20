import {
  Box,
  Flex,
  Link,
  Tooltip,
  Text,
  VStack,
  useMediaQuery,
  Avatar,
} from "@chakra-ui/react";
import { faHeart, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faBookmark,
  faSearch,
  faThumbsUp,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import useAuthStore from "../store/authStore";
import SideBarItem from "./SideBarItem";

interface SideBarProps {
  searchFunc?: () => void;
  myPostsFunc?: () => void;
  likedPostsFunc?: () => void;
  newPostFunc?: () => void;
}

const Sidebar: FC<{}> = ({}) => {
  const authUser = useAuthStore((state) => state.user);
  const [isLargerThan760] = useMediaQuery("(min-width: 760px)");
  return (
    <Box
      height={"90vh"}
      w={isLargerThan760 ? "180px" : "65px"}
      borderRight={"3px solid"}
      borderColor={"var(--secondary-color)"}
      py={6}
      position={"sticky"}
      top={0}
      left={0}
      px={isLargerThan760 ? 4 : 2}
    >
      {authUser ? (
        <>
          <Flex direction="column" align="center" pb={isLargerThan760 ? 2 : 4}>
            <Avatar
              border="2px solid var(--secondary-color)"
              bgColor={"pink.500"}
              color={"white"}
              name={`${authUser.username}`}
              size={isLargerThan760 ? "lg" : "md"}
              src={`${authUser.pfpURL}`}
              mb={1}
            />
            <Text
              fontWeight={"bold"}
              display={isLargerThan760 ? "block" : "none"}
            >{`${authUser.username}`}</Text>
          </Flex>
        </>
      ) : (
        <>
          <Text pl={2}>Welcome to Community Hub!</Text>
        </>
      )}

      <Flex
        alignItems="center"
        justifyContent="center"
        my={1}
        w="full"
        pb={isLargerThan760 ? 2 : 4}
      >
        <Box flex={1} h="1px" bg="var(--divider-color)" mx={1} />
        <FontAwesomeIcon icon={faHeart} color="var(--divider-color)" />
        <Box flex={1} h="1px" bg="var(--divider-color)" mx={1} />
      </Flex>

      <VStack gap={4} w="full">
        <SideBarItem btnText="Search" Icon={faSearch} />
        <SideBarItem btnText="My Posts" Icon={faBookmark} />
        <SideBarItem btnText="Liked Posts" Icon={faThumbsUp} />
        <SideBarItem btnText="New Post" Icon={faPenToSquare} />
        <SideBarItem btnText="Edit Profile" Icon={faUserPen} />
      </VStack>
    </Box>
  );
};

export default Sidebar;
