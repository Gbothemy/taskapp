import { supabase } from './supabase';

export const adminService = {
  // ============================================================================
  // 📊 DASHBOARD ANALYTICS
  // ============================================================================
  async getDashboardStats() {
    try {
      const [
        usersResult,
        tasksResult,
        transactionsResult,
        submissionsResult
      ] = await Promise.all([
        // Total users and new users today
        supabase
          .from('users')
          .select('id, created_at, status')
          .order('created_at', { ascending: false }),
        
        // Active tasks
        supabase
          .from('tasks')
          .select('id, status, reward_amount')
          .eq('status', 'active'),
        
        // Pending payments
        supabase
          .from('transactions')
          .select('id, amount, status, type')
          .eq('status', 'pending'),
        
        // Recent submissions
        supabase
          .from('task_submissions')
          .select('id, status, submitted_at')
          .order('submitted_at', { ascending: false })
          .limit(100)
      ]);

      const users = usersResult.data || [];
      const tasks = tasksResult.data || [];
      const transactions = transactionsResult.data || [];
      const submissions = submissionsResult.data || [];

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const newUsersToday = users.filter(user => 
        new Date(user.created_at) >= today
      ).length;

      const totalRevenue = transactions
        .filter(t => t.type === 'payment' && t.status === 'completed')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const completedTasksToday = submissions.filter(sub => 
        sub.status === 'approved' && new Date(sub.submitted_at) >= today
      ).length;

      return {
        totalUsers: users.length,
        activeTasks: tasks.length,
        pendingPayments: transactions.filter(t => t.type === 'withdrawal').length,
        totalRevenue,
        newUsersToday,
        completedTasksToday,
        flaggedContent: 0, // Would need a separate flagged_content table
        systemHealth: 98.5 // Would calculate from system metrics
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalUsers: 0,
        activeTasks: 0,
        pendingPayments: 0,
        totalRevenue: 0,
        newUsersToday: 0,
        completedTasksToday: 0,
        flaggedContent: 0,
        systemHealth: 0
      };
    }
  },

  async getRecentActivity(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          title,
          message,
          type,
          created_at,
          users!notifications_user_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(activity => ({
        id: activity.id,
        type: activity.type,
        user: activity.users?.full_name || 'Unknown User',
        description: activity.message,
        time: this.formatTimeAgo(activity.created_at),
        status: 'success'
      }));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  },

  // ============================================================================
  // 👥 USER MANAGEMENT
  // ============================================================================
  async getAllUsers(filters = {}) {
    try {
      let query = supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          user_type,
          status,
          created_at,
          last_active,
          tasks_completed,
          tasks_created,
          total_earnings,
          rating
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.role && filters.role !== 'all') {
        query = query.eq('user_type', filters.role);
      }
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(user => ({
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.user_type,
        status: user.status,
        joinDate: user.created_at,
        tasksCompleted: user.tasks_completed || 0,
        tasksPosted: user.tasks_created || 0,
        earnings: user.total_earnings || 0,
        totalSpent: 0, // Would need to calculate from transactions
        lastActive: this.formatTimeAgo(user.last_active),
        rating: user.rating || 0
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async updateUserStatus(userId, status) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // ============================================================================
  // 📋 TASK MANAGEMENT
  // ============================================================================
  async getAllTasks(filters = {}) {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          category_id,
          status,
          priority,
          reward_amount,
          created_at,
          deadline,
          users!tasks_employer_id_fkey(full_name, company),
          categories(name),
          task_submissions(id, status)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(task => {
        const submissions = task.task_submissions || [];
        const flaggedSubmissions = submissions.filter(s => s.status === 'rejected').length;

        return {
          id: task.id,
          title: task.title,
          employer: task.users?.company || task.users?.full_name || 'Unknown',
          category: task.categories?.name || 'Uncategorized',
          status: task.status,
          priority: task.priority || 'medium',
          budget: task.reward_amount,
          submissions: submissions.length,
          flagged: flaggedSubmissions,
          createdDate: task.created_at,
          deadline: task.deadline
        };
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
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
  // 💳 PAYMENT MANAGEMENT
  // ============================================================================
  async getAllPayments(filters = {}) {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          id,
          amount,
          type,
          status,
          description,
          payment_method,
          created_at,
          processed_at,
          users!transactions_user_id_fkey(full_name, user_type)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        query = query.or(`description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(payment => ({
        id: payment.id,
        type: payment.type,
        user: payment.users?.full_name || 'Unknown User',
        userType: payment.users?.user_type || 'unknown',
        amount: payment.amount,
        status: payment.status,
        method: payment.payment_method || 'Unknown',
        requestDate: payment.created_at,
        processedDate: payment.processed_at,
        reference: `${payment.type.toUpperCase()}-${payment.id.slice(0, 8)}`
      }));
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  },

  async updatePaymentStatus(paymentId, status) {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'processing' || status === 'completed') {
        updateData.processed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;

      // If completing a withdrawal, update user wallet balance
      if (status === 'completed' && data.type === 'withdrawal') {
        await supabase.rpc('update_wallet_balance', {
          user_id: data.user_id,
          amount_change: data.amount
        });
      }

      return data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // ============================================================================
  // 📊 ANALYTICS & REPORTS
  // ============================================================================
  async getAnalytics(period = '30d') {
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

      const [usersGrowth, taskStats, revenueStats] = await Promise.all([
        this.getUserGrowthStats(startDate, endDate),
        this.getTaskStats(startDate, endDate),
        this.getRevenueStats(startDate, endDate)
      ]);

      return {
        usersGrowth,
        taskStats,
        revenueStats,
        period
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  },

  async getUserGrowthStats(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('created_at, user_type')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      const dailyGrowth = {};
      (data || []).forEach(user => {
        const date = new Date(user.created_at).toDateString();
        if (!dailyGrowth[date]) {
          dailyGrowth[date] = { workers: 0, employers: 0, total: 0 };
        }
        dailyGrowth[date][user.user_type === 'worker' ? 'workers' : 'employers']++;
        dailyGrowth[date].total++;
      });

      return dailyGrowth;
    } catch (error) {
      console.error('Error fetching user growth stats:', error);
      return {};
    }
  },

  async getTaskStats(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('created_at, status, reward_amount')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      const stats = {
        totalTasks: data?.length || 0,
        completedTasks: data?.filter(t => t.status === 'completed').length || 0,
        activeTasks: data?.filter(t => t.status === 'active').length || 0,
        totalValue: data?.reduce((sum, t) => sum + parseFloat(t.reward_amount), 0) || 0
      };

      return stats;
    } catch (error) {
      console.error('Error fetching task stats:', error);
      return {};
    }
  },

  async getRevenueStats(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('created_at, amount, type, status')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('status', 'completed');

      if (error) throw error;

      const revenue = data?.filter(t => t.type === 'payment').reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
      const payouts = data?.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0) || 0;

      return {
        totalRevenue: revenue,
        totalPayouts: payouts,
        netRevenue: revenue - payouts,
        transactionCount: data?.length || 0
      };
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      return {};
    }
  },

  // ============================================================================
  // 🛠️ UTILITY FUNCTIONS
  // ============================================================================
  formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  },

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
};

export default adminService;