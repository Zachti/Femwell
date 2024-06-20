export interface ChatMsg {
  id?: string;
  userId: string;
  username: string;
  content: string;
  seen?: boolean;
  createdAt?: Date;
}
