# 🚀 MGNREGA Dashboard - Local Testing Guide

## 📋 Prerequisites

### Required Software
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

### API Key Setup
1. **Get data.gov.in API Key** (FREE):
   - Visit: https://data.gov.in/help/how-use-datasets-api
   - Register for a free account
   - Generate API key from your dashboard
   - **Note**: The API key is free and gives you 1000 requests/day

## 🛠️ Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone https://github.com/engraver-beats/mgnrega-dashboard.git
cd mgnrega-dashboard
git checkout codegen-bot/initial-dashboard-implementation
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Configure Environment Variables
Edit the `.env` file:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mgnrega_dashboard

# data.gov.in API Key (GET THIS FROM data.gov.in)
DATA_GOV_API_KEY=your_actual_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 4. Start MongoDB
```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS (with Homebrew)
brew services start mongodb-community

# On Linux (systemd)
sudo systemctl start mongod

# Or run directly
mongod --dbpath /path/to/your/db/directory
```

### 5. Start Backend Server
```bash
# From backend directory
npm run dev

# You should see:
# ✅ MongoDB connected successfully
# 🚀 Server running on port 5000
```

### 6. Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# You should see:
# ➜  Local:   http://localhost:5173/
```

## 🧪 Testing the Application

### 1. Open Your Browser
Navigate to: **http://localhost:5173**

### 2. Test Location Detection
- Click "मेरा जिला खोजें" (Find My District)
- Allow location access when prompted
- Should detect your location and find nearest district

### 3. Test Manual District Selection
- Click "जिला चुनें" (Select District)
- Choose any district from Uttar Pradesh
- Should navigate to dashboard

### 4. Test Dashboard Features
- View performance metrics
- Check if data loads (will show mock data if API fails)
- Test mobile responsiveness (resize browser)

## 🔍 API Testing

### Test MGNREGA API Directly
```bash
# Test the actual data.gov.in API
curl "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=YOUR_API_KEY&format=json&limit=10"
```

### Test Backend APIs
```bash
# Test districts endpoint
curl http://localhost:5000/api/districts

# Test performance endpoint
curl http://localhost:5000/api/performance/UP001

# Test health check
curl http://localhost:5000/health
```

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB if not running
mongod --dbpath /path/to/db
```

**2. API Key Error**
```
Error: Invalid API key
```
**Solution**: 
- Verify your API key in `.env` file
- Check data.gov.in dashboard for key status
- Ensure no extra spaces in the key

**3. CORS Error**
```
Access to fetch at 'http://localhost:5000' blocked by CORS
```
**Solution**: Backend should handle CORS automatically, but verify `FRONTEND_URL` in `.env`

**4. Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change port in `.env` or kill existing process
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## 📊 Real Data vs Mock Data

### How It Works
1. **Primary**: Tries to fetch from data.gov.in MGNREGA API
2. **Fallback**: If API fails, shows mock data for development
3. **Caching**: Successful API responses cached for 1 hour

### API Endpoints Used
- **Resource ID**: `9ef84268-d588-465a-a308-a864a43d0070`
- **Base URL**: `https://api.data.gov.in/resource/`
- **Format**: JSON
- **Rate Limit**: 1000 requests/day (free tier)

## 🎯 What to Test

### ✅ Core Features
- [ ] Location detection works
- [ ] District selection works
- [ ] Dashboard loads with data
- [ ] Mobile responsive design
- [ ] Hindi text displays correctly
- [ ] API caching works (check console logs)
- [ ] Graceful API failure handling

### ✅ Performance
- [ ] Page loads under 3 seconds
- [ ] API responses cached properly
- [ ] No memory leaks during navigation

### ✅ User Experience
- [ ] Large touch targets on mobile
- [ ] Simple navigation (max 2-3 clicks)
- [ ] Visual indicators clear
- [ ] Error messages user-friendly

## 📱 Mobile Testing

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select mobile device (iPhone, Android)
4. Test all features

### Real Device Testing
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access: `http://YOUR_IP:5173` from mobile browser
3. Test location detection and touch interactions

## 🚀 Next Steps

Once local testing is complete:
1. **Day 2**: Add interactive charts and advanced features
2. **Production**: Deploy to cloud with proper scaling
3. **Enhancement**: Add more states and districts

## 📞 Need Help?

If you encounter any issues:
1. Check the console logs (F12 → Console)
2. Verify all environment variables
3. Ensure MongoDB and both servers are running
4. Test API key with direct curl command

**Happy Testing! 🎉**

