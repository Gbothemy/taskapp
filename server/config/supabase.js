const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://xwvpkvzotdaugkywdnme.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3dnBrdnpvdGRhdWdreXdkbm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjA2MDEsImV4cCI6MjA4MDEzNjYwMX0.GsdrOYy56nYs2UPAyPqfahzLJ3b37om3mABWV2SdXzs';

if (!supabaseServiceKey) {
  console.warn('SUPABASE_SERVICE_KEY not found in environment variables, using anon key');
}

// Create Supabase client with service key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

// Create client with anon key for client-side operations
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

module.exports = {
  supabase,
  supabaseAnon,
  supabaseUrl,
  supabaseAnonKey
};