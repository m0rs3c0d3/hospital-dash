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

- **React 18** - UI framework with hooks
- **Recharts** - Data visualization library
- **Vite** - Fast build tooling
- **CSS Variables** - Theming and design tokens
- **No Backend Required** - Static JSON data, perfect for free hosting

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

---

*This project demonstrates proficiency in React, data visualization, healthcare IT concepts, and modern frontend development practices.*
