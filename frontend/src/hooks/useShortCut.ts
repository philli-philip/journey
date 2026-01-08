import { useEffect } from "react";

type KeyCombination = {
  key: string;
  ctrl?: boolean;
  cmd?: boolean;
  alt?: boolean;
  shift?: boolean;
};

// Detect if we're on Mac
const isMac =
  typeof window !== "undefined" &&
  navigator.platform.toUpperCase().indexOf("MAC") >= 0;

function parseKeyShortcut(shortcut: string): KeyCombination {
  const parts = shortcut.split(" + ").map((part) => part.trim().toLowerCase());
  const combination: KeyCombination = { key: "" };

  for (const part of parts) {
    switch (part) {
      case "ctrl":
      case "control":
        combination.ctrl = true;
        break;
      case "cmd":
      case "meta":
      case "command":
        combination.cmd = true;
        break;
      case "mod": // Cross-platform modifier
        if (isMac) {
          combination.cmd = true;
        } else {
          combination.ctrl = true;
        }
        break;
      case "alt":
      case "option":
        combination.alt = true;
        break;
      case "shift":
        combination.shift = true;
        break;
      default:
        combination.key = part;
        break;
    }
  }

  return combination;
}

function matchesKeyEvent(
  event: KeyboardEvent,
  combination: KeyCombination
): boolean {
  const keyMatches = event.key.toLowerCase() === combination.key.toLowerCase();
  const ctrlMatches = !!combination.ctrl === event.ctrlKey;
  const cmdMatches = !!combination.cmd === event.metaKey;
  const altMatches = !!combination.alt === event.altKey;
  const shiftMatches = !!combination.shift === event.shiftKey;

  return keyMatches && ctrlMatches && cmdMatches && altMatches && shiftMatches;
}

export function useKeyShortCut(
  keyOrCombination: string,
  callback: (
    event: KeyboardEvent
  ) => void | Promise<void> | (() => void) | (() => Promise<void>)
) {
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Support both single keys and combinations
      if (keyOrCombination.includes(" + ")) {
        const combination = parseKeyShortcut(keyOrCombination);
        if (matchesKeyEvent(e, combination)) {
          try {
            await callback(e);
          } catch (error) {
            console.error("Error in keyboard shortcut handler:", error);
          }
        }
      } else {
        // Backward compatibility for single keys
        if (e.key === keyOrCombination) {
          try {
            await callback(e);
          } catch (error) {
            console.error("Error in keyboard shortcut handler:", error);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyOrCombination, callback]);
}
