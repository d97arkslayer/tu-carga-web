import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = "primary",
}) => {
  const baseStyles = "rounded-full py-2 px-4 font-semibold focus:outline-none";
  const primaryStyles = "bg-[#C4F439] text-white";
  const secondaryStyles = "bg-black text-white";

  const buttonStyles = variant === "primary" ? primaryStyles : secondaryStyles;

  return (
    <button className={`${baseStyles} ${buttonStyles}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
