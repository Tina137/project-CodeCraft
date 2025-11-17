import css from "./page.module.css";
import Hero from "@/components/Hero/Hero";

export default function Home() {
  return (
    <main className={css.main}>
      <Hero />
    </main>
  );
}
