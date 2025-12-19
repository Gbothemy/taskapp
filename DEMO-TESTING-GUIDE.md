# 🧪 Demo Account Testing Guide

## Step 1: Test Database Setup

### Quick Database Test
Run this in your Supabase SQL Editor to verify demo setup:

```sql
-- Copy and paste contents of database/quick-demo-test.sql
```

**Expected Results:**
- ✅ All 3 demo users exist
- ✅ Multiple demo tasks exist  
- ✅ Good category variety
- ✅ DEMO SETUP COMPLETE

### Comprehensive Database Test
For detailed analysis, run:

```sql
-- Copy and paste contents of database/test-demo-accounts.sql
```

This provides detailed testing of:
- Database structure
- User profiles
- Task relationships
- Categories
- Data integrity

## Step 2: Test App Registration

### Register Demo Accounts
Visit `http://localhost:3001` and register each account:

**Worker Account:**
- Email: `demo.worker@taskapp.com`
- Password: `Demo123!`
- Full Name: `Alex Johnson`
- User Type: `Worker`

**Employer Account:**
- Email: `demo.employer@taskapp.com`
- Password: `Demo123!`
- Full Name: `Sarah Chen`
- User Type: `Employer`

**Admin Account:**
- Email: `demo.admin@taskapp.com`
- Password: `Demo123!`
- Full Name: `Admin User`
- User Type: `Admin`

## Step 3: Test Login Functionality

### Login Test Checklist
- [ ] Worker login successful
- [ ] Employer login successful
- [ ] Admin login successful
- [ ] Dashboard loads for each user type
- [ ] User profile shows correct information

## Step 4: Test Core Features

### As Worker (demo.worker@taskapp.com)
- [ ] **Dashboard Access**: Worker dashboard loads
- [ ] **Task Browser**: Can browse available tasks
- [ ] **Category Filter**: Mobile category navigation works
- [ ] **Task Details**: Can view individual task details
- [ ] **Task Application**: Can apply to tasks (if implemented)
- [ ] **Profile View**: Can view and edit profile

### As Employer (demo.employer@taskapp.com)
- [ ] **Dashboard Access**: Employer dashboard loads
- [ ] **Task Creation**: Can create new tasks
- [ ] **My Tasks**: Can view created tasks
- [ ] **Task Management**: Can edit/manage tasks
- [ ] **Submissions**: Can view task submissions (if any)
- [ ] **Profile View**: Can view and edit profile

### As Admin (demo.admin@taskapp.com)
- [ ] **Dashboard Access**: Admin dashboard loads
- [ ] **User Management**: Can view all users
- [ ] **Task Oversight**: Can view all tasks
- [ ] **System Stats**: Can view platform statistics
- [ ] **Moderation**: Can moderate content (if implemented)

## Step 5: Test Mobile Experience

### Mobile Navigation Test
- [ ] **Bottom Navigation**: Fixed navigation bar appears on mobile
- [ ] **Category Access**: Tasks tab opens category overlay
- [ ] **Category Selection**: Can select categories from overlay
- [ ] **Responsive Design**: All pages work on mobile
- [ ] **Touch Interactions**: All buttons and links work

### Mobile Testing Methods
1. **Browser DevTools**: Use device emulation
2. **Actual Mobile**: Visit `http://YOUR_IP:3001` on phone
3. **Responsive Test**: Resize browser window

## Step 6: Test Task Workflow

### Complete Task Workflow Test
1. **As Employer**: Create a new task
2. **As Worker**: Browse and find the task
3. **As Worker**: View task details
4. **As Worker**: Submit work (if implemented)
5. **As Employer**: Review submission
6. **As Employer**: Approve/reject submission

## Step 7: Test File Upload (If Available)

### File Upload Test
- [ ] **Task Attachments**: Can attach files to tasks
- [ ] **Submission Files**: Can attach files to submissions
- [ ] **File Download**: Can download attached files
- [ ] **File Validation**: Proper file type/size validation

## Step 8: Test Notifications (If Available)

### Notification Test
- [ ] **Real-time Updates**: Notifications appear in real-time
- [ ] **Notification Center**: Can view notification history
- [ ] **Mark as Read**: Can mark notifications as read
- [ ] **Notification Types**: Different notification types work

## Troubleshooting Common Issues

### Database Issues
**Problem**: No demo users found
**Solution**: Run `database/minimal-demo-setup.sql`

**Problem**: Demo tasks missing
**Solution**: Check if demo employer exists, then run task creation SQL

### Authentication Issues
**Problem**: Can't register demo accounts
**Solution**: 
- Check Supabase Auth settings
- Ensure "Enable email confirmations" is OFF
- Try different email variations

### App Issues
**Problem**: Dashboard doesn't load
**Solution**:
- Check browser console for errors
- Verify user type is set correctly
- Clear browser cache

### Mobile Issues
**Problem**: Mobile navigation not showing
**Solution**:
- Mobile nav only shows on screens < 768px width
- Try actual mobile device or browser dev tools

## Success Criteria

### ✅ Demo Setup is Successful When:
- All 3 demo accounts can be registered
- All 3 demo accounts can login
- Demo tasks appear in task browser
- Mobile navigation works properly
- Core features function for each user type
- No critical errors in browser console

### 🎯 Ready for Production When:
- All demo tests pass
- Real user registration works
- Task creation/submission workflow complete
- File uploads functional
- Mobile experience polished
- Performance is acceptable

## Performance Testing

### Load Testing Checklist
- [ ] **Page Load Speed**: All pages load within 3 seconds
- [ ] **Task Browser**: Handles multiple tasks efficiently
- [ ] **Mobile Performance**: Smooth on mobile devices
- [ ] **File Upload Speed**: Files upload reasonably fast
- [ ] **Database Queries**: No slow query warnings

## Final Verification

Run this final check to ensure everything is working:

1. **Database Test**: Run `database/quick-demo-test.sql` - should show all green
2. **Registration Test**: Register all 3 demo accounts successfully
3. **Login Test**: Login with each account type
4. **Feature Test**: Test core features for each user type
5. **Mobile Test**: Verify mobile navigation and responsiveness
6. **Workflow Test**: Complete at least one full task workflow

**If all tests pass, your TaskApp is ready for real users!** 🎉