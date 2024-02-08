import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../assets/Navbar.css";
import {
  faBars,
  faHeartCircleCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Navbar: React.FC = () => {
  const [click, setClick] = useState<boolean>(false);
  const [logoText, setLogoText] = useState<string>("FemWell");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const handleClick = (): void => setClick(!click);
  const closeMobileMenu = (): void => setClick(false);

  useEffect(() => {
    const rootElement = document.querySelector("*") as HTMLElement;
    if (rootElement) {
      click
        ? (rootElement.style.overflow = "hidden")
        : (rootElement.style.overflow = "");
    }
  }, [click]);

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
              <FontAwesomeIcon icon={click ? faTimes : faBars} />
            </div>
            <ul className={click ? "nav-menu active" : "nav-menu"}>
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
              <li>
                <Link
                  to="/premium"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Premium
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
