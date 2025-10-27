#!/usr/bin/env node

/**
 * MGNREGA Dashboard - Data Source Debug Script
 * This script helps diagnose why the dashboard shows offline data
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🔍 MGNREGA Dashboard - Data Source Debugging');
console.log('='.repeat(50));

async function debugDataSources() {
  console.log('\n1️⃣ Checking Backend Server Status...');
  
  try {
    // Check if backend is running
    const healthResponse = await axios.get('http://localhost:5000/api/health', {
      timeout: 5000
    });
    
    console.log('✅ Backend server is running!');
    console.log('📊 Health Status:', healthResponse.data.status);
    console.log('🏛️ Data Quality:', healthResponse.data.dataQuality);
    console.log('📍 Focus State:', healthResponse.data.focusState);
    
    if (healthResponse.data.mpDataService) {
      const mpStatus = healthResponse.data.mpDataService;
      console.log('\n🔧 MP Data Service Status:');
      console.log('   Real Data Enabled:', mpStatus.useRealData ? '✅' : '❌');
      console.log('   API Key Configured:', mpStatus.apiKeyConfigured ? '✅' : '❌');
      console.log('   Total Districts:', mpStatus.totalDistricts);
      console.log('   Data Source:', mpStatus.dataSource);
    }
    
  } catch (error) {
    console.log('❌ Backend server is not responding!');
    console.log('   Error:', error.message);
    console.log('\n🚨 SOLUTION: Start the backend server:');
    console.log('   cd backend && npm start');
    return false;
  }
  
  console.log('\n2️⃣ Checking Environment Configuration...');
  
  // Check backend .env file
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  if (fs.existsSync(backendEnvPath)) {
    console.log('✅ Backend .env file exists');
    
    const envContent = fs.readFileSync(backendEnvPath, 'utf8');
    const hasRealData = envContent.includes('USE_REAL_DATA=true');
    const hasApiKey = envContent.includes('MGNREGA_API_KEY=') && !envContent.includes('your_api_key_here');
    
    console.log('   USE_REAL_DATA=true:', hasRealData ? '✅' : '❌');
    console.log('   API Key configured:', hasApiKey ? '✅' : '❌');
    
    if (!hasRealData) {
      console.log('\n🚨 SOLUTION: Enable real data in backend/.env:');
      console.log('   USE_REAL_DATA=true');
    }
    
    if (!hasApiKey) {
      console.log('\n🚨 SOLUTION: Add API key in backend/.env:');
      console.log('   MGNREGA_API_KEY=your_actual_api_key_here');
    }
    
  } else {
    console.log('❌ Backend .env file not found!');
    console.log('\n🚨 SOLUTION: Create backend/.env file:');
    console.log('   cp backend/.env.example backend/.env');
  }
  
  console.log('\n3️⃣ Testing District Data API...');
  
  try {
    const districtsResponse = await axios.get('http://localhost:5000/api/districts?limit=5', {
      timeout: 10000
    });
    
    console.log('✅ Districts API is working!');
    console.log('📊 Total Districts:', districtsResponse.data.total);
    console.log('🏛️ Data Source:', districtsResponse.data.dataSource);
    
    if (districtsResponse.data.data && districtsResponse.data.data.length > 0) {
      const firstDistrict = districtsResponse.data.data[0];
      console.log('📍 Sample District:', firstDistrict.name, '(' + firstDistrict.hindi + ')');
      console.log('🔗 District Data Source:', firstDistrict.dataSource);
    }
    
  } catch (error) {
    console.log('❌ Districts API failed!');
    console.log('   Error:', error.message);
  }
  
  console.log('\n4️⃣ Testing Specific District Data...');
  
  try {
    // Test with a known MP district ID
    const districtResponse = await axios.get('http://localhost:5000/api/districts/17_1728', {
      timeout: 15000
    });
    
    console.log('✅ District data API is working!');
    console.log('📊 District:', districtResponse.data.data.name);
    console.log('🏛️ Data Source:', districtResponse.data.data.dataSource);
    console.log('💼 Total Job Cards:', districtResponse.data.data.totalJobCards);
    console.log('💰 Average Wage Rate:', districtResponse.data.data.averageWageRate);
    
  } catch (error) {
    console.log('❌ District data API failed!');
    console.log('   Error:', error.message);
  }
  
  console.log('\n5️⃣ Frontend Connection Test...');
  
  // Check if frontend can reach backend
  try {
    const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
    if (fs.existsSync(frontendEnvPath)) {
      const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
      console.log('✅ Frontend .env file exists');
      
      if (frontendEnv.includes('VITE_API_URL=http://localhost:5000/api')) {
        console.log('✅ Frontend API URL is correctly configured');
      } else {
        console.log('❌ Frontend API URL might be incorrect');
        console.log('\n🚨 SOLUTION: Check frontend/.env:');
        console.log('   VITE_API_URL=http://localhost:5000/api');
      }
    } else {
      console.log('❌ Frontend .env file not found!');
      console.log('\n🚨 SOLUTION: Create frontend/.env file:');
      console.log('   cp frontend/.env.example frontend/.env');
    }
  } catch (error) {
    console.log('❌ Could not check frontend configuration');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 DEBUGGING SUMMARY');
  console.log('='.repeat(50));
  
  console.log('\n📋 Common Solutions:');
  console.log('1. Make sure backend is running: cd backend && npm start');
  console.log('2. Make sure frontend is running: cd frontend && npm run dev');
  console.log('3. Check backend/.env has USE_REAL_DATA=true');
  console.log('4. Add your API key to backend/.env');
  console.log('5. Restart both servers after changing .env files');
  
  console.log('\n🔍 If still showing offline:');
  console.log('1. Open browser dev tools (F12)');
  console.log('2. Check Network tab for failed API calls');
  console.log('3. Check Console tab for JavaScript errors');
  console.log('4. Verify the dashboard is loading from http://localhost:5173');
  
  return true;
}

// Run the debug script
debugDataSources().catch(error => {
  console.error('\n💥 Debug script failed:', error.message);
  process.exit(1);
});
