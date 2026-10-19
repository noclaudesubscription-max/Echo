import React from "react";
import { Modal } from "@heroui/react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  closeLabel: string;
  dismissible?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  title,
  children,
  onOpenChange,
  description,
  footer,
  closeLabel,
  dismissible = true,
  closeOnBackdrop = true,
  showCloseButton = true,
  className = "",
  contentClassName = "",
}) => {
  return (
    <Modal>
      <Modal.Backdrop
        isOpen={open}
        onOpenChange={onOpenChange}
        isDismissable={dismissible && closeOnBackdrop}
      >
        <Modal.Container
          className={`flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-mid-gray/20 bg-background shadow-xl outline-none sm:max-h-[calc(100dvh-3rem)] ${className}`}
        >
          <Modal.Dialog>
            {dismissible && showCloseButton && (
              <Modal.CloseTrigger
                aria-label={closeLabel}
                className="absolute right-3 top-3 shrink-0 cursor-pointer rounded-md border border-transparent p-1 text-mid-gray transition-colors hover:border-mid-gray/20 hover:bg-mid-gray/10 hover:text-text focus:outline-none focus-visible:ring-1 focus-visible:ring-logo-primary"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Modal.CloseTrigger>
            )}
            <Modal.Header className="flex shrink-0 items-start justify-between gap-3 border-b border-mid-gray/20 px-4 py-2.5">
              <div className="min-w-0">
                <Modal.Heading className="text-base font-semibold text-text">
                  {title}
                </Modal.Heading>
                {description && (
                  <p className="mt-1 text-sm text-mid-gray">{description}</p>
                )}
              </div>
            </Modal.Header>
            <Modal.Body
              className={`min-h-0 overflow-y-auto px-4 pb-4 pt-3 ${contentClassName}`}
            >
              {children}
            </Modal.Body>
            {footer && (
              <Modal.Footer className="flex shrink-0 justify-end gap-2 border-t border-mid-gray/20 px-4 py-3">
                {footer}
              </Modal.Footer>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
