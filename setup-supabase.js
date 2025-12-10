#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 TaskApp Supabase Setup');
console.log('========================\n');

console.log('Your Supabase URL is already configured: https://xwvpkvzotdaugkywdnme.supabase.co\n');

console.log('To complete the setup, you need to add your Supabase keys to the .env file.');
console.log('You can find these keys in your Supabase project dashboard under Settings > API.\n');

rl.question('Enter your Supabase ANON key: ', (anonKey) => {
  rl.question('Enter your Supabase SERVICE ROLE key: ', (serviceKey) => {
    
    // Update .env file
    const envPath = path.join(__dirname, 'server', '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent = envContent.replace(
      'SUPABASE_ANON_KEY=your_supabase_anon_key_here',
      `SUPABASE_ANON_KEY=${anonKey}`
    );
    
    envContent = envContent.replace(
      'SUPABASE_SERVICE_KEY=your_supabase_service_key_here',
      `SUPABASE_SERVICE_KEY=${serviceKey}`
    );
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Environment variables updated successfully!');
    console.log('\nNext steps:');
    console.log('1. Run the SQL schema in your Supabase project:');
    console.log('   - Copy the contents of database/supabase-schema.sql');
    console.log('   - Paste it in your Supabase SQL Editor');
    console.log('   - Execute the script');
    console.log('\n2. Start the TaskApp:');
    console.log('   npm run dev');
    console.log('\n3. Login with demo accounts:');
    console.log('   Worker: worker@taskapp.com / worker123');
    console.log('   Employer: employer@taskapp.com / employer123');
    console.log('   Admin: admin@taskapp.com / admin123');
    
    rl.close();
  });
});

rl.on('close', () => {
  process.exit(0);
});