# TaskApp Deployment Guide

This guide covers deploying TaskApp to production environments.

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Supabase account and database setup

### 1. Environment Setup
```bash
# Configure Supabase keys
npm run setup-supabase

# Or manually edit server/.env
SUPABASE_URL=https://xwvpkvzotdaugkywdnme.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

### 2. Database Setup
Run the SQL schema in your Supabase project:
```bash
# Copy contents of database/supabase-schema-simple.sql
# Paste in Supabase SQL Editor and execute
```

### 3. Deploy with Docker
```bash
# One-command deployment
npm run deploy

# Or step by step:
npm run install-all
npm run build
npm run docker:build
npm run docker:run
```

### 4. Access Your App
- **Frontend**: https://localhost
- **API**: https://localhost/api
- **Health Check**: https://localhost/health

## 📋 Manual Deployment

### Build for Production
```bash
# Install dependencies
npm run install-all

# Build client
cd client && npm run build

# The build folder contains the production React app
```

### Server Deployment
```bash
# Start production server
cd server && npm run prod

# Or with PM2
pm2 start index.js --name taskapp
```

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t taskapp:latest .
```

### Run with Docker Compose
```bash
docker-compose up -d
```

### Environment Variables
Create a `.env` file for Docker Compose:
```env
SUPABASE_URL=https://xwvpkvzotdaugkywdnme.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_production_jwt_secret
JWT_REFRESH_SECRET=your_production_refresh_secret
```

## ☁️ Cloud Deployment

### Vercel (Frontend + API)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Railway
1. Connect repository to Railway
2. Add environment variables
3. Deploy with one click

### DigitalOcean App Platform
1. Create new app from GitHub
2. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. Add environment variables

### AWS/GCP/Azure
Use the Docker image with container services:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances

## 🔧 Production Configuration

### Environment Variables
```env
# Required
NODE_ENV=production
DATABASE_MODE=supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_strong_jwt_secret
JWT_REFRESH_SECRET=your_strong_refresh_secret

# Optional
PORT=5000
PLATFORM_FEE_PERCENTAGE=5
MIN_WITHDRAWAL_AMOUNT=10

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@yourdomain.com

# Payments
STRIPE_SECRET_KEY=your_stripe_secret
PAYPAL_CLIENT_ID=your_paypal_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### SSL/HTTPS Setup
The included nginx configuration supports SSL:

1. **Get SSL Certificate**:
   ```bash
   # Using Let's Encrypt
   certbot --nginx -d yourdomain.com
   
   # Or place your certificates in ./ssl/
   # cert.pem and key.pem
   ```

2. **Update nginx.conf** with your domain name

### Database Backup
```bash
# Backup Supabase database
supabase db dump --file backup.sql

# Or use pg_dump
pg_dump "postgresql://..." > backup.sql
```

## 📊 Monitoring

### Health Checks
- **Endpoint**: `/api/health`
- **Docker**: Built-in health check
- **Response**: `{"status": "OK", "timestamp": "..."}`

### Logs
```bash
# Docker logs
docker-compose logs -f taskapp

# Server logs
tail -f server/logs/app.log
```

### Performance Monitoring
Consider adding:
- **APM**: New Relic, DataDog
- **Error Tracking**: Sentry
- **Uptime Monitoring**: Pingdom, UptimeRobot

## 🔒 Security Checklist

- [ ] Strong JWT secrets (32+ characters)
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers enabled
- [ ] Regular dependency updates
- [ ] Backup strategy in place

## 🚨 Troubleshooting

### Common Issues

**Build Fails**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Database Connection**:
```bash
# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" \
     "https://YOUR_PROJECT.supabase.co/rest/v1/users?select=count"
```

**Docker Issues**:
```bash
# Rebuild without cache
docker build --no-cache -t taskapp:latest .

# Check container logs
docker logs taskapp_container_name
```

### Support
- Check logs first: `docker-compose logs -f`
- Verify environment variables
- Test database connectivity
- Check Supabase dashboard for errors

## 📈 Scaling

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Multiple app instances
- Shared database (Supabase handles this)
- Redis for session storage

### Performance Optimization
- Enable gzip compression (included in nginx config)
- CDN for static assets
- Database query optimization
- Caching strategy (Redis)

### Monitoring & Alerts
- Set up monitoring for:
  - Response times
  - Error rates
  - Database performance
  - Memory/CPU usage
  - Disk space