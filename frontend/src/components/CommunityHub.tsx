import { FC, useState, useEffect } from "react";
import { Post } from "../models/post.model";
import "../assets/Community.css";

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

const CommunityHub: FC<CommunityProps> = ({ user, posts }) => {
  return (
    <div className="community-hub">
      <div>
        {user ? <h2>Welcome back, {user}!</h2> : null}
        <div className="feed">
          {posts.map((post, index) => (
            <div key={index} className="post">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <button>Like</button>
              <div>
                <input type="text" placeholder="Add a comment" />
                <button>Comment</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
