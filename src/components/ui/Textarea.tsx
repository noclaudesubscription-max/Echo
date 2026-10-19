import React from "react";
import { TextArea as HeroTextarea } from "@heroui/react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "compact";
}

export const Textarea: React.FC<TextareaProps> = ({
  className = "",
  variant = "default",
  ...props
}) => {
  return (
    <HeroTextarea
      className={`${variant === "compact" ? "min-h-[80px]" : "min-h-[100px]"} resize-y ${className}`}
      {...props}
    />
  );
};
