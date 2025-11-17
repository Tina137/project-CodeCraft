import css from "./page.module.css";
import Hero from "@/components/Hero/Hero";
import { Join } from '@/components/Join/Join';

export default function Home() {
  return (
    <main className={css.main}>
      <Hero />
      <Join />
    </main>
  );
}