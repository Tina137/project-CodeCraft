import About from "@/components/About/About";
import css from "./page.module.css";
import Hero from "@/components/Hero/Hero";

export default function Home() {
  return (
    <main className={css.main}>
      <Hero />
      <About />
    </main>
  );
}
