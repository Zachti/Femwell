import { Box, Button, Flex } from "@chakra-ui/react";
import { emojis } from "../utils/emojis";
import { FC } from "react";

interface EmojiPickerProps {
  Func: (emoji: string) => void;
}

const EmojiPicker: FC<EmojiPickerProps> = ({ Func }) => {
  return (
    <Box right="0" zIndex="10" p={2} boxShadow="lg" borderRadius="md">
      <Flex wrap="wrap">
        {emojis.map((emoji) => (
          <Button
            key={emoji}
            onClick={() => Func(emoji)}
            variant="ghost"
            p={1}
            fontSize="20px"
          >
            {emoji}
          </Button>
        ))}
      </Flex>
    </Box>
  );
};

export default EmojiPicker;
