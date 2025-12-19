# 🔧 TaskApp Troubleshooting Guide

## Common Database Issues

### ❌ Error: "column 'category_id' does not exist"

**Problem**: The tasks table is missing some columns.

**Solution**:
1. Go to your Supabase SQL Editor
2. Run the contents of `database/fix-missing-columns.sql`
3. This will add any missing columns to your tasks table

### ❌ Error: "relation 'tasks' does not exist"

**Problem**: The database schema hasn't been applied.

**Solution**:
1. Go to your Supabase SQL Editor
2. Run the contents of `database/clean-schema.sql`
3. This will create all necessary tables

### ❌ Error: "No tasks found" or empty task browser

**Problem**: No demo tasks have been created.

**Solution**:
1. Create a demo employer account first
2. Go to your Supabase SQL Editor
3. Run the contents of `database/simple-demo-setup.sql`
4. This will create 3 demo tasks automatically

## Quick Database Health Check

Run this in your Supabase SQL Editor to check your database status:

```sql
-- Copy and paste the contents of database/check-database-status.sql
```

## Demo Account Issues

### ❌ Can't register demo accounts

**Problem**: Email might already be in use or validation errors.

**Solutions**:
1. Try different email addresses (add numbers: demo.worker1@taskapp.com)
2. Make sure password meets requirements (Demo123!)
3. Check browser console for specific error messages

### ❌ Demo accounts created but can't login

**Problem**: Authentication issues.

**Solutions**:
1. Check Supabase Auth settings:
   - Go to Authentication > Settings
   - Ensure "Enable email confirmations" is OFF for testing
   - Set Site URL to `http://localhost:3001`
2. Clear browser cache and cookies
3. Try incognito/private browsing mode

## App Issues

### ❌ Yellow "Database Setup Required" banner won't go away

**Problem**: App can't connect to database tables.

**Solutions**:
1. Refresh the page (Ctrl+F5 or Cmd+Shift+R)
2. Check that tables exist in Supabase Table Editor
3. Run `database/fix-missing-columns.sql` if needed

### ❌ Mobile navigation not showing

**Problem**: Screen size or CSS issues.

**Solutions**:
1. The mobile nav only shows on screens smaller than 768px (md breakpoint)
2. Try resizing your browser window or use mobile device
3. Check browser developer tools for any CSS errors

### ❌ File uploads not working

**Problem**: Storage buckets not configured.

**Solutions**:
1. Go to Supabase Storage
2. Create these buckets:
   - `task-files` (public)
   - `user-avatars` (public)
   - `documents` (private)
3. Or run the storage setup commands from the schema

## Development Server Issues

### ❌ Server won't start or crashes

**Solutions**:
1. Check if port 3001 is already in use
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check for any syntax errors in recent changes

### ❌ "Module not found" errors

**Solutions**:
1. Make sure all dependencies are installed: `npm install`
2. Check import paths are correct
3. Restart the development server

## Getting Help

### 📊 Check Database Status
Run `database/check-database-status.sql` in Supabase SQL Editor

### 🔍 Check Browser Console
1. Open browser developer tools (F12)
2. Look for red error messages in Console tab
3. Check Network tab for failed API requests

### 📱 Test Mobile Features
1. Use browser developer tools device emulation
2. Or test on actual mobile device using your computer's IP address

### 🎭 Verify Demo Setup
1. Check that demo accounts can be created
2. Verify demo tasks appear in task browser
3. Test the complete workflow: create task → apply → submit → review

## Quick Fixes

### Reset Everything
If nothing works, start fresh:

1. **Database**: Run `database/clean-schema.sql`
2. **Demo Data**: Run `database/simple-demo-setup.sql`
3. **Accounts**: Register demo accounts manually
4. **Server**: Restart with `npm start`

### Minimal Test
Test with just the basics:

1. Visit `http://localhost:3001`
2. Register one account manually
3. Check if dashboard loads
4. Create one simple task
5. Browse tasks page

This will help identify if the issue is with demo setup or core functionality.

---

**Still having issues?** Check the browser console for specific error messages and verify your Supabase project is active and accessible.