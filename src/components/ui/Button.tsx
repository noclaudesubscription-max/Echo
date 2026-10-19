import React from "react";
import { Button as HeroButton } from "@heroui/react";

interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "color" | "disabled"
  > {
  variant?:
    | "primary"
    | "primary-soft"
    | "secondary"
    | "warning"
    | "danger"
    | "danger-ghost"
    | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

// Maps this app's existing variant names onto HeroUI's Button `variant`
// prop, with className overrides for the two variants HeroUI has no direct
// equivalent for (warning, danger-ghost).
const variantMap: Record<
  NonNullable<ButtonProps["variant"]>,
  { variant: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger"; extraClass?: string }
> = {
  primary: { variant: "primary" },
  "primary-soft": { variant: "tertiary" },
  secondary: { variant: "secondary" },
  warning: {
    variant: "secondary",
    extraClass: "hover:bg-warning/15 hover:border-warning focus:ring-1 focus:ring-warning",
  },
  danger: { variant: "danger" },
  "danger-ghost": {
    variant: "ghost",
    extraClass: "text-red-400 hover:text-red-300 hover:bg-red-500/10",
  },
  ghost: { variant: "ghost" },
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  disabled,
  onClick,
  type,
  ...props
}) => {
  const { variant: heroVariant, extraClass } = variantMap[variant];

  return (
    <HeroButton
      variant={heroVariant}
      size={size}
      isDisabled={disabled}
      type={type as "button" | "submit" | "reset" | undefined}
      onPress={onClick ? () => (onClick as () => void)() : undefined}
      className={`${extraClass ?? ""} ${className}`}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </HeroButton>
  );
};
