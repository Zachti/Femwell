import { useState, useRef } from "react";
import {
  Box,
  IconButton,
  ScaleFade,
  Tooltip,
  useOutsideClick,
} from "@chakra-ui/react";
import { AddIcon, SettingsIcon, EditIcon, ChatIcon } from "@chakra-ui/icons";
import LiveChat from "../LiveChat";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
const Fab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const authUser = useAuthStore((state) => state.user);
  const [isPadulla, setIsPadulla] = useState<boolean>(
    authUser?.role === "Padulla",
  );

  const navigate = useNavigate();
  const ref = useRef(null);

  useOutsideClick({
    ref: ref,
    handler: () => setIsOpen(false),
  });

  const onLiveChatClose = () => {
    setIsChatOpen(false);
    setIsOpen(false);
  };

  return (
    <Box
      position="fixed"
      right="1rem"
      bottom="1rem"
      ref={ref}
      className="fab-element"
    >
      <IconButton
        color="white"
        colorScheme="fabColor"
        size="lg"
        fontSize="lg"
        boxShadow="0 0 10px rgba(0, 0, 0, 0.15)"
        icon={<AddIcon />}
        isRound
        aria-label="Add"
        onClick={toggleIsOpen}
      />

      {isOpen && (
        <ScaleFade initialScale={0.9} in={isOpen}>
          <Tooltip
            label={isPadulla ? "Chat Center" : "LiveChat"}
            placement="left"
          >
            <IconButton
              color="white"
              colorScheme="fabColor"
              size="md"
              icon={<ChatIcon />}
              isRound
              aria-label="LiveChat"
              style={{ position: "absolute", right: "60px", bottom: "0px" }}
              onClick={() =>
                isPadulla ? navigate("/livechats") : setIsChatOpen(true)
              }
            />
          </Tooltip>

          <Tooltip label="New Post" placement="left">
            <IconButton
              color="white"
              colorScheme="fabColor"
              size="md"
              icon={<EditIcon />}
              isRound
              aria-label="Post"
              style={{ position: "absolute", bottom: "42px", right: "42px" }}
            />
          </Tooltip>
          <Tooltip label="Settings" placement="left">
            <IconButton
              color="white"
              colorScheme="fabColor"
              size="md"
              icon={<SettingsIcon />}
              isRound
              aria-label="Settings"
              style={{ position: "absolute", bottom: "60px", right: "0px" }}
              onClick={() => navigate("/account")}
            />
          </Tooltip>
        </ScaleFade>
      )}
      {isChatOpen && (
        <LiveChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      )}
    </Box>
  );
};

export default Fab;
