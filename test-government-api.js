#!/usr/bin/env node

/**
 * Test Government API Integration
 * This script tests if your API key works with the real government data API
 */

const axios = require('axios');
const path = require('path');

// Load .env from backend directory
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function testGovernmentAPI() {
  console.log('🧪 Testing Government MGNREGA API Integration');
  console.log('='.repeat(50));
  
  const apiKey = process.env.MGNREGA_API_KEY;
  const useRealData = process.env.USE_REAL_DATA === 'true';
  
  console.log('📋 Configuration Check:');
  console.log(`   USE_REAL_DATA: ${useRealData ? '✅ true' : '❌ false'}`);
  console.log(`   API Key: ${apiKey && apiKey !== 'your_api_key_here' ? '✅ Configured' : '❌ Not configured'}`);
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.log('\n❌ API Key not configured!');
    console.log('Please add your API key to .env file:');
    console.log('MGNREGA_API_KEY=your_actual_api_key_from_data_gov_in');
    return;
  }
  
  if (!useRealData) {
    console.log('\n⚠️ Real data is disabled!');
    console.log('Set USE_REAL_DATA=true in your .env file to enable government API');
  }
  
  console.log('\n🌐 Testing API Connection...');
  
  try {
    const url = 'https://api.data.gov.in/resource/district-wise-mgnrega-data-glance';
    
    console.log(`📡 Making request to: ${url}`);
    
    const response = await axios.get(url, {
      params: {
        'api-key': apiKey,
        'format': 'json',
        'limit': 5
      },
      timeout: 15000
    });
    
    console.log(`✅ API Response: Status ${response.status}`);
    console.log(`📊 Records returned: ${response.data?.records?.length || 0}`);
    
    if (response.data?.records?.length > 0) {
      console.log('\n📋 Sample Data:');
      const sample = response.data.records[0];
      console.log(`   District: ${sample.district_name || sample.district || 'N/A'}`);
      console.log(`   State: ${sample.state_name || sample.state || 'N/A'}`);
      console.log(`   Job Cards: ${sample.total_job_cards || sample.job_cards_issued || 'N/A'}`);
      console.log(`   Person Days: ${sample.total_person_days || sample.person_days_generated || 'N/A'}`);
    }
    
    console.log('\n🎯 Testing MP-specific data...');
    
    const mpResponse = await axios.get(url, {
      params: {
        'api-key': apiKey,
        'format': 'json',
        'filters[state_name]': 'Madhya Pradesh',
        'limit': 5
      },
      timeout: 15000
    });
    
    console.log(`✅ MP Data: ${mpResponse.data?.records?.length || 0} districts found`);
    
    if (mpResponse.data?.records?.length > 0) {
      console.log('\n📋 MP Districts Sample:');
      mpResponse.data.records.slice(0, 3).forEach((district, index) => {
        console.log(`   ${index + 1}. ${district.district_name || district.district || 'Unknown'}`);
      });
    }
    
    console.log('\n🎉 SUCCESS! Government API is working correctly!');
    console.log('Your dashboard should now show real government data when you search for districts.');
    
  } catch (error) {
    console.log('\n❌ API Test Failed!');
    console.log(`Error: ${error.message}`);
    
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
      
      if (error.response.status === 403) {
        console.log('\n💡 This looks like an API key issue:');
        console.log('1. Make sure your API key is valid');
        console.log('2. Check if your API key has access to MGNREGA datasets');
        console.log('3. Visit https://data.gov.in to verify your API key');
      }
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Verify your API key at https://data.gov.in');
    console.log('2. Make sure the API key has access to MGNREGA datasets');
    console.log('3. Check your internet connection');
    console.log('4. Try regenerating your API key if needed');
  }
}

// Run the test
testGovernmentAPI().catch(console.error);
