import css from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={css.hero}>
      <div className="wrapper">
        <div className={css.heroTextWrapper}>
          <h1 className={css.title}>Відкрийте світ подорожей з нами!</h1>
          <p className={css.heroText}>
            Приєднуйтесь до нашої спільноти мандрівників, де ви зможете ділитися
            своїми історіями та отримувати натхнення для нових пригод. Відкрийте
            для себе нові місця та знайдіть однодумців!
          </p>
        </div>
        <a href="#Join" className={css.heroButton}>
          Доєднатись
        </a>
      </div>
    </section>
  );
}
