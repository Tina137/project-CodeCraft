export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string;
  description: string;
  favorites: string[];
  articlesAmount?: number;
  createdAt: string;
  updatedAt: string;
}
