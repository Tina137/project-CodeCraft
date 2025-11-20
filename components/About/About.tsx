import css from "./About.module.css";
import Icon from "@/components/Icon/Icon";
export default function About() {
  return (
    <section className={css.about}>
      <div className="wrapper">
        <div className={css.aboutTextContainer}>
          <h3 className={css.aboutTitle}>
            Проєкт, створений для тих, хто живе подорожами
          </h3>
          <p className={css.aboutText}>
            Ми віримо, що кожна подорож — це унікальна історія, варта того, щоб
            нею поділилися. Наша платформа створена, щоб об'єднати людей,
            закоханих у відкриття нового. Тут ви можете ділитися власним
            досвідом, знаходити друзів та надихатися на наступні пригоди разом з
            нами.
          </p>
        </div>
        <ul className={css.aboutAchieveContainer}>
          <li className={css.aboutAchieve}>
            <Icon name="icon-wand_stars" size={48} className={css.icon} />
            <h4 className={css.aboutAchieveTitle}>Наша місія</h4>
            <p className={css.aboutAchieveText}>
              Об'єднувати людей через любов до пригод та надихати на нові
              відкриття.
            </p>
          </li>
          <li className={css.aboutAchieve}>
            <Icon name="icon-bags" size={48} className={css.icon} />
            <h4 className={css.aboutAchieveTitle}>Автентичні історії</h4>
            <p className={css.aboutAchieveText}>
              Ми цінуємо справжні, нередаговані враження від мандрівників з
              усього світу.
            </p>
          </li>
          <li className={css.aboutAchieve}>
            <Icon name="icon-communication" size={48} className={css.icon} />
            <h4 className={css.aboutAchieveTitle}>Ваша спільнота</h4>
            <p className={css.aboutAchieveText}>
              Станьте частиною спільноти, де кожен може бути і автором, і
              читачем.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
