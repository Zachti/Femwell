import { FC } from "react";
import Search from "./Search";
import MyPosts from "./MyPosts";
import LikedPosts from "./LikedPosts";
import NewPost from "./NewPost";
import EditProfile from "./EditProfile";

const SideBarItems: FC<{}> = ({}) => {
  return (
    <>
      <Search />
      <MyPosts />
      <LikedPosts />
      <NewPost />
      <EditProfile />
    </>
  );
};

export default SideBarItems;
