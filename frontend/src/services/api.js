// API service for backend communication
const API_BASE_URL = '/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }

  // Get all districts
  async getDistricts(limit = null) {
    const params = limit ? `?limit=${limit}` : '';
    return this.request(`/districts${params}`);
  }

  // Get specific district data
  async getDistrict(districtId) {
    return this.request(`/districts/${districtId}`);
  }

  // Get all states
  async getStates() {
    return this.request('/states');
  }

  // Refresh data
  async refreshData() {
    return this.request('/refresh-data', { method: 'POST' });
  }
}

export default new ApiService();

