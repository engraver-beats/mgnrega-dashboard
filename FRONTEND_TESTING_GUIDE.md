# 🚀 MGNREGA Dashboard - Frontend Only Testing Guide

## 📋 Quick Setup (2 minutes)

### **Prerequisites**
- **Node.js** (v16+) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)

### **Setup Steps**
```bash
# 1. Clone repository
git clone https://github.com/engraver-beats/mgnrega-dashboard.git
cd mgnrega-dashboard

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Visit: http://localhost:5173
```

## 🎯 **What's Built - React Frontend**

### ✅ **Pages & Features**
- **🏠 Home Page** (`/`)
  - Location detection with GPS
  - Manual district selection
  - MGNREGA information section
  - Mobile-responsive design

- **📊 Dashboard** (`/dashboard`)
  - Performance metrics with visual cards
  - Mock data for development
  - Hindi language support
  - Mobile-first design

- **ℹ️ About Page** (`/about`)
  - Project information
  - MGNREGA scheme details

### ✅ **Tech Stack**
- **React 18** with Hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Framer Motion** for animations
- **Chart.js** for future charts

## 🧪 **Testing Checklist**

### **🏠 Home Page Testing**
- [ ] Page loads correctly
- [ ] "मेरा जिला खोजें" button works
- [ ] Location permission prompt appears
- [ ] "मैन्युअल चुनें" button navigates to dashboard
- [ ] Hindi text displays properly
- [ ] Features grid shows correctly
- [ ] Footer information visible

### **📊 Dashboard Testing**
- [ ] Dashboard loads with mock data
- [ ] Performance cards display metrics
- [ ] Loading spinner shows initially
- [ ] Back button works
- [ ] Hindi labels display correctly
- [ ] Numbers format properly (lakhs/crores)

### **📱 Mobile Responsiveness**
- [ ] Open Chrome DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test on different screen sizes:
  - iPhone SE (375px)
  - iPhone 12 Pro (390px)
  - iPad (768px)
  - Desktop (1024px+)

### **🎨 UI/UX Testing**
- [ ] Colors and contrast are good
- [ ] Buttons have hover effects
- [ ] Touch targets are large enough (44px+)
- [ ] Loading states work smoothly
- [ ] Toast notifications appear
- [ ] Navigation is intuitive

## 🔍 **Mock Data Features**

The frontend currently uses **mock data** for development:

### **Sample District Data**
```javascript
{
  districtName: 'Agra',
  currentMonth: 'October 2025',
  totalJobCards: 45000,
  activeJobCards: 28000,
  totalPersonDays: 450000,
  womenPersonDays: 225000,
  averageWageRate: 220,
  totalWagesPaid: 9900000,
  worksCompleted: 450,
  worksOngoing: 120,
  womenParticipation: 50
}
```

## 🎯 **Key Features to Test**

### **1. Location Detection**
```javascript
// Click "मेरा जिला खोजें"
// Should prompt for location permission
// On success: navigates to dashboard with coordinates
// On failure: shows error toast
```

### **2. Navigation**
```javascript
// Test all routes:
// / → Home page
// /dashboard → Dashboard with mock data
// /about → About page
```

### **3. Responsive Design**
```javascript
// Test breakpoints:
// sm: 640px
// md: 768px  
// lg: 1024px
// xl: 1280px
```

### **4. Hindi Font Support**
```css
/* Tailwind config includes Hindi fonts */
.hindi-text {
  font-family: 'Noto Sans Devanagari', sans-serif;
}
```

## 🛠️ **Development Commands**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🐛 **Common Issues & Solutions**

### **Port Already in Use**
```bash
# Error: Port 5173 is already in use
# Solution: Kill process or change port
lsof -i :5173
kill -9 <PID>

# Or change port in vite.config.js
export default defineConfig({
  server: { port: 3000 }
})
```

### **Node Modules Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Hindi Fonts Not Loading**
```bash
# Check internet connection
# Fonts load from Google Fonts CDN
# Fallback: system fonts will be used
```

## 📱 **Mobile Testing**

### **Browser DevTools**
1. Open Chrome DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select device (iPhone, Android)
4. Test touch interactions

### **Real Device Testing**
1. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access: `http://YOUR_IP:5173` from mobile
3. Test location detection and navigation

## 🎨 **Design System**

### **Colors**
- Primary: Blue shades for main actions
- Success: Green for positive metrics
- Warning: Yellow for attention items
- Error: Red for problems
- Gray: Neutral backgrounds and text

### **Typography**
- Headers: Bold, large sizes
- Body: Regular weight, readable sizes
- Hindi: Noto Sans Devanagari font
- Numbers: Tabular formatting

### **Components**
- Cards: White background, subtle shadow
- Buttons: Primary (blue) and Secondary (gray)
- Loading: Spinner with Hindi text
- Toast: Dark background, white text

## 🚀 **Next Steps**

Once frontend testing is complete:

### **Day 2 Features**
- Interactive charts with Chart.js
- District selector with search
- Historical data views
- Performance comparisons
- Advanced filtering

### **Backend Integration**
- Replace mock data with API calls
- Add error handling for API failures
- Implement caching strategy
- Add loading states for API calls

## 📞 **Need Help?**

### **Check Console**
- Open DevTools (F12) → Console tab
- Look for errors or warnings
- Check network requests

### **Common Checks**
- [ ] Node.js version 16+
- [ ] All dependencies installed
- [ ] Development server running
- [ ] Browser supports modern JavaScript
- [ ] Internet connection for fonts/CDN

## 🎉 **Success Criteria**

Your frontend is working correctly if:
- ✅ All pages load without errors
- ✅ Navigation works smoothly
- ✅ Hindi text displays properly
- ✅ Mobile responsive on all devices
- ✅ Location detection prompts for permission
- ✅ Mock data displays in dashboard
- ✅ Loading states work correctly
- ✅ Toast notifications appear

**Happy Testing! 🚀**

The frontend is fully functional with mock data and ready for backend integration later!

