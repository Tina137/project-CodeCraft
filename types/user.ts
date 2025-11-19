export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
  description: string;
  favorites: string[];
  articlesAmount?: number;
  createdAt: string;
  updatedAt: string;
}
