import axios from "axios";

export async function getCurrentUser() {
  const res = await axios.get("/api/users/me");
  return res.data;
}


export async function getSavedStories() {
  const res = await axios.get("/api/stories?type=saved");
  return res.data;
}

export async function getMyStories() {
  const res = await axios.get("/api/stories?type=mine");
  return res.data;
}