// District Service for MGNREGA Dashboard
// Comprehensive list of Indian districts with mock MGNREGA data

export const indianDistricts = [
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
  
  // West Bengal
  { id: 'WB001', name: 'Kolkata', state: 'West Bengal', hindi: 'कोलकाता' },
  { id: 'WB002', name: 'Howrah', state: 'West Bengal', hindi: 'हावड़ा' },
  { id: 'WB003', name: 'Darjeeling', state: 'West Bengal', hindi: 'दार्जिलिंग' },
  { id: 'WB004', name: 'Malda', state: 'West Bengal', hindi: 'मालदा' },
  { id: 'WB005', name: 'Murshidabad', state: 'West Bengal', hindi: 'मुर्शिदाबाद' },
  
  // Rajasthan
  { id: 'RJ001', name: 'Jaipur', state: 'Rajasthan', hindi: 'जयपुर' },
  { id: 'RJ002', name: 'Jodhpur', state: 'Rajasthan', hindi: 'जोधपुर' },
  { id: 'RJ003', name: 'Udaipur', state: 'Rajasthan', hindi: 'उदयपुर' },
  { id: 'RJ004', name: 'Kota', state: 'Rajasthan', hindi: 'कोटा' },
  { id: 'RJ005', name: 'Bikaner', state: 'Rajasthan', hindi: 'बीकानेर' },
  
  // Madhya Pradesh
  { id: 'MP001', name: 'Bhopal', state: 'Madhya Pradesh', hindi: 'भोपाल' },
  { id: 'MP002', name: 'Indore', state: 'Madhya Pradesh', hindi: 'इंदौर' },
  { id: 'MP003', name: 'Gwalior', state: 'Madhya Pradesh', hindi: 'ग्वालियर' },
  { id: 'MP004', name: 'Jabalpur', state: 'Madhya Pradesh', hindi: 'जबलपुर' },
  { id: 'MP005', name: 'Ujjain', state: 'Madhya Pradesh', hindi: 'उज्जैन' },
];

// Generate realistic MGNREGA performance data
const generateDistrictData = (district) => {
  const baseJobCards = Math.floor(Math.random() * 50000) + 20000;
  const activePercentage = 0.6 + Math.random() * 0.3; // 60-90% active
  const womenParticipation = 45 + Math.random() * 15; // 45-60%
  const averageWage = 200 + Math.floor(Math.random() * 50); // ₹200-250
  
  return {
    ...district,
    currentMonth: 'October 2024',
    totalJobCards: baseJobCards,
    activeJobCards: Math.floor(baseJobCards * activePercentage),
    totalPersonDays: Math.floor(baseJobCards * activePercentage * 15), // 15 days avg
    womenPersonDays: Math.floor(baseJobCards * activePercentage * 15 * (womenParticipation / 100)),
    averageWageRate: averageWage,
    totalWagesPaid: Math.floor(baseJobCards * activePercentage * 15 * averageWage),
    worksCompleted: Math.floor(Math.random() * 500) + 200,
    worksOngoing: Math.floor(Math.random() * 150) + 50,
    womenParticipation: Math.round(womenParticipation),
    employmentProvided: Math.floor(baseJobCards * activePercentage * 15),
    
    // Monthly trend data for charts
    monthlyData: generateMonthlyTrend(),
    workCategories: generateWorkCategories(),
    paymentStatus: generatePaymentStatus(),
  };
};

// Generate 12 months of trend data
const generateMonthlyTrend = () => {
  const months = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];
  
  return months.map((month, index) => ({
    month,
    employment: Math.floor(Math.random() * 50000) + 30000,
    wages: Math.floor(Math.random() * 10000000) + 5000000,
    works: Math.floor(Math.random() * 100) + 50,
  }));
};

// Generate work category breakdown
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
    value: Math.floor(Math.random() * 30) + 10, // 10-40%
    count: Math.floor(Math.random() * 100) + 20,
  }));
};

// Generate payment status data
const generatePaymentStatus = () => {
  const total = 100;
  const paid = 70 + Math.random() * 25; // 70-95% paid
  const pending = total - paid;
  
  return [
    { name: 'भुगतान हो गया', value: Math.round(paid), color: '#10b981' },
    { name: 'भुगतान बाकी', value: Math.round(pending), color: '#f59e0b' },
  ];
};

// Location detection service
export const detectUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Simple location to district mapping (in real app, use reverse geocoding API)
        const nearestDistrict = findNearestDistrict(latitude, longitude);
        resolve(nearestDistrict);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    );
  });
};

// Simple nearest district finder (in real app, use proper geocoding)
const findNearestDistrict = (lat, lng) => {
  // For demo, return a random district based on rough location
  if (lat > 26 && lat < 31 && lng > 77 && lng < 85) {
    // Roughly UP region
    return indianDistricts.find(d => d.state === 'Uttar Pradesh') || indianDistricts[0];
  } else if (lat > 18 && lat < 22 && lng > 72 && lng < 77) {
    // Roughly Maharashtra region
    return indianDistricts.find(d => d.state === 'Maharashtra') || indianDistricts[5];
  } else {
    // Default to first district
    return indianDistricts[0];
  }
};

// Get district data by ID
export const getDistrictData = (districtId) => {
  const district = indianDistricts.find(d => d.id === districtId);
  if (!district) {
    return null;
  }
  return generateDistrictData(district);
};

// Search districts by name
export const searchDistricts = (query) => {
  if (!query || query.length < 2) {
    return indianDistricts.slice(0, 10); // Return first 10 districts
  }
  
  const lowerQuery = query.toLowerCase();
  return indianDistricts.filter(district => 
    district.name.toLowerCase().includes(lowerQuery) ||
    district.hindi.includes(query) ||
    district.state.toLowerCase().includes(lowerQuery)
  ).slice(0, 10);
};

// Get all states
export const getAllStates = () => {
  const states = [...new Set(indianDistricts.map(d => d.state))];
  return states.sort();
};

// Get districts by state
export const getDistrictsByState = (stateName) => {
  return indianDistricts.filter(d => d.state === stateName);
};

