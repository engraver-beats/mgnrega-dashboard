#!/usr/bin/env node

/**
 * Setup API Key for MGNREGA Dashboard
 * This script helps you configure your government API key
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setupApiKey() {
  console.log('🔧 MGNREGA Dashboard API Key Setup');
  console.log('='.repeat(40));
  
  const envPath = path.join(__dirname, 'backend', '.env');
  
  console.log(`📁 Environment file: ${envPath}`);
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found in backend directory!');
    console.log('Creating .env file...');
    
    const defaultEnv = `# MGNREGA Dashboard Backend Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Real Data Integration
USE_REAL_DATA=true
MGNREGA_API_KEY=your_api_key_here

# Cache and Rate Limiting
CACHE_TTL=3600
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info`;
    
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ Created .env file with default configuration');
  }
  
  // Read current .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const currentApiKey = envContent.match(/MGNREGA_API_KEY=(.+)/)?.[1] || 'not_found';
  
  console.log('\n📋 Current Configuration:');
  console.log(`   API Key: ${currentApiKey === 'your_api_key_here' ? '❌ Not configured (placeholder)' : currentApiKey.length > 10 ? '✅ Configured' : '❌ Invalid'}`);
  console.log(`   USE_REAL_DATA: ${envContent.includes('USE_REAL_DATA=true') ? '✅ Enabled' : '❌ Disabled'}`);
  
  if (currentApiKey === 'your_api_key_here' || currentApiKey === 'not_found') {
    console.log('\n🔑 You need to configure your API key!');
    console.log('\n📝 Steps to get your API key:');
    console.log('1. Go to https://data.gov.in');
    console.log('2. Register/Login to your account');
    console.log('3. Generate an API key');
    console.log('4. Make sure it has access to MGNREGA datasets');
    
    const apiKey = await askQuestion('\n🔑 Enter your API key from data.gov.in: ');
    
    if (apiKey && apiKey.length > 10) {
      // Update .env file
      const updatedEnv = envContent.replace(
        /MGNREGA_API_KEY=.+/,
        `MGNREGA_API_KEY=${apiKey}`
      );
      
      fs.writeFileSync(envPath, updatedEnv);
      console.log('✅ API key configured successfully!');
      
      // Test the API key
      console.log('\n🧪 Testing your API key...');
      await testApiKey(apiKey);
      
    } else {
      console.log('❌ Invalid API key. Please try again.');
    }
  } else {
    console.log('\n✅ API key is already configured!');
    console.log('\n🧪 Testing your current API key...');
    await testApiKey(currentApiKey);
  }
  
  rl.close();
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function testApiKey(apiKey) {
  try {
    const axios = require('axios');
    const url = 'https://api.data.gov.in/resource/district-wise-mgnrega-data-glance';
    
    const response = await axios.get(url, {
      params: {
        'api-key': apiKey,
        'format': 'json',
        'limit': 1
      },
      timeout: 10000
    });
    
    console.log(`✅ API Test Success! Status: ${response.status}`);
    console.log(`📊 Records available: ${response.data?.records?.length || 0}`);
    console.log('\n🎉 Your dashboard is ready to use real government data!');
    console.log('\nNext steps:');
    console.log('1. cd backend && npm start');
    console.log('2. Search for any MP district (like "Bhopal")');
    console.log('3. See real government MGNREGA data! 🏛️');
    
  } catch (error) {
    console.log('❌ API Test Failed!');
    console.log(`Error: ${error.message}`);
    
    if (error.response?.status === 403) {
      console.log('\n💡 This looks like an API key issue:');
      console.log('1. Make sure your API key is valid');
      console.log('2. Check if your API key has access to MGNREGA datasets');
      console.log('3. Visit https://data.gov.in to verify your API key');
    }
  }
}

// Run the setup
setupApiKey().catch(console.error);

