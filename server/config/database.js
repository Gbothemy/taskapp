const mongoose = require('mongoose');
const { supabase } = require('./supabase');

let db = null;

// Demo data storage
let demoData = {
  users: [
    {
      id: '1',
      email: 'worker@taskapp.com',
      password: '$2a$12$sgCiscQs2GJbw743aVxMVuECK74n8.0PeGhY6NRjFIzAC01EcSQ9C', // worker123
      firstName: 'John',
      lastName: 'Worker',
      role: 'worker',
      status: 'active',
      wallet: {
        balance: 150.00,
        pendingEarnings: 25.00,
        totalEarned: 500.00,
        totalSpent: 0
      },
      workerStats: {
        tasksCompleted: 45,
        approvalRate: 95.5,
        level: 3,
        badges: ['reliable', 'fast-worker']
      },
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      email: 'employer@taskapp.com',
      password: '$2a$12$f5IUGcAP3Tv0DVlJNPMx8.xl4oN8Hd9gUsfwhL.jwg7GowT4kEplO', // employer123
      firstName: 'Jane',
      lastName: 'Employer',
      role: 'employer',
      status: 'active',
      wallet: {
        balance: 1000.00,
        pendingEarnings: 0,
        totalEarned: 0,
        totalSpent: 750.00
      },
      employerStats: {
        tasksPosted: 12,
        totalSpent: 750.00
      },
      createdAt: new Date('2024-01-01')
    },
    {
      id: '3',
      email: 'admin@taskapp.com',
      password: '$2a$12$vYmf2egCZFyAVQSX5JkF2OgFzKqkA7eLrxUNwKswWz6c3ktvLVJnm', // admin123
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      status: 'active',
      wallet: {
        balance: 0,
        pendingEarnings: 0,
        totalEarned: 0,
        totalSpent: 0
      },
      createdAt: new Date('2024-01-01')
    }
  ],
  tasks: [
    {
      id: '1',
      title: 'Website Review and Feedback',
      description: 'Visit a website and provide detailed feedback on user experience',
      instructions: 'Navigate through the website, test key features, and provide constructive feedback',
      category: 'review',
      employerId: '2',
      payoutPerTask: 15.00,
      totalTasksNeeded: 10,
      completedTasks: 3,
      approvedTasks: 2,
      rejectedTasks: 0,
      deadline: new Date('2024-12-31'),
      status: 'active',
      requiredProofType: 'text',
      qualityRequirements: {
        minApprovalRate: 80,
        workerLevel: 1
      },
      autoApproval: false,
      createdAt: new Date('2024-12-01')
    },
    {
      id: '2',
      title: 'Social Media Post Creation',
      description: 'Create engaging social media posts for a small business',
      instructions: 'Create 3 unique posts with captions for Instagram/Facebook',
      category: 'content',
      employerId: '2',
      payoutPerTask: 25.00,
      totalTasksNeeded: 5,
      completedTasks: 1,
      approvedTasks: 1,
      rejectedTasks: 0,
      deadline: new Date('2024-12-25'),
      status: 'active',
      requiredProofType: 'image',
      qualityRequirements: {
        minApprovalRate: 85,
        workerLevel: 2
      },
      autoApproval: false,
      createdAt: new Date('2024-12-05')
    },
    {
      id: '3',
      title: 'Logo Design for Tech Startup',
      description: 'Design a modern, professional logo for a technology startup company',
      instructions: 'Create a logo that represents innovation and technology. Requirements:\n\n• Modern and clean design\n• Scalable vector format (SVG preferred)\n• Include both horizontal and vertical layouts\n• Provide color and monochrome versions\n• Logo should work on both light and dark backgrounds\n• Include a brief explanation of your design concept\n\nCompany Info:\n• Name: "TechFlow"\n• Industry: Software Development & AI Solutions\n• Target audience: Business professionals and developers\n• Style preference: Minimalist, tech-forward, trustworthy',
      category: 'design',
      employerId: '2',
      payoutPerTask: 75.00,
      totalTasksNeeded: 3,
      completedTasks: 0,
      approvedTasks: 0,
      rejectedTasks: 0,
      deadline: new Date('2024-12-30'),
      status: 'active',
      requiredProofType: 'image',
      qualityRequirements: {
        minApprovalRate: 90,
        workerLevel: 3
      },
      autoApproval: false,
      createdAt: new Date('2024-12-10')
    }
  ],
  submissions: [
    {
      id: '1',
      taskId: '1',
      workerId: '1',
      employerId: '2',
      proofData: {
        type: 'text',
        content: 'Detailed feedback about the website usability and design improvements needed.'
      },
      status: 'approved',
      payoutDetails: {
        amount: 15.00,
        platformFee: 0.75
      },
      review: {
        rating: 5,
        feedback: 'Excellent detailed feedback!'
      },
      submittedAt: new Date('2024-12-07'),
      reviewedAt: new Date('2024-12-08')
    }
  ],
  transactions: [
    {
      id: '1',
      userId: '1',
      type: 'task_payment',
      amount: 15.00,
      currency: 'USD',
      status: 'completed',
      relatedTaskId: '1',
      createdAt: new Date('2024-12-08')
    }
  ]
};

const connectDatabase = async () => {
  const mode = process.env.DATABASE_MODE || 'demo';
  
  try {
    switch (mode) {
      case 'mongodb':
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        break;
        
      case 'supabase':
        // Test Supabase connection
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
          console.error('Supabase connection error:', error.message);
          throw error;
        }
        console.log('Connected to Supabase successfully');
        break;
        
      case 'demo':
      default:
        console.log('Using demo mode with in-memory data');
        break;
    }
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const getDatabase = () => {
  const mode = process.env.DATABASE_MODE || 'demo';
  
  switch (mode) {
    case 'mongodb':
      return { type: 'mongodb', connection: mongoose.connection };
    case 'supabase':
      return { type: 'supabase', connection: supabase, service: require('../services/supabaseService') };
    case 'demo':
    default:
      return { type: 'demo', data: demoData };
  }
};

module.exports = {
  connectDatabase,
  getDatabase,
  demoData
};