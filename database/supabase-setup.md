# TaskApp Supabase Database Setup

This guide will help you set up the TaskApp database schema in Supabase.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in Supabase
3. Get your project URL and API keys

## Setup Steps

### 1. Run the Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Copy the contents of `supabase-schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the schema

### 2. Configure Environment Variables

Update your `server/.env` file:

```env
# Database Configuration
DATABASE_MODE=supabase

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

### 3. Authentication Setup (Optional)

If you want to use Supabase Auth instead of custom JWT:

1. Go to **Authentication** > **Settings** in Supabase
2. Configure your site URL: `http://localhost:3000`
3. Add redirect URLs for production
4. Enable email confirmations if desired

### 4. Row Level Security (RLS)

The schema includes RLS policies for security:

- Users can only access their own data
- Public task viewing is allowed
- Employers can manage their tasks
- Workers can submit to tasks

### 5. Real-time Subscriptions (Optional)

Enable real-time for live updates:

1. Go to **Database** > **Replication** in Supabase
2. Enable replication for tables you want real-time updates:
   - `tasks` (for new task notifications)
   - `task_submissions` (for submission updates)
   - `transactions` (for payment notifications)

## Database Schema Overview

### Tables Created

1. **users** - User accounts with roles and wallet info
2. **tasks** - Tasks posted by employers
3. **task_submissions** - Worker submissions with proof
4. **transactions** - Financial transactions and payments

### Key Features

- **UUID Primary Keys** - Better for distributed systems
- **ENUM Types** - Type safety for status fields
- **Triggers** - Automatic stats updates
- **Indexes** - Optimized for common queries
- **Constraints** - Data integrity validation
- **RLS Policies** - Row-level security

### Demo Data Included

The schema includes demo accounts:
- Worker: worker@taskapp.com / worker123
- Employer: employer@taskapp.com / employer123
- Admin: admin@taskapp.com / admin123

## Supabase Client Configuration

Update your backend to use Supabase client:

```javascript
// server/config/supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;
```

## Common Queries

### Get Active Tasks
```sql
SELECT * FROM task_stats 
WHERE status = 'active' 
ORDER BY created_at DESC;
```

### Get User Submissions
```sql
SELECT * FROM submission_details 
WHERE worker_id = $1 
ORDER BY submitted_at DESC;
```

### Get Pending Reviews
```sql
SELECT * FROM submission_details 
WHERE employer_id = $1 AND status = 'pending'
ORDER BY submitted_at ASC;
```

## Backup and Migration

### Export Data
```bash
# Using Supabase CLI
supabase db dump --file backup.sql

# Or use pg_dump with connection string
pg_dump "postgresql://..." > backup.sql
```

### Import Data
```bash
# Using Supabase CLI
supabase db reset --file backup.sql

# Or use psql
psql "postgresql://..." < backup.sql
```

## Performance Optimization

The schema includes optimized indexes for:
- User lookups by email and role
- Task filtering by status, category, and payout
- Submission queries by user and status
- Transaction history by user and type

## Security Considerations

1. **RLS Enabled** - All tables have row-level security
2. **Service Key** - Use service key for server operations
3. **Anon Key** - Use anon key for client operations
4. **API Policies** - Configure API access policies
5. **Rate Limiting** - Enable rate limiting in Supabase

## Monitoring

Monitor your database in Supabase:
1. **Database** > **Logs** - Query logs
2. **Database** > **Statistics** - Performance metrics
3. **Settings** > **Usage** - Resource usage

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Check RLS policies
   - Verify user authentication
   - Use service key for admin operations

2. **Connection Issues**
   - Verify environment variables
   - Check network connectivity
   - Confirm project URL and keys

3. **Query Performance**
   - Check query execution plans
   - Add missing indexes
   - Optimize complex queries

### Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)