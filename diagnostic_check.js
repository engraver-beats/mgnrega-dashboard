#!/usr/bin/env node

console.log('🔍 MGNREGA Dashboard Diagnostic Check\n');

const fs = require('fs');
const path = require('path');

// Check 1: Verify we're in the right directory
console.log('📁 Current Directory:', process.cwd());
console.log('📁 Directory Contents:', fs.readdirSync('.').filter(f => !f.startsWith('.')).join(', '));

// Check 2: Verify backend server.js
console.log('\n🔧 Backend Server Check:');
const serverPath = './backend/server.js';
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  const lines = serverContent.split('\n');
  
  console.log('✅ server.js exists');
  console.log(`📝 Line 10: ${lines[9] || 'NOT FOUND'}`);
  console.log(`📝 Line 20: ${lines[19] || 'NOT FOUND'}`);
  
  // Check for problematic imports
  if (serverContent.includes('MGNREGADataProcessor') && !serverContent.includes('// Removed old MGNREGADataProcessor')) {
    console.log('❌ PROBLEM: server.js still references MGNREGADataProcessor');
    const problemLines = lines.map((line, i) => line.includes('MGNREGADataProcessor') ? `Line ${i+1}: ${line}` : null).filter(Boolean);
    problemLines.forEach(line => console.log('   ', line));
  } else {
    console.log('✅ server.js correctly uses MPDataService');
  }
} else {
  console.log('❌ backend/server.js NOT FOUND');
}

// Check 3: Verify frontend districtService.js
console.log('\n🌐 Frontend District Service Check:');
const districtServicePath = './frontend/src/services/districtService.js';
if (fs.existsSync(districtServicePath)) {
  const districtContent = fs.readFileSync(districtServicePath, 'utf8');
  console.log('✅ districtService.js exists');
  
  // Check for MP districts
  const bhopalMatch = districtContent.match(/17_1728.*Bhopal/);
  const indoreMatch = districtContent.match(/17_1723.*Indore/);
  
  if (bhopalMatch && indoreMatch) {
    console.log('✅ District service has correct MP districts with 17_XXXX format');
    console.log(`   Bhopal: ${bhopalMatch[0]}`);
    console.log(`   Indore: ${indoreMatch[0]}`);
  } else {
    console.log('❌ PROBLEM: District service missing correct MP districts');
    console.log('   Looking for: 17_1728 Bhopal and 17_1723 Indore');
  }
  
  // Count total districts
  const districtMatches = districtContent.match(/id: '17_\d{4}'/g);
  if (districtMatches) {
    console.log(`📊 Total MP districts found: ${districtMatches.length}`);
    if (districtMatches.length < 50) {
      console.log('⚠️  WARNING: Expected ~52 MP districts, found fewer');
    }
  }
} else {
  console.log('❌ frontend/src/services/districtService.js NOT FOUND');
}

// Check 4: Git status
console.log('\n📋 Git Status Check:');
const { execSync } = require('child_process');
try {
  const gitBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  console.log(`🌿 Current branch: ${gitBranch}`);
  
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  if (gitStatus) {
    console.log('📝 Uncommitted changes:');
    gitStatus.split('\n').forEach(line => console.log(`   ${line}`));
  } else {
    console.log('✅ Working directory clean');
  }
} catch (error) {
  console.log('❌ Git command failed:', error.message);
}

// Check 5: Node modules
console.log('\n📦 Dependencies Check:');
const backendNodeModules = fs.existsSync('./backend/node_modules');
const frontendNodeModules = fs.existsSync('./frontend/node_modules');
console.log(`Backend node_modules: ${backendNodeModules ? '✅' : '❌'}`);
console.log(`Frontend node_modules: ${frontendNodeModules ? '✅' : '❌'}`);

console.log('\n🎯 Diagnostic Complete!');
console.log('\nIf you see any ❌ or ⚠️ above, those are the issues to fix first.');

