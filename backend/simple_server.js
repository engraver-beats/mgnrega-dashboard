const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Load cached data
const cacheFile = path.join(__dirname, 'cache', 'mgnrega_data.json');
let cachedData = {};

if (fs.existsSync(cacheFile)) {
  cachedData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  console.log('✅ Loaded cached MGNREGA data');
  console.log(`📊 ${Object.keys(cachedData.districts).length} districts available`);
} else {
  console.log('❌ No cached data found. Run: node fetch_and_cache_data.js');
}

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    dataSource: 'Cached MGNREGA Data',
    totalDistricts: Object.keys(cachedData.districts || {}).length,
    lastUpdated: cachedData.metadata?.generated,
    uptime: process.uptime()
  });
});

// Get all districts
app.get('/api/districts', (req, res) => {
  const districts = Object.values(cachedData.districts || {}).map(d => ({
    id: d.id,
    name: d.name,
    hindi: d.hindi,
    state: d.state
  }));
  
  res.json({
    success: true,
    data: districts,
    total: districts.length
  });
});

// Get specific district data
app.get('/api/districts/:districtId', (req, res) => {
  const { districtId } = req.params;
  const district = cachedData.districts?.[districtId];
  
  if (!district) {
    return res.status(404).json({
      success: false,
      error: 'District not found',
      message: `No data available for district: ${districtId}`
    });
  }
  
  res.json(district);
});

app.listen(PORT, () => {
  console.log(`🚀 MGNREGA API Server running on port ${PORT}`);
  console.log(`📊 Serving ${Object.keys(cachedData.districts || {}).length} MP districts`);
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
});