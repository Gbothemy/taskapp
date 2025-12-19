# 🔧 SQL Demo Setup Troubleshooting

## Current Issue: ON CONFLICT Error

**Error Message**: `there is no unique or exclusion constraint matching the ON CONFLICT specification`

**What it means**: The table doesn't have the expected unique constraints for the ON CONFLICT clause to work.

## ✅ Quick Solutions

### Option 1: Use Minimal Setup (RECOMMENDED)
This avoids all complex operations:

1. Go to Supabase SQL Editor
2. Copy and paste contents of `database/minimal-demo-setup.sql`
3. Click "Run"

This creates basic demo users and tasks without any complex constraints.

### Option 2: Use Simple Setup
If you want more detailed demo data:

1. Go to Supabase SQL Editor
2. Copy and paste contents of `database/simple-demo-users.sql`
3. Click "Run"

This includes conditional updates that work with any table structure.

### Option 3: Manual User Creation
Create users one by one to avoid conflicts:

```sql
-- Create worker
INSERT INTO users (email, full_name, user_type, status) 
VALUES ('demo.worker@taskapp.com', 'Alex Johnson', 'worker', 'active');

-- Create employer
INSERT INTO users (email, full_name, user_type, status) 
VALUES ('demo.employer@taskapp.com', 'Sarah Chen', 'employer', 'active');

-- Create admin
INSERT INTO users (email, full_name, user_type, status) 
VALUES ('demo.admin@taskapp.com', 'Admin User', 'admin', 'active');
```

## 🔍 Check Your Database Structure

Run this to see what columns exist in your users table:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

## 🎯 After SQL Setup

Remember that SQL only creates database records. For full authentication:

1. **Visit your app**: `http://localhost:3001`
2. **Register each account** through the normal registration process:
   - `demo.worker@taskapp.com` / `Demo123!`
   - `demo.employer@taskapp.com` / `Demo123!`
   - `demo.admin@taskapp.com` / `Demo123!`

## 🚨 Common SQL Errors & Fixes

### Error: "relation 'users' does not exist"
**Fix**: Run the complete database schema first:
```sql
-- Copy contents of database/clean-schema.sql
```

### Error: "column 'company' does not exist"
**Fix**: The simple setup scripts handle this automatically by checking if columns exist.

### Error: "duplicate key value violates unique constraint"
**Fix**: Users already exist. Either:
- Skip the error (it's harmless)
- Delete existing demo users first:
```sql
DELETE FROM users WHERE email LIKE 'demo.%@taskapp.com';
```

### Error: "permission denied"
**Fix**: Make sure you're the project owner in Supabase.

## ✅ Success Indicators

After running the SQL, you should see:
- ✅ "Demo users created" with 3 users listed
- ✅ "Demo tasks created" with tasks listed
- ✅ No red error messages

## 🎭 Testing Your Demo Setup

1. **Check database**: Verify users and tasks exist in Supabase Table Editor
2. **Register accounts**: Use the app registration for authentication
3. **Login test**: Try logging in with demo credentials
4. **Browse tasks**: Check if demo tasks appear in task browser
5. **Mobile test**: Test mobile navigation and category access

## 📞 Still Having Issues?

If SQL continues to fail:

1. **Use manual registration**: Skip SQL entirely and register accounts through the app
2. **Check Supabase status**: Ensure your project is active
3. **Try minimal approach**: Use the simplest SQL script first
4. **Check browser console**: Look for specific error messages

The most important thing is getting the app working - you can always create demo accounts manually through the registration process!