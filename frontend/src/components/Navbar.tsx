import { useState, useEffect, FC } from "react";
import { Link } from "react-router-dom";
import { useDisclosure, useMultiStyleConfig } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../assets/Navbar.css";
import {
  faBars,
  faHeartCircleCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import InputForm from "./InputForm";
import SideMenu from "./SideMenu";
import useAuthStore from "../store/authStore";
import useLogout from "../hooks/useLogout";

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
  const authUser = useAuthStore((state) => state.user);
  const [logoText, setLogoText] = useState<string>("FemWell");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { logout, isLoggingOut } = useLogout();

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
    if (windowWidth > 930) {
      onSideMenuClose();
    }
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
          <Link to="/" className="navbar-logo" onClick={onSideMenuClose}>
            {logoText}
            <FontAwesomeIcon icon={faHeartCircleCheck} />
          </Link>
          <div className="nav-right-section">
            <div className="menu-icon" onClick={handleClick}>
              <FontAwesomeIcon icon={isSideMenuOpen ? faTimes : faBars} />
            </div>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-links" onClick={onSideMenuClose}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/community"
                  className="nav-links"
                  onClick={onSideMenuClose}
                >
                  Community
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/ION" className="nav-links" onClick={onSideMenuClose}>
                  Information
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/premium"
                  className="nav-links"
                  onClick={onSideMenuClose}
                >
                  Premium
                </Link>
              </li>
              {!authUser ? (
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
              ) : (
                <li className="nav-item">
                  <a className="nav-links" onClick={logout}>
                    Logout
                  </a>
                </li>
              )}
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
