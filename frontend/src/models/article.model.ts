import { ReactNode } from "react";

export interface ArticleModel {
  id: string;
  title: string;
  content: ReactNode;
  summary: string;
  recommended?: boolean;
}
