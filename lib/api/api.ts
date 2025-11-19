import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
});

export interface Traveler {
  _id: string;
  name: string;
  avatarUrl: string;
  description: string;
  articlesAmount: number;
  updatedAt?: string;
}

export interface TravelersResponse {
  status: number;
  message: string;
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  data: Traveler[];
}

import { Story } from "../../types/story";
export interface GetStoriesResponse {
  status: number;
  message: string;
  page: number;
  data: {
    stories: Story[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
