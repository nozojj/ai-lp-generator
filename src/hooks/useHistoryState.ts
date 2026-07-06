import { useCallback, useEffect, useReducer, useRef } from "react";

type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
  pendingBase: T | null;
};

type Action<T> =
  | { type: "SET"; payload: T | ((prev: T) => T); immediate: boolean }
  | { type: "COMMIT" }
  | { type: "UNDO" }
  | { type: "REDO" };

function reducer<T>(state: HistoryState<T>, action: Action<T>): HistoryState<T> {
  switch (action.type) {
    case "SET": {
      const nextPresent =
        typeof action.payload === "function"
          ? (action.payload as (prev: T) => T)(state.present)
          : action.payload;

      const pendingBase = state.pendingBase ?? state.present;

      if (action.immediate) {
        return {
          past: [...state.past, pendingBase],
          present: nextPresent,
          future: [],
          pendingBase: null,
        };
      }

      return {
        ...state,
        present: nextPresent,
        pendingBase,
        future: [],
      };
    }

    case "COMMIT": {
      if (state.pendingBase === null) return state;

      return {
        ...state,
        past: [...state.past, state.pendingBase],
        pendingBase: null,
      };
    }

    case "UNDO": {
      const pastStack =
        state.pendingBase !== null
          ? [...state.past, state.pendingBase]
          : state.past;

      if (pastStack.length === 0) {
        return { ...state, pendingBase: null };
      }

      const previous = pastStack[pastStack.length - 1];

      return {
        past: pastStack.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
        pendingBase: null,
      };
    }

    case "REDO": {
      if (state.future.length === 0) return state;

      const [next, ...rest] = state.future;

      return {
        past: [...state.past, state.present],
        present: next,
        future: rest,
        pendingBase: null,
      };
    }
  }
}

export function useHistoryState<T>(initialState: T, debounceMs = 600) {
  const [state, dispatch] = useReducer(reducer<T>, {
    past: [],
    present: initialState,
    future: [],
    pendingBase: null,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const set = useCallback(
    (updater: T | ((prev: T) => T), immediate = false) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      dispatch({ type: "SET", payload: updater, immediate });

      if (!immediate) {
        timerRef.current = setTimeout(() => {
          dispatch({ type: "COMMIT" });
        }, debounceMs);
      }
    },
    [debounceMs],
  );

  const undo = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    dispatch({ type: "REDO" });
  }, []);

  return {
    state: state.present,
    set,
    undo,
    redo,
    canUndo: state.past.length > 0 || state.pendingBase !== null,
    canRedo: state.future.length > 0,
  };
}
