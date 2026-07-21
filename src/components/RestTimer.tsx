import { useEffect, useState } from "react";

export function RestTimer({ initialSeconds, onSkip }: { initialSeconds: number; onSkip: () => void }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          if ("vibrate" in navigator) navigator.vibrate([120, 60, 120]);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return (
    <aside className={seconds === 0 ? "rest-timer is-done" : "rest-timer"} aria-live="polite">
      <div className="timer-copy">
        <span className="eyebrow">{seconds === 0 ? "REST COMPLETE" : "RESTING"}</span>
        <strong>{String(minutes).padStart(2, "0")}:{String(remainder).padStart(2, "0")}</strong>
      </div>
      <div className="timer-actions">
        <button type="button" onClick={() => setSeconds((current) => Math.max(0, current - 15))}>−15</button>
        <button className="timer-skip" type="button" onClick={onSkip}>{seconds === 0 ? "Done" : "Skip"}</button>
        <button type="button" onClick={() => setSeconds((current) => current + 15)}>+15</button>
      </div>
    </aside>
  );
}
