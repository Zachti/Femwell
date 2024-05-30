export interface PostInput {
  username: string;
  content: string;
  imageURL: File | null;
  isAnonymous: boolean;
}
