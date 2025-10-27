// District Service for MGNREGA Dashboard
// Updated to use real backend API with fallback to mock data

import apiService from './apiService';

// Fallback districts with accurate GPS coordinates for precise location detection
const fallbackDistricts = [
  // Uttar Pradesh
  { id: 'UP001', name: 'Agra', state: 'Uttar Pradesh', hindi: 'आगरा', lat: 27.1767, lng: 78.0081 },
  { id: 'UP002', name: 'Lucknow', state: 'Uttar Pradesh', hindi: 'लखनऊ', lat: 26.8467, lng: 80.9462 },
  { id: 'UP003', name: 'Kanpur', state: 'Uttar Pradesh', hindi: 'कानपुर', lat: 26.4499, lng: 80.3319 },
  { id: 'UP004', name: 'Varanasi', state: 'Uttar Pradesh', hindi: 'वाराणसी', lat: 25.3176, lng: 82.9739 },
  { id: 'UP005', name: 'Allahabad', state: 'Uttar Pradesh', hindi: 'इलाहाबाद', lat: 25.4358, lng: 81.8463 },
  { id: 'UP006', name: 'Meerut', state: 'Uttar Pradesh', hindi: 'मेरठ', lat: 28.9845, lng: 77.7064 },
  { id: 'UP007', name: 'Ghaziabad', state: 'Uttar Pradesh', hindi: 'गाजियाबाद', lat: 28.6692, lng: 77.4538 },
  { id: 'UP008', name: 'Noida', state: 'Uttar Pradesh', hindi: 'नोएडा', lat: 28.5355, lng: 77.3910 },
  { id: 'UP009', name: 'Mathura', state: 'Uttar Pradesh', hindi: 'मथुरा', lat: 27.4924, lng: 77.6737 },
  { id: 'UP010', name: 'Aligarh', state: 'Uttar Pradesh', hindi: 'अलीगढ़', lat: 27.8974, lng: 78.0880 },
  
  // Maharashtra
  { id: 'MH001', name: 'Mumbai', state: 'Maharashtra', hindi: 'मुंबई', lat: 19.0760, lng: 72.8777 },
  { id: 'MH002', name: 'Pune', state: 'Maharashtra', hindi: 'पुणे', lat: 18.5204, lng: 73.8567 },
  { id: 'MH003', name: 'Nagpur', state: 'Maharashtra', hindi: 'नागपुर', lat: 21.1458, lng: 79.0882 },
  { id: 'MH004', name: 'Nashik', state: 'Maharashtra', hindi: 'नाशिक', lat: 19.9975, lng: 73.7898 },
  { id: 'MH005', name: 'Aurangabad', state: 'Maharashtra', hindi: 'औरंगाबाद', lat: 19.8762, lng: 75.3433 },
  { id: 'MH006', name: 'Thane', state: 'Maharashtra', hindi: 'ठाणे', lat: 19.2183, lng: 72.9781 },
  { id: 'MH007', name: 'Navi Mumbai', state: 'Maharashtra', hindi: 'नवी मुंबई', lat: 19.0330, lng: 73.0297 },
  
  // Delhi NCR
  { id: 'DL001', name: 'New Delhi', state: 'Delhi', hindi: 'नई दिल्ली', lat: 28.6139, lng: 77.2090 },
  { id: 'DL002', name: 'South Delhi', state: 'Delhi', hindi: 'दक्षिण दिल्ली', lat: 28.5244, lng: 77.2066 },
  { id: 'DL003', name: 'North Delhi', state: 'Delhi', hindi: 'उत्तर दिल्ली', lat: 28.7041, lng: 77.1025 },
  { id: 'DL004', name: 'East Delhi', state: 'Delhi', hindi: 'पूर्व दिल्ली', lat: 28.6508, lng: 77.3152 },
  { id: 'DL005', name: 'West Delhi', state: 'Delhi', hindi: 'पश्चिम दिल्ली', lat: 28.6517, lng: 77.1389 },
  { id: 'HR001', name: 'Gurugram', state: 'Haryana', hindi: 'गुरुग्राम', lat: 28.4595, lng: 77.0266 },
  { id: 'HR002', name: 'Faridabad', state: 'Haryana', hindi: 'फरीदाबाद', lat: 28.4089, lng: 77.3178 },
  
  // Karnataka
  { id: 'KA001', name: 'Bangalore', state: 'Karnataka', hindi: 'बैंगलोर', lat: 12.9716, lng: 77.5946 },
  { id: 'KA002', name: 'Mysore', state: 'Karnataka', hindi: 'मैसूर', lat: 12.2958, lng: 76.6394 },
  { id: 'KA003', name: 'Hubli', state: 'Karnataka', hindi: 'हुबली', lat: 15.3647, lng: 75.1240 },
  
  // Tamil Nadu
  { id: 'TN001', name: 'Chennai', state: 'Tamil Nadu', hindi: 'चेन्नई', lat: 13.0827, lng: 80.2707 },
  { id: 'TN002', name: 'Coimbatore', state: 'Tamil Nadu', hindi: 'कोयंबटूर', lat: 11.0168, lng: 76.9558 },
  { id: 'TN003', name: 'Madurai', state: 'Tamil Nadu', hindi: 'मदुरै', lat: 9.9252, lng: 78.1198 },
  
  // West Bengal
  { id: 'WB001', name: 'Kolkata', state: 'West Bengal', hindi: 'कोलकाता', lat: 22.5726, lng: 88.3639 },
  { id: 'WB002', name: 'Howrah', state: 'West Bengal', hindi: 'हावड़ा', lat: 22.5958, lng: 88.2636 },
  
  // Rajasthan
  { id: 'RJ001', name: 'Jaipur', state: 'Rajasthan', hindi: 'जयपुर', lat: 26.9124, lng: 75.7873 },
  { id: 'RJ002', name: 'Jodhpur', state: 'Rajasthan', hindi: 'जोधपुर', lat: 26.2389, lng: 73.0243 },
  { id: 'RJ003', name: 'Udaipur', state: 'Rajasthan', hindi: 'उदयपुर', lat: 24.5854, lng: 73.7125 },
  
  // Gujarat
  { id: 'GJ001', name: 'Ahmedabad', state: 'Gujarat', hindi: 'अहमदाबाद', lat: 23.0225, lng: 72.5714 },
  { id: 'GJ002', name: 'Surat', state: 'Gujarat', hindi: 'सूरत', lat: 21.1702, lng: 72.8311 },
  { id: 'GJ003', name: 'Vadodara', state: 'Gujarat', hindi: 'वडोदरा', lat: 22.3072, lng: 73.1812 },
  
  // Madhya Pradesh (Real MGNREGA districts)
  { id: '17_1711', name: 'Damoh', state: 'Madhya Pradesh', hindi: 'दमोह', lat: 23.8315, lng: 79.4422 },
  { id: '17_1716', name: 'Mandsaur', state: 'Madhya Pradesh', hindi: 'मंदसौर', lat: 24.0767, lng: 75.0700 },
  { id: '17_1722', name: 'Dhar', state: 'Madhya Pradesh', hindi: 'धार', lat: 22.5979, lng: 75.2979 },
  { id: '17_1726', name: 'Rajgarh', state: 'Madhya Pradesh', hindi: 'राजगढ़', lat: 24.0073, lng: 76.8441 },
  { id: '17_1733', name: 'Jabalpur', state: 'Madhya Pradesh', hindi: 'जबलपुर', lat: 23.1815, lng: 79.9864 },
  { id: 'MP001', name: 'Bhopal', state: 'Madhya Pradesh', hindi: 'भोपाल', lat: 23.2599, lng: 77.4126 },
  { id: 'MP002', name: 'Indore', state: 'Madhya Pradesh', hindi: 'इंदौर', lat: 22.7196, lng: 75.8577 },
  { id: 'MP003', name: 'Gwalior', state: 'Madhya Pradesh', hindi: 'ग्वालियर', lat: 26.2183, lng: 78.1828 },
  
  // Punjab
  { id: 'PB001', name: 'Chandigarh', state: 'Punjab', hindi: 'चंडीगढ़', lat: 30.7333, lng: 76.7794 },
  { id: 'PB002', name: 'Ludhiana', state: 'Punjab', hindi: 'लुधियाना', lat: 30.9010, lng: 75.8573 },
  { id: 'PB003', name: 'Amritsar', state: 'Punjab', hindi: 'अमृतसर', lat: 31.6340, lng: 74.8723 },
  
  // Bihar
  { id: 'BR001', name: 'Patna', state: 'Bihar', hindi: 'पटना', lat: 25.5941, lng: 85.1376 },
  { id: 'BR002', name: 'Gaya', state: 'Bihar', hindi: 'गया', lat: 24.7914, lng: 85.0002 },
  { id: 'BR003', name: 'Muzaffarpur', state: 'Bihar', hindi: 'मुजफ्फरपुर', lat: 26.1209, lng: 85.3647 },
  { id: 'BR004', name: 'Darbhanga', state: 'Bihar', hindi: 'दरभंगा', lat: 26.1542, lng: 85.8918 },
  { id: 'BR005', name: 'Bhagalpur', state: 'Bihar', hindi: 'भागलपुर', lat: 25.2425, lng: 86.9842 },
];

