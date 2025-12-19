# 🎭 Demo Testing Accounts

## Quick Setup (Manual Registration)

Since you don't need the service role key, you can create demo accounts manually through the app:

### 📋 **Demo Account Credentials**

```
┌─────────────────────────────────────────────────────────┐
│                    DEMO ACCOUNTS                        │
├─────────────────────────────────────────────────────────┤
│ 👷 WORKER ACCOUNT                                       │
│ Email: demo.worker@taskapp.com                          │
│ Password: Demo123!                                      │
│ Name: Alex Johnson                                      │
│ Role: Worker/Freelancer                                 │
├─────────────────────────────────────────────────────────┤
│ 🏢 EMPLOYER ACCOUNT                                     │
│ Email: demo.employer@taskapp.com                        │
│ Password: Demo123!                                      │
│ Name: Sarah Chen                                        │
│ Role: Employer/Business Owner                           │
├─────────────────────────────────────────────────────────┤
│ 👨‍💼 ADMIN ACCOUNT                                        │
│ Email: demo.admin@taskapp.com                           │
│ Password: Demo123!                                      │
│ Name: Admin User                                        │
│ Role: Platform Administrator                            │
└─────────────────────────────────────────────────────────┘
```

## 🚀 How to Create Demo Accounts

### Option 1: Minimal SQL Setup (RECOMMENDED - No Errors)
1. Go to your Supabase SQL Editor
2. Copy and paste the contents of `database/minimal-demo-setup.sql`
3. Click "Run" - this creates basic users and tasks
4. Then register the accounts through the app for full authentication

### Option 2: Simple SQL Setup (More Features)
1. Go to your Supabase SQL Editor  
2. Copy and paste the contents of `database/simple-demo-users.sql`
3. Click "Run" - this creates detailed user profiles and tasks
4. Then register the accounts through the app for authentication

### Option 3: Skip SQL - Manual Only
If SQL gives errors, just register manually through the app (see steps below)

### Option 3: Manual Registration (Step by Step)

### Step 1: Create Worker Account
1. Go to `http://localhost:3001`
2. Click "Sign Up" or "Register"
3. Fill in the form:
   - **Email**: `demo.worker@taskapp.com`
   - **Password**: `Demo123!`
   - **Full Name**: `Alex Johnson`
   - **User Type**: Select "Worker"
   - **Bio**: `Experienced graphic designer and content writer with 5+ years in the industry.`
4. Click "Create Account"

### Step 2: Create Employer Account
1. Logout from worker account
2. Click "Sign Up" or "Register"
3. Fill in the form:
   - **Email**: `demo.employer@taskapp.com`
   - **Password**: `Demo123!`
   - **Full Name**: `Sarah Chen`
   - **User Type**: Select "Employer"
   - **Company**: `TechStart Solutions`
   - **Bio**: `Startup founder looking for talented freelancers to help grow our business.`
4. Click "Create Account"

### Step 3: Create Admin Account
1. Logout from employer account
2. Click "Sign Up" or "Register"
3. Fill in the form:
   - **Email**: `demo.admin@taskapp.com`
   - **Password**: `Demo123!`
   - **Full Name**: `Admin User`
   - **User Type**: Select "Admin" (if available)
   - **Company**: `TaskApp Inc.`
4. Click "Create Account"

## 🔧 Database Fix (If Needed)

If you encounter "column does not exist" errors when creating tasks:

1. Go to your Supabase SQL Editor
2. Run the contents of `database/fix-missing-columns.sql`
3. This will add any missing columns to your tasks table

## 🎯 Quick Demo Tasks Setup

After creating your demo employer account:

1. Go to Supabase SQL Editor
2. Run the contents of `database/simple-demo-setup.sql`
3. This will create 3 demo tasks automatically

## 🧪 Testing Scenarios

### As a Worker (demo.worker@taskapp.com)
✅ **Test These Features:**
- [ ] Browse tasks by category
- [ ] Use mobile navigation to access categories
- [ ] View task details
- [ ] Submit work for tasks
- [ ] Upload files with submissions
- [ ] Check submission status
- [ ] View earnings and wallet
- [ ] Update profile information

### As an Employer (demo.employer@taskapp.com)
✅ **Test These Features:**
- [ ] Create new tasks
- [ ] Upload task attachments
- [ ] Set task requirements and deadlines
- [ ] Review worker submissions
- [ ] Approve/reject submissions
- [ ] Rate worker performance
- [ ] Manage task listings
- [ ] View payment history

### As an Admin (demo.admin@taskapp.com)
✅ **Test These Features:**
- [ ] Access admin dashboard
- [ ] View all users and tasks
- [ ] Moderate content
- [ ] Manage platform settings
- [ ] View system analytics
- [ ] Handle disputes (if any)

## 📱 Mobile Testing

**Test on Mobile Device:**
1. Open `http://localhost:3001` on your phone
2. Test the bottom navigation bar
3. Try the category overlay from Tasks tab
4. Test responsive design on different screen sizes
5. Verify touch interactions work smoothly

## 🎯 Sample Tasks to Create

Once you have the employer account, create these sample tasks:

### Task 1: Logo Design
- **Title**: "Design a Modern Logo for Tech Startup"
- **Category**: Design & Creative
- **Reward**: $150
- **Difficulty**: Medium
- **Description**: "We need a clean, modern logo for our new tech startup..."

### Task 2: Content Writing
- **Title**: "Write SEO-Optimized Blog Posts"
- **Category**: Writing & Content
- **Reward**: $200
- **Difficulty**: Medium
- **Description**: "Looking for an experienced content writer to create 5 SEO-optimized blog posts..."

### Task 3: Data Entry
- **Title**: "Customer Information Processing"
- **Category**: Data & Analytics
- **Reward**: $75
- **Difficulty**: Easy
- **Description**: "We have approximately 500 customer records that need to be entered..."

## 🔄 Testing Workflow

1. **Create tasks** as employer
2. **Switch to worker account**
3. **Browse and apply** for tasks
4. **Submit work** with file attachments
5. **Switch back to employer**
6. **Review submissions** and provide feedback
7. **Test mobile navigation** throughout

## 🎉 Ready to Test!

Your TaskApp now has everything needed for comprehensive testing:
- ✅ Demo accounts for all user types
- ✅ Sample tasks to work with
- ✅ Mobile navigation to test
- ✅ File upload functionality
- ✅ Complete workflow testing

**Start testing at: `http://localhost:3001`**