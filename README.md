# 🏥 Hospital Operations Dashboard

A real-time hospital operations monitoring dashboard built with React. This project demonstrates complex data visualization, state management, and healthcare domain knowledge.

## ✨ Features

### Real-Time Monitoring
- **Hospital-Wide KPIs**: Total patients, bed occupancy, average wait times, staff ratios
- **Department Status Cards**: 10 departments with live capacity, wait times, and staffing levels
- **Color-Coded Alerts**: Critical (red), Warning (amber), Normal (green) status indicators

### Data Visualization
- **Time Series Charts**: Interactive area charts showing occupancy trends over 24-48 hours
- **Occupancy Heatmap**: Visual grid showing department loads across time periods
- **Trend Indicators**: Up/down arrows showing changes from previous hour

### Time Simulation
- **Playback Controls**: Play/pause through 48 hours of simulated data
- **Variable Speed**: 1x, 2x, 4x playback speeds
- **Time Scrubbing**: Drag slider to jump to any point in time
- **Step Controls**: Move forward/backward one hour at a time

### Alert System
- **Dynamic Alerts**: Automatically generated based on threshold violations
- **Filterable**: View all, critical only, or warning only
- **Dismissible**: Clear resolved alerts from view

## 🛠️ Tech Stack

### Core Technologies

- **React 18.2** - Modern UI framework with hooks-based architecture
- **Recharts 2.10** - Composable charting library built on D3.js
- **Vite 5.0** - Next-generation frontend build tool with lightning-fast HMR
- **CSS Variables** - Custom design system with theming tokens
- **No Backend Required** - Static JSON data simulation, perfect for free hosting

### Architecture & Patterns

#### State Management
The application uses **React Hooks** exclusively for state management, avoiding external libraries like Redux or MobX:

- **`useState`**: Local component state for UI interactions (filters, toggles, playback controls)
- **`useEffect`**: Side effects for async data loading and cleanup of intervals/timers
- **`useMemo`**: Performance optimization for expensive calculations (metric aggregations, heatmap generation)
- **`useCallback`**: Memoized callbacks to prevent unnecessary re-renders in child components
- **`useRef`**: Direct DOM access and persisting values across renders (playback intervals)

#### Custom Hooks

**`useMetricsData(currentHour)`** - `/src/hooks/useMetricsData.js:11`
- Loads and processes hospital metrics from JSON
- Calculates department-level and hospital-wide KPIs
- Generates alerts based on threshold violations
- Computes heatmap and time series data for visualizations
- Uses `useMemo` to recalculate only when `currentHour` changes

**`useSimulation(maxHour, initialHour)`** - `/src/hooks/useSimulation.js:3`
- Controls time-based playback through 48 hours of data
- Manages play/pause state and variable speed (1x/2x/4x)
- Provides step controls and seek functionality
- Uses `setInterval` with cleanup to prevent memory leaks

#### Data Flow

1. **JSON Data Source** → Static metrics dataset with 48 hours of simulated hospital data
2. **Custom Hooks** → Process raw data into computed metrics and visualizations
3. **Props Down** → Parent components pass data to specialized child components
4. **Events Up** → User interactions (filters, time controls) bubble up via callbacks
5. **Reactive Updates** → Changes in `currentHour` trigger cascading recalculations via `useMemo`

#### Calculation Layer

**`/src/utils/calculations.js`** contains pure functions for:
- Aggregating bed occupancy across departments
- Computing average wait times and staff ratios
- Threshold detection for alert generation
- Heatmap matrix transformation
- Time series data extraction for charts

**`/src/utils/formatters.js`** provides:
- Time formatting (12/24-hour display)
- Number formatting (percentages, ratios)
- Duration formatting (minutes to hours)

#### Visualization Strategy

**Recharts Integration:**
- `<AreaChart>` for occupancy trends with gradient fills
- `<LineChart>` for wait time progression
- Responsive sizing with `ResponsiveContainer`
- Custom tooltips showing department breakdowns
- Color-coded by status (critical/warning/normal)

**Custom Heatmap Grid:**
- CSS Grid layout for time × department matrix
- Color intensity based on occupancy percentage
- Hover states showing exact values

### Performance Optimizations

1. **Memoization**: All expensive calculations wrapped in `useMemo` to prevent recalculation on every render
2. **Callback Memoization**: Event handlers wrapped in `useCallback` to maintain referential equality
3. **Code Splitting**: Vite automatically chunks components and lazy-loads when needed
4. **CSS Variables**: Hardware-accelerated color transitions without JavaScript
5. **Static Assets**: Pre-generated JSON data eliminates server round trips

