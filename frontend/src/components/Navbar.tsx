import { useState, useEffect, FC } from "react";
import { Link } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../assets/Navbar.css";
import {
  faBars,
  faHeartCircleCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import InputForm from "./InputForm";
import SideMenu from "./SideMenu";

const Navbar: FC<{}> = () => {
  const {
    isOpen: isSideMenuOpen,
    onOpen: onSideMenuOpen,
    onClose: onSideMenuClose,
  } = useDisclosure();
  const {
    isOpen: isInputFormOpen,
    onOpen: onInputFormOpen,
    onClose: onInputFormClose,
  } = useDisclosure();
  const [logoText, setLogoText] = useState<string>("FemWell");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const closeMobileMenu = (): void => {
    onSideMenuClose();
  };

  const handleClick = (): void => {
    if (!isSideMenuOpen) {
      onSideMenuOpen();
    } else {
      onSideMenuClose();
    }
  };

  //on mount
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth < 500) {
      setLogoText("FW");
    } else {
      setLogoText("FemWell");
    }
  }, [windowWidth]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            {logoText}
            <FontAwesomeIcon icon={faHeartCircleCheck} />
          </Link>
          <div className="nav-right-section">
            <div className="menu-icon" onClick={handleClick}>
              <FontAwesomeIcon icon={isSideMenuOpen ? faTimes : faBars} />
            </div>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/community"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Community
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/premium"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Premium
                </Link>
              </li>
              <li className="nav-item">
                <a
                  className="nav-links"
                  onClick={() => {
                    onInputFormOpen();
                  }}
                >
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <InputForm
        isOpen={isInputFormOpen}
        onClose={onInputFormClose}
        onOpen={onInputFormOpen}
      />
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={onSideMenuClose}
        onOpen={onSideMenuOpen}
        onInputFormOpen={onInputFormOpen}
      />
    </>
  );
};

export default Navbar;
