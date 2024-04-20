import { Post } from "./post.model";

export interface User {
  id: string;
  email: string;
  username: string;
  phone?: string;
  posts?: Post[];
  pfpURL?: string;
  laterArticles?: string[];
}
