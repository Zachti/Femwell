export interface PostInput {
  username: string;
  content: string;
  imageUrl: File | null;
  isAnonymous: boolean;
}
