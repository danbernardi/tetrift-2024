import { useEffect, useRef } from "react";

export const useFrameLoop = (callback, fps = 60) => {
  const requestID = useRef();
  const previousTime = useRef();
  let elapsed = 0;
  let now = Date.now();
  let then = Date.now();
  let fpsInterval = 1000 / fps;

  const loop = time => {
    if (previousTime.current !== undefined) {
      now = Date.now();
      elapsed = now - then;

      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        callback(time);
      }
    }

    previousTime.current = time;
    startLoop();
  }

  const startLoop = () => {
    requestID.current = requestAnimationFrame(loop);
  }

  const stopLoop = () => {
    cancelAnimationFrame(requestID.current);
    requestID.current = null;
  };

  useEffect(() => {
    requestID.current = requestAnimationFrame(loop);
    startLoop();
    return  () => stopLoop();
  }, []);

  return {
    stopLoop,
    startLoop
  }
}
