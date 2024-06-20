import { Post } from "./post.model";

export interface Profile {
  id: string;
  username: string;
  posts?: Post[];
  likes?: Post[];
  profilePic?: string;
}
