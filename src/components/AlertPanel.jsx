import React, { useState } from 'react';
import { formatTime } from '../utils/formatters';

const AlertItem = ({ alert, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  
  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(alert.id), 300);
  };

  return (
    <div className={`alert-item alert-${alert.severity} ${isExiting ? 'exiting' : ''}`}>
      <div className="alert-icon">{alert.icon}</div>
      <div className="alert-content">
        <div className="alert-message">{alert.message}</div>
        <div className="alert-meta">
          <span className="alert-time">{formatTime(alert.timestamp)}</span>
        </div>
      </div>
      <button className="alert-dismiss" onClick={handleDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
};

const AlertPanel = ({ alerts }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [filter, setFilter] = useState('all');

  const handleDismiss = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const visibleAlerts = alerts
    .filter(a => !dismissedAlerts.has(a.id))
    .filter(a => filter === 'all' || a.severity === filter);

  const criticalCount = alerts.filter(a => !dismissedAlerts.has(a.id) && a.severity === 'critical').length;
  const warningCount = alerts.filter(a => !dismissedAlerts.has(a.id) && a.severity === 'warning').length;

  return (
    <div className="alert-panel">
      <div className="alert-header">
        <h3 className="alert-title">
          Active Alerts
          {(criticalCount + warningCount) > 0 && (
            <span className="alert-count">{criticalCount + warningCount}</span>
          )}
        </h3>
        <div className="alert-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn filter-critical ${filter === 'critical' ? 'active' : ''}`}
            onClick={() => setFilter('critical')}
          >
            Critical {criticalCount > 0 && `(${criticalCount})`}
          </button>
          <button 
            className={`filter-btn filter-warning ${filter === 'warning' ? 'active' : ''}`}
            onClick={() => setFilter('warning')}
          >
            Warning {warningCount > 0 && `(${warningCount})`}
          </button>
        </div>
      </div>
      
      <div className="alert-list">
        {visibleAlerts.length === 0 ? (
          <div className="no-alerts">
            <span className="no-alerts-icon">✓</span>
            <span>No active alerts</span>
          </div>
        ) : (
          visibleAlerts.map(alert => (
            <AlertItem 
              key={alert.id} 
              alert={alert} 
              onDismiss={handleDismiss}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AlertPanel;
