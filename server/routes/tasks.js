const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { getDatabase } = require('../config/database');
const { authenticateToken, requireEmployer, requireWorker } = require('../middleware/auth');

const router = express.Router();

// Get all tasks with filters
router.get('/', [
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
    } else {
      // MongoDB/Supabase implementation would go here
      res.json({ tasks: [], pagination: {} });
    }
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    let task = null;
    if (db.type === 'demo') {
      task = db.data.tasks.find(t => t.id === id);
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
router.post('/', authenticateToken, requireEmployer, [
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
    }

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('new_task', {
      task: newTask,
      message: `New ${category} task available: ${title}`
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// Submit task (workers only)
router.post('/:id/submit', authenticateToken, requireWorker, [
  body('proofData.type').isIn(['image', 'text', 'url', 'file']),
  body('proofData.content').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id: taskId } = req.params;
    const { proofData } = req.body;
    const db = getDatabase();

    // Find task
    let task = null;
    if (db.type === 'demo') {
      task = db.data.tasks.find(t => t.id === taskId);
    }

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.status !== 'active') {
      return res.status(400).json({ message: 'Task is not active' });
    }

    if (task.completedTasks >= task.totalTasksNeeded) {
      return res.status(400).json({ message: 'Task is already completed' });
    }

    // Check if worker already submitted
    if (db.type === 'demo') {
      const existingSubmission = db.data.submissions.find(
        s => s.taskId === taskId && s.workerId === req.user.id
      );
      if (existingSubmission) {
        return res.status(400).json({ message: 'You have already submitted this task' });
      }
    }

    // Calculate payout
    const platformFeePercentage = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE) || 5;
    const platformFee = (task.payoutPerTask * platformFeePercentage) / 100;
    const workerEarning = task.payoutPerTask - platformFee;

    // Create submission
    let newSubmission = null;
    if (db.type === 'demo') {
      const submissionId = String(db.data.submissions.length + 1);
      newSubmission = {
        id: submissionId,
        taskId,
        workerId: req.user.id,
        employerId: task.employerId,
        proofData,
        status: 'pending',
        payoutDetails: {
          amount: task.payoutPerTask,
          platformFee,
          workerEarning
        },
        submittedAt: new Date()
      };
      db.data.submissions.push(newSubmission);

      // Update task completed count
      task.completedTasks += 1;
    }

    // Emit real-time notification to employer
    const io = req.app.get('io');
    io.to(`user_${task.employerId}`).emit('new_submission', {
      submission: newSubmission,
      task: { id: taskId, title: task.title },
      worker: { id: req.user.id, firstName: req.user.firstName, lastName: req.user.lastName }
    });

    res.status(201).json({
      message: 'Task submitted successfully',
      submission: newSubmission
    });
  } catch (error) {
    console.error('Submit task error:', error);
    res.status(500).json({ message: 'Server error submitting task' });
  }
});

// Get my tasks (employer)
router.get('/my/tasks', authenticateToken, requireEmployer, async (req, res) => {
  try {
    const db = getDatabase();
    let tasks = [];

    if (db.type === 'demo') {
      tasks = db.data.tasks.filter(t => t.employerId === req.user.id);
    }

    res.json({ tasks });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// Get my submissions (worker)
router.get('/my/submissions', authenticateToken, requireWorker, async (req, res) => {
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
    }

    res.json({ submissions });
  } catch (error) {
    console.error('Get my submissions error:', error);
    res.status(500).json({ message: 'Server error fetching submissions' });
  }
});

module.exports = router;