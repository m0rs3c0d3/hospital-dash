// Time formatting utilities
export const formatTime = (hour) => {
  const displayHour = hour % 24;
  const period = displayHour >= 12 ? 'PM' : 'AM';
  const formattedHour = displayHour === 0 ? 12 : displayHour > 12 ? displayHour - 12 : displayHour;
  return `${formattedHour}:00 ${period}`;
};

export const formatTimeShort = (hour) => {
  const displayHour = hour % 24;
  const period = displayHour >= 12 ? 'P' : 'A';
  const formattedHour = displayHour === 0 ? 12 : displayHour > 12 ? displayHour - 12 : displayHour;
  return `${formattedHour}${period}`;
};

export const formatDayLabel = (hour) => {
  if (hour < 24) return 'Yesterday';
  return 'Today';
};

export const formatFullTime = (hour) => {
  const day = formatDayLabel(hour);
  const time = formatTime(hour);
  return `${day} ${time}`;
};

// Percentage formatting
export const formatPercentage = (value, decimals = 0) => {
  return `${value.toFixed(decimals)}%`;
};

// Duration formatting
export const formatMinutes = (minutes) => {
  if (minutes === 0) return 'N/A';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Number formatting with commas
export const formatNumber = (num) => {
  return num.toLocaleString();
};

// Ratio formatting
export const formatRatio = (numerator, denominator) => {
  if (denominator === 0) return 'N/A';
  return `${numerator}:${denominator}`;
};

// Status text based on occupancy
export const getStatusText = (occupancy, warningThreshold, criticalThreshold) => {
  if (occupancy >= criticalThreshold) return 'Critical';
  if (occupancy >= warningThreshold) return 'Warning';
  if (occupancy >= 50) return 'Normal';
  return 'Low';
};

// Severity color mapping
export const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return '#ff4757';
    case 'warning': return '#ffa502';
    case 'info': return '#3498db';
    default: return '#7f8c8d';
  }
};
