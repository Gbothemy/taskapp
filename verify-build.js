#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 TaskApp Build Verification');
console.log('============================\n');

// Check if build folder exists
const buildPath = path.join(__dirname, 'client', 'build');
if (!fs.existsSync(buildPath)) {
  console.log('❌ Build folder not found. Run: npm run build');
  process.exit(1);
}

// Check essential build files
const requiredFiles = [
  'index.html',
  'static/js',
  'static/css',
  'manifest.json'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(buildPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

// Check build size
const indexPath = path.join(buildPath, 'index.html');
if (fs.existsSync(indexPath)) {
  const stats = fs.statSync(indexPath);
  console.log(`📄 index.html size: ${(stats.size / 1024).toFixed(2)} KB`);
}

// Check static assets
const staticPath = path.join(buildPath, 'static');
if (fs.existsSync(staticPath)) {
  const jsPath = path.join(staticPath, 'js');
  const cssPath = path.join(staticPath, 'css');
  
  if (fs.existsSync(jsPath)) {
    const jsFiles = fs.readdirSync(jsPath);
    console.log(`📦 JavaScript files: ${jsFiles.length}`);
  }
  
  if (fs.existsSync(cssPath)) {
    const cssFiles = fs.readdirSync(cssPath);
    console.log(`🎨 CSS files: ${cssFiles.length}`);
  }
}

console.log('\n' + '='.repeat(40));

if (allFilesExist) {
  console.log('✅ Build verification successful!');
  console.log('\n🚀 Ready for deployment:');
  console.log('   npm run docker:build');
  console.log('   npm run docker:run');
  console.log('\n🌐 Or serve locally:');
  console.log('   cd client && npx serve -s build');
} else {
  console.log('❌ Build verification failed!');
  console.log('   Run: npm run build');
  process.exit(1);
}