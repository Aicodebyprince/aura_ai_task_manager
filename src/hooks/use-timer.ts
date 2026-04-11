
"use client"
import { useState, useEffect, useCallback } from 'react';
import type { Task } from '@/app/page';

export function useTimer(task: Task) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (task.status === 'in-progress' && task.estimatedTime) {
      const estimatedSeconds = task.estimatedTime * 3600;
      const spent = task.timeSpent || 0;
      setTimeRemaining(estimatedSeconds - spent);
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [task.status, task.estimatedTime, task.timeSpent]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const startTimer = useCallback(() => {
    if(task.estimatedTime) {
      setTimeRemaining(task.estimatedTime * 3600);
      setIsRunning(true);
    }
  }, [task.estimatedTime]);

  return { timeRemaining, isRunning, startTimer };
}

    