import React from "react";
import { Tooltip as HeroTooltip } from "@heroui/react";

type TooltipPosition = "top" | "bottom";

interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  children: React.ReactNode;
}

// Thin wrapper over HeroUI's Tooltip: the trigger is passed as `children`
// (a single focusable/hoverable element), and the tooltip text as `content`.
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  children,
}) => {
  return (
    <HeroTooltip delay={0}>
      {children}
      <HeroTooltip.Content placement={position} className="max-w-[200px]">
        <p className="text-sm text-center leading-relaxed">{content}</p>
      </HeroTooltip.Content>
    </HeroTooltip>
  );
};
