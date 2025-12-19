#!/usr/bin/env node

/**
 * Database Seeding Script
 * Seeds the database with initial data for production
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Please set REACT_APP_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  console.log('🌱 Seeding TaskApp database...\n');

  try {
    // Seed categories
    console.log('📂 Seeding categories...');
    const categories = [
      { name: 'Writing & Content', description: 'Content creation, copywriting, blogging', color: 'blue', icon: 'pencil', sort_order: 1 },
      { name: 'Design & Creative', description: 'Graphic design, UI/UX, illustrations', color: 'purple', icon: 'paint-brush', sort_order: 2 },
      { name: 'Programming & Tech', description: 'Web development, mobile apps, software', color: 'green', icon: 'code', sort_order: 3 },
      { name: 'Data & Analytics', description: 'Data entry, analysis, research', color: 'yellow', icon: 'chart-bar', sort_order: 4 },
      { name: 'Marketing & Sales', description: 'Digital marketing, SEO, social media', color: 'red', icon: 'megaphone', sort_order: 5 },
      { name: 'Translation & Languages', description: 'Translation, proofreading, localization', color: 'indigo', icon: 'globe', sort_order: 6 },
      { name: 'Business & Consulting', description: 'Business planning, consulting, strategy', color: 'gray', icon: 'briefcase', sort_order: 7 },
      { name: 'Video & Audio', description: 'Video editing, audio production, animation', color: 'pink', icon: 'film', sort_order: 8 }
    ];

    const { error: categoriesError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'name' });

    if (categoriesError) {
      console.error('❌ Error seeding categories:', categoriesError);
    } else {
      console.log('✅ Categories seeded successfully');
    }

    // Create sample admin user (if needed)
    console.log('👤 Creating admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@taskapp.com';
    
    // Check if admin exists
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('email', adminEmail)
      .eq('user_type', 'admin')
      .single();

    if (!existingAdmin) {
      const { error: adminError } = await supabase
        .from('users')
        .insert([
          {
            email: adminEmail,
            full_name: 'System Administrator',
            user_type: 'admin',
            status: 'active'
          }
        ]);

      if (adminError) {
        console.error('❌ Error creating admin user:', adminError);
      } else {
        console.log('✅ Admin user created successfully');
        console.log(`📧 Admin email: ${adminEmail}`);
      }
    } else {
      console.log('✅ Admin user already exists');
    }

    // Set up storage buckets (this would typically be done in Supabase dashboard)
    console.log('🗂️  Storage buckets should be created in Supabase dashboard:');
    console.log('   - task-files (public)');
    console.log('   - user-avatars (public)');
    console.log('   - documents (private)');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up storage buckets in Supabase dashboard');
    console.log('2. Configure RLS policies');
    console.log('3. Set up authentication providers');
    console.log('4. Configure email templates');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();