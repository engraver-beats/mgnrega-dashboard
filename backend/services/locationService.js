const District = require('../models/District');

class LocationService {
  // Find nearest district based on coordinates
  async findNearestDistrict(latitude, longitude) {
    try {
      // Use MongoDB's geospatial query to find nearest district
      const nearestDistrict = await District.findOne({
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: 100000 // 100km radius
          }
        },
        isActive: true
      });

      if (nearestDistrict) {
        return {
          success: true,
          district: nearestDistrict,
          confidence: this.calculateConfidence(latitude, longitude, nearestDistrict)
        };
      }

      // Fallback: find by approximate coordinates
      return this.findByApproximateLocation(latitude, longitude);
    } catch (error) {
      console.error('Error finding nearest district:', error);
      return {
        success: false,
        error: 'Location service unavailable'
      };
    }
  }

  async findByApproximateLocation(latitude, longitude) {
    try {
      // Simple distance calculation for fallback
      const districts = await District.find({ isActive: true });
      let nearestDistrict = null;
      let minDistance = Infinity;

      districts.forEach(district => {
        if (district.coordinates && district.coordinates.latitude && district.coordinates.longitude) {
          const distance = this.calculateDistance(
            latitude, longitude,
            district.coordinates.latitude, district.coordinates.longitude
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestDistrict = district;
          }
        }
      });

      if (nearestDistrict && minDistance < 100) { // Within 100km
        return {
          success: true,
          district: nearestDistrict,
          confidence: Math.max(0.1, 1 - (minDistance / 100))
        };
      }

      return {
        success: false,
        error: 'No nearby district found'
      };
    } catch (error) {
      console.error('Error in approximate location search:', error);
      return {
        success: false,
        error: 'Location service error'
      };
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  calculateConfidence(userLat, userLng, district) {
    if (!district.coordinates) return 0.5;
    
    const distance = this.calculateDistance(
      userLat, userLng,
      district.coordinates.latitude, district.coordinates.longitude
    );
    
    // Higher confidence for closer distances
    if (distance < 10) return 0.95;
    if (distance < 25) return 0.85;
    if (distance < 50) return 0.70;
    if (distance < 100) return 0.50;
    return 0.30;
  }

  // Get districts by state for manual selection
  async getDistrictsByState(stateCode = '09') {
    try {
      const districts = await District.find({ 
        stateCode: stateCode,
        isActive: true 
      }).sort({ districtName: 1 });
      
      return {
        success: true,
        districts: districts
      };
    } catch (error) {
      console.error('Error fetching districts by state:', error);
      return {
        success: false,
        error: 'Failed to fetch districts'
      };
    }
  }
}

module.exports = new LocationService();

