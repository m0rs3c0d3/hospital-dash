import React, { useState } from 'react';
import { useMetricsData } from '../hooks/useMetricsData';
import { useSimulation } from '../hooks/useSimulation';
import MetricsGrid from './MetricsGrid';
import DepartmentCard from './DepartmentCard';
import TimeSeriesChart from './TimeSeriesChart';
import AlertPanel from './AlertPanel';
import TimeSlider from './TimeSlider';
import HeatmapGrid from './HeatmapGrid';

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-content">
      <div className="loading-pulse" />
      <div className="loading-text">Initializing Hospital Metrics...</div>
    </div>
  </div>
);

const Dashboard = () => {
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [activeView, setActiveView] = useState('overview'); // overview, heatmap

  const simulation = useSimulation(47, 36);
  const { 
    isLoading,
    hospital,
    hospitalMetrics,
    previousMetrics,
    departmentMetrics,
    alerts,
    heatmapData,
    occupancyTimeSeries,
    departments
  } = useMetricsData(simulation.currentHour);

  const handleDepartmentClick = (deptId) => {
    setSelectedDepartments(prev => {
      if (prev.includes(deptId)) {
        return prev.filter(id => id !== deptId);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), deptId];
      }
      return [...prev, deptId];
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="hospital-logo">🏥</div>
          <div className="hospital-info">
            <h1 className="hospital-name">{hospital.name}</h1>
            <span className="hospital-tagline">Operations Command Center</span>
          </div>
        </div>
        <div className="header-right">
          <div className="view-toggle">
            <button 
              className={`view-btn ${activeView === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveView('overview')}
            >
              Overview
            </button>
            <button 
              className={`view-btn ${activeView === 'heatmap' ? 'active' : ''}`}
              onClick={() => setActiveView('heatmap')}
            >
              Heatmap
            </button>
          </div>
          <div className="live-indicator">
            <span className="pulse-dot" />
            <span>Simulated Live</span>
          </div>
        </div>
      </header>

      {/* Time Controls */}
      <TimeSlider
        currentHour={simulation.currentHour}
        maxHour={simulation.maxHour}
        isPlaying={simulation.isPlaying}
        playbackSpeed={simulation.playbackSpeed}
        onSeek={simulation.seekTo}
        onTogglePlayback={simulation.togglePlayback}
        onStepForward={simulation.stepForward}
        onStepBackward={simulation.stepBackward}
        onGoToStart={simulation.goToStart}
        onGoToEnd={simulation.goToEnd}
        onCycleSpeed={simulation.cycleSpeed}
      />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* KPI Grid */}
        <section className="section-kpi">
          <MetricsGrid 
            hospitalMetrics={hospitalMetrics}
            previousMetrics={previousMetrics}
            hospital={hospital}
          />
        </section>

        {activeView === 'overview' ? (
          <>
            {/* Two Column Layout */}
            <div className="content-grid">
              {/* Left Column - Departments */}
              <section className="section-departments">
                <div className="section-header">
                  <h2 className="section-title">Department Status</h2>
                  <span className="section-hint">Click to add to chart</span>
                </div>
                <div className="departments-grid">
                  {departmentMetrics.map(dept => (
                    <DepartmentCard
                      key={dept.id}
                      department={dept}
                      isSelected={selectedDepartments.includes(dept.id)}
                      onClick={() => handleDepartmentClick(dept.id)}
                    />
                  ))}
                </div>
              </section>

              {/* Right Column - Charts & Alerts */}
              <section className="section-analytics">
                <TimeSeriesChart
                  data={occupancyTimeSeries}
                  departments={departments}
                  selectedDepartments={selectedDepartments}
                  title="Occupancy Trends (24h)"
                />
                <AlertPanel alerts={alerts} />
              </section>
            </div>
          </>
        ) : (
          /* Heatmap View */
          <section className="section-heatmap">
            <HeatmapGrid 
              data={heatmapData}
              currentHour={simulation.currentHour}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <span>Hospital Operations Dashboard • Portfolio Demo</span>
        <span>Data is simulated for demonstration purposes</span>
      </footer>
    </div>
  );
};

export default Dashboard;
