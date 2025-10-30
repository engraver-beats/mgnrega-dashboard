// const express = require('express');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = 5000;

// // Load real government data
// const cacheFile = path.join(__dirname, 'cache', 'real_mgnrega_data.json');
// let realData = {};

// if (fs.existsSync(cacheFile)) {
//   realData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
//   console.log('✅ Loaded REAL Government MGNREGA data');
//   console.log(`📊 ${Object.keys(realData.districts).length} MP districts with real data`);
//   console.log(`🏛️ Data source: ${realData.metadata.dataSource}`);
//   console.log(`📅 Financial years: ${realData.metadata.financialYears.join(', ')}`);
// } else {
//   console.log('❌ No real data found. Run: node fetch_real_government_data.js');
// }

// app.use(cors());
// app.use(express.json());

// // Health check with real data info
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'healthy',
//     dataSource: 'REAL Government MGNREGA API',
//     totalDistricts: Object.keys(realData.districts || {}).length,
//     totalRecords: realData.metadata?.totalRecords || 0,
//     financialYears: realData.metadata?.financialYears || [],
//     lastUpdated: realData.metadata?.generated,
//     uptime: process.uptime(),
//     apiEndpoint: 'https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722'
//   });
// });

// // Get all districts with real data
// app.get('/api/districts', (req, res) => {
//   const districts = Object.values(realData.districts || {}).map(d => ({
//     id: d.id,
//     name: d.name,
//     state: d.state,
//     totalJobCards: d.totalJobCards,
//     activeWorkers: d.activeWorkers,
//     averageWageRate: d.averageWageRate,
//     dataSource: d.dataSource
//   }));
  
//   res.json({
//     success: true,
//     data: districts,
//     total: districts.length,
//     dataSource: 'Real Government MGNREGA API'
//   });
// });

// // Get states endpoint (required by frontend)
// app.get('/api/states', (req, res) => {
//   res.json({
//     success: true,
//     data: [
//       {
//         id: '17',
//         name: 'Madhya Pradesh',
//         code: 'MP',
//         totalDistricts: Object.keys(realData.districts || {}).length
//       }
//     ],
//     total: 1,
//     dataSource: 'Real Government MGNREGA API'
//   });
// });

// // Search districts endpoint (must come before :districtId route)
// app.get('/api/districts/search', (req, res) => {
//   const { q, state } = req.query;
  
//   if (!q) {
//     return res.json({
//       success: true,
//       data: Object.values(realData.districts || {}),
//       total: Object.keys(realData.districts || {}).length
//     });
//   }
  
//   const searchTerm = q.toLowerCase();
//   const filteredDistricts = Object.values(realData.districts || {}).filter(district => 
//     district.name.toLowerCase().includes(searchTerm) ||
//     district.id.includes(searchTerm)
//   );
  
//   res.json({
//     success: true,
//     data: filteredDistricts,
//     total: filteredDistricts.length,
//     searchTerm: q
//   });
// });

// // Get specific district real data (must come after search route)
// app.get('/api/districts/:districtId', (req, res) => {
//   const { districtId } = req.params;
//   const district = realData.districts?.[districtId];
  
//   if (!district) {
//     return res.status(404).json({
//       success: false,
//       error: 'District not found',
//       message: `No real government data available for district: ${districtId}`,
//       availableDistricts: Object.keys(realData.districts || {})
//     });
//   }
  
//   res.json({
//     ...district,
//     dataQuality: '🟢 Real Government Data',
//     apiVerified: true
//   });
// });

// // Find district by location (geolocation)
// app.post('/api/districts/find-by-location', (req, res) => {
//   const { latitude, longitude } = req.body;
  
//   if (!latitude || !longitude) {
//     return res.status(400).json({
//       success: false,
//       error: 'Missing coordinates',
//       message: 'Latitude and longitude are required'
//     });
//   }

