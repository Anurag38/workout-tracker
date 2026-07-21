import { useCallback, useEffect, useState } from "react";
import { loadState, saveState } from "../lib/db";
import type { AppState } from "../types";

export function useStore() {
  const [state, setState] = useState<AppState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadState()
      .then((loaded) => {
        if (active) setState(loaded);
      })
      .catch(() => {
        if (active) setError("LiftLog could not open local storage on this device.");
      });
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback((recipe: (current: AppState) => AppState) => {
    setState((current) => {
      if (!current) return current;
      const next = recipe(current);
      saveState(next).catch(() => setError("Your latest change could not be saved."));
      return next;
    });
  }, []);

  const replace = useCallback((next: AppState) => {
    setState(next);
    return saveState(next).catch(() => {
      setError("That data was loaded, but could not be saved locally.");
      throw new Error("Save failed");
    });
  }, []);

  return { state, error, clearError: () => setError(null), update, replace };
}
