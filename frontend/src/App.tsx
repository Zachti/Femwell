import { useState, FC } from "react";
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

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "var(--primary-color)",
        paddingTop: "10vh",
      },
    },
  },
});

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
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
