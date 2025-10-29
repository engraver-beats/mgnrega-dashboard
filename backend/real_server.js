const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Load real government data
const cacheFile = path.join(__dirname, 'cache', 'real_mgnrega_data.json');
let realData = {};

if (fs.existsSync(cacheFile)) {
  realData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  console.log('✅ Loaded REAL Government MGNREGA data');
  console.log(`📊 ${Object.keys(realData.districts).length} MP districts with real data`);
  console.log(`🏛️ Data source: ${realData.metadata.dataSource}`);
  console.log(`📅 Financial years: ${realData.metadata.financialYears.join(', ')}`);
} else {
  console.log('❌ No real data found. Run: node fetch_real_government_data.js');
}

app.use(cors());
app.use(express.json());

// Health check with real data info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    dataSource: 'REAL Government MGNREGA API',
    totalDistricts: Object.keys(realData.districts || {}).length,
    totalRecords: realData.metadata?.totalRecords || 0,
    financialYears: realData.metadata?.financialYears || [],
    lastUpdated: realData.metadata?.generated,
    uptime: process.uptime(),
    apiEndpoint: 'https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722'
  });
});

// Get all districts with real data
app.get('/api/districts', (req, res) => {
  const districts = Object.values(realData.districts || {}).map(d => ({
    id: d.id,
    name: d.name,
    state: d.state,
    totalJobCards: d.totalJobCards,
    activeWorkers: d.activeWorkers,
    averageWageRate: d.averageWageRate,
    dataSource: d.dataSource
  }));
  
  res.json({
    success: true,
    data: districts,
    total: districts.length,
    dataSource: 'Real Government MGNREGA API'
  });
});

// Get states endpoint (required by frontend)
app.get('/api/states', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '17',
        name: 'Madhya Pradesh',
        code: 'MP',
        totalDistricts: Object.keys(realData.districts || {}).length
      }
    ],
    total: 1,
    dataSource: 'Real Government MGNREGA API'
  });
});

// Search districts endpoint (must come before :districtId route)
app.get('/api/districts/search', (req, res) => {
  const { q, state } = req.query;
  
  if (!q) {
    return res.json({
      success: true,
      data: Object.values(realData.districts || {}),
      total: Object.keys(realData.districts || {}).length
    });
  }
  
  const searchTerm = q.toLowerCase();
  const filteredDistricts = Object.values(realData.districts || {}).filter(district => 
    district.name.toLowerCase().includes(searchTerm) ||
    district.id.includes(searchTerm)
  );
  
  res.json({
    success: true,
    data: filteredDistricts,
    total: filteredDistricts.length,
    searchTerm: q
  });
});

// Get specific district real data (must come after search route)
app.get('/api/districts/:districtId', (req, res) => {
  const { districtId } = req.params;
  const district = realData.districts?.[districtId];
  
  if (!district) {
    return res.status(404).json({
      success: false,
      error: 'District not found',
      message: `No real government data available for district: ${districtId}`,
      availableDistricts: Object.keys(realData.districts || {})
    });
  }
  
  res.json({
    ...district,
    dataQuality: '🟢 Real Government Data',
    apiVerified: true
  });
});

// Find district by location (geolocation)
app.post('/api/districts/find-by-location', (req, res) => {
  const { latitude, longitude } = req.body;
  
  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      error: 'Missing coordinates',
      message: 'Latitude and longitude are required'
    });
  }

  // MP district coordinates (approximate centers)
  const mpDistrictCoords = {
    '17_1703': { name: 'GWALIOR', lat: 26.2183, lng: 78.1828 },
    '17_1719': { name: 'SHAJAPUR', lat: 23.4273, lng: 76.2731 },
    '17_1728': { name: 'BHOPAL', lat: 23.2599, lng: 77.4126 },
    '17_1710': { name: 'SAGAR', lat: 23.8388, lng: 78.7378 },
    '17_1722': { name: 'DHAR', lat: 22.5971, lng: 75.2973 },
    '17_1730': { name: 'INDORE', lat: 22.7196, lng: 75.8577 },
    '17_1733': { name: 'UJJAIN', lat: 23.1765, lng: 75.7885 },
    '17_1701': { name: 'SHEOPUR', lat: 25.6681, lng: 76.6947 },
    '17_1702': { name: 'MORENA', lat: 26.4951, lng: 78.0015 },
    '17_1704': { name: 'SHIVPURI', lat: 25.4305, lng: 77.6581 }
  };

  // Calculate distance and find nearest district
  let nearestDistrict = null;
  let minDistance = Infinity;

  Object.entries(mpDistrictCoords).forEach(([districtId, coords]) => {
    const distance = Math.sqrt(
      Math.pow(latitude - coords.lat, 2) + Math.pow(longitude - coords.lng, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestDistrict = {
        id: districtId,
        name: coords.name,
        distance: distance,
        coordinates: coords
      };
    }
  });

  if (nearestDistrict && realData.districts[nearestDistrict.id]) {
    const districtData = realData.districts[nearestDistrict.id];
    res.json({
      success: true,
      data: {
        ...districtData,
        locationMetadata: {
          detectedLocation: { latitude, longitude },
          nearestDistrict: nearestDistrict.name,
          distance: minDistance,
          method: 'GPS coordinates'
        }
      },
      message: `Found nearest district: ${nearestDistrict.name}`
    });
  } else {
    // Fallback to Bhopal if no match found
    const fallbackDistrict = realData.districts['17_1728'];
    res.json({
      success: true,
      data: {
        ...fallbackDistrict,
        locationMetadata: {
          detectedLocation: { latitude, longitude },
          nearestDistrict: 'BHOPAL (fallback)',
          method: 'Fallback to capital'
        }
      },
      message: 'Using fallback district: Bhopal'
    });
  }
});

// Get raw government records for debugging
app.get('/api/raw-data', (req, res) => {
  res.json({
    metadata: realData.metadata,
    sampleRecords: (realData.rawRecords || []).slice(0, 5),
    totalRawRecords: (realData.rawRecords || []).length
  });
});

app.listen(PORT, () => {
  console.log(`🚀 REAL MGNREGA API Server running on port ${PORT}`);
  console.log(`📊 Serving ${Object.keys(realData.districts || {}).length} MP districts with REAL government data`);
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
  console.log(`🏛️ Data source: Real Government MGNREGA Database`);
});
