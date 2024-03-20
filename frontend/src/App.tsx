import { useState, FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import "./index.css";
import "./assets/App.css";
import Home from "./pages/Home";
import CommunityHub from "./pages/CommunityHub";
import Fab from "./components/ActionButton";
import useAuthStore from "./store/authStore";

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

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        {authUser ? <Fab /> : null}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/community"
            element={<CommunityHub user={user} posts={posts} />}
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
