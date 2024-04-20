import { useState, FC, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import "./index.css";
import "./assets/App.css";
import Home from "./pages/Home";
import CommunityHub from "./pages/CommunityHub";
import Fab from "./components/ActionButton";
import useAuthStore from "./store/authStore";
import AccountSettings from "./pages/AccountSettings";
import ION from "./pages/ION";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const App: FC<{}> = () => {
  const authUser = useAuthStore((state) => state.user);
  const user = "John Doe";
  const posts = [
    {
      username: "Sophie Barnet",
      title: "First post",
      content: "This is the first post.",
    },
    {
      username: "Shiri Cohen",
      title: "Second post",
      content: "This is the second post.",
    },
    {
      username: "Sara Netanyahu",
      title: "Third post",
      content: "This is the third post.",
    },
  ];

  const theme = extendTheme({
    config,
    styles: {
      global: (props: any) => ({
        body: {
          backgroundColor: props.colorMode === "dark" ? "#250515" : "#fbf2f7",
          color: props.colorMode === "dark" ? "#fbf2f7" : "#250515",
          paddingTop: "10vh",
        },
      }),
    },
    components: {
      Button: {
        baseStyle: {
          _focus: {
            boxShadow: "none",
          },
        },
      },
    },
    colors: {
      fabColor: {
        200: "#EC407A",
        300: "#B8325F",
        400: "#7B223F",
        500: "#86003C",
        600: "#5A052E",
        700: "#3F0421",
      },
    },
  });

  const FabWithLocation = () => {
    const location = useLocation();

    return authUser && location.pathname !== "/account" ? <Fab /> : null;
  };

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <FabWithLocation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/community"
            element={<CommunityHub user={user} posts={posts} />}
          />
          <Route
            path="/account"
            element={authUser ? <AccountSettings /> : <Navigate to="/" />}
          />
          <Route path="/ION" element={<ION />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
