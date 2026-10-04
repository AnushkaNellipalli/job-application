import { useEffect, useRef, useState } from "react";

/**
 * Runs `load(signal)` when the component mounts and whenever `key` changes, and returns
 * { data, error, loading }. Cancels the request if the component unmounts or `key` changes
 * before it finishes (no stale results, no leaks).
 *
 *   const { data: job } = useAsync((signal) => getJob(id, { signal }), id);
 */
export function useAsync(load, key) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const latestLoad = useRef(load);

  useEffect(() => {
    latestLoad.current = load;
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, error: null, loading: true }));
    latestLoad
      .current(controller.signal)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setState({ data: null, error, loading: false });
      });
    return () => controller.abort();
  }, [key]);

  return state;
}
