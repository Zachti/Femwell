import { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  username: string;
  profilePic?: string;
  content: string;
  imageURL?: string;
  likes: number;
  comments: string[];
  createdAt: Timestamp;
  createdBy: string;
}
