import { FC, ReactNode } from "react";
import "../assets/App.css";

interface HeaderProps {
  image: string;
  children?: ReactNode;
}

const Header: FC<HeaderProps> = ({ image, children }) => {
  return (
    <div className="header" style={{ backgroundImage: `url(${image})` }}>
      {children}
    </div>
  );
};

export default Header;
