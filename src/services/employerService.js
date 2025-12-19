import { supabase } from './supabase';

export const employerService = {
  // ============================================================================
  // 📊 EMPLOYER DASHBOARD
  // ============================================================================
  async getDashboardStats(employerId) {
    try {
      console.log('Fetching dashboard stats for employer:', employerId);
      
      const [
        tasksResult,
        submissionsResult,
        transactionsResult,
        workersResult
      ] = await Promise.all([
        // Get employer's tasks
        supabase
          .from('tasks')
          .select('id, status, reward_amount, created_at')
          .eq('employer_id', employerId),
        
        // Get submissions for employer's tasks
        supabase
          .from('task_submissions')
          .select(`
            id, 
            status, 
            submitted_at,
            tasks!inner(employer_id)
          `)
          .eq('tasks.employer_id', employerId),
        
        // Get employer's transactions
        supabase
          .from('transactions')
          .select('id, amount, type, status, created_at')
          .eq('user_id', employerId),
        
        // Get unique workers who worked on employer's tasks
        supabase
          .from('task_submissions')
          .select(`
            worker_id,
            tasks!inner(employer_id)
          `)
          .eq('tasks.employer_id', employerId)
      ]);

      // Check for errors in any of the queries
      if (tasksResult.error) {
        console.error('Tasks query error:', tasksResult.error);
        throw new Error('Failed to fetch tasks: ' + tasksResult.error.message);
      }
      if (submissionsResult.error) {
        console.error('Submissions query error:', submissionsResult.error);
        throw new Error('Failed to fetch submissions: ' + submissionsResult.error.message);
      }
      if (transactionsResult.error) {
        console.error('Transactions query error:', transactionsResult.error);
        throw new Error('Failed to fetch transactions: ' + transactionsResult.error.message);
      }
      if (workersResult.error) {
        console.error('Workers query error:', workersResult.error);
        throw new Error('Failed to fetch workers: ' + workersResult.error.message);
      }

      const tasks = tasksResult.data || [];
      const submissions = submissionsResult.data || [];
      const transactions = transactionsResult.data || [];
      const workers = workersResult.data || [];

      // Calculate stats
      const activeTasks = tasks.filter(t => t.status === 'active').length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const pendingReviews = submissions.filter(s => s.status === 'pending').length;
      
      const totalSpent = transactions
        .filter(t => t.type === 'payment' && t.status === 'completed')
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);

      const uniqueWorkers = new Set(workers.map(w => w.worker_id)).size;

      // Calculate average completion time
      const completedSubmissions = submissions.filter(s => s.status === 'approved');
      const avgCompletionTime = completedSubmissions.length > 0 
        ? this.calculateAverageCompletionTime(completedSubmissions)
        : '0 days';

      return {
        activeTasks,
        pendingReviews,
        completedTasks,
        totalSpent,
        activeWorkers: uniqueWorkers,
        avgCompletionTime
      };
    } catch (error) {
      console.error('Error fetching employer dashboard stats:', error);
      return {
        activeTasks: 0,
        pendingReviews: 0,
        completedTasks: 0,
        totalSpent: 0,
        activeWorkers: 0,
        avgCompletionTime: '0 days'
      };
    }
  },

  async getRecentTasks(employerId, limit = 10) {
    try {
      console.log('Fetching recent tasks for employer:', employerId, 'limit:', limit);
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          status,
          reward_amount,
          created_at,
          task_submissions(id, status)
        `)
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Recent tasks query error:', error);
        throw new Error('Failed to fetch recent tasks: ' + error.message);
      }

      console.log('Recent tasks data:', data);

      return (data || []).map(task => {
        const submissions = task.task_submissions || [];
        const pending = submissions.filter(s => s.status === 'pending').length;

        return {
          id: task.id,
          title: task.title,
          submissions: submissions.length,
          pending,
          status: task.status,
          budget: task.reward_amount
        };
      });
    } catch (error) {
      console.error('Error fetching recent tasks:', error);
      return [];
    }
  },

  // ============================================================================
  // 📋 TASK MANAGEMENT
  // ============================================================================
  async getEmployerTasks(employerId, filters = {}) {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          status,
          reward_amount,
          deadline,
          created_at,
          categories(name),
          task_submissions(
            id, 
            status, 
            submitted_at,
            users!task_submissions_worker_id_fkey(full_name, avatar_url)
          )
        `)
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.category && filters.category !== 'all') {
        query = query.eq('categories.name', filters.category);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(task => {
        const submissions = task.task_submissions || [];
        const approved = submissions.filter(s => s.status === 'approved').length;
        const rejected = submissions.filter(s => s.status === 'rejected').length;
        const pending = submissions.filter(s => s.status === 'pending').length;
        
        // Calculate completion rate
        const totalSubmissions = submissions.length;
        const completionRate = totalSubmissions > 0 
          ? Math.round((approved / totalSubmissions) * 100)
          : 0;

        // Get unique workers
        const uniqueWorkers = new Set(submissions.map(s => s.users?.full_name)).size;

        return {
          id: task.id,
          title: task.title,
          description: task.description,
          category: task.categories?.name || 'Uncategorized',
          status: task.status,
          budget: task.reward_amount,
          submissions: totalSubmissions,
          approved,
          rejected,
          pending,
          workers: uniqueWorkers,
          createdDate: task.created_at,
          deadline: task.deadline,
          completionRate
        };
      });
    } catch (error) {
      console.error('Error fetching employer tasks:', error);
      return [];
    }
  },

  async updateTaskStatus(taskId, status) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  },

  async deleteTask(taskId) {
    try {
      // Check if task has submissions
      const { data: submissions } = await supabase
        .from('task_submissions')
        .select('id')
        .eq('task_id', taskId);

      if (submissions && submissions.length > 0) {
        throw new Error('Cannot delete task with existing submissions');
      }

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // ============================================================================
  // 📝 SUBMISSION MANAGEMENT
  // ============================================================================
  async getTaskSubmissions(employerId, filters = {}) {
    try {
      let query = supabase
        .from('task_submissions')
        .select(`
          id,
          submission_text,
          submission_files,
          status,
          rating,
          feedback,
          submitted_at,
          reviewed_at,
          tasks!inner(
            id,
            title,
            reward_amount,
            employer_id
          ),
          users!task_submissions_worker_id_fkey(
            id,
            full_name,
            avatar_url,
            rating
          )
        `)
        .eq('tasks.employer_id', employerId)
        .order('submitted_at', { ascending: false });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.taskId) {
        query = query.eq('task_id', filters.taskId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(submission => ({
        id: submission.id,
        taskId: submission.tasks.id,
        taskTitle: submission.tasks.title,
        workerName: submission.users.full_name,
        workerAvatar: submission.users.avatar_url,
        workerRating: submission.users.rating,
        submissionText: submission.submission_text,
        submissionFiles: submission.submission_files || [],
        status: submission.status,
        rating: submission.rating,
        feedback: submission.feedback,
        submittedAt: submission.submitted_at,
        reviewedAt: submission.reviewed_at,
        rewardAmount: submission.tasks.reward_amount
      }));
    } catch (error) {
      console.error('Error fetching task submissions:', error);
      return [];
    }
  },

  async reviewSubmission(submissionId, status, feedback = null, rating = null) {
    try {
      const updateData = {
        status,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (feedback) updateData.feedback = feedback;
      if (rating) updateData.rating = rating;

      const { data, error } = await supabase
        .from('task_submissions')
        .update(updateData)
        .eq('id', submissionId)
        .select(`
          *,
          tasks(id, reward_amount, employer_id, title),
          users!task_submissions_worker_id_fkey(id, full_name)
        `)
        .single();

      if (error) throw error;

      // If approved, handle payment and notifications
      if (status === 'approved') {
        await this.handleApprovedSubmission(data);
      }

      return data;
    } catch (error) {
      console.error('Error reviewing submission:', error);
      throw error;
    }
  },

  async handleApprovedSubmission(submission) {
    try {
      const { task_id, worker_id } = submission;
      const { reward_amount, employer_id, title } = submission.tasks;

      // Update task status to completed
      await supabase
        .from('tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', task_id);

      // Create earning transaction for worker
      await supabase
        .from('transactions')
        .insert([{
          user_id: worker_id,
          amount: reward_amount,
          type: 'earning',
          status: 'completed',
          description: `Payment for completing task: ${title}`,
          reference_id: task_id,
          reference_type: 'task'
        }]);

      // Create payment transaction for employer
      await supabase
        .from('transactions')
        .insert([{
          user_id: employer_id,
          amount: -reward_amount,
          type: 'payment',
          status: 'completed',
          description: `Payment for task completion: ${title}`,
          reference_id: task_id,
          reference_type: 'task'
        }]);

      // Update user balances using stored procedure
      await supabase.rpc('update_wallet_balance', {
        user_id: worker_id,
        amount_change: reward_amount
      });

      // Update user stats
      await this.updateUserStats(worker_id, employer_id, reward_amount);

      // Create notifications
      await this.createNotifications(submission);

    } catch (error) {
      console.error('Error handling approved submission:', error);
    }
  },

  async updateUserStats(workerId, employerId, amount) {
    try {
      // Update worker stats
      await supabase
        .from('users')
        .update({
          tasks_completed: supabase.raw('tasks_completed + 1'),
          total_earnings: supabase.raw(`total_earnings + ${amount}`),
          updated_at: new Date().toISOString()
        })
        .eq('id', workerId);

      // Update employer stats
      await supabase
        .from('users')
        .update({
          tasks_created: supabase.raw('tasks_created + 1'),
          updated_at: new Date().toISOString()
        })
        .eq('id', employerId);
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  },

  async createNotifications(submission) {
    try {
      const { worker_id, tasks } = submission;
      const { title, employer_id } = tasks;

      // Notify worker
      await supabase
        .from('notifications')
        .insert([{
          user_id: worker_id,
          title: 'Submission Approved!',
          message: `Your submission for "${title}" has been approved and payment is being processed.`,
          type: 'success',
          reference_id: submission.id,
          reference_type: 'submission'
        }]);

      // Notify employer
      await supabase
        .from('notifications')
        .insert([{
          user_id: employer_id,
          title: 'Task Completed',
          message: `Task "${title}" has been completed successfully.`,
          type: 'success',
          reference_id: submission.task_id,
          reference_type: 'task'
        }]);
    } catch (error) {
      console.error('Error creating notifications:', error);
    }
  },

  // ============================================================================
  // 📊 ANALYTICS
  // ============================================================================
  async getEmployerAnalytics(employerId, period = '30d') {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      const [taskStats, spendingStats, workerStats] = await Promise.all([
        this.getTaskAnalytics(employerId, startDate, endDate),
        this.getSpendingAnalytics(employerId, startDate, endDate),
        this.getWorkerAnalytics(employerId, startDate, endDate)
      ]);

      return {
        taskStats,
        spendingStats,
        workerStats,
        period
      };
    } catch (error) {
      console.error('Error fetching employer analytics:', error);
      return null;
    }
  },

  async getTaskAnalytics(employerId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('created_at, status, reward_amount')
        .eq('employer_id', employerId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      return {
        totalTasks: data?.length || 0,
        completedTasks: data?.filter(t => t.status === 'completed').length || 0,
        activeTasks: data?.filter(t => t.status === 'active').length || 0,
        totalBudget: data?.reduce((sum, t) => sum + parseFloat(t.reward_amount), 0) || 0
      };
    } catch (error) {
      console.error('Error fetching task analytics:', error);
      return {};
    }
  },

  async getSpendingAnalytics(employerId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('created_at, amount, type')
        .eq('user_id', employerId)
        .eq('type', 'payment')
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      const totalSpent = data?.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0) || 0;
      const averagePerTask = data?.length > 0 ? totalSpent / data.length : 0;

      return {
        totalSpent,
        transactionCount: data?.length || 0,
        averagePerTask
      };
    } catch (error) {
      console.error('Error fetching spending analytics:', error);
      return {};
    }
  },

  async getWorkerAnalytics(employerId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('task_submissions')
        .select(`
          worker_id,
          status,
          submitted_at,
          tasks!inner(employer_id)
        `)
        .eq('tasks.employer_id', employerId)
        .gte('submitted_at', startDate.toISOString())
        .lte('submitted_at', endDate.toISOString());

      if (error) throw error;

      const uniqueWorkers = new Set(data?.map(s => s.worker_id)).size;
      const totalSubmissions = data?.length || 0;
      const approvedSubmissions = data?.filter(s => s.status === 'approved').length || 0;
      const approvalRate = totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions) * 100 : 0;

      return {
        uniqueWorkers,
        totalSubmissions,
        approvedSubmissions,
        approvalRate
      };
    } catch (error) {
      console.error('Error fetching worker analytics:', error);
      return {};
    }
  },

  // ============================================================================
  // 🛠️ UTILITY FUNCTIONS
  // ============================================================================
  calculateAverageCompletionTime(submissions) {
    if (submissions.length === 0) return '0 days';

    const totalDays = submissions.reduce((sum, submission) => {
      const submitted = new Date(submission.submitted_at);
      const reviewed = new Date(submission.reviewed_at || submission.submitted_at);
      const diffDays = Math.ceil((reviewed - submitted) / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);

    const avgDays = Math.round(totalDays / submissions.length);
    return `${avgDays} day${avgDays !== 1 ? 's' : ''}`;
  },

  formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  }
};

export default employerService;