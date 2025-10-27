// District Service for MGNREGA Dashboard
// Updated to use real backend API with fallback to mock data

import apiService from './apiService';

// Fallback mock data (used when backend is unavailable)
const fallbackDistricts = [
  // Uttar Pradesh
  { id: 'UP001', name: 'Agra', state: 'Uttar Pradesh', hindi: 'आगरा' },
  { id: 'UP002', name: 'Lucknow', state: 'Uttar Pradesh', hindi: 'लखनऊ' },
  { id: 'UP003', name: 'Kanpur', state: 'Uttar Pradesh', hindi: 'कानपुर' },
  { id: 'UP004', name: 'Varanasi', state: 'Uttar Pradesh', hindi: 'वाराणसी' },
  { id: 'UP005', name: 'Allahabad', state: 'Uttar Pradesh', hindi: 'इलाहाबाद' },
  
  // Maharashtra
  { id: 'MH001', name: 'Mumbai', state: 'Maharashtra', hindi: 'मुंबई' },
  { id: 'MH002', name: 'Pune', state: 'Maharashtra', hindi: 'पुणे' },
  { id: 'MH003', name: 'Nagpur', state: 'Maharashtra', hindi: 'नागपुर' },
  { id: 'MH004', name: 'Nashik', state: 'Maharashtra', hindi: 'नाशिक' },
  { id: 'MH005', name: 'Aurangabad', state: 'Maharashtra', hindi: 'औरंगाबाद' },
  
  // Bihar
  { id: 'BR001', name: 'Patna', state: 'Bihar', hindi: 'पटना' },
  { id: 'BR002', name: 'Gaya', state: 'Bihar', hindi: 'गया' },
  { id: 'BR003', name: 'Muzaffarpur', state: 'Bihar', hindi: 'मुजफ्फरपुर' },
  { id: 'BR004', name: 'Darbhanga', state: 'Bihar', hindi: 'दरभंगा' },
  { id: 'BR005', name: 'Bhagalpur', state: 'Bihar', hindi: 'भागलपुर' },
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

// Fallback location detection
const fallbackLocationDetection = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearestDistrict = findNearestFallbackDistrict(latitude, longitude);
        const districtData = generateFallbackData(nearestDistrict);
        resolve(districtData);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  });
};

const findNearestFallbackDistrict = (lat, lng) => {
  if (lat > 26 && lat < 31 && lng > 77 && lng < 85) {
    return fallbackDistricts.find(d => d.state === 'Uttar Pradesh') || fallbackDistricts[0];
  } else if (lat > 18 && lat < 22 && lng > 72 && lng < 77) {
    return fallbackDistricts.find(d => d.state === 'Maharashtra') || fallbackDistricts[5];
  } else {
    return fallbackDistricts[0];
  }
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

