
import React, { useState, useEffect } from "react";
import { Clock as ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClockProps {
  is24HourFormat: boolean;
  className?: string;
}

const Clock: React.FC<ClockProps> = ({ is24HourFormat, className }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const hours = is24HourFormat 
    ? time.getHours() 
    : time.getHours() % 12 || 12;
  
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <div className={cn("glass-panel rounded-2xl p-6 w-full", className)}>
      <div className="flex items-center justify-center mb-4">
        <ClockIcon className="mr-2 h-6 w-6 text-theme" />
        <h2 className="text-xl font-semibold">Clock</h2>
      </div>
      
      <div className="text-6xl font-bold text-center time-display">
        {hours}:{minutes}:{seconds}
        {!is24HourFormat && (
          <span className="text-2xl ml-2 text-adaptive">{ampm}</span>
        )}
      </div>
      
      <div className="text-center text-adaptive mt-4">
        {time.toLocaleDateString(undefined, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </div>
  );
};

export default Clock;
