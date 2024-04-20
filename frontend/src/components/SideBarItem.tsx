import { Box, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SideBarProps {
  btnText: string;
  Icon: any;
  Func?: () => void;
}

const SideBarItem: FC<SideBarProps> = ({ btnText, Icon, Func }) => {
  const [isLargerThan760] = useMediaQuery("(min-width: 760px)");

  return (
    <Box
      w={isLargerThan760 ? "full" : ""}
      pl={2}
      cursor={"pointer"}
      borderRadius={6}
      _hover={{ bg: "var(--hover-color-dim)" }}
      onClick={Func}
    >
      <Flex
        p={2}
        alignItems={"center"}
        justifyContent={isLargerThan760 ? "flex-start" : "center"}
      >
        <FontAwesomeIcon style={{ paddingRight: "10px" }} icon={Icon} />
        <Text display={isLargerThan760 ? "block" : "none"}>{btnText}</Text>
      </Flex>
    </Box>
  );
};

export default SideBarItem;
