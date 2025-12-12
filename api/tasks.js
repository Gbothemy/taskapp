// Serverless function for tasks
require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { body, validationResult, query } = require('express-validator');

// Import database configuration
const { connectDatabase, getDatabase } = require('../server/config/database');

const app = express();

// Initialize database connection
connectDatabase();

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

  jwt.verify(token, process.env.JWT_SECRET || 'taskapp_super_secret_jwt_key_2024_development', async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    // Get user from database
    const db = getDatabase();
    let user = null;
    
    if (db.type === 'demo') {
      user = db.data.users.find(u => u.id === decoded.userId);
    } else if (db.type === 'supabase') {
      user = await db.service.getUserById(decoded.userId);
    }
    
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  });
};

// Role middleware
const requireEmployer = (req, res, next) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Employer access required' });
  }
  next();
};

const requireWorker = (req, res, next) => {
  if (req.user.role !== 'worker') {
    return res.status(403).json({ message: 'Worker access required' });
  }
  next();
};

// Get all tasks with filters
app.get('/', [
  query('category').optional().isIn(['data-entry', 'content', 'review', 'research', 'testing', 'design', 'other']),
  query('minPayout').optional().isFloat({ min: 0 }),
  query('maxPayout').optional().isFloat({ min: 0 }),
  query('status').optional().isIn(['active', 'completed']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('search').optional().isLength({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      category,
      minPayout,
      maxPayout,
      status = 'active',
      page = 1,
      limit = 20,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const db = getDatabase();
    let tasks = [];

    if (db.type === 'demo') {
      tasks = db.data.tasks.filter(task => {
        if (status && task.status !== status) return false;
        if (category && task.category !== category) return false;
        if (minPayout && task.payoutPerTask < parseFloat(minPayout)) return false;
        if (maxPayout && task.payoutPerTask > parseFloat(maxPayout)) return false;
        if (search) {
          const searchLower = search.toLowerCase();
          return task.title.toLowerCase().includes(searchLower) ||
                 task.description.toLowerCase().includes(searchLower);
        }
        return true;
      });

      // Sort tasks
      tasks.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedTasks = tasks.slice(startIndex, endIndex);

      res.json({
        tasks: paginatedTasks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(tasks.length / limit),
          totalTasks: tasks.length,
          hasNext: endIndex < tasks.length,
          hasPrev: startIndex > 0
        }
      });
    } else if (db.type === 'supabase') {
      const result = await db.service.getTasks({
        category,
        minPayout,
        maxPayout,
        status,
        page,
        limit,
        search,
        sortBy,
        sortOrder
      });
      res.json(result);
    } else {
      res.json({ tasks: [], pagination: {} });
    }
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// Get single task
app.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    let task = null;
    if (db.type === 'demo') {
      task = db.data.tasks.find(t => t.id === id);
    } else if (db.type === 'supabase') {
      task = await db.service.getTaskById(id);
    }

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error fetching task' });
  }
});

// Create task (employers only)
app.post('/', authenticateToken, requireEmployer, [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').trim().isLength({ min: 1, max: 2000 }),
  body('instructions').trim().isLength({ min: 1, max: 5000 }),
  body('category').isIn(['data-entry', 'content', 'review', 'research', 'testing', 'design', 'other']),
  body('payoutPerTask').isFloat({ min: 0.01 }),
  body('totalTasksNeeded').isInt({ min: 1 }),
  body('deadline').isISO8601(),
  body('requiredProofType').isIn(['image', 'text', 'url', 'file'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      instructions,
      category,
      payoutPerTask,
      totalTasksNeeded,
      deadline,
      requiredProofType,
      qualityRequirements = {},
      autoApproval = { enabled: false }
    } = req.body;

    const db = getDatabase();
    let newTask = null;

    if (db.type === 'demo') {
      const taskId = String(db.data.tasks.length + 1);
      newTask = {
        id: taskId,
        title,
        description,
        instructions,
        category,
        employerId: req.user.id,
        payoutPerTask: parseFloat(payoutPerTask),
        totalTasksNeeded: parseInt(totalTasksNeeded),
        completedTasks: 0,
        approvedTasks: 0,
        rejectedTasks: 0,
        deadline: new Date(deadline),
        status: 'active',
        requiredProofType,
        qualityRequirements: {
          minApprovalRate: qualityRequirements.minApprovalRate || 80,
          workerLevel: qualityRequirements.workerLevel || 1
        },
        autoApproval,
        createdAt: new Date()
      };
      db.data.tasks.push(newTask);

      // Update employer stats
      const employer = db.data.users.find(u => u.id === req.user.id);
      if (employer && employer.employerStats) {
        employer.employerStats.tasksPosted += 1;
      }
    } else if (db.type === 'supabase') {
      newTask = await db.service.createTask({
        title,
        description,
        instructions,
        category,
        employer_id: req.user.id,
        payout_per_task: parseFloat(payoutPerTask),
        total_tasks_needed: parseInt(totalTasksNeeded),
        deadline: new Date(deadline).toISOString(),
        required_proof_type: requiredProofType,
        status: 'active'
      });
    }

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// Get my tasks (employer)
app.get('/my/tasks', authenticateToken, requireEmployer, async (req, res) => {
  try {
    const db = getDatabase();
    let tasks = [];

    if (db.type === 'demo') {
      tasks = db.data.tasks.filter(t => t.employerId === req.user.id);
    } else if (db.type === 'supabase') {
      tasks = await db.service.getTasksByEmployer(req.user.id);
    }

    res.json({ tasks });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// Get my submissions (worker)
app.get('/my/submissions', authenticateToken, requireWorker, async (req, res) => {
  try {
    const db = getDatabase();
    let submissions = [];

    if (db.type === 'demo') {
      submissions = db.data.submissions.filter(s => s.workerId === req.user.id);
      
      // Add task details to submissions
      submissions = submissions.map(submission => {
        const task = db.data.tasks.find(t => t.id === submission.taskId);
        return {
          ...submission,
          task: task ? { id: task.id, title: task.title, category: task.category } : null
        };
      });
    } else if (db.type === 'supabase') {
      submissions = await db.service.getSubmissionsByWorker(req.user.id);
    }

    res.json({ submissions });
  } catch (error) {
    console.error('Get my submissions error:', error);
    res.status(500).json({ message: 'Server error fetching submissions' });
  }
});

// Export for Vercel serverless
module.exports = app;