// Generate fallback data for offline mode
const generateFallbackData = (district) => {
  const baseJobCards = Math.floor(Math.random() * 50000) + 20000;
  const activePercentage = 0.6 + Math.random() * 0.3;
  const womenParticipation = 45 + Math.random() * 15;
  const averageWage = 200 + Math.floor(Math.random() * 50);
  
  return {
    ...district,
    currentMonth: 'October 2024',
    totalJobCards: baseJobCards,
    activeJobCards: Math.floor(baseJobCards * activePercentage),
    totalPersonDays: Math.floor(baseJobCards * activePercentage * 15),
    womenPersonDays: Math.floor(baseJobCards * activePercentage * 15 * (womenParticipation / 100)),
    averageWageRate: averageWage,
    totalWagesPaid: Math.floor(baseJobCards * activePercentage * 15 * averageWage),
    worksCompleted: Math.floor(Math.random() * 500) + 200,
    worksOngoing: Math.floor(Math.random() * 150) + 50,
    womenParticipation: Math.round(womenParticipation),
    employmentProvided: Math.floor(baseJobCards * activePercentage * 15),
    dataSource: 'Offline Mode - Mock Data',
    
    monthlyData: generateMonthlyTrend(),
    workCategories: generateWorkCategories(),
    paymentStatus: generatePaymentStatus(),
  };
};

