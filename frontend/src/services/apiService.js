// API Service for MGNREGA Dashboard
// Handles all communication with the backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Generic API request handler
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Special handling for health endpoint
      if (endpoint === '/health') {
        return data; // Health endpoint has different response format
      }
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Cache management
  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Health check
  async checkHealth() {
    try {
      const response = await this.request('/health');
      return response;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }

  // Get all districts with optional filtering
  async getDistricts(options = {}) {
    const { search, state, limit = 50 } = options;
    const cacheKey = `districts_${search || ''}_${state || ''}_${limit}`;
    
    // Check cache first
    const cached = this.getCached(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (state) params.append('state', state);
      if (limit) params.append('limit', limit.toString());

      const response = await this.request(`/districts?${params.toString()}`);
      
      // Cache the result
      this.setCache(cacheKey, response);
      
      return response;
    } catch (error) {
      console.error('Failed to fetch districts:', error);
      throw error;
    }
  }

  // Get specific district data
  async getDistrictData(districtId) {
    if (!districtId) {
      throw new Error('District ID is required');
    }

    const cacheKey = `district_${districtId}`;
    
    // Check cache first
    const cached = this.getCached(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.request(`/districts/${districtId}`);
      
      // Cache the result
      this.setCache(cacheKey, response);
      
      return response;
    } catch (error) {
      console.error(`Failed to fetch district data for ${districtId}:`, error);
      throw error;
    }
  }

  // Get all states
  async getStates() {
    const cacheKey = 'states';
    
    // Check cache first
    const cached = this.getCached(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.request('/states');
      
      // Cache the result
      this.setCache(cacheKey, response);
      
      return response;
    } catch (error) {
      console.error('Failed to fetch states:', error);
      throw error;
    }
  }

  // Search districts
  async searchDistricts(query) {
    if (!query || query.length < 2) {
      return await this.getDistricts({ limit: 10 });
    }

    return await this.getDistricts({ search: query, limit: 20 });
  }

  // Get districts by state
  async getDistrictsByState(stateName) {
    return await this.getDistricts({ state: stateName });
  }

  // Refresh data (force backend to update)
  async refreshData() {
    try {
      const response = await this.request('/refresh-data', {
        method: 'POST',
      });
      
      // Clear cache after refresh
      this.cache.clear();
      
      return response;
    } catch (error) {
      console.error('Failed to refresh data:', error);
      throw error;
    }
  }

  // Location-based district detection
  async detectUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // For now, use simple location mapping
            // In a real implementation, you'd use reverse geocoding
            const nearestDistrict = await this.findNearestDistrict(latitude, longitude);
            resolve(nearestDistrict);
          } catch (error) {
            reject(error);
          }
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
  }

  // Simple nearest district finder (would use proper geocoding in production)
  async findNearestDistrict(lat, lng) {
    try {
      // Get all districts
      const response = await this.getDistricts({ limit: 100 });
      const districts = response.data;

      // Simple region-based mapping
      let selectedDistrict = districts[0]; // default

      if (lat > 26 && lat < 31 && lng > 77 && lng < 85) {
        // Roughly UP region
        selectedDistrict = districts.find(d => d.state === 'Uttar Pradesh') || districts[0];
      } else if (lat > 18 && lat < 22 && lng > 72 && lng < 77) {
        // Roughly Maharashtra region
        selectedDistrict = districts.find(d => d.state === 'Maharashtra') || districts[0];
      } else if (lat > 24 && lat < 28 && lng > 84 && lng < 88) {
        // Roughly Bihar region
        selectedDistrict = districts.find(d => d.state === 'Bihar') || districts[0];
      } else if (lat > 22 && lat < 27 && lng > 87 && lng < 90) {
        // Roughly West Bengal region
        selectedDistrict = districts.find(d => d.state === 'West Bengal') || districts[0];
      }

      // Get full district data
      const districtResponse = await this.getDistrictData(selectedDistrict.id);
      return districtResponse.data;
    } catch (error) {
      console.error('Failed to find nearest district:', error);
      throw error;
    }
  }

  // Utility method to check if backend is available
  async isBackendAvailable() {
    try {
      console.log(`🔍 Checking backend health at: ${this.baseURL}/health`);
      const health = await this.checkHealth();
      console.log('🏥 Health check response:', health);
      
      const isHealthy = health.status === 'healthy';
      console.log(`🎯 Backend available: ${isHealthy}`);
      
      return isHealthy;
    } catch (error) {
      console.error('❌ Backend health check failed:', error.message);
      console.log('📱 Falling back to offline mode');
      return false;
    }
  }
}

// Create singleton instance
const apiService = new APIService();

export default apiService;

// Export individual methods for convenience
export const {
  getDistricts,
  getDistrictData,
  getStates,
  searchDistricts,
  getDistrictsByState,
  detectUserLocation,
  refreshData,
  checkHealth,
  isBackendAvailable,
} = apiService;
