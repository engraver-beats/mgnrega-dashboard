// Quick test to verify the API setup
const MPDataService = require('./mpDataService');
require('dotenv').config();

async function testAPI() {
  console.log('🧪 Testing MGNREGA API setup...');
  
  const mpService = new MPDataService();
  await mpService.initialize();
  
  try {
    console.log('\n📍 Testing district data fetch for Bhopal...');
    const data = await mpService.getDistrictData('17_1728');
    
    console.log('\n✅ Success! Data received:');
    console.log(`- District: ${data.name}`);
    console.log(`- Job Cards: ${data.totalJobCards}`);
    console.log(`- Person Days: ${data.totalPersonDays}`);
    console.log(`- Wages Paid: ${data.totalWagesPaid}`);
    console.log(`- Data Source: ${data.dataSource}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testAPI();
