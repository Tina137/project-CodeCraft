'use client'; 

import { useRouter } from 'next/navigation'; 
import styles from './Join.module.css';

import { useAuthStore } from '@/lib/store/authStore'; 

export const Join = () => {
  const router = useRouter();
  
 
const isLoggedIn = useAuthStore((state) => state.isAuthenticated);

  const buttonText = isLoggedIn ? 'Збережені' : 'Зареєструватися';
  const buttonLink = isLoggedIn ? '/auth/profile' : '/auth/register';

  const handleNavigate = () => {
    router.push(buttonLink);
  };

  return (
    <section id="Join" className={styles.joinSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Приєднуйтесь до нашої спільноти</h2>
        <p className={styles.text}>
          Долучайтеся до мандрівників, які діляться своїми
          історіями та надихають на нові пригоди.
        </p>
        <button 
          type="button" 
          className={styles.button}
          onClick={handleNavigate}
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
};