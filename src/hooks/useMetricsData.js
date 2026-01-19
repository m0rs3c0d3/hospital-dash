import { useState, useEffect, useMemo } from 'react';
import metricsData from '../data/metrics.json';
import { 
  calculateHospitalMetrics, 
  getDepartmentMetrics,
  generateAlerts,
  getOccupancyHeatmap,
  getMetricTimeSeries
} from '../utils/calculations';

export const useMetricsData = (currentHour = 36) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { hospital, departments, timeSeriesData, alertTypes } = metricsData;

  useEffect(() => {
    // Simulate async loading for realistic UX
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate hospital-wide metrics
  const hospitalMetrics = useMemo(() => {
    return calculateHospitalMetrics(timeSeriesData, departments, currentHour);
  }, [currentHour]);

  // Calculate department-specific metrics
  const departmentMetrics = useMemo(() => {
    return departments.map(dept => ({
      ...dept,
      metrics: getDepartmentMetrics(timeSeriesData, dept, currentHour)
    }));
  }, [currentHour]);

  // Generate current alerts
  const alerts = useMemo(() => {
    return generateAlerts(timeSeriesData, departments, alertTypes, currentHour);
  }, [currentHour]);

  // Get heatmap data (last 24 hours from current)
  const heatmapData = useMemo(() => {
    const startHour = Math.max(0, currentHour - 23);
    return getOccupancyHeatmap(timeSeriesData, departments, startHour, currentHour);
  }, [currentHour]);

  // Get time series for charts
  const occupancyTimeSeries = useMemo(() => {
    const startHour = Math.max(0, currentHour - 23);
    return getMetricTimeSeries(timeSeriesData, departments, 'occupancy', startHour, currentHour);
  }, [currentHour]);

  const waitTimeTimeSeries = useMemo(() => {
    const startHour = Math.max(0, currentHour - 23);
    return getMetricTimeSeries(timeSeriesData, departments, 'waitTime', startHour, currentHour);
  }, [currentHour]);

  // Previous hour metrics for trend calculation
  const previousMetrics = useMemo(() => {
    const prevHour = Math.max(0, currentHour - 1);
    return calculateHospitalMetrics(timeSeriesData, departments, prevHour);
  }, [currentHour]);

  return {
    isLoading,
    error,
    hospital,
    departments,
    hospitalMetrics,
    previousMetrics,
    departmentMetrics,
    alerts,
    heatmapData,
    occupancyTimeSeries,
    waitTimeTimeSeries,
    timeSeriesData,
    maxHour: timeSeriesData.length - 1
  };
};
