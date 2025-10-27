## 🎯 Project Overview

This dashboard transforms complex government data from data.gov.in APIs into simple, visual information that can be easily understood by citizens with low technical literacy in rural India.

### Key Features

- 📍 **Auto Location Detection**: Automatically detects user's district using GPS
- 🎨 **Low-Literacy Design**: Visual cards with icons, minimal text, Hindi language support
- 📊 **Performance Metrics**: Current month data, historical trends, district comparisons
- 🔄 **Offline Resilience**: Caching and fallback mechanisms for API downtime
- 📱 **Mobile-First**: Optimized for smartphones used in rural areas
- ⚡ **Production Ready**: Built to handle millions of users across India

## 🏗️ Architecture

### Backend (Node.js + MongoDB)
- **API Integration**: Robust data.gov.in API integration with retry logic
- **Caching Layer**: Redis-like caching to reduce API calls
- **Location Services**: GPS-based district detection
- **Performance Monitoring**: Health checks and error tracking

### Frontend (React + Tailwind)
- **Mobile-First Design**: Responsive UI optimized for rural users
- **Visual Dashboard**: Icon-based cards with progress indicators
- **Multi-language**: Hindi and English support
- **Offline Support**: Local caching for poor connectivity areas

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and API keys
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📊 MGNREGA Metrics Tracked

- **Job Cards**: Total and active job cards in district
- **Employment**: Person-days generated, households benefited
- **Wages**: Average wage rates, total payments
- **Women Participation**: Percentage of women workers
- **Works Progress**: Completed and ongoing projects
- **Comparisons**: District vs state average performance

## 🎨 Design Philosophy

### For Low-Literacy Users
- **Visual First**: Icons and colors over text
- **Simple Navigation**: Maximum 2-3 clicks to any information
- **Clear Indicators**: Green/Red status, progress bars
- **Local Language**: Hindi text with simple vocabulary
- **Large Touch Targets**: Mobile-friendly button sizes

### Production Considerations
- **API Resilience**: Handles data.gov.in downtime gracefully
- **Caching Strategy**: Reduces server load and improves speed
- **Error Handling**: Graceful degradation when services fail
- **Security**: Rate limiting, input validation, CORS protection
- **Monitoring**: Health checks and performance metrics

## 🗺️ Current Coverage

**Focus State**: Uttar Pradesh (75 districts)
- Largest state by population
- High MGNREGA participation
- Diverse rural demographics

## 📱 Mobile Optimization

- **Progressive Web App**: Can be installed on phones
- **Offline Mode**: Core features work without internet
- **Low Data Usage**: Optimized images and minimal API calls
- **Touch Friendly**: Large buttons, swipe gestures

## 🔧 Development Status

### ✅ Completed (Day 1)
- Backend API with MongoDB integration
- Location detection service
- Performance data models
- Frontend foundation with Tailwind CSS
- API service layer with caching

### 🚧 In Progress (Day 2)
- Visual dashboard components
- District selector with map
- Performance charts and graphs
- Historical trend analysis

### 📋 Planned (Day 3)
- Final UI polish and testing
- Performance optimization
- Error handling improvements
- Documentation completion

## 🤝 Contributing

This project aims to improve access to government information for rural citizens. Contributions welcome!

## 📄 License

MIT License - Built for social impact

---

### 📊 **Comprehensive Analytics**
- **Employment Trends**: Monthly employment generation patterns
- **Work Categories**: Distribution of different types of MGNREGA works
- **Payment Analysis**: Wage payment status and trends
- **Progress Tracking**: Visual progress indicators for key metrics

### 🗺️ **Location Features**
- **GPS Detection**: Automatic district detection based on user location
- **Manual Search**: Search districts by name in Hindi/English
- **State Filtering**: Filter districts by state
- **Multi-language**: Hindi and English support

### 📱 **User Experience**
- **Mobile Responsive**: Works perfectly on all device sizes
- **Government Styling**: Professional government portal design
- **Fast Loading**: Optimized performance with caching
- **Accessibility**: Screen reader friendly and keyboard navigable

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MGNREGA API key (optional, for real government data)

### 1. Clone Repository
```bash
git clone https://github.com/engraver-beats/mgnrega-dashboard.git
cd mgnrega-dashboard
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```

The backend will start on `http://localhost:5000`

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Configure Real Data (Optional)
```bash
# Run the interactive setup script
node setup-real-data.js

# Or manually edit backend/.env
USE_REAL_DATA=true
MGNREGA_API_KEY=your_actual_api_key_here
```

### 5. Access Dashboard
Open your browser and go to:
- **Home**: http://localhost:5173
- **Dashboard**: http://localhost:5173/dashboard/UP001 (example)
- **Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
mgnrega-dashboard/
├── backend/                 # Node.js Express API server
│   ├── server.js           # Main server file with real data integration
│   ├── package.json        # Backend dependencies
│   ├── .env               # Environment configuration
│   └── .env.example       # Environment template
├── frontend/               # React.js dashboard application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── SimpleCharts.jsx    # Chart components
│   │   │   └── DistrictSelector.jsx # District selection UI
│   │   ├── pages/          # Main page components
│   │   │   ├── Home.jsx    # Landing page
│   │   │   └── Dashboard.jsx # Main dashboard
│   │   ├── services/       # API and data services
│   │   │   ├── apiService.js      # Backend API communication
│   │   │   └── districtService.js # District data management
│   │   └── App.jsx         # Main app component
│   ├── package.json        # Frontend dependencies
│   ├── .env               # Environment configuration
│   └── .env.example       # Environment template
└── README.md              # This file
```

## 🔧 Configuration

### Backend Configuration (backend/.env)
```env
PORT=5000                           # Server port
NODE_ENV=development               # Environment mode
FRONTEND_URL=http://localhost:5173 # Frontend URL for CORS

