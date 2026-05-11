import { useEffect, useState } from "react";

export function useMockFetch<T>(data: T, delay = 600): { data: T | null; loading: boolean } {
  const [state, setState] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const t = setTimeout(() => {
      if (active) {
        setState(data);
        setLoading(false);
      }
    }, delay);
    return () => {
      active = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data: state, loading };
}