//   // MP district coordinates (approximate centers)
//   const mpDistrictCoords = {
//     '17_1703': { name: 'GWALIOR', lat: 26.2183, lng: 78.1828 },
//     '17_1719': { name: 'SHAJAPUR', lat: 23.4273, lng: 76.2731 },
//     '17_1728': { name: 'BHOPAL', lat: 23.2599, lng: 77.4126 },
//     '17_1710': { name: 'SAGAR', lat: 23.8388, lng: 78.7378 },
//     '17_1722': { name: 'DHAR', lat: 22.5971, lng: 75.2973 },
//     '17_1730': { name: 'INDORE', lat: 22.7196, lng: 75.8577 },
//     '17_1733': { name: 'UJJAIN', lat: 23.1765, lng: 75.7885 },
//     '17_1701': { name: 'SHEOPUR', lat: 25.6681, lng: 76.6947 },
//     '17_1702': { name: 'MORENA', lat: 26.4951, lng: 78.0015 },
//     '17_1704': { name: 'SHIVPURI', lat: 25.4305, lng: 77.6581 }
//   };

//   // Calculate distance and find nearest district
//   let nearestDistrict = null;
//   let minDistance = Infinity;

//   Object.entries(mpDistrictCoords).forEach(([districtId, coords]) => {
//     const distance = Math.sqrt(
//       Math.pow(latitude - coords.lat, 2) + Math.pow(longitude - coords.lng, 2)
//     );
    
//     if (distance < minDistance) {
//       minDistance = distance;
//       nearestDistrict = {
//         id: districtId,
//         name: coords.name,
//         distance: distance,
//         coordinates: coords
//       };
//     }
//   });

//   if (nearestDistrict && realData.districts[nearestDistrict.id]) {
//     const districtData = realData.districts[nearestDistrict.id];
//     res.json({
//       success: true,
//       data: {
//         ...districtData,
//         locationMetadata: {
//           detectedLocation: { latitude, longitude },
//           nearestDistrict: nearestDistrict.name,
//           distance: minDistance,
//           method: 'GPS coordinates'
//         }
//       },
//       message: `Found nearest district: ${nearestDistrict.name}`
//     });
//   } else {
//     // Fallback to Bhopal if no match found
//     const fallbackDistrict = realData.districts['17_1728'];
//     res.json({
//       success: true,
//       data: {
//         ...fallbackDistrict,
//         locationMetadata: {
//           detectedLocation: { latitude, longitude },
//           nearestDistrict: 'BHOPAL (fallback)',
//           method: 'Fallback to capital'
//         }
//       },
//       message: 'Using fallback district: Bhopal'
//     });
//   }
// });

// // Get raw government records for debugging
// app.get('/api/raw-data', (req, res) => {
//   res.json({
//     metadata: realData.metadata,
//     sampleRecords: (realData.rawRecords || []).slice(0, 5),
//     totalRawRecords: (realData.rawRecords || []).length
//   });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 REAL MGNREGA API Server running on port ${PORT}`);
//   console.log(`📊 Serving ${Object.keys(realData.districts || {}).length} MP districts with REAL government data`);
//   console.log(`🌐 API available at http://localhost:${PORT}/api`);
//   console.log(`🏛️ Data source: Real Government MGNREGA Database`);
// });


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const USE_REAL_DATA = process.env.USE_REAL_DATA === "true";

app.use(cors());
app.use(express.json());

let realData = {};

if (USE_REAL_DATA) {
  const file = path.join(__dirname, "cache", "real_mgnrega_data.json");

  if (fs.existsSync(file)) {
    realData = JSON.parse(fs.readFileSync(file, "utf8"));
    console.log(`✅ Loaded Real Data (${Object.keys(realData.districts).length} districts)`);
  } else {
    console.log("❌ real_mgnrega_data.json missing. Run: node fetch_real_government_data.js");
  }
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "running",
    realDataEnabled: USE_REAL_DATA,
    districts: Object.keys(realData.districts || {}).length,
    lastUpdated: realData.metadata?.generated
  });
});

