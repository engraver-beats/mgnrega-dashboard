// #!/usr/bin/env node

// const axios = require('axios');
// const fs = require('fs');
// const path = require('path');

// console.log('🏛️ Fetching REAL Government MGNREGA Data...\n');

// // Real Government API configuration
// const API_KEY = '579b464db66ec23bdd00000108db2609c42e47e37440c9b493bf7ff6';
// const BASE_URL = 'https://api.data.gov.in/resource';
// const RESOURCE_ID = 'ee03643a-ee4c-48c2-ac30-9f2ff26ab722';

// // Financial years to fetch
// const FINANCIAL_YEARS = ['2024-2025', '2023-2024', '2022-2023'];

// async function fetchRealMPData(financialYear = '2024-2025', limit = 100) {
//   try {
//     console.log(`📡 Fetching data for FY ${financialYear}...`);
    
//     const response = await axios.get(`${BASE_URL}/${RESOURCE_ID}`, {
//       params: {
//         'api-key': API_KEY,
//         format: 'json',
//         offset: 0,
//         limit: limit,
//         'filters[state_name]': 'MADHYA PRADESH',
//         'filters[fin_year]': financialYear
//       },
//       timeout: 30000
//     });
    
//     if (response.data && response.data.records) {
//       console.log(`✅ Fetched ${response.data.records.length} real records for FY ${financialYear}`);
//       return response.data.records;
//     } else {
//       console.log(`⚠️ No records found for FY ${financialYear}`);
//       return [];
//     }
//   } catch (error) {
//     console.log(`❌ Error fetching data for FY ${financialYear}:`, error.message);
//     return [];
//   }
// }

// function processGovernmentRecord(record) {
//   // Convert government API record to our format
//   const districtCode = record.district_code;
//   const districtName = record.district_name;
  
//   return {
//     id: `17_${districtCode}`,
//     name: districtName,
//     state: 'Madhya Pradesh',
//     stateCode: '17',
//     districtCode: districtCode,
    
//     // Direct from government data
//     totalJobCards: parseInt(record.Total_No_of_JobCards_issued) || 0,
//     activeJobCards: parseInt(record.Total_No_of_Active_Job_Cards) || 0,
//     totalWorkers: parseInt(record.Total_No_of_Workers) || 0,
//     activeWorkers: parseInt(record.Total_No_of_Active_Workers) || 0,
    
//     // Employment metrics
//     totalHouseholdsWorked: parseInt(record.Total_Households_Worked) || 0,
//     totalIndividualsWorked: parseInt(record.Total_Individuals_Worked) || 0,
//     averageWageRate: parseFloat(record.Average_Wage_rate_per_day_per_person) || 0,
//     averageDaysEmployment: parseInt(record.Average_days_of_employment_provided_per_Household) || 0,
    
//     // Work statistics
//     completedWorks: parseInt(record.Number_of_Completed_Works) || 0,
//     ongoingWorks: parseInt(record.Number_of_Ongoing_Works) || 0,
//     totalWorksUndertaken: parseInt(record.Total_No_of_Works_Takenup) || 0,
    
//     // Financial data (in lakhs)
//     totalExpenditure: parseFloat(record.Total_Exp) || 0,
//     wageExpenditure: parseFloat(record.Wages) || 0,
//     materialExpenditure: parseFloat(record.Material_and_skilled_Wages) || 0,
//     adminExpenditure: parseFloat(record.Total_Adm_Expenditure) || 0,
    
//     // Demographics
//     scWorkers: parseInt(record.SC_workers_against_active_workers) || 0,
//     stWorkers: parseInt(record.ST_workers_against_active_workers) || 0,
//     scPersondays: parseInt(record.SC_persondays) || 0,
//     stPersondays: parseInt(record.ST_persondays) || 0,
//     womenPersondays: parseInt(record.Women_Persondays) || 0,
//     differentlyAbledWorkers: parseInt(record.Differently_abled_persons_worked) || 0,
    
