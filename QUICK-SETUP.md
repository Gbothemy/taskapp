# 🚀 Quick Database Setup Guide

The 400 errors you're seeing indicate that the database tables haven't been created yet. Here's how to fix this:

## Step 1: Set Up Database Schema

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `xwvpkvzotdaugkywdnme`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Database Schema**
   - Copy the entire contents of `database/clean-schema.sql` (recommended) or `database/complete-schema.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

## Step 2: Set Up Storage Buckets

1. **Go to Storage**
   - Click on "Storage" in the left sidebar
   - Click "Create a new bucket"

2. **Create these buckets:**
   ```
   Bucket Name: task-files
   Public: Yes
   
   Bucket Name: user-avatars  
   Public: Yes
   
   Bucket Name: documents
   Public: No
   ```

## Step 3: Enable Authentication

1. **Go to Authentication**
   - Click on "Authentication" in the left sidebar
   - Click on "Settings"

2. **Configure Auth Settings**
   - Enable "Enable email confirmations": OFF (for testing)
   - Enable "Enable phone confirmations": OFF
   - Site URL: `http://localhost:3000`

## Step 4: Test the Connection

After completing the above steps, refresh your React app and try:

1. **Register a new account**
   - Go to `/register`
   - Create a worker or employer account
   - You should be able to register successfully

2. **Login**
   - Use the account you just created
   - You should be able to access the dashboard

## Step 5: Create Sample Data (Optional)

To populate your database with sample data:

1. **Create Categories** (Run in SQL Editor):
```sql
INSERT INTO categories (name, description, color, icon, sort_order, active) VALUES
  ('Writing & Content', 'Content creation, copywriting, blogging', 'blue', 'pencil', 1, true),
  ('Design & Creative', 'Graphic design, UI/UX, illustrations', 'purple', 'paint-brush', 2, true),
  ('Programming & Tech', 'Web development, mobile apps, software', 'green', 'code', 3, true),
  ('Data & Analytics', 'Data entry, analysis, research', 'yellow', 'chart-bar', 4, true),
  ('Marketing & Sales', 'Digital marketing, SEO, social media', 'red', 'megaphone', 5, true);
```

## 🔧 Troubleshooting

**If you still get 400 errors:**

1. **Check RLS Policies**
   - Make sure Row Level Security policies are set up correctly
   - The schema should have created these automatically

2. **Verify Table Creation**
   - In Supabase dashboard, go to "Table Editor"
   - You should see tables like: users, tasks, categories, etc.

3. **Check API Keys**
   - Verify your `REACT_APP_SUPABASE_ANON_KEY` is correct
   - It should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

## ✅ Success Indicators

Once everything is set up correctly, you should be able to:

- ✅ Register new users without errors
- ✅ Login and see the dashboard
- ✅ Create tasks (as employer)
- ✅ Browse tasks (as worker)
- ✅ Upload files
- ✅ Receive notifications

## 🆘 Need Help?

If you encounter issues:

1. Check the browser console for specific error messages
2. Check the Supabase dashboard logs
3. Verify all environment variables are correct
4. Make sure the database schema was applied successfully

Your TaskApp will be fully functional once the database is properly set up!