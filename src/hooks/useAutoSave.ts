"use client";

import { useRef, useCallback, useState } from "react";

export type TAutoSaveStatus = "idle" | "saving" | "saved" | "error";

interface IUseAutoSaveOptions {
  onSave: (value: unknown) => Promise<void>;
  delay?: number;
}

export function useAutoSave({ onSave, delay = 1000 }: IUseAutoSaveOptions) {
  const [status, setStatus] = useState<TAutoSaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestValueRef = useRef<unknown>(null);

  const trigger = useCallback(
    (value: unknown) => {
      latestValueRef.current = value;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setStatus("saving");

      timerRef.current = setTimeout(async () => {
        try {
          await onSave(latestValueRef.current);
          setStatus("saved");
        } catch {
          setStatus("error");
        }
      }, delay);
    },
    [onSave, delay]
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setStatus("idle");
  }, []);

  return { trigger, cancel, status };
}
