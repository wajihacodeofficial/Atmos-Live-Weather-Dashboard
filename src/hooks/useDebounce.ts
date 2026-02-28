import { useCallback, useRef } from 'react';

export function useDebouncedCallback<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): ((...args: Args) => void) & { cancel: () => void } {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounced = useCallback(
    (...args: Args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const wrapped = (...args: Args) => debounced(...args);
  // eslint-disable-next-line
  wrapped.cancel = cancel;

  return wrapped as ((...args: Args) => void) & { cancel: () => void };
}
