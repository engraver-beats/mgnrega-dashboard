// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// // Create axios instance with default config
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // Add auth token if available
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     console.error('API Error:', error);
    
//     if (error.response) {
//       // Server responded with error status
//       const message = error.response.data?.message || 'Server error occurred';
//       return Promise.reject(new Error(message));
//     } else if (error.request) {
//       // Request made but no response received
//       return Promise.reject(new Error('Network error - please check your connection'));
//     } else {
//       // Something else happened
//       return Promise.reject(new Error('An unexpected error occurred'));
//     }
//   }
// );

// // API methods
// export const apiService = {
//   // Health check
//   health: () => api.get('/health'),

//   // Districts
//   getDistricts: (stateCode = '09') => api.get(`/districts?state=${stateCode}`),
//   getDistrictByCode: (districtCode) => api.get(`/districts/${districtCode}`),
//   findDistrictByLocation: (latitude, longitude) => 
//     api.post('/districts/find-by-location', { latitude, longitude }),

//   // Performance
//   getCurrentPerformance: (districtCode) => api.get(`/performance/current/${districtCode}`),
//   getHistoricalPerformance: (districtCode, months = 6) => 
//     api.get(`/performance/history/${districtCode}?months=${months}`),
//   comparePerformance: (districtCode) => api.get(`/performance/compare/${districtCode}`),
// };

// // Utility functions
// export const handleApiError = (error, fallbackMessage = 'Something went wrong') => {
//   console.error('API Error:', error);
//   return error.message || fallbackMessage;
// };

// export const isOnline = () => {
//   return navigator.onLine;
// };

// // Cache management
// export const cache = {
//   set: (key, data, ttl = 300000) => { // 5 minutes default
//     const item = {
//       data,
//       timestamp: Date.now(),
//       ttl
//     };
//     localStorage.setItem(`cache_${key}`, JSON.stringify(item));
//   },

//   get: (key) => {
//     try {
//       const item = JSON.parse(localStorage.getItem(`cache_${key}`));
//       if (!item) return null;

//       const now = Date.now();
//       if (now - item.timestamp > item.ttl) {
//         localStorage.removeItem(`cache_${key}`);
//         return null;
//       }

//       return item.data;
//     } catch (error) {
//       console.error('Cache error:', error);
//       return null;
//     }
//   },

//   clear: (key) => {
//     if (key) {
//       localStorage.removeItem(`cache_${key}`);
//     } else {
//       // Clear all cache
//       Object.keys(localStorage)
//         .filter(key => key.startsWith('cache_'))
//         .forEach(key => localStorage.removeItem(key));
//     }
//   }
// };

// export default api;


import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Rewrite API methods to match backend output
export const apiService = {
  health: () => api.get('/health'),

  // ✅ Correct endpoint (backend ignores ?state=)
  getDistricts: () => api.get('/districts'),

  // ✅ Works with backend /districts/:id
  getDistrictByCode: (districtId) => api.get(`/districts/${districtId}`),
};

export default api;
