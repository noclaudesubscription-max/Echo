import React from "react";
import { Button } from "@heroui/react";
import ResetIcon from "../icons/ResetIcon";

interface ResetButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
}

export const ResetButton: React.FC<ResetButtonProps> = React.memo(
  ({ onClick, disabled = false, className = "", ariaLabel, children }) => (
    <Button
      variant="ghost"
      isIconOnly
      aria-label={ariaLabel}
      isDisabled={disabled}
      onPress={onClick}
      className={`p-1 ${className}`}
    >
      {children ?? <ResetIcon />}
    </Button>
  ),
);
