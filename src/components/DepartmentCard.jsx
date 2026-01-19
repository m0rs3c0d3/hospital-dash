import React from 'react';
import { formatPercentage, formatMinutes } from '../utils/formatters';

const StatusBadge = ({ status }) => {
  const labels = {
    critical: 'CRITICAL',
    warning: 'WARNING',
    normal: 'NORMAL'
  };
  
  return (
    <span className={`status-badge status-${status}`}>
      {labels[status]}
    </span>
  );
};

const ProgressBar = ({ value, warningThreshold, criticalThreshold }) => {
  let barClass = 'progress-normal';
  if (value >= criticalThreshold) barClass = 'progress-critical';
  else if (value >= warningThreshold) barClass = 'progress-warning';
  
  return (
    <div className="progress-container">
      <div 
        className={`progress-bar ${barClass}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
      <div 
        className="threshold-marker warning-marker"
        style={{ left: `${warningThreshold}%` }}
      />
      <div 
        className="threshold-marker critical-marker"
        style={{ left: `${criticalThreshold}%` }}
      />
    </div>
  );
};

const DepartmentCard = ({ department, isSelected, onClick }) => {
  const { name, shortName, icon, totalBeds, warningThreshold, criticalThreshold, metrics } = department;
  
  if (!metrics) return null;

  const { occupancy, waitTime, staff, admissions, discharges, occupiedBeds, availableBeds, status } = metrics;

  return (
    <div 
      className={`department-card ${isSelected ? 'selected' : ''} status-border-${status}`}
      onClick={onClick}
    >
      <div className="dept-header">
        <div className="dept-icon">{icon}</div>
        <div className="dept-info">
          <h3 className="dept-name">{shortName}</h3>
          <span className="dept-full-name">{name}</span>
        </div>
        <StatusBadge status={status} />
      </div>
      
      <div className="dept-occupancy">
        <div className="occupancy-label">
          <span>Occupancy</span>
          <span className="occupancy-value">{formatPercentage(occupancy)}</span>
        </div>
        <ProgressBar 
          value={occupancy} 
          warningThreshold={warningThreshold} 
          criticalThreshold={criticalThreshold} 
        />
      </div>
      
      <div className="dept-stats">
        <div className="dept-stat">
          <span className="stat-icon">🛏️</span>
          <div className="stat-content">
            <span className="stat-value">{occupiedBeds}/{totalBeds}</span>
            <span className="stat-label">Beds</span>
          </div>
        </div>
        <div className="dept-stat">
          <span className="stat-icon">⏱️</span>
          <div className="stat-content">
            <span className="stat-value">{waitTime > 0 ? formatMinutes(waitTime) : '—'}</span>
            <span className="stat-label">Wait</span>
          </div>
        </div>
        <div className="dept-stat">
          <span className="stat-icon">👥</span>
          <div className="stat-content">
            <span className="stat-value">{staff}</span>
            <span className="stat-label">Staff</span>
          </div>
        </div>
      </div>
      
      <div className="dept-flow">
        <span className="flow-in">↓ {admissions} in</span>
        <span className="flow-out">↑ {discharges} out</span>
      </div>
    </div>
  );
};

export default DepartmentCard;
