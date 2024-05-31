import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { Box, Flex, Input, Text, useMediaQuery } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import useSearchUser from "../../../hooks/useSearchUser";
import { queryTypes } from "../../../utils/userPostQueries";
import useGetUserPost from "../../../hooks/useGetUserPost";

interface SideBarProps {
  btnText?: string;
  Icon?: any;
  Func?: () => void;
  isSearch?: boolean;
}

const Search: FC<{}> = ({}) => {
  const [isLargerThan400] = useMediaQuery("(min-width: 400px)");
  const [isLargerThan760] = useMediaQuery("(min-width: 760px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchVal, setSearchVal] = useState("");

  const { getPosts, isLoading } = useGetUserPost();
  // const { isLoading, getUserProfile } = useSearchUser();

  const handleSearchUser = async () => {
    if (searchVal) {
      await getPosts({ username: searchVal, queryType: queryTypes.USER_POSTS });
      // await getUserProfile(searchVal, queryTypes.USER_POSTS);
      onClose();
      setSearchVal("");
    }
  };

  return (
    <>
      <Box
        w={isLargerThan760 ? "full" : ""}
        pl={isLargerThan760 ? 2 : 0}
        px={isLargerThan760 ? 0 : isLargerThan400 ? 2 : 0}
        cursor={"pointer"}
        borderRadius={6}
        _hover={{ bg: "var(--hover-color-dim)" }}
        onClick={onOpen}
      >
        <Flex
          p={2}
          alignItems={"center"}
          justifyContent={isLargerThan760 ? "flex-start" : "center"}
        >
          <FontAwesomeIcon
            style={{ paddingRight: isLargerThan760 ? "10px" : "" }}
            icon={faSearch}
          />
          <Text display={isLargerThan760 ? "block" : "none"}>Search</Text>
        </Flex>
      </Box>

      <Modal
        preserveScrollBarGap
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInLeft"
      >
        <ModalContent maxW={"400px"} bgColor={"var(--primary-color)"}>
          <ModalHeader>Search User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup>
              <Input
                placeholder="Search"
                focusBorderColor="pink.500"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  icon={<FontAwesomeIcon icon={faSearch} />}
                  aria-label="Search"
                  onClick={() => {
                    handleSearchUser();
                  }}
                  isLoading={isLoading}
                />
              </InputRightElement>
            </InputGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Search;
