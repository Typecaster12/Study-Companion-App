import React, { useState, useEffect } from 'react';
import './Pomodoro.css';

const Pomodoro = () => {
  // State variables
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  
  // Timer settings
  const workTime = 25;
  const breakTime = 5;
  const longBreakTime = 15;
  const cyclesBeforeLongBreak = 4;

  // Effect for the timer functionality
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            clearInterval(interval);
            handleTimerCompletion();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  // Handle timer completion
  const handleTimerCompletion = () => {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audio.play();
    
    if (!isBreak) {
      // Work session completed
      const newCycleCount = cycleCount + 1;
      setCycleCount(newCycleCount);
      
      if (newCycleCount % cyclesBeforeLongBreak === 0) {
        // Time for a long break
        setMinutes(longBreakTime);
        setIsBreak(true);
      } else {
        // Time for a short break
        setMinutes(breakTime);
        setIsBreak(true);
      }
    } else {
      // Break completed, back to work
      setMinutes(workTime);
      setIsBreak(false);
    }
    
    setIsActive(false);
  };

  // Start timer
  const startTimer = () => {
    setIsActive(true);
  };

  // Pause timer
  const pauseTimer = () => {
    setIsActive(false);
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    if (isBreak) {
      setMinutes(breakTime);
    } else {
      setMinutes(workTime);
    }
    setSeconds(0);
  };

  // Skip current session
  const skipSession = () => {
    setIsActive(false);
    if (isBreak) {
      // Skip to work
      setMinutes(workTime);
      setIsBreak(false);
    } else {
      // Skip to break
      const newCycleCount = cycleCount + 1;
      setCycleCount(newCycleCount);
      
      if (newCycleCount % cyclesBeforeLongBreak === 0) {
        setMinutes(longBreakTime);
      } else {
        setMinutes(breakTime);
      }
      setIsBreak(true);
    }
    setSeconds(0);
  };

  // Format time to always show two digits
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  // Calculate progress percentage for circular progress bar
  const calculateProgress = () => {
    const totalSeconds = (isBreak ? (cycleCount % cyclesBeforeLongBreak === 0 ? longBreakTime : breakTime) : workTime) * 60;
    const remainingSeconds = minutes * 60 + seconds;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-card">
        <h1 className="pomodoro-title">Pomodoro Timer</h1>
        
        <div className="timer-display">
          <div className="circular-progress-animated">
            <svg className="progress-ring" viewBox="0 0 120 120">
              <circle
                className="progress-bg"
                stroke="#e0e0e0"
                strokeWidth="8"
                fill="transparent"
                r="52"
                cx="60"
                cy="60"
              />
              <circle
                className="progress-bar"
                stroke="#b721ff"
                strokeWidth="8"
                fill="transparent"
                r="52"
                cx="60"
                cy="60"
                style={{
                  strokeDasharray: 326,
                  strokeDashoffset: 326 - (calculateProgress() * 326) / 100,
                  transition: 'stroke-dashoffset 1s cubic-bezier(0.23, 1, 0.32, 1)'
                }}
              />
            </svg>
            <div className="timer-numeric">
              <span className="timer-big">
                {formatTime(minutes)}:
                <span className="timer-seconds" key={seconds}>{formatTime(seconds)}</span>
              </span>
            </div>
          </div>
          
          <div className="timer-mode">
            {isBreak ? 
              (cycleCount % cyclesBeforeLongBreak === 0 ? 'Long Break' : 'Short Break') : 
              'Focus Time'}
          </div>
          
          <div className="cycle-count">
            Completed Cycles: {cycleCount}
          </div>
        </div>
        
        <div className="timer-controls">
          {!isActive ? (
            <button className="control-btn start-btn" onClick={startTimer}>
              Start
            </button>
          ) : (
            <button className="control-btn pause-btn" onClick={pauseTimer}>
              Pause
            </button>
          )}
          
          <button className="control-btn reset-btn" onClick={resetTimer}>
            Reset
          </button>
          
          <button className="control-btn skip-btn" onClick={skipSession}>
            Skip
          </button>
        </div>
        
        <div className="timer-settings">
          <div className="setting">
            <span>Focus Time: {workTime} min</span>
          </div>
          <div className="setting">
            <span>Short Break: {breakTime} min</span>
          </div>
          <div className="setting">
            <span>Long Break: {longBreakTime} min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
