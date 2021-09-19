import { useEffect, useRef } from 'react';

function useInterval(callback, delayInMillis) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (delayInMillis === null) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delayInMillis);

    return () => clearInterval(id);
  }, [delayInMillis]);
}

export default useInterval;
