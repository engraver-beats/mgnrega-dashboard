// District Service for MGNREGA Dashboard
// Updated to use real backend API with fallback to mock data

import apiService from './apiService';

// All Madhya Pradesh districts with real MGNREGA codes and accurate coordinates
// This ensures location detection only finds MP districts and uses backend-compatible IDs
const fallbackDistricts = [
  { id: '17_1701', name: 'Sheopur', state: 'Madhya Pradesh', hindi: 'श्योपुर', lat: 25.6697, lng: 76.6947 },
  { id: '17_1702', name: 'Morena', state: 'Madhya Pradesh', hindi: 'मुरैना', lat: 26.5015, lng: 78.0014 },
  { id: '17_1703', name: 'Bhind', state: 'Madhya Pradesh', hindi: 'भिंड', lat: 26.5653, lng: 78.7875 },
  { id: '17_1704', name: 'Gwalior', state: 'Madhya Pradesh', hindi: 'ग्वालियर', lat: 26.2183, lng: 78.1828 },
  { id: '17_1705', name: 'Datia', state: 'Madhya Pradesh', hindi: 'दतिया', lat: 25.6669, lng: 78.4574 },
  { id: '17_1706', name: 'Shivpuri', state: 'Madhya Pradesh', hindi: 'शिवपुरी', lat: 25.4231, lng: 77.6581 },
  { id: '17_1707', name: 'Tikamgarh', state: 'Madhya Pradesh', hindi: 'टीकमगढ़', lat: 24.7433, lng: 78.8353 },
  { id: '17_1708', name: 'Chhatarpur', state: 'Madhya Pradesh', hindi: 'छतरपुर', lat: 24.9177, lng: 79.5941 },
  { id: '17_1709', name: 'Panna', state: 'Madhya Pradesh', hindi: 'पन्ना', lat: 24.7213, lng: 80.1919 },
  { id: '17_1710', name: 'Sagar', state: 'Madhya Pradesh', hindi: 'सागर', lat: 23.8388, lng: 78.7378 },
  { id: '17_1711', name: 'Damoh', state: 'Madhya Pradesh', hindi: 'दमोह', lat: 23.8315, lng: 79.4422 },
  { id: '17_1712', name: 'Satna', state: 'Madhya Pradesh', hindi: 'सतना', lat: 24.5707, lng: 80.8320 },
  { id: '17_1713', name: 'Rewa', state: 'Madhya Pradesh', hindi: 'रीवा', lat: 24.5364, lng: 81.2961 },
  { id: '17_1714', name: 'Umaria', state: 'Madhya Pradesh', hindi: 'उमरिया', lat: 23.5236, lng: 80.8372 },
  { id: '17_1715', name: 'Neemuch', state: 'Madhya Pradesh', hindi: 'नीमच', lat: 24.4739, lng: 74.8706 },
  { id: '17_1716', name: 'Mandsaur', state: 'Madhya Pradesh', hindi: 'मंदसौर', lat: 24.0767, lng: 75.0700 },
  { id: '17_1717', name: 'Ratlam', state: 'Madhya Pradesh', hindi: 'रतलाम', lat: 23.3315, lng: 75.0367 },
  { id: '17_1718', name: 'Ujjain', state: 'Madhya Pradesh', hindi: 'उज्जैन', lat: 23.1765, lng: 75.7885 },
  { id: '17_1719', name: 'Shajapur', state: 'Madhya Pradesh', hindi: 'शाजापुर', lat: 23.4267, lng: 76.2738 },
  { id: '17_1720', name: 'Dewas', state: 'Madhya Pradesh', hindi: 'देवास', lat: 22.9676, lng: 76.0534 },
  { id: '17_1721', name: 'Jhabua', state: 'Madhya Pradesh', hindi: 'झाबुआ', lat: 22.7676, lng: 74.5953 },
  { id: '17_1722', name: 'Dhar', state: 'Madhya Pradesh', hindi: 'धार', lat: 22.5979, lng: 75.2979 },
  { id: '17_1723', name: 'Indore', state: 'Madhya Pradesh', hindi: 'इंदौर', lat: 22.7196, lng: 75.8577 },
  { id: '17_1724', name: 'West Nimar (Khargone)', state: 'Madhya Pradesh', hindi: 'पश्चिम निमाड़ (खरगोन)', lat: 21.8236, lng: 75.6147 },
  { id: '17_1725', name: 'Barwani', state: 'Madhya Pradesh', hindi: 'बड़वानी', lat: 22.0322, lng: 74.9006 },
  { id: '17_1726', name: 'Rajgarh', state: 'Madhya Pradesh', hindi: 'राजगढ़', lat: 24.0073, lng: 76.8441 },
  { id: '17_1727', name: 'Vidisha', state: 'Madhya Pradesh', hindi: 'विदिशा', lat: 23.5251, lng: 77.8081 },
  { id: '17_1728', name: 'Bhopal', state: 'Madhya Pradesh', hindi: 'भोपाल', lat: 23.2599, lng: 77.4126 },
  { id: '17_1729', name: 'Sehore', state: 'Madhya Pradesh', hindi: 'सीहोर', lat: 23.2021, lng: 77.0854 },
  { id: '17_1730', name: 'Raisen', state: 'Madhya Pradesh', hindi: 'रायसेन', lat: 23.3315, lng: 77.7824 },
  { id: '17_1731', name: 'Betul', state: 'Madhya Pradesh', hindi: 'बैतूल', lat: 21.9057, lng: 77.8986 },
  { id: '17_1732', name: 'Harda', state: 'Madhya Pradesh', hindi: 'हरदा', lat: 22.3442, lng: 77.0953 },
  { id: '17_1733', name: 'Hoshangabad', state: 'Madhya Pradesh', hindi: 'होशंगाबाद', lat: 22.7440, lng: 77.7282 },
  { id: '17_1734', name: 'Katni', state: 'Madhya Pradesh', hindi: 'कटनी', lat: 23.8346, lng: 80.3942 },
  { id: '17_1735', name: 'Jabalpur', state: 'Madhya Pradesh', hindi: 'जबलपुर', lat: 23.1815, lng: 79.9864 },
  { id: '17_1736', name: 'Narsinghpur', state: 'Madhya Pradesh', hindi: 'नरसिंहपुर', lat: 22.9676, lng: 79.1947 },
  { id: '17_1737', name: 'Dindori', state: 'Madhya Pradesh', hindi: 'डिंडोरी', lat: 22.9441, lng: 81.0784 },
  { id: '17_1738', name: 'Mandla', state: 'Madhya Pradesh', hindi: 'मंडला', lat: 22.5979, lng: 80.3714 },
  { id: '17_1739', name: 'Chhindwara', state: 'Madhya Pradesh', hindi: 'छिंदवाड़ा', lat: 22.0567, lng: 78.9378 },
  { id: '17_1740', name: 'Seoni', state: 'Madhya Pradesh', hindi: 'सिवनी', lat: 22.0862, lng: 79.5431 },
  { id: '17_1741', name: 'Balaghat', state: 'Madhya Pradesh', hindi: 'बालाघाट', lat: 21.8047, lng: 80.1847 },
  { id: '17_1742', name: 'Guna', state: 'Madhya Pradesh', hindi: 'गुना', lat: 24.6473, lng: 77.3072 },
  { id: '17_1743', name: 'Ashoknagar', state: 'Madhya Pradesh', hindi: 'अशोकनगर', lat: 24.5726, lng: 77.7299 },
  { id: '17_1744', name: 'Sheopur', state: 'Madhya Pradesh', hindi: 'श्योपुर', lat: 25.6697, lng: 76.6947 },
  { id: '17_1745', name: 'East Nimar (Khandwa)', state: 'Madhya Pradesh', hindi: 'पूर्व निमाड़ (खंडवा)', lat: 21.8362, lng: 76.3500 },
  { id: '17_1746', name: 'Burhanpur', state: 'Madhya Pradesh', hindi: 'बुरहानपुर', lat: 21.3009, lng: 76.2291 },
  { id: '17_1747', name: 'Alirajpur', state: 'Madhya Pradesh', hindi: 'अलीराजपुर', lat: 22.3021, lng: 74.3644 },
  { id: '17_1748', name: 'Anuppur', state: 'Madhya Pradesh', hindi: 'अनूपपुर', lat: 23.1041, lng: 81.6905 },
  { id: '17_1749', name: 'Singrauli', state: 'Madhya Pradesh', hindi: 'सिंगरौली', lat: 24.1997, lng: 82.6739 },
  { id: '17_1750', name: 'Sidhi', state: 'Madhya Pradesh', hindi: 'सीधी', lat: 24.4186, lng: 81.8797 },
  { id: '17_1751', name: 'Shahdol', state: 'Madhya Pradesh', hindi: 'शहडोल', lat: 23.2967, lng: 81.3615 },
  { id: '17_1752', name: 'Agar Malwa', state: 'Madhya Pradesh', hindi: 'आगर मालवा', lat: 23.7117, lng: 76.0153 },
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
        
        // Check if coordinates are within Madhya Pradesh (approximate bounds)
        // MP bounds: Lat 21.0-26.9, Lng 74.0-82.7
        const isWithinMP = latitude >= 21.0 && latitude <= 26.9 && longitude >= 74.0 && longitude <= 82.7;
        
        if (!isWithinMP) {
          console.warn(`⚠️ Coordinates (${latitude}, ${longitude}) appear to be outside Madhya Pradesh`);
          console.log('🏛️ Using nearest MP district for MGNREGA data');
        } else {
          console.log('✅ Coordinates are within Madhya Pradesh bounds');
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
export const getDistrictData = async (districtId, year = null) => {
  try {
    // Try to use real API first
    const isBackendAvailable = await apiService.isBackendAvailable();
    
    if (isBackendAvailable) {
      console.log(`🌐 Fetching real data for district ${districtId}${year ? `, year: ${year}` : ''}`);
      const response = await apiService.getDistrictData(districtId, year);
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
    console.error(`Failed to get district data for ${districtId}${year ? ` (year: ${year})` : ''}:`, error);
    
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
  console.log(`🔍 Searching districts for query: "${query}"`);
  
  if (!query || query.length < 2) {
    const results = fallbackDistricts.slice(0, 10);
    console.log(`📋 Returning ${results.length} default districts`);
    return results;
  }
  
  const lowerQuery = query.toLowerCase();
  const results = fallbackDistricts.filter(district => 
    district.name.toLowerCase().includes(lowerQuery) ||
    district.hindi.includes(query) ||
    district.state.toLowerCase().includes(lowerQuery)
  ).slice(0, 10);
  
  console.log(`🎯 Found ${results.length} districts matching "${query}":`, results.map(d => d.name));
  return results;
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

// Get available financial years
export const getAvailableFinancialYears = async () => {
  try {
    // Try to use real API first
    const isBackendAvailable = await apiService.isBackendAvailable();
    
    if (isBackendAvailable) {
      console.log('🌐 Fetching available financial years from API');
      const response = await apiService.getFinancialYears();
      return {
        years: response.data,
        currentYear: response.currentFinancialYear,
        dataSource: response.dataSource
      };
    } else {
      console.log('📱 Backend unavailable, using fallback years');
      return {
        years: ['2024', '2023', '2022', '2021', '2020'],
        currentYear: '2024',
        dataSource: 'Offline Mode'
      };
    }
  } catch (error) {
    console.error('Failed to get financial years:', error);
    return {
      years: ['2024', '2023', '2022', '2021', '2020'],
      currentYear: '2024',
      dataSource: 'Fallback'
    };
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
      status: health.status,
      availableFinancialYears: health.availableFinancialYears,
      currentFinancialYear: health.currentFinancialYear
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
