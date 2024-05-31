interface User {
  profilePic?: string;
  username: string;
}

export interface Comment {
  id: number;
  userId: string;
  user: User;
  content: string;
}
