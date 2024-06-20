import { ChatMsg } from "./chatMsg.model";

interface User {
  id: string;
  profilePic?: string;
  username: string;
}

export interface Chat {
  id: number;
  users: User[];
  messages: ChatMsg[];
  createdAt?: Date;
  updatedAt?: Date;
}
