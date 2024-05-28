import { Post } from "./post.model";
import { Questionnare } from "./questionnaire.model";

export interface User {
  id: string;
  email: string;
  username: string;
  jwt: string;
  refreshToken: string;
  phoneNumber?: string;
  posts?: Post[];
  likedPosts?: Post[];
  questionnaire?: Questionnare;
  profilePic?: string;
  laterArticles?: string[];
}
