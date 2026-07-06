import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full resize-none rounded-lg border border-border bg-[#161616] px-4 py-3 text-sm text-white placeholder:text-muted/70 outline-none transition-colors focus:border-accent/60",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
