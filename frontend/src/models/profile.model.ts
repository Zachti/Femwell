import { Post } from "./post.model";

export interface Profile {
  id: string;
  username: string;
  posts?: Post[];
  likedPosts?: Post[];
  profilePic?: string;
}
