import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://project-codecraft-backend.onrender.com";

export function useSaveStory() {
  const addMutation = useMutation({
    mutationFn: async (storyId: string) => {
      try {
        const res = await axios.post(
          `${APP_URL}/api/users/saved/${storyId}`,
          {},
          { withCredentials: true }
        );
        return res.data;
      } catch (err: any) {
        throw err;
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (storyId: string) => {
      try {
        const res = await axios.delete(
          `${APP_URL}/api/users/saved/${storyId}`,
          { withCredentials: true }
        );
        return res.data;
      } catch (err: any) {
        throw err;
      }
    },
  });

  return { addMutation, removeMutation };
}
