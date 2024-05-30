export interface Post {
  id: string;
  username: string;
  profilePic?: string;
  content: string;
  imageURL?: string;
  likes: number;
  comments: string[];
  createdAt: Date;
  createdBy: string;
  isAnonymous: boolean;
}
