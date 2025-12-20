export interface User {
  userId: string;
  username: string;
}

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