//     // Work categories (from percentages)
//     workCategories: [
//       { 
//         name: 'Agriculture & Allied Works', 
//         value: parseFloat(record.percent_of_Expenditure_on_Agriculture_Allied_Works) || 0, 
//         color: '#8884d8' 
//       },
//       { 
//         name: 'Natural Resource Management', 
//         value: parseFloat(record.percent_of_NRM_Expenditure) || 0, 
//         color: '#82ca9d' 
//       },
//       { 
//         name: 'Category B Works', 
//         value: parseFloat(record.percent_of_Category_B_Works) || 0, 
//         color: '#ffc658' 
//       },
//       { 
//         name: 'Other Works', 
//         value: Math.max(0, 100 - (parseFloat(record.percent_of_Expenditure_on_Agriculture_Allied_Works) || 0) - (parseFloat(record.percent_of_NRM_Expenditure) || 0) - (parseFloat(record.percent_of_Category_B_Works) || 0)), 
//         color: '#ff7300' 
//       }
//     ],
    
//     // Payment efficiency
//     paymentStatus: {
//       within15Days: parseFloat(record.percentage_payments_gererated_within_15_days) || 0,
//       within30Days: Math.max(0, 95 - (parseFloat(record.percentage_payments_gererated_within_15_days) || 0)),
//       beyond30Days: Math.max(0, 5)
//     },
    
//     // Raw government data for reference
//     rawData: {
//       fin_year: record.fin_year,
//       month: record.month,
//       approvedLabourBudget: record.Approved_Labour_Budget,
//       persondaysOfCentralLiability: record.Persondays_of_Central_Liability_so_far,
//       householdsCompleted100Days: record.Total_No_of_HHs_completed_100_Days_of_Wage_Employment,
//       gpWithNilExp: record.Number_of_GPs_with_NIL_exp,
//       remarks: record.Remarks
//     },
    
//     // Metadata
//     lastUpdated: new Date().toISOString(),
//     dataSource: 'Real Government MGNREGA API',
//     financialYear: record.fin_year,
//     month: record.month,
//     apiSource: `${BASE_URL}/${RESOURCE_ID}`
//   };
// }

// function generateMonthlyTrend(baseValue, months = 12) {
//   const monthNames = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
//   return monthNames.slice(0, months).map(month => ({
//     month,
//     value: Math.floor(baseValue * (0.7 + Math.random() * 0.6))
//   }));
// }

// async function main() {
//   console.log('🏛️ REAL Government MGNREGA Data Fetcher\n');
//   console.log(`🔑 API Key: ${API_KEY.substring(0, 10)}...`);
//   console.log(`🌐 Resource: ${RESOURCE_ID}`);
//   console.log(`📊 Target: Madhya Pradesh districts\n`);
  
//   let allRealData = [];
//   let allDistrictsData = {};
  
//   // Fetch data for multiple financial years
//   for (const year of FINANCIAL_YEARS) {
//     const yearData = await fetchRealMPData(year, 200);
//     allRealData = allRealData.concat(yearData);
    
//     // Add delay between requests to be respectful to the API
//     if (FINANCIAL_YEARS.indexOf(year) < FINANCIAL_YEARS.length - 1) {
//       console.log('⏳ Waiting 2 seconds before next request...');
//       await new Promise(resolve => setTimeout(resolve, 2000));
//     }
//   }
  
//   console.log(`\n📊 Total records fetched: ${allRealData.length}`);
  
//   if (allRealData.length === 0) {
//     console.log('❌ No data fetched. Please check API key and network connection.');
//     return;
//   }
  
//   // Process and organize data by district
//   console.log('🔄 Processing government records...');
  
//   const districtMap = new Map();
  
//   allRealData.forEach(record => {
//     const processed = processGovernmentRecord(record);
//     const districtId = processed.id;
    
//     if (!districtMap.has(districtId)) {
//       districtMap.set(districtId, []);
//     }
//     districtMap.get(districtId).push(processed);
//   });
  
//   console.log(`📍 Found data for ${districtMap.size} unique MP districts`);
  
