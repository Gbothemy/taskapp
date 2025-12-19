#!/usr/bin/env node

/**
 * Demo Account Creation Script
 * Creates demo accounts and sample data for testing
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
  console.log('\n🔧 Alternatively, you can create these accounts manually through the app registration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createDemoAccounts() {
  console.log('🎭 Creating demo accounts for testing...\n');

  const demoAccounts = [
    {
      email: 'demo.worker@taskapp.com',
      password: 'Demo123!',
      userData: {
        full_name: 'Alex Johnson',
        user_type: 'worker',
        bio: 'Experienced graphic designer and content writer with 5+ years in the industry.',
        skills: ['Graphic Design', 'Content Writing', 'Adobe Creative Suite', 'WordPress'],
        rating: 4.8,
        tasks_completed: 47,
        total_earnings: 2850.00,
        wallet_balance: 450.00
      }
    },
    {
      email: 'demo.employer@taskapp.com',
      password: 'Demo123!',
      userData: {
        full_name: 'Sarah Chen',
        user_type: 'employer',
        company: 'TechStart Solutions',
        bio: 'Startup founder looking for talented freelancers to help grow our business.',
        rating: 4.9,
        tasks_created: 23,
        wallet_balance: 1200.00
      }
    },
    {
      email: 'demo.admin@taskapp.com',
      password: 'Demo123!',
      userData: {
        full_name: 'Admin User',
        user_type: 'admin',
        company: 'TaskApp Inc.',
        bio: 'Platform administrator managing the TaskApp ecosystem.',
        rating: 5.0
      }
    }
  ];

  try {
    for (const account of demoAccounts) {
      console.log(`👤 Creating ${account.userData.user_type}: ${account.email}`);
      
      // Create auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          full_name: account.userData.full_name,
          user_type: account.userData.user_type
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`   ✅ User already exists: ${account.email}`);
          continue;
        } else {
          console.error(`   ❌ Auth error for ${account.email}:`, authError.message);
          continue;
        }
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .upsert([
          {
            id: authUser.user.id,
            email: account.email,
            ...account.userData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

      if (profileError) {
        console.error(`   ❌ Profile error for ${account.email}:`, profileError.message);
        continue;
      }

      // Create verification record
      const { error: verificationError } = await supabase
        .from('user_verifications')
        .upsert([
          {
            user_id: authUser.user.id,
            email_verified: true,
            trust_score: account.userData.user_type === 'admin' ? 100 : 85,
            trust_level: account.userData.user_type === 'admin' ? 'enterprise' : 'verified'
          }
        ]);

      if (verificationError) {
        console.log(`   ⚠️  Verification warning for ${account.email}:`, verificationError.message);
      }

      console.log(`   ✅ Successfully created: ${account.email}`);
    }

    console.log('\n🎯 Creating sample tasks...');
    await createSampleTasks();

    console.log('\n🎉 Demo setup completed successfully!');
    console.log('\n📋 Demo Account Credentials:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│                    DEMO ACCOUNTS                        │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ 👷 WORKER ACCOUNT                                       │');
    console.log('│ Email: demo.worker@taskapp.com                          │');
    console.log('│ Password: Demo123!                                      │');
    console.log('│ Features: Browse tasks, submit work, track earnings     │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ 🏢 EMPLOYER ACCOUNT                                     │');
    console.log('│ Email: demo.employer@taskapp.com                        │');
    console.log('│ Password: Demo123!                                      │');
    console.log('│ Features: Create tasks, review submissions, payments    │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ 👨‍💼 ADMIN ACCOUNT                                        │');
    console.log('│ Email: demo.admin@taskapp.com                           │');
    console.log('│ Password: Demo123!                                      │');
    console.log('│ Features: Full platform management, user oversight      │');
    console.log('└─────────────────────────────────────────────────────────┘');
    console.log('\n🚀 Ready to test! Visit http://localhost:3001 and login with any account above.');

  } catch (error) {
    console.error('❌ Demo setup failed:', error);
    process.exit(1);
  }
}

async function createSampleTasks() {
  // Get the demo employer user
  const { data: employer } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'demo.employer@taskapp.com')
    .single();

  if (!employer) {
    console.log('   ⚠️  Demo employer not found, skipping sample tasks');
    return;
  }

  // Get categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .limit(4);

  if (!categories || categories.length === 0) {
    console.log('   ⚠️  No categories found, skipping sample tasks');
    return;
  }

  const sampleTasks = [
    {
      title: 'Design a Modern Logo for Tech Startup',
      description: 'We need a clean, modern logo for our new tech startup. The logo should be scalable, work in both light and dark themes, and represent innovation and reliability. We prefer minimalist designs with a tech-forward aesthetic.\n\nDeliverables should include:\n- Logo in various formats (PNG, SVG, AI)\n- Color and black/white versions\n- Usage guidelines\n- Source files',
      category_id: categories.find(c => c.name.includes('Design'))?.id || categories[0].id,
      employer_id: employer.id,
      reward_amount: 150.00,
      difficulty_level: 'medium',
      status: 'active',
      requirements: 'Experience with logo design, proficiency in Adobe Illustrator or similar tools, portfolio of previous logo work',
      deliverables: 'Logo files in PNG, SVG, and AI formats, plus usage guidelines document',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      max_submissions: 3
    },
    {
      title: 'Write SEO-Optimized Blog Posts (5 Articles)',
      description: 'Looking for an experienced content writer to create 5 SEO-optimized blog posts for our digital marketing agency. Each article should be 1000-1500 words, well-researched, and engaging.\n\nTopics:\n1. "Digital Marketing Trends in 2024"\n2. "Social Media Strategy for Small Businesses"\n3. "Email Marketing Best Practices"\n4. "Content Marketing ROI Measurement"\n5. "PPC vs Organic Search: Which is Better?"\n\nAll articles must be original, plagiarism-free, and optimized for search engines.',
      category_id: categories.find(c => c.name.includes('Writing'))?.id || categories[0].id,
      employer_id: employer.id,
      reward_amount: 200.00,
      difficulty_level: 'medium',
      status: 'active',
      requirements: 'Proven experience in content writing, SEO knowledge, understanding of digital marketing concepts',
      deliverables: '5 blog posts (1000-1500 words each) in Google Docs format with SEO recommendations',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      max_submissions: 2
    },
    {
      title: 'Build a Simple React Component Library',
      description: 'We need a developer to create a small React component library with 8-10 reusable components. The components should be modern, accessible, and well-documented.\n\nRequired components:\n- Button (with variants)\n- Input fields\n- Modal/Dialog\n- Card\n- Loading spinner\n- Alert/Notification\n- Dropdown\n- Tabs\n\nComponents should use TypeScript, include Storybook documentation, and follow modern React patterns.',
      category_id: categories.find(c => c.name.includes('Programming') || c.name.includes('Tech'))?.id || categories[0].id,
      employer_id: employer.id,
      reward_amount: 400.00,
      difficulty_level: 'hard',
      status: 'active',
      requirements: 'Strong React and TypeScript experience, knowledge of component design patterns, Storybook experience preferred',
      deliverables: 'Complete component library with TypeScript definitions, Storybook documentation, and usage examples',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      max_submissions: 1
    },
    {
      title: 'Data Entry: Customer Information Processing',
      description: 'We have approximately 500 customer records that need to be entered into our CRM system. The data is currently in PDF format and needs to be accurately transcribed.\n\nThe work involves:\n- Extracting customer information from PDF documents\n- Entering data into our web-based CRM\n- Ensuring accuracy and completeness\n- Basic data validation\n\nThis is straightforward data entry work that requires attention to detail and accuracy.',
      category_id: categories.find(c => c.name.includes('Data'))?.id || categories[0].id,
      employer_id: employer.id,
      reward_amount: 75.00,
      difficulty_level: 'easy',
      status: 'active',
      requirements: 'Attention to detail, basic computer skills, ability to work with PDF documents and web forms',
      deliverables: 'All 500 customer records accurately entered into the CRM system',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      max_submissions: 1
    }
  ];

  for (const task of sampleTasks) {
    const { error } = await supabase
      .from('tasks')
      .insert([task]);

    if (error) {
      console.log(`   ⚠️  Error creating task "${task.title}":`, error.message);
    } else {
      console.log(`   ✅ Created task: "${task.title}"`);
    }
  }
}

// Run the demo setup
createDemoAccounts();