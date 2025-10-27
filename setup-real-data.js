#!/usr/bin/env node

/**
 * MGNREGA Dashboard - Real Data Setup Script
 * 
 * This script helps users configure their API key for real government data integration.
 * Run with: node setup-real-data.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🏛️  MGNREGA Dashboard - Real Data Setup');
console.log('=====================================\n');

console.log('This script will help you configure real government data integration.\n');

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

const updateEnvFile = (filePath, key, value) => {
  try {
    let envContent = '';
    
    if (fs.existsSync(filePath)) {
      envContent = fs.readFileSync(filePath, 'utf8');
    }
    
    // Check if key already exists
    const keyRegex = new RegExp(`^${key}=.*$`, 'm');
    const newLine = `${key}=${value}`;
    
    if (keyRegex.test(envContent)) {
      // Update existing key
      envContent = envContent.replace(keyRegex, newLine);
    } else {
      // Add new key
      envContent += envContent.endsWith('\n') ? '' : '\n';
      envContent += newLine + '\n';
    }
    
    fs.writeFileSync(filePath, envContent);
    return true;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
};

const main = async () => {
  try {
    console.log('📋 Current Configuration Status:');
    
    // Check backend .env
    const backendEnvPath = path.join(__dirname, 'backend', '.env');
    const backendEnvExists = fs.existsSync(backendEnvPath);
    console.log(`   Backend .env file: ${backendEnvExists ? '✅ Found' : '❌ Missing'}`);
    
    // Check frontend .env
    const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
    const frontendEnvExists = fs.existsSync(frontendEnvPath);
    console.log(`   Frontend .env file: ${frontendEnvExists ? '✅ Found' : '❌ Missing'}`);
    
    console.log('\\n📝 Configuration Options:');
    console.log('   1. Configure API key for real government data');
    console.log('   2. Enable/disable real data integration');
    console.log('   3. View current configuration');
    console.log('   4. Reset to default configuration');
    
    const choice = await askQuestion('\\nSelect an option (1-4): ');
    
    switch (choice) {
      case '1':
        await configureApiKey();
        break;
      case '2':
        await toggleRealData();
        break;
      case '3':
        await viewConfiguration();
        break;
      case '4':
        await resetConfiguration();
        break;
      default:
        console.log('❌ Invalid option selected.');
        break;
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
};

const configureApiKey = async () => {
  console.log('\\n🔑 API Key Configuration');
  console.log('========================\\n');
  
  console.log('You can get MGNREGA API keys from:');
  console.log('   • data.gov.in - Official Government Data Portal');
  console.log('   • API Setu (apisetu.gov.in) - Government API Gateway');
  console.log('   • Direct MGNREGA portal APIs\\n');
  
  const apiKey = await askQuestion('Enter your MGNREGA API key: ');
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.log('❌ Invalid API key provided.');
    return;
  }
  
  // Update backend .env
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  const backendSuccess = updateEnvFile(backendEnvPath, 'MGNREGA_API_KEY', apiKey);
  
  if (backendSuccess) {
    console.log('✅ Backend API key configured successfully!');
    
    // Also enable real data
    updateEnvFile(backendEnvPath, 'USE_REAL_DATA', 'true');
    console.log('✅ Real data integration enabled!');
    
    console.log('\\n🚀 Next Steps:');
    console.log('   1. Restart the backend server: cd backend && npm start');
    console.log('   2. The dashboard will now use real government data!');
    console.log('   3. Check the health endpoint: http://localhost:5000/api/health');
  }
};

const toggleRealData = async () => {
  console.log('\\n🔄 Toggle Real Data Integration');
  console.log('===============================\\n');
  
  const enable = await askQuestion('Enable real data integration? (y/n): ');
  const useRealData = enable.toLowerCase() === 'y' || enable.toLowerCase() === 'yes';
  
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  const success = updateEnvFile(backendEnvPath, 'USE_REAL_DATA', useRealData.toString());
  
  if (success) {
    console.log(`✅ Real data integration ${useRealData ? 'enabled' : 'disabled'}!`);
    
    if (useRealData) {
      console.log('\\n⚠️  Make sure you have configured your API key first!');
      console.log('   Run: node setup-real-data.js and select option 1');
    }
  }
};

const viewConfiguration = async () => {
  console.log('\\n📊 Current Configuration');
  console.log('========================\\n');
  
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  
  if (fs.existsSync(backendEnvPath)) {
    const envContent = fs.readFileSync(backendEnvPath, 'utf8');
    
    const useRealData = envContent.match(/USE_REAL_DATA=(.+)/)?.[1] || 'false';
    const apiKey = envContent.match(/MGNREGA_API_KEY=(.+)/)?.[1] || 'not_configured';
    
    console.log(`Real Data Integration: ${useRealData === 'true' ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`API Key Status: ${apiKey !== 'your_api_key_here' && apiKey !== 'not_configured' ? '✅ Configured' : '❌ Not Configured'}`);
    
    if (apiKey !== 'your_api_key_here' && apiKey !== 'not_configured') {
      console.log(`API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
    }
  } else {
    console.log('❌ Backend .env file not found!');
    console.log('   Run: cp backend/.env.example backend/.env');
  }
};

const resetConfiguration = async () => {
  console.log('\\n🔄 Reset Configuration');
  console.log('======================\\n');
  
  const confirm = await askQuestion('This will reset all configuration to defaults. Continue? (y/n): ');
  
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('❌ Reset cancelled.');
    return;
  }
  
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  const backendExamplePath = path.join(__dirname, 'backend', '.env.example');
  
  try {
    if (fs.existsSync(backendExamplePath)) {
      fs.copyFileSync(backendExamplePath, backendEnvPath);
      console.log('✅ Backend configuration reset to defaults!');
    }
    
    const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
    const frontendExamplePath = path.join(__dirname, 'frontend', '.env.example');
    
    if (fs.existsSync(frontendExamplePath)) {
      fs.copyFileSync(frontendExamplePath, frontendEnvPath);
      console.log('✅ Frontend configuration reset to defaults!');
    }
    
    console.log('\\n🚀 Configuration reset complete!');
    console.log('   You can now reconfigure using this setup script.');
    
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
  }
};

// Run the setup
main();

