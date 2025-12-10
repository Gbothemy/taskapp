#!/bin/bash

# Build script for Vercel deployment
echo "Starting TaskApp build process..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install

# Build the React app
echo "Building React application..."
npm run build

echo "Build completed successfully!"