### Development Experience

- **Hot Module Replacement (HMR)**: Vite preserves component state during development edits
- **Fast Refresh**: React changes reflect instantly without full page reload
- **ES Modules**: Native ESM in development for faster cold starts
- **Optimized Production Build**: Rollup-based bundling with tree-shaking and minification

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main container & layout
│   ├── MetricsGrid.jsx        # Hospital-wide KPI cards
│   ├── DepartmentCard.jsx     # Individual department status
│   ├── TimeSeriesChart.jsx    # Recharts area chart
│   ├── AlertPanel.jsx         # Active alerts list
│   ├── TimeSlider.jsx         # Time navigation controls
│   └── HeatmapGrid.jsx        # Occupancy heatmap
├── hooks/
│   ├── useMetricsData.js      # Data loading & calculations
│   └── useSimulation.js       # Time playback logic
├── utils/
│   ├── calculations.js        # Metric aggregation & thresholds
│   └── formatters.js          # Time/number formatting
├── data/
│   └── metrics.json           # 48-hour simulated dataset
└── App.jsx
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hospital-dashboard.git
cd hospital-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder, ready for deployment to Vercel, Netlify, or GitHub Pages.

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Netlify
1. Push to GitHub
2. Connect repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## 📊 Understanding the Data

The dashboard simulates realistic hospital patterns:

- **Night Shift (12am-6am)**: Lower occupancy, minimal admissions
- **Morning Surge (7am-11am)**: Rapid increase in ED visits, surgeries begin
- **Peak Hours (11am-2pm)**: Highest occupancy, longest wait times
- **Afternoon Decline (2pm-6pm)**: Gradual decrease as discharges outpace admissions
- **Evening (6pm-12am)**: Return to baseline levels

### Departments Modeled

| Department | Beds | Critical Threshold | Typical Pattern |
|------------|------|-------------------|-----------------|
| Emergency (ED) | 45 | 90% | Highest variability |
| ICU | 32 | 85% | Consistently high |
| Surgery | 60 | 88% | Morning peaks |
| Pediatrics | 40 | 85% | Afternoon peaks |
| Maternity | 35 | 90% | Unpredictable |
| Cardiology | 48 | 85% | Stable |
| Oncology | 42 | 88% | Very stable |
| Neurology | 38 | 85% | Moderate |
| Orthopedics | 44 | 85% | Surgery-linked |
| General Medicine | 66 | 90% | ED overflow |

## 🎨 Design Philosophy

- **Clinical Dark Theme**: Reduces eye strain during long monitoring sessions
- **Information Hierarchy**: Most critical data is largest and most prominent
- **Status Colors**: Industry-standard red/amber/green for immediate recognition
- **Monospace Numbers**: JetBrains Mono for data legibility
- **Minimal Animation**: Motion only where it adds meaning (alerts, transitions)

## 🔧 Customization

### Adding Departments
Edit `src/data/metrics.json` to add new departments to the `departments` array and corresponding data to `timeSeriesData`.

### Adjusting Thresholds
Modify `warningThreshold` and `criticalThreshold` in the department configuration.

### Styling
All design tokens are CSS variables in `src/App.css` under `:root`.

## 📱 Responsive Design

The dashboard adapts to:
- **Desktop (1200px+)**: Full two-column layout
- **Tablet (768-1199px)**: Stacked layout, condensed controls
- **Mobile (< 768px)**: Single column, simplified visualizations

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🙏 Credits & Acknowledgments

This project is built with the following open-source libraries:

### Core Dependencies

- **[React](https://react.dev/)** (v18.2.0) - MIT License
  A JavaScript library for building user interfaces, maintained by Meta and the React community.

- **[Recharts](https://recharts.org/)** (v2.10.3) - MIT License
  A composable charting library built on React components, powered by D3.js for data transformations.

- **[Vite](https://vitejs.dev/)** (v5.0.8) - MIT License
  A modern build tool that provides lightning-fast development experience with native ESM support.

### Development Tools

- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)** (v4.2.1) - MIT License
  Official Vite plugin enabling React Fast Refresh and JSX transformation.

### Font

- **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)** - OFL License
  Monospace typeface designed for developers, used for numerical data display.

### Special Thanks

- Hospital operations data patterns inspired by real-world healthcare workflows
- Color palette designed for clinical monitoring environments
- Dashboard UX influenced by medical device interfaces and command centers

All dependencies are licensed under permissive open-source licenses. See individual package repositories for full license texts.

---

*This project demonstrates proficiency in React, data visualization, healthcare IT concepts, and modern frontend development practices.*
