import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    setMode(newMode);
    if (replace) {
      setHistory((prev) => {
        return [...prev.slice(0, -1), newMode];
      })
    } else {
      setHistory((prev) => {
        return [...prev, newMode]
      });

    }
    
  }

  function back() {
    // set limit that it will not pass initial mode
    if (history.length > 1) {
      // remove the last mode in history
      setHistory((prev) => {
        const newHistory = prev.slice(0, prev.length - 1);
        return newHistory;
      });
      setMode(history[history.length - 2]);

    }

  }

  return { mode, transition, back };

}