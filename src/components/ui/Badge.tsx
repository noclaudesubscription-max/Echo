import React from "react";
import { Chip } from "@heroui/react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "secondary";
  className?: string;
}

const variantMap: Record<
  NonNullable<BadgeProps["variant"]>,
  { color: "default" | "accent" | "success" | "warning" | "danger"; variant: "primary" | "secondary" | "tertiary" | "soft" }
> = {
  primary: { color: "accent", variant: "primary" },
  success: { color: "success", variant: "soft" },
  secondary: { color: "default", variant: "secondary" },
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className = "",
}) => {
  const { color, variant: heroVariant } = variantMap[variant];
  return (
    <Chip color={color} variant={heroVariant} className={className}>
      {children}
    </Chip>
  );
};

export default Badge;
