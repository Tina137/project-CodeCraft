// app/page.tsx

import About from "@/components/About/About";

import css from "./page.module.css";
import Hero from "@/components/Hero/Hero";
import { Join } from "@/components/Join/Join";
import Popular from "@/components/Popular/Popular";

import OurTravellers from "../components/OurTravellers/OurTravellers";
import { getUsersServer, getStoriesServer } from "../lib/api/serverApi";
import { TravelersResponse, GetStoriesResponse } from "../lib/api/api";

export default async function Home() {
  const initialData: TravelersResponse = await getUsersServer(1, 4);
  const initialDataStory: GetStoriesResponse = await getStoriesServer(1, 3);
  return (
    <main className={css.main}>
      <Hero />
      <Popular initialData={initialDataStory} />
      <OurTravellers initialData={initialData} />
      <About />
      <Join />
    </main>
  );
}
