
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw, Timer as TimerIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  presets: number[];
  className?: string;
}

type TimerStatus = "idle" | "running" | "paused";

const Timer: React.FC<TimerProps> = ({ presets, className }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === "running" && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (timeLeft === 0 && status === "running") {
      setStatus("idle");
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Timer Complete!', {
          body: 'Your timer has finished.',
        });
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, timeLeft]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const startTimer = () => {
    if (timeLeft > 0) {
      setStatus("running");
    }
  };

  const pauseTimer = () => {
    setStatus("paused");
  };

  const resetTimer = () => {
    setStatus("idle");
    setTimeLeft(initialTime);
  };

  const setTimer = (seconds: number) => {
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setStatus("idle");
  };

  const handleCustomTime = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const minutes = Number(formData.get('minutes')) || 0;
    const seconds = Number(formData.get('seconds')) || 0;
    
    const totalSeconds = (minutes * 60) + seconds;
    if (totalSeconds > 0) {
      setTimer(totalSeconds);
    }
    
    // Reset form
    e.currentTarget.reset();
  };

  const progress = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;

  return (
    <div className={cn("glass-panel rounded-2xl p-6 w-full", className)}>
      <div className="flex items-center justify-center mb-4">
        <TimerIcon className="mr-2 h-6 w-6 text-theme" />
        <h2 className="text-xl font-semibold">Timer</h2>
      </div>
      
      <div className="relative mb-4">
        <div 
          className="bg-theme/20 h-2 rounded-full overflow-hidden"
          aria-hidden="true"
        >
          <div 
            className="bg-theme h-full transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="text-6xl font-bold text-center mb-6 time-display">
        {formatTime(timeLeft)}
      </div>
      
      <div className="flex justify-center gap-2 mb-6">
        {status === "running" ? (
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-full border-theme text-theme hover:text-theme-foreground hover:bg-theme"
            onClick={pauseTimer}
          >
            <Pause className="h-5 w-5" />
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-full border-theme text-theme hover:text-theme-foreground hover:bg-theme"
            onClick={startTimer}
            disabled={timeLeft === 0}
          >
            <Play className="h-5 w-5" />
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-12 w-12 rounded-full border-theme text-theme hover:text-theme-foreground hover:bg-theme"
          onClick={resetTimer}
          disabled={timeLeft === 0 && initialTime === 0}
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presets.map((seconds) => (
          <Button 
            key={seconds} 
            variant="outline"
            className="border-theme/30 hover:bg-theme hover:text-theme-foreground"
            onClick={() => setTimer(seconds)}
          >
            {seconds >= 3600 
              ? `${Math.floor(seconds / 3600)}h` 
              : seconds >= 60 
                ? `${Math.floor(seconds / 60)}m` 
                : `${seconds}s`
            }
          </Button>
        ))}
      </div>
      
      <form onSubmit={handleCustomTime} className="flex gap-2">
        <input
          type="number"
          name="minutes"
          placeholder="Min"
          min="0"
          className="flex-1 px-3 py-2 rounded-md border border-theme/30 bg-background/50"
        />
        <input
          type="number"
          name="seconds"
          placeholder="Sec"
          min="0"
          max="59"
          className="flex-1 px-3 py-2 rounded-md border border-theme/30 bg-background/50"
        />
        <Button 
          type="submit"
          variant="outline"
          className="border-theme/30 hover:bg-theme hover:text-theme-foreground"
        >
          Set
        </Button>
      </form>
    </div>
  );
};

export default Timer;
