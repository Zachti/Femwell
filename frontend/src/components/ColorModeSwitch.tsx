import { SunIcon } from "@chakra-ui/icons";
import {
  Flex,
  Text,
  Switch,
  VStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Colors } from "../utils/colorsConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const text = useColorModeValue("dark", "light");

  const [isChecked, setIsChecked] = useState(colorMode === "dark");
  const [mode, setMode] = useState("Light Mode");

  useEffect(() => {
    setIsChecked(colorMode === "dark");
    setMode(colorMode === "dark" ? "Dark Mode" : "Light Mode");
    const root = window.document.documentElement;
    const backgroundColor =
      colorMode === "dark" ? Colors.darkPrimaryColor : Colors.primaryColor;
    root.style.backgroundColor = backgroundColor;
    root.classList.remove("light", "dark");
    root.classList.add(colorMode);
  }, [colorMode]);

  return (
    <Flex justifyContent={"center"} alignItems={"center"}>
      <Text mr={2}>{mode}</Text>
      <FontAwesomeIcon
        icon={colorMode === "dark" ? faMoon : faSun}
        color={
          colorMode === "dark" ? Colors.primaryColor : Colors.darkPrimaryColor
        }
      />
      <Switch
        size="lg"
        aria-label={`Switch to ${text} mode`}
        color="current"
        marginLeft="2"
        isChecked={isChecked}
        onChange={toggleColorMode}
      />
    </Flex>
  );
};

export default ColorModeSwitch;
