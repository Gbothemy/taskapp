# 🔧 Disable Email Verification - Quick Setup

## Step 1: Supabase Dashboard Settings

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `xwvpkvzotdaugkywdnme`

2. **Navigate to Authentication Settings**
   - Click "Authentication" in the left sidebar
   - Click "Settings" tab

3. **Disable Email Confirmations**
   - Find "Enable email confirmations"
   - **Turn it OFF** (uncheck the box)
   - Click "Save"

4. **Set Site URL**
   - Find "Site URL" field
   - Set to: `http://localhost:3001`
   - Click "Save"

## Step 2: Verify Settings

After making these changes:
- ✅ Users can register without email verification
- ✅ Immediate login after registration
- ✅ No "check your email" messages
- ✅ Demo accounts will work instantly

## Step 3: Test Registration

1. Visit `http://localhost:3001`
2. Try registering a test account
3. Should work immediately without email verification

## Alternative: Environment Variable

If you prefer to handle this in code, I can also update the Supabase client configuration to skip email verification programmatically.