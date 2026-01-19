// Calculate hospital-wide metrics from department data
export const calculateHospitalMetrics = (timeSeriesData, departments, currentHour) => {
  const currentData = timeSeriesData.find(d => d.hour === currentHour) || timeSeriesData[0];
  
  let totalPatients = 0;
  let totalBeds = 0;
  let totalStaff = 0;
  let totalWaitTime = 0;
  let deptWithWait = 0;
  let totalAdmissions = 0;
  let totalDischarges = 0;

  departments.forEach(dept => {
    const deptData = currentData[dept.id];
    if (deptData) {
      const occupied = Math.round((deptData.occupancy / 100) * dept.totalBeds);
      totalPatients += occupied;
      totalBeds += dept.totalBeds;
      totalStaff += deptData.staff;
      totalAdmissions += deptData.admissions;
      totalDischarges += deptData.discharges;
      
      if (deptData.waitTime > 0) {
        totalWaitTime += deptData.waitTime;
        deptWithWait++;
      }
    }
  });

  const avgOccupancy = totalBeds > 0 ? (totalPatients / totalBeds) * 100 : 0;
  const avgWaitTime = deptWithWait > 0 ? totalWaitTime / deptWithWait : 0;
  const staffRatio = totalStaff > 0 ? (totalPatients / totalStaff).toFixed(1) : 0;

  return {
    totalPatients,
    totalBeds,
    avgOccupancy: Math.round(avgOccupancy),
    avgWaitTime: Math.round(avgWaitTime),
    totalStaff,
    staffRatio,
    totalAdmissions,
    totalDischarges,
    netFlow: totalAdmissions - totalDischarges
  };
};

// Get department metrics for a specific hour
export const getDepartmentMetrics = (timeSeriesData, department, currentHour) => {
  const currentData = timeSeriesData.find(d => d.hour === currentHour) || timeSeriesData[0];
  const deptData = currentData[department.id];
  
  if (!deptData) return null;

  const occupiedBeds = Math.round((deptData.occupancy / 100) * department.totalBeds);
  const availableBeds = department.totalBeds - occupiedBeds;

  return {
    ...deptData,
    occupiedBeds,
    availableBeds,
    totalBeds: department.totalBeds,
    status: getOccupancyStatus(deptData.occupancy, department.warningThreshold, department.criticalThreshold)
  };
};

// Determine occupancy status
export const getOccupancyStatus = (occupancy, warningThreshold, criticalThreshold) => {
  if (occupancy >= criticalThreshold) return 'critical';
  if (occupancy >= warningThreshold) return 'warning';
  return 'normal';
};

// Generate alerts based on current metrics
export const generateAlerts = (timeSeriesData, departments, alertTypes, currentHour) => {
  const alerts = [];
  const currentData = timeSeriesData.find(d => d.hour === currentHour) || timeSeriesData[0];

  departments.forEach(dept => {
    const deptData = currentData[dept.id];
    if (!deptData) return;

    // Capacity alerts
    if (deptData.occupancy >= dept.criticalThreshold) {
      const alertType = alertTypes.find(a => a.id === 'capacity_critical');
      alerts.push({
        id: `${dept.id}-capacity-critical-${currentHour}`,
        department: dept.name,
        departmentId: dept.id,
        severity: 'critical',
        message: alertType.message.replace('{dept}', dept.shortName).replace('{value}', deptData.occupancy),
        icon: alertType.icon,
        timestamp: currentHour,
        value: deptData.occupancy
      });
    } else if (deptData.occupancy >= dept.warningThreshold) {
      const alertType = alertTypes.find(a => a.id === 'capacity_warning');
      alerts.push({
        id: `${dept.id}-capacity-warning-${currentHour}`,
        department: dept.name,
        departmentId: dept.id,
        severity: 'warning',
        message: alertType.message.replace('{dept}', dept.shortName).replace('{value}', deptData.occupancy),
        icon: alertType.icon,
        timestamp: currentHour,
        value: deptData.occupancy
      });
    }

    // Wait time alerts
    if (deptData.waitTime >= 60) {
      const alertType = alertTypes.find(a => a.id === 'wait_time_critical');
      alerts.push({
        id: `${dept.id}-wait-critical-${currentHour}`,
        department: dept.name,
        departmentId: dept.id,
        severity: 'critical',
        message: alertType.message.replace('{dept}', dept.shortName).replace('{value}', deptData.waitTime),
        icon: alertType.icon,
        timestamp: currentHour,
        value: deptData.waitTime
      });
    } else if (deptData.waitTime >= 30) {
      const alertType = alertTypes.find(a => a.id === 'wait_time_warning');
      alerts.push({
        id: `${dept.id}-wait-warning-${currentHour}`,
        department: dept.name,
        departmentId: dept.id,
        severity: 'warning',
        message: alertType.message.replace('{dept}', dept.shortName).replace('{value}', deptData.waitTime),
        icon: alertType.icon,
        timestamp: currentHour,
        value: deptData.waitTime
      });
    }
  });

  // Sort by severity (critical first, then warning, then info)
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
};

// Calculate time series for a specific metric across all departments
export const getMetricTimeSeries = (timeSeriesData, departments, metric, startHour, endHour) => {
  return timeSeriesData
    .filter(d => d.hour >= startHour && d.hour <= endHour)
    .map(hourData => {
      const result = { hour: hourData.hour };
      departments.forEach(dept => {
        if (hourData[dept.id]) {
          result[dept.id] = hourData[dept.id][metric];
        }
      });
      return result;
    });
};

// Calculate heatmap data for occupancy
export const getOccupancyHeatmap = (timeSeriesData, departments, startHour, endHour) => {
  const hours = timeSeriesData.filter(d => d.hour >= startHour && d.hour <= endHour);
  
  return departments.map(dept => ({
    department: dept.shortName,
    departmentId: dept.id,
    icon: dept.icon,
    data: hours.map(hourData => ({
      hour: hourData.hour,
      value: hourData[dept.id]?.occupancy || 0,
      status: getOccupancyStatus(
        hourData[dept.id]?.occupancy || 0,
        dept.warningThreshold,
        dept.criticalThreshold
      )
    }))
  }));
};

// Calculate trends (comparing to previous period)
export const calculateTrend = (current, previous) => {
  if (previous === 0) return { direction: 'stable', change: 0 };
  const change = ((current - previous) / previous) * 100;
  
  if (change > 5) return { direction: 'up', change: Math.round(change) };
  if (change < -5) return { direction: 'down', change: Math.round(Math.abs(change)) };
  return { direction: 'stable', change: 0 };
};

// Get peak hours analysis
export const getPeakHours = (timeSeriesData, departmentId, metric = 'occupancy') => {
  const sorted = [...timeSeriesData].sort((a, b) => {
    const aVal = a[departmentId]?.[metric] || 0;
    const bVal = b[departmentId]?.[metric] || 0;
    return bVal - aVal;
  });

  return sorted.slice(0, 5).map(d => ({
    hour: d.hour,
    value: d[departmentId]?.[metric] || 0
  }));
};