//   // Create final district data (use latest/best record for each district)
//   districtMap.forEach((records, districtId) => {
//     // Sort by financial year and take the most recent
//     const sortedRecords = records.sort((a, b) => b.financialYear.localeCompare(a.financialYear));
//     const latestRecord = sortedRecords[0];
    
//     // Add monthly trends based on real data
//     latestRecord.monthlyData = {
//       employment: generateMonthlyTrend(latestRecord.totalIndividualsWorked),
//       wages: generateMonthlyTrend(latestRecord.averageWageRate),
//       works: generateMonthlyTrend(latestRecord.completedWorks)
//     };
    
//     // Add historical data summary (avoid circular reference)
//     latestRecord.historicalData = sortedRecords.map(r => ({
//       financialYear: r.financialYear,
//       month: r.month,
//       totalJobCards: r.totalJobCards,
//       activeWorkers: r.activeWorkers,
//       averageWageRate: r.averageWageRate,
//       totalExpenditure: r.totalExpenditure
//     }));
    
//     allDistrictsData[districtId] = latestRecord;
//   });
  
//   // Create cache directory
//   const cacheDir = './backend/cache';
//   if (!fs.existsSync(cacheDir)) {
//     fs.mkdirSync(cacheDir, { recursive: true });
//   }
  
//   // Save real government data cache
//   const cacheData = {
//     metadata: {
//       generated: new Date().toISOString(),
//       totalDistricts: Object.keys(allDistrictsData).length,
//       totalRecords: allRealData.length,
//       dataSource: 'Real Government MGNREGA API',
//       apiKey: API_KEY.substring(0, 10) + '...',
//       resourceId: RESOURCE_ID,
//       financialYears: FINANCIAL_YEARS,
//       version: '2.0',
//       state: 'Madhya Pradesh',
//       stateCode: '17'
//     },
//     districts: allDistrictsData,
//     rawRecords: allRealData // Keep raw data for debugging
//   };
  
//   const cacheFile = path.join(cacheDir, 'real_mgnrega_data.json');
//   fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
//   console.log(`💾 Real government data cached to: ${cacheFile}`);
  
//   // Update the simple server to use real data
//   const serverCode = `
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
//   console.log(\`📊 \${Object.keys(realData.districts).length} MP districts with real data\`);
//   console.log(\`🏛️ Data source: \${realData.metadata.dataSource}\`);
//   console.log(\`📅 Financial years: \${realData.metadata.financialYears.join(', ')}\`);
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

// // Get specific district real data
// app.get('/api/districts/:districtId', (req, res) => {
//   const { districtId } = req.params;
//   const district = realData.districts?.[districtId];
  
//   if (!district) {
//     return res.status(404).json({
//       success: false,
//       error: 'District not found',
//       message: \`No real government data available for district: \${districtId}\`,
//       availableDistricts: Object.keys(realData.districts || {})
//     });
//   }
  
//   res.json({
//     ...district,
//     dataQuality: '🟢 Real Government Data',
//     apiVerified: true
//   });
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
//   console.log(\`🚀 REAL MGNREGA API Server running on port \${PORT}\`);
//   console.log(\`📊 Serving \${Object.keys(realData.districts || {}).length} MP districts with REAL government data\`);
//   console.log(\`🌐 API available at http://localhost:\${PORT}/api\`);
//   console.log(\`🏛️ Data source: Real Government MGNREGA Database\`);
// });
// `;
  
//   // Save the updated server
//   fs.writeFileSync('./backend/real_server.js', serverCode.trim());
//   console.log('💾 Created real_server.js with government data');
  
//   // Show sample real data
//   const sampleDistricts = Object.values(allDistrictsData).slice(0, 3);
//   console.log('\n📋 Sample REAL Government Data:');
//   sampleDistricts.forEach(district => {
//     console.log(`\n🏛️ ${district.name} (${district.id}):`);
//     console.log(`   📊 Job Cards: ${district.totalJobCards.toLocaleString()}`);
//     console.log(`   👥 Active Workers: ${district.activeWorkers.toLocaleString()}`);
//     console.log(`   💰 Average Wage: ₹${district.averageWageRate.toFixed(2)}`);
//     console.log(`   🏗️ Completed Works: ${district.completedWorks.toLocaleString()}`);
//     console.log(`   💸 Total Expenditure: ₹${district.totalExpenditure.toFixed(2)} lakhs`);
//     console.log(`   📅 Financial Year: ${district.financialYear}`);
//   });
  
