const express = require('express');
const router = express.Router();
const District = require('../models/District');
const locationService = require('../services/locationService');
const apiService = require('../services/apiService');

// Get all districts (for dropdown)
router.get('/', async (req, res) => {
  try {
    const { state = '09' } = req.query;
    const result = await locationService.getDistrictsByState(state);
    
    if (result.success) {
      res.json({
        success: true,
        districts: result.districts
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Find district by location
router.post('/find-by-location', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const result = await locationService.findNearestDistrict(latitude, longitude);
    
    if (result.success) {
      res.json({
        success: true,
        district: result.district,
        confidence: result.confidence,
        message: result.confidence > 0.7 ? 
          'High confidence match' : 
          'Approximate match - please verify'
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.error || 'No district found for this location'
      });
    }
  } catch (error) {
    console.error('Error finding district by location:', error);
    res.status(500).json({
      success: false,
      message: 'Location service error'
    });
  }
});

// Get district details
router.get('/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    
    const district = await District.findOne({ 
      districtCode: districtCode,
      isActive: true 
    });
    
    if (!district) {
      return res.status(404).json({
        success: false,
        message: 'District not found'
      });
    }

    res.json({
      success: true,
      district: district
    });
  } catch (error) {
    console.error('Error fetching district details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