const generateMonthlyTrend = () => {
  const months = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];
  
  return months.map((month) => ({
    month,
    employment: Math.floor(Math.random() * 50000) + 30000,
    wages: Math.floor(Math.random() * 10000000) + 5000000,
    works: Math.floor(Math.random() * 100) + 50,
  }));
};

const generateWorkCategories = () => {
  const categories = [
    { name: 'सड़क निर्माण', hindi: 'सड़क निर्माण', color: '#3b82f6' },
    { name: 'जल संरक्षण', hindi: 'जल संरक्षण', color: '#10b981' },
    { name: 'कृषि कार्य', hindi: 'कृषि कार्य', color: '#f59e0b' },
    { name: 'भवन निर्माण', hindi: 'भवन निर्माण', color: '#ef4444' },
    { name: 'अन्य कार्य', hindi: 'अन्य कार्य', color: '#8b5cf6' },
  ];
  
  return categories.map(category => ({
    ...category,
    value: Math.floor(Math.random() * 30) + 10,
    count: Math.floor(Math.random() * 100) + 20,
  }));
};

const generatePaymentStatus = () => {
  const paid = 70 + Math.random() * 25;
  const pending = 100 - paid;
  
  return [
    { name: 'भुगतान हो गया', value: Math.round(paid), color: '#10b981' },
    { name: 'भुगतान बाकी', value: Math.round(pending), color: '#f59e0b' },
  ];
};

// Main service functions with API integration

// Location detection service
export const detectUserLocation = async () => {
  try {
    // Try to use real API first
    const isBackendAvailable = await apiService.isBackendAvailable();
    
    if (isBackendAvailable) {
      console.log('🌐 Using real API for location detection');
      return await apiService.detectUserLocation();
    } else {
      console.log('📱 Backend unavailable, using fallback location detection');
      return await fallbackLocationDetection();
    }
  } catch (error) {
    console.error('Location detection failed:', error);
    throw error;
  }
};

// Fallback location detection with improved accuracy
const fallbackLocationDetection = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    console.log('🌍 Starting GPS location detection...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`📍 GPS coordinates obtained: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`);
        
        // Validate coordinates
        if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
          console.error('❌ Invalid GPS coordinates received');
          reject(new Error('Invalid GPS coordinates received'));
          return;
        }
        
        // Check if coordinates are within India (approximate bounds)
        if (latitude < 6 || latitude > 37 || longitude < 68 || longitude > 97) {
          console.warn('⚠️ Coordinates appear to be outside India, using fallback');
        }
        
        const nearestDistrict = findNearestFallbackDistrict(latitude, longitude);
        const districtData = generateFallbackData(nearestDistrict);
        
        // Add location metadata
        districtData.locationMetadata = {
          userCoordinates: { lat: latitude, lng: longitude },
          accuracy: accuracy,
          detectionMethod: 'GPS',
          distanceToDistrict: calculateDistance(latitude, longitude, nearestDistrict.lat, nearestDistrict.lng)
        };
        
        console.log(`🎯 Location detection complete: ${nearestDistrict.name}, ${nearestDistrict.state}`);
        resolve(districtData);
      },
      (error) => {
        console.error('❌ GPS location detection failed:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Location detection failed';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please check your GPS settings.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = `Location error: ${error.message}`;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout for better accuracy
        maximumAge: 300000 // 5 minutes cache
      }
    );
  });
};

