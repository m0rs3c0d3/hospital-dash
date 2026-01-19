import React from 'react';
import { formatTime, formatDayLabel } from '../utils/formatters';

const TimeSlider = ({ 
  currentHour, 
  maxHour,
  isPlaying,
  playbackSpeed,
  onSeek,
  onTogglePlayback,
  onStepForward,
  onStepBackward,
  onGoToStart,
  onGoToEnd,
  onCycleSpeed
}) => {
  const progress = (currentHour / maxHour) * 100;
  
  const handleSliderChange = (e) => {
    onSeek(parseInt(e.target.value, 10));
  };

  // Generate tick marks for every 6 hours
  const ticks = [];
  for (let i = 0; i <= maxHour; i += 6) {
    ticks.push({
      hour: i,
      position: (i / maxHour) * 100
    });
  }

  return (
    <div className="time-slider">
      <div className="time-display">
        <div className="time-current">
          <span className="time-day">{formatDayLabel(currentHour)}</span>
          <span className="time-clock">{formatTime(currentHour)}</span>
        </div>
        <div className="time-range">
          <span className="time-label">48-Hour View</span>
        </div>
      </div>
      
      <div className="slider-container">
        <div className="slider-track">
          <div 
            className="slider-progress"
            style={{ width: `${progress}%` }}
          />
          <div className="slider-ticks">
            {ticks.map(tick => (
              <div 
                key={tick.hour}
                className="slider-tick"
                style={{ left: `${tick.position}%` }}
              >
                <span className="tick-label">{formatTime(tick.hour)}</span>
              </div>
            ))}
          </div>
          <div 
            className="day-separator"
            style={{ left: `${(24 / maxHour) * 100}%` }}
          >
            <span className="day-label">Today</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max={maxHour}
          value={currentHour}
          onChange={handleSliderChange}
          className="slider-input"
        />
      </div>
      
      <div className="playback-controls">
        <button 
          className="control-btn" 
          onClick={onGoToStart}
          title="Go to start"
        >
          ⏮
        </button>
        <button 
          className="control-btn" 
          onClick={onStepBackward}
          title="Step backward"
        >
          ◀◀
        </button>
        <button 
          className="control-btn play-btn" 
          onClick={onTogglePlayback}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button 
          className="control-btn" 
          onClick={onStepForward}
          title="Step forward"
        >
          ▶▶
        </button>
        <button 
          className="control-btn" 
          onClick={onGoToEnd}
          title="Go to end"
        >
          ⏭
        </button>
        <button 
          className="control-btn speed-btn" 
          onClick={onCycleSpeed}
          title="Change speed"
        >
          {playbackSpeed}x
        </button>
      </div>
    </div>
  );
};

export default TimeSlider;
