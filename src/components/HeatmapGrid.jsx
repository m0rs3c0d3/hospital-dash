import React, { useState } from 'react';
import { formatTimeShort, formatTime } from '../utils/formatters';

const HeatmapCell = ({ value, status, hour, onHover, isHighlighted }) => {
  // Color intensity based on value
  const getBackgroundColor = () => {
    if (status === 'critical') {
      const intensity = Math.min((value - 85) / 15, 1);
      return `rgba(255, 71, 87, ${0.5 + intensity * 0.5})`;
    }
    if (status === 'warning') {
      const intensity = (value - 70) / 20;
      return `rgba(255, 165, 2, ${0.4 + intensity * 0.4})`;
    }
    const intensity = value / 70;
    return `rgba(46, 213, 115, ${0.2 + intensity * 0.4})`;
  };

  return (
    <div 
      className={`heatmap-cell ${status} ${isHighlighted ? 'highlighted' : ''}`}
      style={{ backgroundColor: getBackgroundColor() }}
      onMouseEnter={() => onHover({ value, hour, status })}
      onMouseLeave={() => onHover(null)}
      title={`${value}% at ${formatTime(hour)}`}
    />
  );
};

const HeatmapGrid = ({ data, currentHour }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [hoveredDept, setHoveredDept] = useState(null);

  // Get hours for header (every 4th hour)
  const hourLabels = data[0]?.data
    .filter((_, i) => i % 4 === 0)
    .map(d => d.hour) || [];

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <h3 className="heatmap-title">Department Occupancy Heatmap</h3>
        {hoveredCell && (
          <div className="heatmap-tooltip">
            <span className={`tooltip-status ${hoveredCell.status}`}>
              {hoveredCell.value}%
            </span>
            at {formatTime(hoveredCell.hour)}
          </div>
        )}
      </div>
      
      <div className="heatmap-grid">
        {/* Time axis header */}
        <div className="heatmap-row header-row">
          <div className="heatmap-label" />
          {hourLabels.map(hour => (
            <div 
              key={hour} 
              className={`heatmap-hour ${hour === currentHour ? 'current' : ''}`}
            >
              {formatTimeShort(hour)}
            </div>
          ))}
        </div>

        {/* Department rows */}
        {data.map(dept => (
          <div 
            key={dept.departmentId} 
            className={`heatmap-row ${hoveredDept === dept.departmentId ? 'highlighted' : ''}`}
            onMouseEnter={() => setHoveredDept(dept.departmentId)}
            onMouseLeave={() => setHoveredDept(null)}
          >
            <div className="heatmap-label">
              <span className="dept-icon">{dept.icon}</span>
              <span className="dept-name">{dept.department}</span>
            </div>
            <div className="heatmap-cells">
              {dept.data.map((cell, i) => (
                <HeatmapCell
                  key={cell.hour}
                  value={cell.value}
                  status={cell.status}
                  hour={cell.hour}
                  onHover={setHoveredCell}
                  isHighlighted={cell.hour === currentHour}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="heatmap-legend">
        <span className="legend-label">Low</span>
        <div className="legend-gradient">
          <div className="gradient-segment normal" />
          <div className="gradient-segment warning" />
          <div className="gradient-segment critical" />
        </div>
        <span className="legend-label">Critical</span>
      </div>
    </div>
  );
};

export default HeatmapGrid;
