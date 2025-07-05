import React, { useEffect, useState } from "react";
import './Clock.css';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return <p className="clock">{time.toLocaleTimeString()}</p>;
}

export default Clock;