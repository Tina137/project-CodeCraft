// app/page.tsx
import css from "./page.module.css";
import Hero from "@/components/Hero/Hero";

import OurTravellers from "../components/OurTravellers/OurTravellers";
import { getUsersServer } from "../lib/api/serverApi";
import { TravelersResponse } from "../lib/api/api";

export default async function Home() {
  const initialData: TravelersResponse = await getUsersServer(1, 4);
  return (
    <main className={css.main}>
      <Hero />
      <OurTravellers initialData={initialData} />
    </main>
  );
}
