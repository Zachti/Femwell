import { FC, ReactNode } from "react";
import "../assets/App.css";
import { useColorModeValue } from "@chakra-ui/react";
import { Colors } from "../utils/colorsConstants";

interface HeaderProps {
  image: string;
  children?: ReactNode;
}

const Header: FC<HeaderProps> = ({ image, children }) => {
  const headerFadeColor = useColorModeValue(
    Colors.primaryColor,
    Colors.darkPrimaryColor,
  );

  return (
    <div
      className="header"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0), 70%, ${headerFadeColor}), url(${image})`,
      }}
    >
      {children}
    </div>
  );
};

export default Header;
