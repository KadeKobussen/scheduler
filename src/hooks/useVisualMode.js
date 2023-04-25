import { useState } from 'react'

const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  
  
  const transition = (nextMode, replace = false) => {
    if(!replace) {
      setMode(nextMode);
      setHistory(prev => ([...prev, nextMode]));
    } else {
      setMode(nextMode);
    }
  }

  const back = () => {
    if (history.length > 1) {
      history.pop();
      setMode(history[history.length - 1])
    }
  }


  return { mode, transition, back };
};

export default useVisualMode;