# MGNREGA District Performance Dashboard

A user-friendly web application that helps rural Indians understand their district's performance in the MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) program.

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

**Built with ❤️ for rural India's digital empowerment**

