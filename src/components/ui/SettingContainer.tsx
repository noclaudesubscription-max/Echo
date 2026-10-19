import React from "react";
import { Tooltip } from "./Tooltip";

interface SettingContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
  layout?: "horizontal" | "stacked";
  disabled?: boolean;
  tooltipPosition?: "top" | "bottom";
}

const InfoIcon: React.FC<{ disabled?: boolean }> = () => (
  <svg
    className="w-4 h-4 text-mid-gray cursor-help hover:text-logo-primary transition-colors duration-200 select-none"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label="More information"
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const SettingContainer: React.FC<SettingContainerProps> = ({
  title,
  description,
  children,
  descriptionMode = "tooltip",
  grouped = false,
  layout = "horizontal",
  disabled = false,
  tooltipPosition = "top",
}) => {
  const titleWithTooltip = (
    <div className="flex items-center gap-2">
      <h3 className={`text-sm font-medium ${disabled ? "opacity-50" : ""}`}>
        {title}
      </h3>
      <Tooltip content={description} position={tooltipPosition}>
        <InfoIcon />
      </Tooltip>
    </div>
  );

  const titleWithInline = (
    <>
      <h3 className={`text-sm font-medium ${disabled ? "opacity-50" : ""}`}>
        {title}
      </h3>
      <p className={`text-sm ${disabled ? "opacity-50" : ""}`}>
        {description}
      </p>
    </>
  );

  const containerClasses = grouped
    ? "px-4 p-2"
    : "px-4 p-2 rounded-lg border border-mid-gray/20";

  if (layout === "stacked") {
    return (
      <div className={containerClasses}>
        <div className="mb-2">
          {descriptionMode === "tooltip" ? titleWithTooltip : titleWithInline}
        </div>
        <div className="w-full">{children}</div>
      </div>
    );
  }

  const horizontalContainerClasses = grouped
    ? "flex items-center justify-between min-h-12 px-4 p-2"
    : "flex items-center justify-between min-h-12 px-4 p-2 rounded-lg border border-mid-gray/20";

  return (
    <div className={horizontalContainerClasses}>
      <div className="max-w-2/3">
        {descriptionMode === "tooltip" ? titleWithTooltip : titleWithInline}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
};
