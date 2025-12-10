#!/bin/bash

# TaskApp Deployment Script
set -e

echo "🚀 Starting TaskApp deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    echo -e "${RED}❌ server/.env file not found!${NC}"
    echo "Please create server/.env with your configuration"
    exit 1
fi

# Check if Supabase keys are configured
if grep -q "your_supabase_anon_key" server/.env; then
    echo -e "${RED}❌ Supabase keys not configured!${NC}"
    echo "Please run: npm run setup-supabase"
    exit 1
fi

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm run install-all

echo -e "${YELLOW}🏗️  Building client...${NC}"
cd client && npm run build && cd ..

echo -e "${YELLOW}🧪 Running tests...${NC}"
# Add test commands here when available
# npm test

echo -e "${YELLOW}🐳 Building Docker image...${NC}"
docker build -t taskapp:latest .

echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose up -d

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "🌐 TaskApp is now running at:"
echo "   HTTP:  http://localhost"
echo "   HTTPS: https://localhost"
echo "   API:   http://localhost/api"
echo ""
echo "📊 Monitor logs with:"
echo "   docker-compose logs -f taskapp"
echo ""
echo "🛑 Stop services with:"
echo "   docker-compose down"