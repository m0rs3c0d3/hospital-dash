import React from 'react';
import { formatNumber, formatMinutes, formatPercentage } from '../utils/formatters';
import { calculateTrend } from '../utils/calculations';

const TrendIndicator = ({ current, previous, inverted = false }) => {
  const { direction, change } = calculateTrend(current, previous);
  
  if (direction === 'stable') return null;
  
  const isPositive = inverted ? direction === 'down' : direction === 'up';
  const color = isPositive ? 'var(--status-warning)' : 'var(--status-normal)';
  const arrow = direction === 'up' ? '↑' : '↓';
  
  return (
    <span className="trend-indicator" style={{ color }}>
      {arrow} {change}%
    </span>
  );
};

const MetricCard = ({ label, value, subValue, icon, trend, previousValue, inverted }) => (
  <div className="metric-card">
    <div className="metric-icon">{icon}</div>
    <div className="metric-content">
      <div className="metric-label">{label}</div>
      <div className="metric-value">
        {value}
        {previousValue !== undefined && (
          <TrendIndicator current={parseFloat(value)} previous={previousValue} inverted={inverted} />
        )}
      </div>
      {subValue && <div className="metric-subvalue">{subValue}</div>}
    </div>
  </div>
);

const MetricsGrid = ({ hospitalMetrics, previousMetrics, hospital }) => {
  const { 
    totalPatients, 
    totalBeds, 
    avgOccupancy, 
    avgWaitTime, 
    totalStaff, 
    staffRatio,
    totalAdmissions,
    totalDischarges,
    netFlow
  } = hospitalMetrics;

  return (
    <div className="metrics-grid">
      <MetricCard
        label="Total Patients"
        value={formatNumber(totalPatients)}
        subValue={`of ${formatNumber(totalBeds)} beds`}
        icon="🛏️"
        previousValue={previousMetrics.totalPatients}
      />
      <MetricCard
        label="Bed Occupancy"
        value={formatPercentage(avgOccupancy)}
        subValue={avgOccupancy >= 85 ? 'High Capacity' : avgOccupancy >= 70 ? 'Moderate' : 'Normal'}
        icon="📊"
        previousValue={previousMetrics.avgOccupancy}
      />
      <MetricCard
        label="Avg Wait Time"
        value={formatMinutes(avgWaitTime)}
        subValue={avgWaitTime > 30 ? 'Above Target' : 'Within Target'}
        icon="⏱️"
        previousValue={previousMetrics.avgWaitTime}
        inverted={true}
      />
      <MetricCard
        label="Staff on Duty"
        value={formatNumber(totalStaff)}
        subValue={`${staffRatio} patients/staff`}
        icon="👨‍⚕️"
      />
      <MetricCard
        label="Admissions"
        value={formatNumber(totalAdmissions)}
        subValue="This hour"
        icon="📥"
        previousValue={previousMetrics.totalAdmissions}
      />
      <MetricCard
        label="Discharges"
        value={formatNumber(totalDischarges)}
        subValue="This hour"
        icon="📤"
        previousValue={previousMetrics.totalDischarges}
      />
    </div>
  );
};

export default MetricsGrid;
