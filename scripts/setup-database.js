#!/usr/bin/env node

/**
 * Database Setup Script
 * Sets up the complete database schema and initial data
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://xwvpkvzotdaugkywdnme.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY not found in environment variables');
  console.log('📋 To get your service role key:');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to Settings > API');
  console.log('3. Copy the "service_role" key (not the anon key)');
  console.log('4. Set it as SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.log('\n🔧 For now, you can run the SQL manually in your Supabase SQL editor');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up TaskApp database...\n');

  try {
    // Test connection
    console.log('🔗 Testing database connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error && error.code === '42P01') {
      console.log('❌ Tables not found. Please run the SQL schema first.');
      console.log('📋 Steps to set up your database:');
      console.log('1. Go to your Supabase project dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of database/complete-schema.sql');
      console.log('4. Run the SQL to create all tables');
      console.log('5. Then run this setup script again');
      return;
    }

    console.log('✅ Database connection successful');

    // Check if categories exist
    console.log('📂 Setting up categories...');
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (!existingCategories || existingCategories.length === 0) {
      const categories = [
        { name: 'Writing & Content', description: 'Content creation, copywriting, blogging', color: 'blue', icon: 'pencil', sort_order: 1, active: true },
        { name: 'Design & Creative', description: 'Graphic design, UI/UX, illustrations', color: 'purple', icon: 'paint-brush', sort_order: 2, active: true },
        { name: 'Programming & Tech', description: 'Web development, mobile apps, software', color: 'green', icon: 'code', sort_order: 3, active: true },
        { name: 'Data & Analytics', description: 'Data entry, analysis, research', color: 'yellow', icon: 'chart-bar', sort_order: 4, active: true },
        { name: 'Marketing & Sales', description: 'Digital marketing, SEO, social media', color: 'red', icon: 'megaphone', sort_order: 5, active: true },
        { name: 'Translation & Languages', description: 'Translation, proofreading, localization', color: 'indigo', icon: 'globe', sort_order: 6, active: true },
        { name: 'Business & Consulting', description: 'Business planning, consulting, strategy', color: 'gray', icon: 'briefcase', sort_order: 7, active: true },
        { name: 'Video & Audio', description: 'Video editing, audio production, animation', color: 'pink', icon: 'film', sort_order: 8, active: true }
      ];

      const { error: categoriesError } = await supabase
        .from('categories')
        .insert(categories);

      if (categoriesError) {
        console.error('❌ Error inserting categories:', categoriesError);
      } else {
        console.log('✅ Categories created successfully');
      }
    } else {
      console.log('✅ Categories already exist');
    }

    // Create sample tasks for testing
    console.log('📋 Creating sample tasks...');
    const { data: existingTasks } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);

    if (!existingTasks || existingTasks.length === 0) {
      // First, we need to create a sample employer user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: 'demo.employer@taskapp.com',
        password: 'demo123456',
        email_confirm: true
      });

      if (authError) {
        console.log('⚠️  Could not create auth user:', authError.message);
      } else {
        // Create user profile
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: authUser.user.id,
              email: 'demo.employer@taskapp.com',
              full_name: 'Demo Employer',
              user_type: 'employer',
              company: 'TaskApp Demo Company',
              status: 'active'
            }
          ]);

        if (userError) {
          console.log('⚠️  Could not create user profile:', userError.message);
        } else {
          // Get first category
          const { data: categories } = await supabase
            .from('categories')
            .select('id')
            .limit(1);

          if (categories && categories.length > 0) {
            const sampleTasks = [
              {
                title: 'Write a Product Description',
                description: 'Create a compelling product description for our new eco-friendly water bottle. The description should be engaging, highlight key features, and be optimized for e-commerce.',
                category_id: categories[0].id,
                employer_id: authUser.user.id,
                reward_amount: 25.00,
                difficulty_level: 'easy',
                status: 'active',
                requirements: 'Experience in copywriting, understanding of eco-friendly products',
                deliverables: 'A 150-200 word product description in a Word document'
              },
              {
                title: 'Design a Simple Logo',
                description: 'Design a modern, minimalist logo for a tech startup. The logo should be scalable and work well in both light and dark themes.',
                category_id: categories[0].id,
                employer_id: authUser.user.id,
                reward_amount: 75.00,
                difficulty_level: 'medium',
                status: 'active',
                requirements: 'Graphic design experience, proficiency in design software',
                deliverables: 'Logo files in PNG, SVG, and AI formats'
              }
            ];

            const { error: tasksError } = await supabase
              .from('tasks')
              .insert(sampleTasks);

            if (tasksError) {
              console.log('⚠️  Could not create sample tasks:', tasksError.message);
            } else {
              console.log('✅ Sample tasks created successfully');
            }
          }
        }
      }
    } else {
      console.log('✅ Sample tasks already exist');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Your database is now ready for use');
    console.log('2. You can register new users through the app');
    console.log('3. Demo employer account: demo.employer@taskapp.com / demo123456');
    console.log('4. Start using your TaskApp!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup
setupDatabase();