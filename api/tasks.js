// Serverless function for tasks
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://xwvpkvzotdaugkywdnme.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3dnBrdnpvdGRhdWdreXdkbm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjA2MDEsImV4cCI6MjA4MDEzNjYwMX0.GsdrOYy56nYs2UPAyPqfahzLJ3b37om3mABWV2SdXzs';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://taskapp-gbothemy.vercel.app', 
      'https://taskapp.vercel.app', 
      'https://taskappv1.vercel.app',
      /^https:\/\/taskapp.*\.vercel\.app$/
    ];
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    callback(null, isAllowed || true);
  },
  credentials: true
}));

app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'taskapp_super_secret_jwt_key_2024_development', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get all tasks
app.get('/', async (req, res) => {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        *,
        users!tasks_employer_id_fkey(first_name, last_name, email)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Tasks fetch error:', error);
      return res.status(500).json({ message: 'Failed to fetch tasks' });
    }

    res.json({ tasks: tasks || [] });
  } catch (error) {
    console.error('Tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task by ID
app.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        users!tasks_employer_id_fkey(first_name, last_name, email)
      `)
      .eq('id', id)
      .single();

    if (error || !task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Task fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task (requires auth)
app.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, instructions, category, payoutPerTask, totalTasksNeeded, deadline, requiredProofType } = req.body;

    if (!title || !description || !instructions || !category || !payoutPerTask || !totalTasksNeeded || !deadline || !requiredProofType) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert([{
        title,
        description,
        instructions,
        category,
        employer_id: req.user.userId,
        payout_per_task: payoutPerTask,
        total_tasks_needed: totalTasksNeeded,
        deadline: new Date(deadline).toISOString(),
        required_proof_type: requiredProofType,
        status: 'active'
      }])
      .select()
      .single();

    if (error) {
      console.error('Task creation error:', error);
      return res.status(500).json({ message: 'Failed to create task' });
    }

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Task creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = (req, res) => {
  return app(req, res);
};