// Calculate distance between two GPS coordinates using Haversine formula
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Find the nearest district based on actual GPS coordinates
const findNearestFallbackDistrict = (userLat, userLng) => {
  console.log(`🎯 Finding nearest district for coordinates: ${userLat}, ${userLng}`);
  
  let nearestDistrict = fallbackDistricts[0];
  let minDistance = Infinity;
  
  fallbackDistricts.forEach(district => {
    if (district.lat && district.lng) {
      const distance = calculateDistance(userLat, userLng, district.lat, district.lng);
      console.log(`📍 Distance to ${district.name}: ${distance.toFixed(2)} km`);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestDistrict = district;
      }
    }
  });
  
  console.log(`✅ Nearest district found: ${nearestDistrict.name} (${minDistance.toFixed(2)} km away)`);
  return nearestDistrict;
};

// Get district data by ID
export const getDistrictData = async (districtId) => {
  try {
    // Try to use real API first
    const isBackendAvailable = await apiService.isBackendAvailable();
    
    if (isBackendAvailable) {
      console.log(`🌐 Fetching real data for district ${districtId}`);
      const response = await apiService.getDistrictData(districtId);
      return response.data;
    } else {
      console.log(`📱 Backend unavailable, using fallback data for district ${districtId}`);
      const district = fallbackDistricts.find(d => d.id === districtId);
      if (!district) {
        return null;
      }
      return generateFallbackData(district);
    }
  } catch (error) {
    console.error(`Failed to get district data for ${districtId}:`, error);
    
    // Fallback to mock data
    const district = fallbackDistricts.find(d => d.id === districtId);
    if (district) {
      return generateFallbackData(district);
    }
    return null;
  }
};

// Search districts by name
export const searchDistricts = async (query) => {
  try {
    // Try to use real API first
    const isBackendAvailable = await apiService.isBackendAvailable();
    
    if (isBackendAvailable) {
      console.log(`🌐 Searching districts with real API: "${query}"`);
      const response = await apiService.searchDistricts(query);
      return response.data;
    } else {
      console.log(`📱 Backend unavailable, using fallback search for: "${query}"`);
      return fallbackSearchDistricts(query);
    }
  } catch (error) {
    console.error('Failed to search districts:', error);
    return fallbackSearchDistricts(query);
  }
};

const fallbackSearchDistricts = (query) => {
  if (!query || query.length < 2) {
    return fallbackDistricts.slice(0, 10);
  }
  
  const lowerQuery = query.toLowerCase();
  return fallbackDistricts.filter(district => 
    district.name.toLowerCase().includes(lowerQuery) ||
    district.hindi.includes(query) ||
    district.state.toLowerCase().includes(lowerQuery)
  ).slice(0, 10);
};

// Get all states
export const getAllStates = async () => {
  try {
    // Try to use real API first
    const isBackendAvailable = await apiService.isBackendAvailable();
    
    if (isBackendAvailable) {
      console.log('🌐 Fetching states from real API');
      const response = await apiService.getStates();
      return response.data;
    } else {
      console.log('📱 Backend unavailable, using fallback states');
      const states = [...new Set(fallbackDistricts.map(d => d.state))];
      return states.sort();
    }
  } catch (error) {
    console.error('Failed to get states:', error);
    const states = [...new Set(fallbackDistricts.map(d => d.state))];
    return states.sort();
  }
};

// Get districts by state
export const getDistrictsByState = async (stateName) => {
  try {
    // Try to use real API first
    const isBackendAvailable = await apiService.isBackendAvailable();
    
    if (isBackendAvailable) {
      console.log(`🌐 Fetching districts for state ${stateName} from real API`);
      const response = await apiService.getDistrictsByState(stateName);
      return response.data;
    } else {
      console.log(`📱 Backend unavailable, using fallback districts for state ${stateName}`);
      return fallbackDistricts.filter(d => d.state === stateName);
    }
  } catch (error) {
    console.error(`Failed to get districts for state ${stateName}:`, error);
    return fallbackDistricts.filter(d => d.state === stateName);
  }
};

// Refresh data from backend
export const refreshData = async () => {
  try {
    const isBackendAvailable = await apiService.isBackendAvailable();
    
    if (isBackendAvailable) {
      console.log('🔄 Refreshing data from backend');
      const response = await apiService.refreshData();
      return response;
    } else {
      throw new Error('Backend is not available');
    }
  } catch (error) {
    console.error('Failed to refresh data:', error);
    throw error;
  }
};

// Check backend status
export const checkBackendStatus = async () => {
  try {
    const health = await apiService.checkHealth();
    return {
      available: health.status === 'healthy',
      lastUpdated: health.lastDataUpdate,
      totalDistricts: health.totalDistricts,
      status: health.status
    };
  } catch (error) {
    return {
      available: false,
      error: error.message,
      status: 'unavailable'
    };
  }
};

// Export the list for backward compatibility
export const indianDistricts = fallbackDistricts;
