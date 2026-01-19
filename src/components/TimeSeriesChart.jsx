import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatTimeShort, formatTime } from '../utils/formatters';

const COLORS = {
  ed: '#ff6b6b',
  icu: '#ff9f43',
  surgery: '#feca57',
  pediatrics: '#48dbfb',
  maternity: '#ff9ff3',
  cardiology: '#ee5a24',
  oncology: '#5f27cd',
  neuro: '#00d2d3',
  ortho: '#10ac84',
  general: '#576574'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div className="chart-tooltip">
      <div className="tooltip-header">{formatTime(label)}</div>
      <div className="tooltip-content">
        {payload.map((entry, index) => (
          <div key={index} className="tooltip-row">
            <span className="tooltip-dot" style={{ backgroundColor: entry.color }} />
            <span className="tooltip-label">{entry.name}</span>
            <span className="tooltip-value">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TimeSeriesChart = ({ 
  data, 
  departments, 
  selectedDepartments = [],
  title = "Occupancy Over Time",
  metric = "occupancy",
  yAxisLabel = "Occupancy %"
}) => {
  const [hoveredDept, setHoveredDept] = useState(null);
  
  // Filter departments to show
  const visibleDepts = selectedDepartments.length > 0 
    ? departments.filter(d => selectedDepartments.includes(d.id))
    : departments.slice(0, 4); // Default to first 4

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {visibleDepts.map(dept => (
                <linearGradient key={dept.id} id={`gradient-${dept.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[dept.id]} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={COLORS[dept.id]} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.1)" 
              vertical={false}
            />
            <XAxis 
              dataKey="hour" 
              tickFormatter={formatTimeShort}
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis 
              domain={[0, 100]}
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            {visibleDepts.map(dept => (
              <Area
                key={dept.id}
                type="monotone"
                dataKey={dept.id}
                name={dept.shortName}
                stroke={COLORS[dept.id]}
                strokeWidth={hoveredDept === dept.id ? 3 : 2}
                fill={`url(#gradient-${dept.id})`}
                fillOpacity={hoveredDept === dept.id ? 1 : 0.6}
                onMouseEnter={() => setHoveredDept(dept.id)}
                onMouseLeave={() => setHoveredDept(null)}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        {visibleDepts.map(dept => (
          <div 
            key={dept.id} 
            className={`legend-item ${hoveredDept === dept.id ? 'active' : ''}`}
            onMouseEnter={() => setHoveredDept(dept.id)}
            onMouseLeave={() => setHoveredDept(null)}
          >
            <span className="legend-color" style={{ backgroundColor: COLORS[dept.id] }} />
            <span className="legend-label">{dept.shortName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSeriesChart;
