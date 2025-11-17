
import css from './page.module.css';
import { Join } from '@/components/Join/Join';


export default function Home() {
  return (
    <main className={css.main}>
      <Join />

    </main>
  );
}