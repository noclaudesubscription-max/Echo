import React from "react";
import { Input as HeroInput } from "@heroui/react";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "compact";
}

export const Input: React.FC<InputProps> = ({
  className = "",
  variant = "default",
  disabled,
  ...props
}) => {
  return (
    <HeroInput
      disabled={disabled}
      className={`${variant === "compact" ? "text-sm py-1" : ""} ${className}`}
      {...(props as Record<string, unknown>)}
    />
  );
};
