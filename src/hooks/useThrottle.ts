import { useState, useRef, useEffect } from "react";

const useThrottle = (value: any, callback?: any, limit = 10000) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(async function() {
      if (Date.now() - lastRan.current >= limit) {
        if(callback)
          setThrottledValue(await callback(value));
        else
          setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };    
  }, [value, callback, limit]);

  return throttledValue;
}

export default useThrottle;