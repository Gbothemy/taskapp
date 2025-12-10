const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get wallet information
router.get('/wallet', authenticateToken, (req, res) => {
  try {
    const wallet = req.user.wallet || {
      balance: 0,
      pendingEarnings: 0,
      totalEarned: 0,
      totalSpent: 0
    };

    res.json({ wallet });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ message: 'Server error fetching wallet' });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const db = getDatabase();
    let transactions = [];

    if (db.type === 'demo') {
      transactions = db.data.transactions.filter(t => t.userId === req.user.id);
      
      if (type) {
        transactions = transactions.filter(t => t.type === type);
      }

      // Sort by date (newest first)
      transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedTransactions = transactions.slice(startIndex, endIndex);

      res.json({
        transactions: paginatedTransactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(transactions.length / limit),
          totalTransactions: transactions.length,
          hasNext: endIndex < transactions.length,
          hasPrev: startIndex > 0
        }
      });
    } else {
      res.json({ transactions: [], pagination: {} });
    }
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error fetching transactions' });
  }
});

// Request withdrawal
router.post('/withdraw', authenticateToken, [
  body('amount').isFloat({ min: 0.01 }),
  body('method').isIn(['paypal', 'bank_transfer', 'crypto']),
  body('details').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, method, details } = req.body;
    const db = getDatabase();
    const minWithdrawal = parseFloat(process.env.MIN_WITHDRAWAL_AMOUNT) || 10;

    if (amount < minWithdrawal) {
      return res.status(400).json({ 
        message: `Minimum withdrawal amount is $${minWithdrawal}` 
      });
    }

    if (req.user.wallet.balance < amount) {
      return res.status(400).json({ 
        message: 'Insufficient balance' 
      });
    }

    if (db.type === 'demo') {
      // Create withdrawal transaction
      const transactionId = String(db.data.transactions.length + 1);
      const newTransaction = {
        id: transactionId,
        userId: req.user.id,
        type: 'withdrawal',
        amount: -amount, // Negative for withdrawal
        currency: 'USD',
        status: 'pending',
        paymentMethod: method,
        description: `Withdrawal via ${method}`,
        metadata: details,
        createdAt: new Date()
      };
      db.data.transactions.push(newTransaction);

      // Update user wallet
      const user = db.data.users.find(u => u.id === req.user.id);
      if (user) {
        user.wallet.balance -= amount;
      }

      res.json({
        message: 'Withdrawal request submitted successfully',
        transaction: newTransaction
      });
    } else {
      res.status(501).json({ message: 'Not implemented for this database mode' });
    }
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ message: 'Server error processing withdrawal' });
  }
});

// Deposit funds (for demo/testing)
router.post('/deposit', authenticateToken, [
  body('amount').isFloat({ min: 0.01 }),
  body('method').isIn(['stripe', 'paypal', 'demo'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, method } = req.body;
    const db = getDatabase();

    if (db.type === 'demo') {
      // Create deposit transaction
      const transactionId = String(db.data.transactions.length + 1);
      const newTransaction = {
        id: transactionId,
        userId: req.user.id,
        type: 'deposit',
        amount: amount,
        currency: 'USD',
        status: 'completed',
        paymentMethod: method,
        description: `Deposit via ${method}`,
        createdAt: new Date()
      };
      db.data.transactions.push(newTransaction);

      // Update user wallet
      const user = db.data.users.find(u => u.id === req.user.id);
      if (user) {
        user.wallet.balance += amount;
      }

      res.json({
        message: 'Deposit completed successfully',
        transaction: newTransaction
      });
    } else {
      res.status(501).json({ message: 'Not implemented for this database mode' });
    }
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ message: 'Server error processing deposit' });
  }
});

// Process task payment (internal use)
router.post('/process-task-payment', authenticateToken, async (req, res) => {
  try {
    const { submissionId, approved } = req.body;
    const db = getDatabase();

    if (db.type === 'demo') {
      const submission = db.data.submissions.find(s => s.id === submissionId);
      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }

      if (submission.status !== 'pending') {
        return res.status(400).json({ message: 'Submission already processed' });
      }

      // Update submission status
      submission.status = approved ? 'approved' : 'rejected';
      submission.reviewedAt = new Date();

      if (approved) {
        // Create payment transaction for worker
        const workerTransactionId = String(db.data.transactions.length + 1);
        const workerTransaction = {
          id: workerTransactionId,
          userId: submission.workerId,
          type: 'task_payment',
          amount: submission.payoutDetails.workerEarning,
          currency: 'USD',
          status: 'completed',
          relatedTaskId: submission.taskId,
          relatedSubmissionId: submissionId,
          description: 'Task completion payment',
          createdAt: new Date()
        };
        db.data.transactions.push(workerTransaction);

        // Update worker wallet
        const worker = db.data.users.find(u => u.id === submission.workerId);
        if (worker) {
          worker.wallet.balance += submission.payoutDetails.workerEarning;
          worker.wallet.totalEarned += submission.payoutDetails.workerEarning;
          if (worker.workerStats) {
            worker.workerStats.tasksCompleted += 1;
          }
        }

        // Create platform fee transaction
        const feeTransactionId = String(db.data.transactions.length + 1);
        const feeTransaction = {
          id: feeTransactionId,
          userId: submission.employerId,
          type: 'platform_fee',
          amount: -submission.payoutDetails.platformFee,
          currency: 'USD',
          status: 'completed',
          relatedTaskId: submission.taskId,
          relatedSubmissionId: submissionId,
          description: 'Platform fee',
          createdAt: new Date()
        };
        db.data.transactions.push(feeTransaction);

        // Update task stats
        const task = db.data.tasks.find(t => t.id === submission.taskId);
        if (task) {
          task.approvedTasks += 1;
        }

        // Emit real-time notification to worker
        const io = req.app.get('io');
        io.to(`user_${submission.workerId}`).emit('task_approved', {
          submission,
          task: { id: task.id, title: task.title },
          earnings: submission.payoutDetails.workerEarning
        });
      } else {
        // Update task stats for rejection
        const task = db.data.tasks.find(t => t.id === submission.taskId);
        if (task) {
          task.rejectedTasks += 1;
          task.completedTasks -= 1; // Reduce completed count
        }

        // Emit real-time notification to worker
        const io = req.app.get('io');
        io.to(`user_${submission.workerId}`).emit('task_rejected', {
          submission,
          task: { id: task.id, title: task.title }
        });
      }

      res.json({
        message: `Task ${approved ? 'approved' : 'rejected'} successfully`,
        submission
      });
    } else {
      res.status(501).json({ message: 'Not implemented for this database mode' });
    }
  } catch (error) {
    console.error('Process task payment error:', error);
    res.status(500).json({ message: 'Server error processing payment' });
  }
});

module.exports = router;