const axios = require('axios');
const NodeCache = require('node-cache');

// Cache for 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600 });

class APIService {
  constructor() {
    this.baseURL = 'https://api.data.gov.in/resource';
    this.apiKey = process.env.DATA_GOV_API_KEY || 'your-api-key';
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
<<<<<<< HEAD
=======
    
    // MGNREGA API Resource IDs from data.gov.in
    this.resourceIds = {
      performance: '9ef84268-d588-465a-a308-a864a43d0070', // MGNREGA Performance Data
      jobCards: 'a8b2c3d4-e5f6-7890-abcd-ef1234567890',   // Job Cards Data (example)
      wages: 'b9c3d4e5-f6g7-8901-bcde-f23456789012',      // Wages Data (example)
      works: 'c0d4e5f6-g7h8-9012-cdef-345678901234'       // Works Data (example)
    };
>>>>>>> origin/main
  }

  async fetchWithRetry(url, options = {}, attempt = 1) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error(`API call failed (attempt ${attempt}):`, error.message);
      
      if (attempt < this.retryAttempts) {
        await this.delay(this.retryDelay * attempt);
        return this.fetchWithRetry(url, options, attempt + 1);
      }
      
      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getMGNREGAData(districtCode, month, year) {
    const cacheKey = `mgnrega_${districtCode}_${month}_${year}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached data for:', cacheKey);
      return cachedData;
    }

    try {
<<<<<<< HEAD
      // Mock API endpoint - replace with actual data.gov.in endpoint
      const url = `${this.baseURL}/mgnrega-performance`;
      const params = {
        'api-key': this.apiKey,
        'format': 'json',
        'district_code': districtCode,
        'month': month,
        'year': year,
        'limit': 1000
      };

      const data = await this.fetchWithRetry(url, { params });
      
      // Cache the successful response
      cache.set(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('Failed to fetch MGNREGA data:', error);
=======
      // Actual MGNREGA API endpoints from data.gov.in
      const url = `${this.baseURL}/${this.resourceIds.performance}`;
      const params = {
        'api-key': this.apiKey,
        'format': 'json',
        'filters[district_code]': districtCode,
        'filters[month]': month,
        'filters[year]': year,
        'limit': 1000
      };

      console.log(`🔍 Fetching MGNREGA data from data.gov.in for district: ${districtCode}`);
      const data = await this.fetchWithRetry(url, { params });
      
      // Process and normalize the API response
      const processedData = this.processAPIResponse(data);
      
      // Cache the successful response
      cache.set(cacheKey, processedData);
      console.log(`✅ Successfully cached MGNREGA data for: ${cacheKey}`);
      
      return processedData;
    } catch (error) {
      console.error('❌ Failed to fetch MGNREGA data from data.gov.in:', error.message);
      console.log('🔄 Falling back to mock data for development...');
>>>>>>> origin/main
      
      // Return mock data if API fails (for development)
      return this.getMockData(districtCode, month, year);
    }
  }

<<<<<<< HEAD
=======
  // Process and normalize data.gov.in API response
  processAPIResponse(apiData) {
    try {
      // data.gov.in returns data in 'records' array
      const records = apiData.records || [];
      
      if (records.length === 0) {
        console.log('⚠️ No records found in API response, using mock data');
        return null;
      }

      // Aggregate the data from multiple records
      const aggregated = records.reduce((acc, record) => {
        acc.totalJobCards += parseInt(record.total_job_cards || 0);
        acc.activeJobCards += parseInt(record.active_job_cards || 0);
        acc.totalHouseholds += parseInt(record.total_households || 0);
        acc.householdsWorked += parseInt(record.households_worked || 0);
        acc.personDaysGenerated += parseInt(record.person_days_generated || 0);
        acc.womenParticipation += parseInt(record.women_participation || 0);
        acc.totalWagesPaid += parseFloat(record.total_wages_paid || 0);
        acc.averageWageRate += parseFloat(record.average_wage_rate || 0);
        acc.worksCompleted += parseInt(record.works_completed || 0);
        acc.worksOngoing += parseInt(record.works_ongoing || 0);
        return acc;
      }, {
        totalJobCards: 0,
        activeJobCards: 0,
        totalHouseholds: 0,
        householdsWorked: 0,
        personDaysGenerated: 0,
        womenParticipation: 0,
        totalWagesPaid: 0,
        averageWageRate: 0,
        worksCompleted: 0,
        worksOngoing: 0
      });

      // Calculate averages and percentages
      const recordCount = records.length;
      aggregated.averageWageRate = aggregated.averageWageRate / recordCount;
      aggregated.womenParticipationPercent = aggregated.totalHouseholds > 0 
        ? (aggregated.womenParticipation / aggregated.totalHouseholds) * 100 
        : 0;

      console.log(`📊 Processed ${recordCount} records from data.gov.in API`);
      return aggregated;
      
    } catch (error) {
      console.error('❌ Error processing API response:', error.message);
      return null;
    }
  }

>>>>>>> origin/main
  // Mock data for development and API failures
  getMockData(districtCode, month, year) {
    const baseData = {
      totalJobCards: Math.floor(Math.random() * 50000) + 10000,
      activeJobCards: Math.floor(Math.random() * 30000) + 5000,
      totalHouseholds: Math.floor(Math.random() * 40000) + 8000,
      householdsWorked: Math.floor(Math.random() * 25000) + 4000,
      totalPersonDays: Math.floor(Math.random() * 500000) + 100000,
      womenPersonDays: Math.floor(Math.random() * 250000) + 50000,
      averageWageRate: Math.floor(Math.random() * 50) + 200,
      totalWagesPaid: Math.floor(Math.random() * 10000000) + 2000000,
      worksCompleted: Math.floor(Math.random() * 500) + 100,
      worksOngoing: Math.floor(Math.random() * 200) + 50
    };

    // Calculate derived metrics
    baseData.employmentProvided = baseData.totalPersonDays;
    baseData.averageDaysPerHousehold = Math.round(baseData.totalPersonDays / baseData.householdsWorked);
    baseData.womenParticipation = Math.round((baseData.womenPersonDays / baseData.totalPersonDays) * 100);

    return {
      records: [{
        ...baseData,
        district_code: districtCode,
        month: month,
        year: year,
        last_updated: new Date().toISOString()
      }]
    };
  }

  async getDistrictList(stateCode = '09') { // UP state code
    const cacheKey = `districts_${stateCode}`;
    
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // Mock district data for UP
      const districts = this.getUPDistricts();
      cache.set(cacheKey, districts, 86400); // Cache for 24 hours
      return districts;
    } catch (error) {
      console.error('Failed to fetch districts:', error);
      return this.getUPDistricts();
    }
  }

  getUPDistricts() {
    return [
      { code: '0901', name: 'Agra', lat: 27.1767, lng: 78.0081 },
      { code: '0902', name: 'Aligarh', lat: 27.8974, lng: 78.0880 },
      { code: '0903', name: 'Allahabad', lat: 25.4358, lng: 81.8463 },
      { code: '0904', name: 'Ambedkar Nagar', lat: 26.4059, lng: 83.1947 },
      { code: '0905', name: 'Amethi', lat: 26.1594, lng: 81.8129 },
      { code: '0906', name: 'Amroha', lat: 28.9034, lng: 78.4677 },
      { code: '0907', name: 'Auraiya', lat: 26.4648, lng: 79.5041 },
      { code: '0908', name: 'Azamgarh', lat: 26.0685, lng: 83.1836 },
      { code: '0909', name: 'Baghpat', lat: 28.9477, lng: 77.2056 },
      { code: '0910', name: 'Bahraich', lat: 27.5742, lng: 81.5947 },
      { code: '0911', name: 'Ballia', lat: 25.7781, lng: 84.1497 },
      { code: '0912', name: 'Balrampur', lat: 27.4308, lng: 82.1811 },
      { code: '0913', name: 'Banda', lat: 25.4761, lng: 80.3364 },
      { code: '0914', name: 'Barabanki', lat: 26.9247, lng: 81.2084 },
      { code: '0915', name: 'Bareilly', lat: 28.3670, lng: 79.4304 },
      { code: '0916', name: 'Basti', lat: 26.7928, lng: 82.7364 },
      { code: '0917', name: 'Bhadohi', lat: 25.3950, lng: 82.5685 },
      { code: '0918', name: 'Bijnor', lat: 29.3729, lng: 78.1367 },
      { code: '0919', name: 'Budaun', lat: 28.0407, lng: 79.1218 },
      { code: '0920', name: 'Bulandshahr', lat: 28.4089, lng: 77.8498 }
    ];
  }
}

module.exports = new APIService();
<<<<<<< HEAD

=======
>>>>>>> origin/main
