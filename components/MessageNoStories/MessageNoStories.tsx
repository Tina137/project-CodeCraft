import Link from "next/link";
import css from "./MessageNoStories.module.css";

interface MessageNoStoriesProps {
  text: string;
  buttonText: string;
  route: string;
}

export default function MessageNoStories({
  text,
  buttonText,
  route,
}: MessageNoStoriesProps) {
  return (
    <div className={css.noStoriesWrapper}>
      <p className={css.noStoriesText}>{text}</p>
      <Link href={route} className={css.noStoriesButton}>
        {buttonText}
      </Link>
    </div>
  );
}
