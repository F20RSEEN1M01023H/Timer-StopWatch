import React, { useRef, useState, useEffect } from "react";

const TimerStopWatch = () => {
  /** Utility: ms → "MM:SS:HH" (HH = hundredths) */
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, "0");
    const hundredths = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${minutes}:${seconds}:${hundredths}`;
  };
  // Mode states
  const [mode, setMode] = useState("stopwatch");
  const [isRunning, setIsRunning] = useState(false);

  //Stopwatch states
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(null);

  //Timer states
  const [remaining, setRemaining] = useState(0);
  const [minsInput, setMinsInput] = useState("0");
  const [secsInput, setSecsInput] = useState("30");
  const endTimeRef = useRef(null);

  // One interval for both modes
  const intervalRef = useRef(null);

  const handleStart = () => {
    if (isRunning) return;
    if (mode === "stopwatch") {
      startTimeRef.current = Date.now() - elapsed;
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current);
      }, 50);
    } else {
      let base = remaining;
      if (base <= 0) {
        const total =
          Math.max(parseInt(minsInput || "0", 10), 0) * 60 * 1000 +
          Math.max(parseInt(secsInput || "0", 10), 0) * 1000;
        base = total;
        setRemaining(total);
      }
      endTimeRef.current = Date.now() + base;
      intervalRef.current = setInterval(() => {
        const left = Math.max(endTimeRef.current - Date.now(), 0);
        setRemaining(left);
        if (left === 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
        }
      }, 100);
    }
    setIsRunning(true);
  };
  const handlePause = () => {
    if (!isRunning) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  };
  const handleReset = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    if (mode === "stopwatch") {
      setElapsed(0);
      startTimeRef.current = null;
    } else {
      setRemaining(0);
      endTimeRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  }, [mode]);

  const display =
    mode === "stopwatch" ? formatTime(elapsed) : formatTime(remaining);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-gray-600 to-slate-800 p-6 rounded-lg">
      <div className="w-full max-w-lg rounded-2xl bg-white/90 backdrop-blur-2xl shadow-2xl p-6">
        <div className="flex gap-2 mb-6">
          <button
            className={`flex-1 py-2 rounded-xl font-semibold ${
              mode === "stopwatch"
                ? "bg-blue-600 text-white"
                : "bg-gray-50 text-gray-700 hover:bg-gray-400 hover:text-white"
            }`}
            onClick={() => setMode("stopwatch")}
          >
            StopWatch
          </button>
          <button
            className={`flex-1 py-2 rounded-xl font-semibold ${
              mode === "timer"
                ? "bg-blue-600 text-white"
                : "bg-gray-50 text-gray-700 hover:bg-gray-400 hover:text-white"
            }`}
            onClick={() => setMode("timer")}
          >
            Timer
          </button>
        </div>
        {mode === "timer" && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minutes
              </label>
              <input
                type="number"
                min="0"
                value={minsInput}
                onChange={(e) => setMinsInput(e.target.value)}
                className="w-full rounded-lg border border-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seconds
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={secsInput}
                onChange={(e) => setSecsInput(e.target.value)}
                className="w-full rounded-lg border border-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        )}
        {/* Time display  */}
        <div className="text-center ">
          <div className="text-5xl md:text-6xl font-mono font-bold text-gray-900 tracking-wider">
            {display}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {mode === "stopwatch"
              ? "Minutes:Seconds:Hundredths"
              : "Time Remaining"}
          </p>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {!isRunning ? (
            <button
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
              onClick={handleStart}
            >
              Start
            </button>
          ) : (
            <button
              className="px-5 py-2 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600"
              onClick={handlePause}
            >
              Pause
            </button>
          )}
          <button
            className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerStopWatch;
