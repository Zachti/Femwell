import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  VStack,
  useMediaQuery,
  TagLeftIcon,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onInputFormOpen: () => void;
}

const SideMenu: FC<SideMenuProps> = ({
  isOpen,
  onClose,
  onOpen,
  onInputFormOpen,
}) => {
  const navigate = useNavigate();
  const [isSmallerThan650] = useMediaQuery("(max-width: 650px)");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      preserveScrollBarGap
    >
      <DrawerOverlay bg="transparent" />
      <DrawerContent
        maxWidth="300px"
        height="90vh"
        marginTop="10vh"
        borderLeft="3px solid var(--secondary-color)"
      >
        <DrawerHeader mb="-4">
          <Box>Welcome Back!</Box>
          <Box>XYZ</Box>
        </DrawerHeader>
        <DrawerBody>
          <VStack justifyContent="center" alignItems="center" spacing={5}>
            <Flex alignItems="center" justifyContent="center" my={1} w="full">
              <Box flex={1} h="1px" bg="var(--divider-color)" mx={1} />
              <FontAwesomeIcon icon={faHeart} color="var(--divider-color)" />
              <Box flex={1} h="1px" bg="var(--divider-color)" mx={1} />
              <FontAwesomeIcon icon={faHeart} color="var(--divider-color)" />
              <Box flex={1} h="1px" bg="var(--divider-color)" mx={1} />
              <FontAwesomeIcon icon={faHeart} color="var(--divider-color)" />
              <Box flex={1} h="1px" bg="var(--divider-color)" mx={1} />
            </Flex>
            <Button
              colorScheme="pink"
              w="full"
              onClick={() => {
                onClose();
                navigate("/");
              }}
            >
              Home
            </Button>

            <Button
              colorScheme="pink"
              w="full"
              onClick={() => {
                onClose();
                navigate("/community");
              }}
            >
              Community
            </Button>
            <Button
              colorScheme="pink"
              w="full"
              onClick={() => {
                onClose();
                navigate("/contact");
              }}
            >
              Contact
            </Button>
            <Button
              colorScheme="pink"
              w="full"
              onClick={() => {
                onClose();
                navigate("/premium");
              }}
            >
              Premium
            </Button>
            {!isLoggedIn && (
              <Button
                colorScheme="pink"
                w="full"
                onClick={() => {
                  onInputFormOpen();
                }}
              >
                Login
              </Button>
            )}
          </VStack>
        </DrawerBody>
        {isLoggedIn && (
          <DrawerFooter>
            <Button
              variant="outline"
              colorScheme="pink"
              w="full"
              onClick={onClose}
            >
              Logout
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default SideMenu;
