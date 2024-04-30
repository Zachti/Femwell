import { formatDistanceToNow, set } from "date-fns";
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import { FC, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import useAuthStore from "../../store/authStore";
import useDeletePost from "../../hooks/useDeletePost";
import CreateOrUpdatePost from "../Menus/SideBar/createOrUpdatePost";
import { DeleteIcon } from "@chakra-ui/icons";
import useEditPost from "../../hooks/useEditPost";

interface PostHeaderProps {
  id: string;
  username: string;
  avatarURL?: string;
  createdAt: Timestamp;
  createdBy: string;
  content: string;
  imgURL?: string;
}

const PostHeader: FC<PostHeaderProps> = ({
  id,
  username,
  avatarURL,
  createdAt,
  createdBy,
  content,
  imgURL,
}) => {
  const authUser = useAuthStore((state) => state.user);
  const { isLoading, handleDeletePost } = useDeletePost();

  const menuDisclosure = useDisclosure();
  const postUpdateDisclosure = useDisclosure();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const timeAgo = formatDistanceToNow(createdAt.toDate(), { addSuffix: true });

  const handleDeletePostClick = () => {
    console.log("Deleting Post...");
    closeMenu();
    handleDeletePost(id);
  };

  const closeMenu = () => {
    setConfirmDelete(false);
    menuDisclosure.onClose();
  };

  return (
    <>
      <Flex
        justifyContent={"flex-start"}
        alignItems={"center"}
        w="full"
        fontSize={12}
        fontWeight={"bold"}
        pb={2}
      >
        <Avatar
          name={username}
          src={avatarURL ? avatarURL : ""}
          size={"sm"}
          bgColor={"pink.500"}
          color={"white"}
          mr={2}
        />
        {username}
        <Flex w={"full"} justifyContent={"space-between"}>
          <Box px={2} color={"gray.400"}>
            ● {timeAgo}
          </Box>
          {authUser?.id === createdBy && !isLoading && (
            <Menu
              isOpen={menuDisclosure.isOpen}
              onClose={closeMenu}
              closeOnSelect={false}
            >
              <MenuButton onClick={menuDisclosure.onOpen}>
                <Box cursor={"pointer"} px={3} mr={-2}>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </Box>
              </MenuButton>
              <Portal>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      closeMenu();
                      postUpdateDisclosure.onOpen();
                    }}
                  >
                    Edit Post
                  </MenuItem>
                  <MenuItem
                    cursor={confirmDelete ? "default" : "pointer"}
                    onClick={() => {
                      setConfirmDelete(true);
                    }}
                  >
                    {confirmDelete ? "Are you sure?" : "Delete Post"}
                    {confirmDelete && (
                      <Box
                        px={2}
                        ml={"auto"}
                        onClick={handleDeletePostClick}
                        cursor={"pointer"}
                        _hover={{ color: "red" }}
                      >
                        <DeleteIcon />
                      </Box>
                    )}
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          )}
        </Flex>
      </Flex>

      <CreateOrUpdatePost
        isWinOpen={postUpdateDisclosure.isOpen}
        onWinOpen={postUpdateDisclosure.onOpen}
        onWinClose={postUpdateDisclosure.onClose}
        mode="update"
        content={content}
        imgURL={imgURL}
        postId={id}
      />
    </>
  );
};

export default PostHeader;
