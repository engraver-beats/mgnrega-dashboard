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

// Get specific district real data
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