# Real Data Integration
USE_REAL_DATA=true                 # Enable real government data
MGNREGA_API_KEY=your_api_key_here  # Your MGNREGA API key

# Cache and Performance
CACHE_TTL=3600                     # Cache timeout in seconds
RATE_LIMIT_MAX_REQUESTS=100        # API rate limiting
```

### Frontend Configuration (frontend/.env)
```env
VITE_API_URL=http://localhost:5000/api  # Backend API URL
VITE_ENABLE_REAL_DATA=true              # Enable real data integration
VITE_ENABLE_LOCATION_DETECTION=true     # Enable GPS location detection
VITE_ENABLE_DATA_REFRESH=true           # Enable manual data refresh
```

### 🔑 Getting API Keys

**Option 1: data.gov.in (Recommended)**
1. Visit https://data.gov.in/
2. Register for an account
3. Browse MGNREGA datasets
4. Request API access
5. Copy your API key

**Option 2: API Setu**
1. Visit https://apisetu.gov.in/
2. Register and verify your account
3. Browse government APIs
4. Subscribe to MGNREGA data services
5. Generate API key

**Option 3: Direct Government Portals**
- Contact Ministry of Rural Development
- Request developer access to MGNREGA data
- Follow their API documentation

## 🌐 API Endpoints

### Backend API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Backend health check |
| GET | `/api/districts` | Get all districts with filtering |
| GET | `/api/districts/:id` | Get specific district data |
| GET | `/api/states` | Get all states |
| POST | `/api/refresh-data` | Force data refresh |

### Example API Usage
```javascript
// Get district data
const response = await fetch('http://localhost:5000/api/districts/UP001');
const data = await response.json();

// Search districts
const response = await fetch('http://localhost:5000/api/districts?search=agra&limit=10');
const districts = await response.json();
```

## 📊 Data Sources

### Current Implementation
- **Real Data Patterns**: Based on actual MGNREGA statistics
- **Government APIs**: Designed to integrate with data.gov.in and official sources
- **Fallback Data**: Realistic mock data when APIs are unavailable
- **Caching System**: Efficient data caching for performance

### Supported Data Types
- **Employment Data**: Person-days, job cards, active workers
- **Financial Data**: Wages paid, payment status, average rates
- **Work Data**: Completed works, ongoing projects, work categories
- **Demographic Data**: Women participation, SC/ST data

## 🎨 UI Components

### Chart Components
- **EmploymentTrendChart**: Line chart showing monthly employment trends
- **WorkCategoriesChart**: Pie chart showing work type distribution
- **MonthlyWagesChart**: Bar chart showing wage payments
- **PaymentStatusChart**: Status chart showing payment completion
- **ProgressBar**: Visual progress indicators
- **QuickStatsCard**: Key statistics display cards

### Interactive Components
- **DistrictSelector**: GPS + manual district selection
- **BackendStatus**: Live/offline mode indicator
- **DataRefresh**: Manual data refresh functionality

## 🔄 Data Flow

1. **Backend Service** fetches real MGNREGA data from government sources
2. **Caching Layer** stores processed data for fast access
3. **API Layer** serves data to frontend with proper formatting
4. **Frontend Service** handles API communication with fallback support
5. **UI Components** display data with interactive charts and controls

## 🛠️ Development

### Adding New Districts
```javascript
// In backend/server.js, add to getRealDistrictList()
{ id: 'ST001', name: 'New District', state: 'State Name', hindi: 'नया जिला' }
```

### Adding New Chart Types
```javascript
// Create new chart component in frontend/src/components/SimpleCharts.jsx
export const NewChart = ({ data }) => {
  // Chart implementation
};
```

### Integrating Real APIs
```javascript
// In backend/server.js, update fetchRealMGNREGAData()
const response = await axios.get('https://api.data.gov.in/mgnrega/...');
```

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm install --production
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### Environment Variables for Production
```env
# Backend
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com

# Frontend  
VITE_API_URL=https://your-api-domain.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ministry of Rural Development, Government of India** for MGNREGA data
- **National Informatics Centre (NIC)** for technical infrastructure
- **Open Government Data Platform India** for data accessibility
- **React.js & Node.js Communities** for excellent frameworks

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@mgnrega-dashboard.com
- Documentation: [Wiki](https://github.com/engraver-beats/mgnrega-dashboard/wiki)

---

**🇮🇳 Made with ❤️ for Digital India Initiative**

*This dashboard helps citizens, officials, and researchers understand MGNREGA implementation at the district level, promoting transparency and accountability in rural employment programs.*