//   console.log('\n🎉 REAL Government data fetch complete!');
//   console.log('\n🚀 To use REAL data:');
//   console.log('   1. cd backend');
//   console.log('   2. node real_server.js');
//   console.log('   3. Open http://localhost:5000/api/health');
//   console.log('\n✅ Your dashboard will now show ACTUAL government MGNREGA data!');
//   console.log('🏛️ Data directly from: https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722');
// }

// main().catch(console.error);




require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Load ENV Vars
const API_KEY = process.env.MGNREGA_API_KEY;
const BASE_URL = process.env.MGNREGA_API_BASE_URL || "https://api.data.gov.in/resource";
const RESOURCE_ID = process.env.RESOURCE_ID || "ee03643a-ee4c-48c2-ac30-9f2ff26ab722";
const STATE = process.env.STATE || "MADHYA PRADESH";

console.log(`🏛️ Fetching REAL government MGNREGA data for ${STATE}`);
console.log(`🔑 API Key loaded: ${API_KEY ? "YES ✅" : "NO ❌"}`);

if (!API_KEY) {
  console.error("❌ ERROR: MGNREGA_API_KEY missing in .env");
  process.exit(1);
}

const FINANCIAL_YEARS = ["2024-2025", "2023-2024", "2022-2023"];

async function fetchYear(year, limit = 5000) {
  try {
    console.log(`📡 Fetching: ${year} ...`);
    const res = await axios.get(`${BASE_URL}/${RESOURCE_ID}`, {
      params: {
        "api-key": API_KEY,
        format: "json",
        limit,
        "filters[state_name]": STATE,
        "filters[fin_year]": year
      },
      timeout: 30000
    });

    if (res.data.error) {
      console.log(`❌ API returned error: ${res.data.error}`);
      process.exit(1);
    }

    return res.data.records || [];
  } catch (err) {
    console.log(`❌ Request failed: ${err.message}`);
    return [];
  }
}

function formatRecord(r) {
  return {
    id: `17_${r.district_code}`,
    name: r.district_name,
    state: STATE,
    totalJobCards: Number(r.Total_No_of_JobCards_issued) || 0,
    activeWorkers: Number(r.Total_No_of_Active_Workers) || 0,
    averageWageRate: Number(r.Average_Wage_rate_per_day_per_person) || 0,
    completedWorks: Number(r.Number_of_Completed_Works) || 0,
    totalExpenditure: Number(r.Total_Exp) || 0,
    financialYear: r.fin_year,
    month: r.month,
    lastUpdated: new Date().toISOString(),
    dataSource: "Real Government MGNREGA API"
  };
}

async function main() {
  let all = [];

  for (let year of FINANCIAL_YEARS) {
    const data = await fetchYear(year);
    console.log(`✅ ${data.length} records received for ${year}`);
    all = all.concat(data);
    await new Promise(r => setTimeout(r, 1500));
  }

  if (all.length === 0) {
    console.log("❌ No MGNREGA data retrieved. Check API key or dataset access permissions.");
    return;
  }

  const districts = {};

  all.forEach(record => {
    const d = formatRecord(record);
    if (!districts[d.id] || d.financialYear > districts[d.id].financialYear) {
      districts[d.id] = d;
    }
  });

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const cacheFile = path.join(cacheDir, "real_mgnrega_data.json");

  fs.writeFileSync(cacheFile, JSON.stringify({
    metadata: {
      generated: new Date().toISOString(),
      totalDistricts: Object.keys(districts).length,
      totalRecords: all.length,
      dataSource: "Real Government MGNREGA API",
      resourceId: RESOURCE_ID,
      state: STATE
    },
    districts,
    rawRecords: all
  }, null, 2));

  console.log(`💾 Saved ✅ ${Object.keys(districts).length} districts to ${cacheFile}`);
}

main();
