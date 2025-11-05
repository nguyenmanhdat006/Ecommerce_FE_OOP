import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogOverlay = (props) => (
  <DialogPrimitive.Overlay
    {...props}
    className={"fixed inset-0 bg-black/40 z-40 " + (props.className ?? "")}
  />
);
export const DialogContent = React.forwardRef((props, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      {...props}
      ref={ref}
      className={
        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg outline-none " +
        (props.className ?? "")
      }
    >
      {props.children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ children, ...props }) => (
  <div {...props} className="mb-4">
    {children}
  </div>
);
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export const DialogFooter = ({ children, ...props }) => (
  <div {...props} className="flex flex-row-reverse gap-2 mt-4">
    {children}
  </div>
);
