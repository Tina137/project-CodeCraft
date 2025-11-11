import axios from "axios";
import { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "https://project-codecraft-backend.onrender.com",
  withCredentials: true,
});

export type ApiError = AxiosError<{ error: string }>;
