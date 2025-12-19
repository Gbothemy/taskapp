const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function seedSampleData() {
  console.log('🌱 Starting to seed sample data...');

  try {
    // 1. Create sample categories
    console.log('📂 Creating categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .upsert([
        { name: 'Data Entry', description: 'Data input and processing tasks', color: 'blue', icon: 'document' },
        { name: 'AI/ML', description: 'Artificial Intelligence and Machine Learning tasks', color: 'purple', icon: 'cpu' },
        { name: 'Survey', description: 'Market research and survey completion', color: 'green', icon: 'clipboard' },
        { name: 'Moderation', description: 'Content review and moderation', color: 'orange', icon: 'shield' },
        { name: 'Writing', description: 'Content creation and copywriting', color: 'red', icon: 'pencil' }
      ], { onConflict: 'name' })
      .select();

    if (categoriesError) throw categoriesError;
    console.log(`✅ Created ${categories.length} categories`);

    // 2. Create sample users (if they don't exist)
    console.log('👥 Creating sample users...');
    
    // Check if demo users exist
    const { data: existingUsers } = await supabase
      .from('users')
      .select('email')
      .in('email', ['admin@taskapp.com', 'employer@taskapp.com', 'worker@taskapp.com']);

    const usersToCreate = [];
    
    if (!existingUsers.find(u => u.email === 'admin@taskapp.com')) {
      usersToCreate.push({
        email: 'admin@taskapp.com',
        full_name: 'Admin User',
        user_type: 'admin',
        status: 'active'
      });
    }

    if (!existingUsers.find(u => u.email === 'employer@taskapp.com')) {
      usersToCreate.push({
        email: 'employer@taskapp.com',
        full_name: 'TechCorp Inc.',
        user_type: 'employer',
        company: 'TechCorp Inc.',
        status: 'active',
        wallet_balance: 5000.00
      });
    }

    if (!existingUsers.find(u => u.email === 'worker@taskapp.com')) {
      usersToCreate.push({
        email: 'worker@taskapp.com',
        full_name: 'John Worker',
        user_type: 'worker',
        status: 'active',
        wallet_balance: 250.75,
        total_earnings: 1250.50,
        tasks_completed: 15,
        rating: 4.8
      });
    }

    if (usersToCreate.length > 0) {
      const { data: newUsers, error: usersError } = await supabase
        .from('users')
        .insert(usersToCreate)
        .select();

      if (usersError) throw usersError;
      console.log(`✅ Created ${newUsers.length} new users`);
    }

    // Get all users for reference
    const { data: allUsers } = await supabase
      .from('users')
      .select('id, email, user_type');

    const employer = allUsers.find(u => u.user_type === 'employer');
    const worker = allUsers.find(u => u.user_type === 'worker');

    if (!employer || !worker) {
      console.log('⚠️ Missing employer or worker users, skipping task creation');
      return;
    }

    // 3. Create sample tasks
    console.log('📋 Creating sample tasks...');
    const dataEntryCategory = categories.find(c => c.name === 'Data Entry');
    const aiCategory = categories.find(c => c.name === 'AI/ML');
    const surveyCategory = categories.find(c => c.name === 'Survey');

    const sampleTasks = [
      {
        title: 'Data Entry - Customer Records',
        description: 'Enter customer information from scanned documents into our database system. Requires attention to detail and accuracy.',
        employer_id: employer.id,
        category_id: dataEntryCategory?.id,
        reward_amount: 150.00,
        status: 'active',
        priority: 'normal',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        difficulty_level: 'easy',
        required_skills: ['Data Entry', 'Attention to Detail'],
        max_submissions: 1
      },
      {
        title: 'Image Classification Project',
        description: 'Classify product images into appropriate categories for our e-commerce platform. Training will be provided.',
        employer_id: employer.id,
        category_id: aiCategory?.id,
        reward_amount: 500.00,
        status: 'active',
        priority: 'high',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
        difficulty_level: 'medium',
        required_skills: ['Machine Learning', 'Image Processing'],
        max_submissions: 3
      },
      {
        title: 'Market Research Survey',
        description: 'Complete a comprehensive market research survey about consumer preferences in the tech industry.',
        employer_id: employer.id,
        category_id: surveyCategory?.id,
        reward_amount: 75.00,
        status: 'completed',
        priority: 'low',
        deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        difficulty_level: 'easy',
        required_skills: ['Survey Completion'],
        max_submissions: 1
      },
      {
        title: 'Content Moderation Task',
        description: 'Review and moderate user-generated content for policy violations. Must follow community guidelines.',
        employer_id: employer.id,
        category_id: categories.find(c => c.name === 'Moderation')?.id,
        reward_amount: 200.00,
        status: 'draft',
        priority: 'high',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        difficulty_level: 'medium',
        required_skills: ['Content Moderation', 'Policy Knowledge'],
        max_submissions: 1
      }
    ];

    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .insert(sampleTasks)
      .select();

    if (tasksError) throw tasksError;
    console.log(`✅ Created ${tasks.length} sample tasks`);

    // 4. Create sample submissions
    console.log('📝 Creating sample submissions...');
    const activeTask = tasks.find(t => t.status === 'active');
    const completedTask = tasks.find(t => t.status === 'completed');

    if (activeTask && completedTask) {
      const sampleSubmissions = [
        {
          task_id: activeTask.id,
          worker_id: worker.id,
          submission_text: 'I have completed the data entry task as requested. All customer records have been accurately entered into the system with proper validation.',
          status: 'pending',
          submitted_at: new Date().toISOString()
        },
        {
          task_id: completedTask.id,
          worker_id: worker.id,
          submission_text: 'Survey completed successfully. All questions answered thoroughly with detailed responses.',
          status: 'approved',
          rating: 5,
          feedback: 'Excellent work! Very thorough and professional.',
          submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          reviewed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
        }
      ];

      const { data: submissions, error: submissionsError } = await supabase
        .from('task_submissions')
        .insert(sampleSubmissions)
        .select();

      if (submissionsError) throw submissionsError;
      console.log(`✅ Created ${submissions.length} sample submissions`);
    }

    // 5. Create sample transactions
    console.log('💳 Creating sample transactions...');
    try {
      const sampleTransactions = [
        {
          user_id: worker.id,
          amount: 75.00,
          type: 'earning',
          status: 'completed',
          description: 'Payment for completing Market Research Survey'
        },
        {
          user_id: worker.id,
          amount: -50.00,
          type: 'withdrawal',
          status: 'pending',
          description: 'Withdrawal request to PayPal'
        }
      ];

      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .insert(sampleTransactions)
        .select();

      if (transactionsError) {
        console.log('⚠️ Could not create transactions:', transactionsError.message);
      } else {
        console.log(`✅ Created ${transactions.length} sample transactions`);
      }
    } catch (error) {
      console.log('⚠️ Transactions creation skipped:', error.message);
    }

    // 6. Create sample notifications
    console.log('🔔 Creating sample notifications...');
    const sampleNotifications = [
      {
        user_id: worker.id,
        title: 'Task Submission Approved',
        message: 'Your submission for "Market Research Survey" has been approved!',
        type: 'success',
        reference_id: completedTask?.id,
        reference_type: 'task'
      },
      {
        user_id: employer.id,
        title: 'New Task Submission',
        message: 'You have a new submission to review for "Data Entry - Customer Records"',
        type: 'info',
        reference_id: activeTask?.id,
        reference_type: 'task'
      },
      {
        user_id: worker.id,
        title: 'Withdrawal Request Received',
        message: 'Your withdrawal request for $50.00 is being processed.',
        type: 'info'
      }
    ];

    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .insert(sampleNotifications)
      .select();

    if (notificationsError) throw notificationsError;
    console.log(`✅ Created ${notifications.length} sample notifications`);

    console.log('\n🎉 Sample data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Tasks: ${tasks.length}`);
    console.log(`- Submissions: ${sampleSubmissions?.length || 0}`);
    console.log(`- Transactions: Created (if successful)`);
    console.log(`- Notifications: ${notifications.length}`);

    console.log('\n🔑 Demo Accounts:');
    console.log('- Admin: admin@taskapp.com');
    console.log('- Employer: employer@taskapp.com');
    console.log('- Worker: worker@taskapp.com');

  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedSampleData()
  .then(() => {
    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });