import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown as HeroDropdown, Button, Label, Description } from "@heroui/react";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  className?: string;
  menuClassName?: string;
  selectedValue: string | null;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onOpen?: () => void;
}

// Adapter: keeps this app's flat (options/selectedValue/onSelect) API while
// rendering HeroUI's compound Dropdown pieces underneath, so every existing
// caller (ModelDropdown, settings rows, ...) needs no changes.
export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  className = "",
  menuClassName = "",
  placeholder = "Select an option...",
  disabled = false,
  onOpen,
}) => {
  const { t } = useTranslation();
  const selectedOption = options.find((option) => option.value === selectedValue);

  return (
    <HeroDropdown
      className={className}
      onOpenChange={(isOpen: boolean) => {
        if (isOpen) onOpen?.();
      }}
    >
      <Button
        variant="secondary"
        isDisabled={disabled}
        className="min-w-[200px] w-full text-start grid grid-cols-[1fr_auto] gap-2 items-center"
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
      </Button>
      <HeroDropdown.Popover className={`max-h-60 overflow-y-auto ${menuClassName}`}>
        <HeroDropdown.Menu
          onAction={(key) => onSelect(String(key))}
          disabledKeys={options.filter((o) => o.disabled).map((o) => o.value)}
          selectedKeys={selectedValue ? [selectedValue] : []}
        >
          {options.length === 0 ? (
            <HeroDropdown.Item id="__empty" textValue={t("common.noOptionsFound")} isDisabled>
              <Label>{t("common.noOptionsFound")}</Label>
            </HeroDropdown.Item>
          ) : (
            options.map((option) => (
              <HeroDropdown.Item key={option.value} id={option.value} textValue={option.label}>
                <div className="flex flex-col">
                  <Label>{option.label}</Label>
                  {option.description && <Description>{option.description}</Description>}
                </div>
              </HeroDropdown.Item>
            ))
          )}
        </HeroDropdown.Menu>
      </HeroDropdown.Popover>
    </HeroDropdown>
  );
};
