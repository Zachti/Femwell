import { Comment } from "./comment.model";

interface User {
  profilePic?: string;
  username: string;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  imageUrl?: string;
  likes: string[];
  comments: Comment[];
  createdAt: Date;
  isAnonymous: boolean;
}
