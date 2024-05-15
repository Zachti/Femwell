import { Post } from "./post.model";
import { Questionnare } from "./questionnaire.model";

export interface User {
  id: string;
  email: string;
  username: string;
  phone?: string;
  posts?: Post[];
  likedPosts?: Post[];
  questionnaire?: Questionnare;
  pfpURL?: string;
  laterArticles?: string[];
}
