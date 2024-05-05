import { Box, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";

interface SideBarProps {
  btnText?: string;
  Icon?: any;
  Func?: () => void;
  isSearch?: boolean;
}

const EditProfile: FC<SideBarProps> = ({}) => {
  const [isLargerThan400] = useMediaQuery("(min-width: 400px)");
  const [isLargerThan760] = useMediaQuery("(min-width: 760px)");

  return (
    <Box
      w={isLargerThan760 ? "full" : ""}
      pl={isLargerThan760 ? 2 : 0}
      px={isLargerThan760 ? 0 : isLargerThan400 ? 2 : 0}
      cursor={"pointer"}
      borderRadius={6}
      _hover={{ bg: "var(--hover-color-dim)" }}
      onClick={() => {}}
    >
      <Flex
        p={2}
        alignItems={"center"}
        justifyContent={isLargerThan760 ? "flex-start" : "center"}
      >
        <FontAwesomeIcon
          style={{ paddingRight: isLargerThan760 ? "10px" : "" }}
          icon={faUserPen}
        />
        <Text display={isLargerThan760 ? "block" : "none"}>Edit Profile</Text>
      </Flex>
    </Box>
  );
};

export default EditProfile;
