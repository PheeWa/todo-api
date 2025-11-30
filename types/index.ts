export interface User {
  username: string;
}

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  userId: string;
}
