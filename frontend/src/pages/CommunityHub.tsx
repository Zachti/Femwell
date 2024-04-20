import { FC, useState, useEffect } from "react";
import { Post } from "../models/post.model";
import "../assets/App.css";
import Sidebar from "../components/SideBar";

interface CommunityProps {
  user?: string;
  posts: Post[];
}

//will send commentDTO
const onComment = (userId: string, postId: string, content: string) => {
  //add comment to post in db
};

//will send likeDTO
const onLike = (userId: string, postId: string) => {
  //add like in db
};

const CommunityHub: FC<CommunityProps> = ({}) => {
  return (
    <div className="page">
      <Sidebar />
    </div>
  );
};

export default CommunityHub;
