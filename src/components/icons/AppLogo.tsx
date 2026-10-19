import React from "react";
import logoSrc from "../../assets/echo-logo.svg";

interface AppLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

/** The Echo app icon (square mark), replacing the old hand-drawn HandyHand SVG. */
const AppLogo: React.FC<AppLogoProps> = ({ width = 24, height, className = "" }) => (
  <img
    src={logoSrc}
    alt="Echo"
    width={width}
    height={height ?? width}
    className={`object-contain ${className}`}
  />
);

export default AppLogo;

/**
 * Icon mark + wordmark, replacing the old hand-drawn HandyTextLogo SVG.
 * `width` sizes the whole lockup (icon height is derived from it).
 */
export const AppWordmark: React.FC<{ width?: number | string; className?: string }> = ({
  width = 160,
  className = "",
}) => {
  const iconSize =
    typeof width === "number" ? Math.round(width * 0.22) : undefined;

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      style={typeof width === "number" ? { width } : undefined}
    >
      <img
        src={logoSrc}
        alt="Echo"
        width={iconSize ?? "22%"}
        height={iconSize ?? "22%"}
        className="object-contain shrink-0"
      />
      {/* eslint-disable-next-line i18next/no-literal-string -- brand name, not translated */}
      <span className="text-xl font-semibold tracking-tight text-text truncate">
        Echo
      </span>
    </div>
  );
};
