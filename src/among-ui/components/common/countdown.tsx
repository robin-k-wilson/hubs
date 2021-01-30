import React, { useEffect, useState } from "react";

type CountdownProps = {
  timestamp: number | null;
  classes: string;
};

let timer: number | null = null;
export function Countdown(props: CountdownProps) {
  const { timestamp, classes } = props;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (timestamp !== null && timestamp > Date.now() && !timer) {
      setCount(Math.ceil((timestamp - Date.now()) / 1000)); // so the count finishes right after 1
      timer = window.setInterval(countdown, 1000);
    }
  }, [count, timer]);
  function countdown() {
    if (count > Date.now()) {
      const newCount = Math.ceil((count - Date.now()) / 1000);
      setCount(newCount);
    } else {
      setCount(0);
      clearCount();
    }
  }
  function clearCount() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  return <>{!!count && <span className={classes}>{count}</span>}</>;
}
