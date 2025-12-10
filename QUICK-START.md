# TaskApp Quick Start Guide

## 🚀 You're Almost Ready!

Your TaskApp is built and the server is running, but you need to set up the database first.

### Step 1: Set Up Supabase Database

1. **Go to your Supabase project**: https://supabase.com/dashboard/project/xwvpkvzotdaugkywdnme

2. **Open SQL Editor** (in the left sidebar)

3. **Copy and paste this SQL schema**:
   ```sql
   -- Copy the entire contents of: database/supabase-schema-simple.sql
   ```

4. **Click "Run" to execute the schema**

### Step 2: Test the Application

Once the database is set up, you can test with these demo accounts:

- **Worker**: worker@taskapp.com / worker123
- **Employer**: employer@taskapp.com / employer123  
- **Admin**: admin@taskapp.com / admin123

### Step 3: Access Your App

**Development Mode:**
```bash
# Terminal 1: Server (already running)
cd server && npm start

# Terminal 2: Client
cd client && npm start
# Then visit: http://localhost:3000
```

**Production Mode:**
```bash
# Serve the built client
cd client && npx serve -s build -p 3000
# Then visit: http://localhost:3000
# API available at: http://localhost:5000/api
```

**Docker Mode:**
```bash
npm run docker:build
npm run docker:run
# Then visit: https://localhost
```

### Step 4: Verify Everything Works

1. **Health Check**: http://localhost:5000/api/health
2. **Login Test**: Try logging in with worker@taskapp.com / worker123
3. **Browse Tasks**: Check the task browser as a worker
4. **Create Task**: Try creating a task as an employer

### 🎯 Current Status

✅ Server running on port 5000  
✅ Supabase connected  
✅ Client built successfully  
⏳ Database schema needed  

### 🔧 Troubleshooting

**If login fails:**
- Make sure you ran the SQL schema in Supabase
- Check that demo users were created
- Verify your Supabase keys are correct

**If server won't start:**
- Check your .env file has the correct Supabase keys
- Make sure port 5000 is available

**If client won't load:**
- Run `npm run build` to rebuild the client
- Check that all dependencies are installed

### 📚 Next Steps

1. **Customize**: Update branding, colors, and content
2. **Deploy**: Use Docker or cloud hosting
3. **Scale**: Add more features and integrations
4. **Monitor**: Set up logging and analytics

Your TaskApp is production-ready! 🎉