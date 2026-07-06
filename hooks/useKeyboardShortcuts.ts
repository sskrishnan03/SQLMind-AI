"use client";

import { useEffect } from "react";

interface ShortcutHandlers {
  onGenerate?: () => void;
  onCopy?: () => void;
  onFocusInput?: () => void;
  onClear?: () => void;
}

/**
 * Wires up:
 *  - Ctrl/Cmd+Enter -> generate
 *  - Ctrl/Cmd+/     -> focus input
 *  - Ctrl/Cmd+L     -> clear input
 * Copy uses the browser's native Ctrl+C on selected text; onCopy is
 * reserved for a future "copy SQL regardless of selection" shortcut.
 */
export function useKeyboardShortcuts({
  onGenerate,
  onFocusInput,
  onClear,
}: ShortcutHandlers) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;

      if (e.key === "Enter") {
        e.preventDefault();
        onGenerate?.();
      } else if (e.key === "/") {
        e.preventDefault();
        onFocusInput?.();
      } else if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        onClear?.();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onGenerate, onFocusInput, onClear]);
}
