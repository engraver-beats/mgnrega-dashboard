const express = require('express');
const router = express.Router();
const Performance = require('../models/Performance');
const apiService = require('../services/apiService');

// Get current month performance for a district
router.get('/current/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let performance = await Performance.findOne({
      districtCode: districtCode,
      month: currentMonth,
      year: currentYear
    });

    // If not in database, fetch from API
    if (!performance) {
      const apiData = await apiService.getMGNREGAData(districtCode, currentMonth, currentYear);
      
      if (apiData && apiData.records && apiData.records.length > 0) {
        const record = apiData.records[0];
        
        performance = new Performance({
          districtCode: districtCode,
          month: currentMonth,
          year: currentYear,
          ...record
        });
        
        await performance.save();
      }
    }

    if (!performance) {
      return res.status(404).json({
        success: false,
        message: 'Performance data not available'
      });
    }

    res.json({
      success: true,
      performance: performance,
      period: `${currentMonth}/${currentYear}`
    });
  } catch (error) {
    console.error('Error fetching current performance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get historical performance (last 6 months)
router.get('/history/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    const { months = 6 } = req.query;
    
    const currentDate = new Date();
    const historicalData = [];

    // Get last N months of data
    for (let i = 0; i < parseInt(months); i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      let performance = await Performance.findOne({
        districtCode: districtCode,
        month: month,
        year: year
      });

      // If not in database, try to fetch from API
      if (!performance) {
        try {
          const apiData = await apiService.getMGNREGAData(districtCode, month, year);
          
          if (apiData && apiData.records && apiData.records.length > 0) {
            const record = apiData.records[0];
            
            performance = new Performance({
              districtCode: districtCode,
              month: month,
              year: year,
              ...record
            });
            
            await performance.save();
          }
        } catch (apiError) {
          console.log(`No data available for ${month}/${year}`);
        }
      }

      if (performance) {
        historicalData.push({
          ...performance.toObject(),
          period: `${month}/${year}`
        });
      }
    }

    res.json({
      success: true,
      history: historicalData.reverse(), // Oldest first
      totalMonths: historicalData.length
    });
  } catch (error) {
    console.error('Error fetching historical performance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Compare district performance with state average
router.get('/compare/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Get district performance
    const districtPerformance = await Performance.findOne({
      districtCode: districtCode,
      month: currentMonth,
      year: currentYear
    });

    if (!districtPerformance) {
      return res.status(404).json({
        success: false,
        message: 'District performance data not found'
      });
    }

    // Get state average (all districts in UP)
    const stateAverage = await Performance.aggregate([
      {
        $match: {
          month: currentMonth,
          year: currentYear,
          districtCode: { $regex: '^09' } // UP districts
        }
      },
      {
        $group: {
          _id: null,
          avgJobCards: { $avg: '$totalJobCards' },
          avgActiveJobCards: { $avg: '$activeJobCards' },
          avgPersonDays: { $avg: '$totalPersonDays' },
          avgWageRate: { $avg: '$averageWageRate' },
          avgWomenParticipation: { $avg: '$womenParticipation' },
          avgEmployment: { $avg: '$employmentProvided' },
          totalDistricts: { $sum: 1 }
        }
      }
    ]);

    const comparison = {
      district: {
        name: districtCode,
        totalJobCards: districtPerformance.totalJobCards,
        activeJobCards: districtPerformance.activeJobCards,
        totalPersonDays: districtPerformance.totalPersonDays,
        averageWageRate: districtPerformance.averageWageRate,
        womenParticipation: districtPerformance.womenParticipation,
        employmentProvided: districtPerformance.employmentProvided
      },
      stateAverage: stateAverage[0] || {},
      performance: {}
    };

    // Calculate performance indicators
    if (stateAverage[0]) {
      const avg = stateAverage[0];
      comparison.performance = {
        jobCardsRatio: (districtPerformance.totalJobCards / avg.avgJobCards * 100).toFixed(1),
        personDaysRatio: (districtPerformance.totalPersonDays / avg.avgPersonDays * 100).toFixed(1),
        wageRateRatio: (districtPerformance.averageWageRate / avg.avgWageRate * 100).toFixed(1),
        womenParticipationDiff: (districtPerformance.womenParticipation - avg.avgWomenParticipation).toFixed(1)
      };
    }

    res.json({
      success: true,
      comparison: comparison,
      period: `${currentMonth}/${currentYear}`
    });
  } catch (error) {
    console.error('Error comparing performance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

