import { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  username: string;
  pfpURL?: string;
  content: string;
  imgURL?: string;
  likes: number;
  comments: string[];
  createdAt: Timestamp;
  createdBy: string;
}
