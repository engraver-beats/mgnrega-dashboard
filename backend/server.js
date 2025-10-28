const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const cron = require('node-cron');
const axios = require('axios');
// Removed old MGNREGADataProcessor - using MPDataService instead
const MPDataService = require('./mpDataService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Cache setup - cache for 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

// Initialize MP Data Service for real government data
const mpDataService = new MPDataService();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Note: Using MPDataService initialized above for all data processing


// Note: Using MPDataService initialized above - no need for old MGNREGADataService

// API Routes
app.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const mpStatus = mpDataService.getStatus();
  
  res.json({
    status: 'healthy',
    uptime: Math.floor(uptime),
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB'
    },
    timestamp: new Date().toISOString(),
    
    // MP Data Service Status
    mpDataService: mpStatus,
    
    // Service information
    focusState: 'Madhya Pradesh Only',
    dataQuality: mpStatus.useRealData && mpStatus.apiKeyConfigured 
      ? '🟢 Real Government MGNREGA Data' 
      : '🟡 Government District Database (Pattern-based)',
    
    // Legacy compatibility
    lastDataUpdate: mpStatus.lastUpdated,
    totalDistricts: mpStatus.totalDistricts,
    realDataEnabled: mpStatus.useRealData,
    dataSource: mpStatus.dataSource,
    apiKeyConfigured: mpStatus.apiKeyConfigured
  });
});

app.get('/api/districts', async (req, res) => {
  try {
    const { search, state, limit = 10 } = req.query;
    
    // Use MP Data Service for real government data
    let districts;
    
    if (search) {
      console.log(`🔍 API: Searching districts for "${search}"`);
      districts = await mpDataService.searchDistricts(search);
    } else {
      console.log('📋 API: Getting all MP districts');
      districts = await mpDataService.getAllDistricts();
    }
    
    // Filter by state (should be MP for our service)
    if (state && state !== 'Madhya Pradesh') {
      console.log(`⚠️ API: Requested state "${state}" but only MP data available`);
      districts = []; // Return empty for non-MP states
    }
    
    // Limit results
    districts = districts.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: districts.map(d => ({
        id: d.id,
        name: d.name,
        hindi: d.hindi,
        state: d.state,
        dataSource: d.dataSource
      })),
      total: districts.length,
      dataSource: mpDataService.getStatus().dataSource,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch districts',
      message: error.message
    });
  }
});

app.get('/api/districts/:districtId', async (req, res) => {
  try {
    const { districtId } = req.params;
    const { year } = req.query;
    console.log(`📊 API: Getting data for district ${districtId}${year ? `, year: ${year}` : ''}`);
    
    let districtData;
    if (year) {
      districtData = await mpDataService.getDistrictDataForYear(districtId, year);
    } else {
      districtData = await mpDataService.getDistrictData(districtId);
    }
    
    if (!districtData) {
      return res.status(404).json({
        success: false,
        error: 'District not found',
        message: `No MP district data available for ID: ${districtId}${year ? ` in year ${year}` : ''}`
      });
    }
    
    const status = mpDataService.getStatus();
    res.json({
      success: true,
      data: districtData,
      lastUpdated: status.lastUpdated,
      currentFinancialYear: status.currentFinancialYear,
      availableFinancialYears: status.availableFinancialYears
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch district data',
      message: error.message
    });
  }
});

app.get('/api/states', async (req, res) => {
  try {
    const districts = await mpDataService.getAllDistricts();
    const states = [...new Set(districts.map(d => d.state))].sort();
    
    res.json({
      success: true,
      data: states,
      total: states.length,
      dataSource: mpDataService.getStatus().dataSource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch states',
      message: error.message
    });
  }
});

// Get available financial years
app.get('/api/financial-years', async (req, res) => {
  try {
    console.log('📅 API: Getting available financial years');
    
    const availableYears = await mpDataService.getAvailableFinancialYears();
    const status = mpDataService.getStatus();
    
    res.json({
      success: true,
      data: availableYears,
      currentFinancialYear: status.currentFinancialYear,
      total: availableYears.length,
      dataSource: status.dataSource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch financial years',
      message: error.message
    });
  }
});

// Data refresh endpoint (for manual updates)
app.post('/api/refresh-data', async (req, res) => {
  try {
    console.log('🔄 Manual data refresh requested');
    
    // Force refresh the MP data service
    await mpDataService.refreshData();
    const status = mpDataService.getStatus();
    
    res.json({
      success: true,
      message: 'MP data refreshed successfully',
      dataSource: status.dataSource,
      lastUpdated: status.lastUpdated,
      totalDistricts: status.totalDistricts,
      useRealData: status.useRealData,
      apiKeyConfigured: status.apiKeyConfigured
    });
  } catch (error) {
    console.error('❌ Data refresh failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh data',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Initialize data on startup
async function initializeServer() {
  console.log('🚀 Starting MGNREGA Dashboard Backend...');
  
  // Initialize MP Data Service
  console.log('🏛️ Initializing MP Data Service...');
  await mpDataService.initialize();
  
  // Schedule daily data updates at 6 AM
  cron.schedule('0 6 * * *', async () => {
    console.log('🔄 Scheduled MP data update starting...');
    await mpDataService.refreshData();
  });
  
  const status = mpDataService.getStatus();
  
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🏛️ MP Data Service: ${status.dataSource}`);
    console.log(`📊 Serving ${status.totalDistricts} MP districts`);
    console.log(`🌐 API available at http://localhost:${PORT}/api`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  });
}

// Start server
initializeServer().catch(console.error);

module.exports = app;
