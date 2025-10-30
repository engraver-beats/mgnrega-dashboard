// const express = require('express');
// const router = express.Router();
// const District = require('../models/District');
// const locationService = require('../services/locationService');
// const apiService = require('../services/apiService');

// // Get all districts (for dropdown)
// router.get('/', async (req, res) => {
//   try {
//     const { state = '09' } = req.query;
//     const result = await locationService.getDistrictsByState(state);
    
//     if (result.success) {
//       res.json({
//         success: true,
//         districts: result.districts
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: result.error
//       });
//     }
//   } catch (error) {
//     console.error('Error fetching districts:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Find district by location
// router.post('/find-by-location', async (req, res) => {
//   try {
//     const { latitude, longitude } = req.body;
    
//     if (!latitude || !longitude) {
//       return res.status(400).json({
//         success: false,
//         message: 'Latitude and longitude are required'
//       });
//     }

//     const result = await locationService.findNearestDistrict(latitude, longitude);
    
//     if (result.success) {
//       res.json({
//         success: true,
//         district: result.district,
//         confidence: result.confidence,
//         message: result.confidence > 0.7 ? 
//           'High confidence match' : 
//           'Approximate match - please verify'
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: result.error || 'No district found for this location'
//       });
//     }
//   } catch (error) {
//     console.error('Error finding district by location:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Location service error'
//     });
//   }
// });

// // Get district details
// // router.get('/:districtCode', async (req, res) => {
// //   try {
// //     const { districtCode } = req.params;
    
// //     const district = await District.findOne({ 
// //       districtCode: districtCode,
// //       isActive: true 
// //     });
    
// //     if (!district) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'District not found'
// //       });
// //     }

// //     res.json({
// //       success: true,
// //       district: district
// //     });
// //   } catch (error) {
// //     console.error('Error fetching district details:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Server error'
// //     });
// //   }
// // });

// // module.exports = router;

// router.get('/:districtCode', async (req, res) => {
//   try {
//     const districtCodeFull = req.params.districtCode; 
//     const [stateCode, districtCode] = districtCodeFull.split("_");

//     const baseUrl = `${process.env.MGNREGA_API_BASE_URL}/${process.env.RESOURCE_ID}`;
//     const url = `${baseUrl}?api-key=${process.env.MGNREGA_API_KEY}&format=json&filters[state_code]=${stateCode}&filters[district_code]=${districtCode}`;

//     const apiResponse = await fetch(url);
//     const data = await apiResponse.json();

//     if (!data.records || data.records.length === 0) {
//       return res.json({
//         success: true,
//         id: districtCodeFull,
//         name: "Unknown",
//         charts: {
//           employmentTrend: [],
//           wagesTrend: [],
//           workCategories: [],
//           paymentStatus: []
//         }
//       });
//     }

//     const records = data.records;

//     // ✅ Employment Trend
//     const employmentTrend = records.map(r => ({
//       month: r.month_name || r.month,
//       employment: Number(r.tot_persondays_generated || 0)
//     }));

//     // ✅ Wages Trend
//     const wagesTrend = records.map(r => ({
//       month: r.month_name || r.month,
//       wages: Number(r.wage_expenditure || 0)
//     }));

//     // ✅ Work Category
//     const first = records[0];
//     const workCategories = [
//       { hindi: "जल संरक्षण", value: Number(first.no_of_works_watershed || 0), color: "#3b82f6" },
//       { hindi: "कृषि सम्बंधित", value: Number(first.no_of_works_agriculture || 0), color: "#10b981" },
//       { hindi: "सड़क निर्माण", value: Number(first.no_of_works_rural_connectivity || 0), color: "#f59e0b" }
//     ];

//     // ✅ Payment Status
//     const totalFunds = Number(first.funds_released || 0);
//     const usedFunds = Number(first.funds_utilised || 0);
//     const pending = totalFunds - usedFunds;

//     const paymentStatus = [
//       { name: "भुगतान हो चुका", value: usedFunds, color: "#22c55e" },
//       { name: "लंबित", value: pending, color: "#ef4444" }
//     ];

//     // ✅ Main Response
//     return res.json({
//       success: true,
//       id: districtCodeFull,
//       name: first.district_name,
//       state: first.state_name,
//       totalJobCards: Number(first.tot_jobcards_issued || 0),
//       activeWorkers: Number(first.tot_active_workers || 0),
//       charts: {
//         employmentTrend,
//         wagesTrend,
//         workCategories,
//         paymentStatus
//       }
//     });

//   } catch (err) {
//     console.error("District API ERROR:", err);
//     return res.status(500).json({ success: false, error: "Server error" });
//   }
// });

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // ✅ Add this if missing (for older Node versions)

// ✅ Example: 17_1710 → state=17, district=1710
router.get('/:districtCode', async (req, res) => {
  try {
    const districtCodeFull = req.params.districtCode;
    const [stateCode, districtCode] = districtCodeFull.split("_");

    // ✅ Data.gov.in API URL (most reliable resource)
    const baseUrl = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";
    const url = `${baseUrl}?api-key=${process.env.MGNREGA_API_KEY}&format=json&filters[state_code]=${stateCode}&filters[district_code]=${districtCode}&limit=1000`;

    const apiResponse = await fetch(url);
    const data = await apiResponse.json();

    if (!data.records || data.records.length === 0) {
      return res.json({
        success: true,
        id: districtCodeFull,
        name: "Unknown District",
        state: "Unknown",
        totalJobCards: 0,
        activeWorkers: 0,
        charts: {
          employmentTrend: [],
          wagesTrend: [],
          workCategories: [],
          paymentStatus: []
        }
      });
    }

    const records = data.records;

    // ✅ Employment Trend Chart
    const employmentTrend = records.map(r => ({
      month: r.month_name || r.month,
      employment: Number(r.tot_persondays_generated || 0)
    }));

    // ✅ Wages Trend Chart
    const wagesTrend = records.map(r => ({
      month: r.month_name || r.month,
      wages: Number(r.wage_expenditure || 0)
    }));

    // ✅ Read first record for summary
    const first = records[0];

    // ✅ Work Categories Pie
    const workCategories = [
      { hindi: "जल संरक्षण", value: Number(first.no_of_works_watershed || 0), color: "#3b82f6" },
      { hindi: "कृषि सम्बंधित", value: Number(first.no_of_works_agriculture || 0), color: "#10b981" },
      { hindi: "सड़क निर्माण", value: Number(first.no_of_works_rural_connectivity || 0), color: "#f59e0b" }
    ];

    // ✅ Payment Status
    const totalFunds = Number(first.funds_released || 0);
    const usedFunds = Number(first.funds_utilised || 0);
    const pending = totalFunds > usedFunds ? totalFunds - usedFunds : 0;

    const paymentStatus = [
      { name: "भुगतान हो चुका", value: usedFunds, color: "#22c55e" },
      { name: "लंबित", value: pending, color: "#ef4444" }
    ];

    return res.json({
      success: true,
      id: districtCodeFull,
      name: first.district_name,
      state: first.state_name,
      totalJobCards: Number(first.tot_jobcards_issued || 0),
      activeWorkers: Number(first.tot_active_workers || 0),
      charts: {
        employmentTrend,
        wagesTrend,
        workCategories,
        paymentStatus
      }
    });

  } catch (err) {
    console.error("District API ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching MGNREGA data"
    });
  }
});

module.exports = router;