app.get("/api/findNearest", (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.json({ success: false, error: "Missing coordinates" });
  }

  // ✅ Load districts
  let districts = [];
  
  // 1️⃣ Prefer real data if loaded
  if (realData.districts && Object.keys(realData.districts).length > 0) {
    districts = Object.values(realData.districts);
  }

  // 2️⃣ Fallback to static district list if real data not loaded
  if (districts.length === 0) {
    districts = [
      { id: "17_1752", name: "Agar Malwa", hindi: "आगर मालवा", lat: 23.7, lng: 76.01 },
      { id: "17_1711", name: "Damoh", hindi: "दमोह", lat: 23.83, lng: 79.44 },
      { id: "17_1710", name: "Sagar", hindi: "सागर", lat: 23.83, lng: 78.73 },
      { id: "17_1737", name: "Indore", hindi: "इंदौर", lat: 22.72, lng: 75.86 },
      { id: "17_1735", name: "Bhopal", hindi: "भोपाल", lat: 23.26, lng: 77.41 },
      { id: "17_1720", name: "Ujjain", hindi: "उज्जैन", lat: 23.17, lng: 75.78 },
    ];
  }

  // ✅ Find nearest using squared distance (fast & accurate enough)
  let best = null;
  let bestDist = Infinity;

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  for (const d of districts) {
    const dx = d.lat - userLat;
    const dy = d.lng - userLng;
    const dist = dx * dx + dy * dy;

    if (dist < bestDist) {
      bestDist = dist;
      best = d;
    }
  }

  if (!best) {
    return res.json({ success: false, error: "No districts found" });
  }

  res.json({ success: true, district: best });
});

app.get("/api/districts", (req, res) => {
  const search = (req.query.search || "").toLowerCase();

  const list = Object.values(realData.districts || {})
    .filter(d =>
      d.name.toLowerCase().includes(search) ||
      d.hindi?.toLowerCase().includes(search) ||
      d.id.toLowerCase().includes(search)
    )
    .map(d => ({
      id: d.id,
      name: d.name,
      hindi: d.hindi || d.name,
      state: d.state || "Madhya Pradesh",
      lat: d.lat,
      lng: d.lng
    }));

  res.json({
    success: true,
    total: list.length,
    data: list
  });
});


/**
 * ✅ Get ONE district data, formatted for charts + dashboard
 */
app.get("/api/districts/:id", (req, res) => {
  const { id } = req.params;
  const district = realData.districts?.[id];

  if (!district) {
    return res.status(404).json({
      success: false,
      error: "District not found",
      availableDistricts: Object.keys(realData.districts || [])
    });
  }

  // ✅ Monthly data → chart friendly
  const employmentTrend = district.monthlyData?.map(m => ({
    month: m.monthHindi || m.month,
    personDays: m.personDays || m.personDaysGenerated || 0
  })) || [];

  const wagesTrend = district.monthlyData?.map(m => ({
    month: m.monthHindi || m.month,
    wages: m.wages || m.totalWagesPaid || 0
  })) || [];

  const workCategories = district.workCategories?.map(w => ({
    category: w.category,
    count: w.count,
    percentage: w.percentage,
    color: "#"+Math.floor(Math.random()*16777215).toString(16)
  })) || [];

  const paymentStatus = district.paymentStatus?.map(p => ({
    status: p.status,
    amount: p.amount,
    percentage: p.percentage
  })) || [];

  res.json({
    success: true,
    data: {
      id,
      name: district.name,
      hindi: district.hindi,
      state: district.state,
      lat: district.lat,
      lng: district.lng,

      totalJobCards: district.totalJobCards,
      activeJobCards: district.activeJobCards,
      totalPersonDays: district.totalPersonDays,
      womenPersonDays: district.womenPersonDays,
      worksCompleted: district.worksCompleted,
      worksOngoing: district.worksOngoing,
      totalWagesPaid: district.totalWagesPaid,
      averageWageRate: district.averageWageRate,
      womenParticipation: district.womenParticipation,

      charts: {
        employmentTrend,
        wagesTrend,
        workCategories,
        paymentStatus
      },

      lastUpdated: district.lastUpdated
    }
  });
});

app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));

