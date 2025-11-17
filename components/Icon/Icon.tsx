import React from "react";

type IconProps = {
  name: string; // назва <symbol id="...">
  size?: number; // розмір px
  className?: string; // додаткові стилі
};

const Icon: React.FC<IconProps> = ({ name, size = 24, className = "" }) => {
  return (
    <svg
      className={`${className}`}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
};

export default Icon;
