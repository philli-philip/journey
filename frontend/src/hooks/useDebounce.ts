import { useCallback, useRef } from "react";

export function useDebounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number
) {
  const timeoutRef = useRef<number>();

  return useCallback(
    (...args: unknown[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...(args as T));
      }, delay);
    },
    [callback, delay]
  );
}
