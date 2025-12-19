#!/usr/bin/env node

/**
 * Health Check Script
 * Verifies that all required environment variables and services are configured
 */

const requiredEnvVars = [
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_SUPABASE_ANON_KEY',
  'REACT_APP_APP_NAME',
  'REACT_APP_APP_URL'
];

const optionalEnvVars = [
  'REACT_APP_STRIPE_PUBLISHABLE_KEY',
  'REACT_APP_SUPPORT_EMAIL'
];

console.log('🏥 TaskApp Health Check\n');

// Check required environment variables
console.log('📋 Checking required environment variables...');
let missingRequired = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your-') || value.includes('placeholder')) {
    missingRequired.push(varName);
    console.log(`❌ ${varName}: Missing or placeholder value`);
  } else {
    console.log(`✅ ${varName}: Configured`);
  }
});

// Check optional environment variables
console.log('\n📋 Checking optional environment variables...');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your-') || value.includes('placeholder')) {
    console.log(`⚠️  ${varName}: Not configured (optional)`);
  } else {
    console.log(`✅ ${varName}: Configured`);
  }
});

// Check feature flags
console.log('\n🚩 Feature flags:');
const features = {
  'REACT_APP_ENABLE_PAYMENTS': process.env.REACT_APP_ENABLE_PAYMENTS === 'true',
  'REACT_APP_ENABLE_NOTIFICATIONS': process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
  'REACT_APP_ENABLE_FILE_UPLOADS': process.env.REACT_APP_ENABLE_FILE_UPLOADS === 'true'
};

Object.entries(features).forEach(([key, enabled]) => {
  console.log(`${enabled ? '✅' : '❌'} ${key}: ${enabled ? 'Enabled' : 'Disabled'}`);
});

// Summary
console.log('\n📊 Summary:');
if (missingRequired.length === 0) {
  console.log('✅ All required configuration is present');
  console.log('🚀 Ready for deployment!');
  process.exit(0);
} else {
  console.log(`❌ ${missingRequired.length} required configuration(s) missing:`);
  missingRequired.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📖 Please check your .env file and update the missing values.');
  console.log('📖 See .env.example for reference.');
  process.exit(1);
}