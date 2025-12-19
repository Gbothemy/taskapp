import { supabase } from './supabase';

export const adminService = {
  // ============================================================================
  // 📊 DASHBOARD ANALYTICS
  // ============================================================================
  async getDashboardStats() {
    try {
      console.log('AdminService: Starting getDashboardStats...');
      
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

      console.log('AdminService: Query results:', {
        users: usersResult,
        tasks: tasksResult,
        transactions: transactionsResult,
        submissions: submissionsResult
      });

      // Check for errors in any of the queries
      if (usersResult.error) {
        console.error('Users query error:', usersResult.error);
        throw new Error(`Users query failed: ${usersResult.error.message}`);
      }
      if (tasksResult.error) {
        console.error('Tasks query error:', tasksResult.error);
        throw new Error(`Tasks query failed: ${tasksResult.error.message}`);
      }
      if (transactionsResult.error) {
        console.error('Transactions query error:', transactionsResult.error);
        throw new Error(`Transactions query failed: ${transactionsResult.error.message}`);
      }
      if (submissionsResult.error) {
        console.error('Submissions query error:', submissionsResult.error);
        throw new Error(`Submissions query failed: ${submissionsResult.error.message}`);
      }

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

      const stats = {
        totalUsers: users.length,
        activeTasks: tasks.length,
        pendingPayments: transactions.filter(t => t.type === 'withdrawal').length,
        totalRevenue,
        newUsersToday,
        completedTasksToday,
        flaggedContent: 0, // Would need a separate flagged_content table
        systemHealth: 98.5 // Would calculate from system metrics
      };

      console.log('AdminService: Calculated stats:', stats);
      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // Check if it's a table missing error and return mock data
      if (error.message.includes('does not exist') || error.code === '42P01') {
        console.log('Some tables missing, returning mock data');
        return {
          totalUsers: 25,
          activeTasks: 12,
          pendingPayments: 3,
          totalRevenue: 1250.00,
          newUsersToday: 2,
          completedTasksToday: 8,
          flaggedContent: 1,
          systemHealth: 98.5
        };
      }
      
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
      console.log('AdminService: Fetching recent activity...');
      
      // First check if notifications table exists
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

      if (error) {
        console.error('Recent activity query error:', error);
        // If notifications table doesn't exist, return mock data
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.log('Notifications table does not exist, returning mock data');
          return this.getMockRecentActivity();
        }
        throw error;
      }

      console.log('Recent activity data:', data);

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
      // Return mock data as fallback
      return this.getMockRecentActivity();
    }
  },

  getMockRecentActivity() {
    return [
      {
        id: '1',
        type: 'user_registered',
        user: 'John Doe',
        description: 'New user registered',
        time: '2 minutes ago',
        status: 'success'
      },
      {
        id: '2',
        type: 'task_completed',
        user: 'Jane Smith',
        description: 'Task completed successfully',
        time: '15 minutes ago',
        status: 'success'
      },
      {
        id: '3',
        type: 'payment_processed',
        user: 'Mike Johnson',
        description: 'Payment processed',
        time: '1 hour ago',
        status: 'success'
      }
    ];
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
  // 📊 ACTIVITY LOGS & AUDIT TRAIL
  // ============================================================================
  async getActivityLogs(filters = {}) {
    try {
      let query = supabase
        .from('activity_logs')
        .select(`
          id,
          action,
          description,
          category,
          severity,
          success,
          created_at,
          users(full_name, email),
          metadata
        `)
        .order('created_at', { ascending: false })
        .limit(filters.limit || 100);

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.severity && filters.severity !== 'all') {
        query = query.eq('severity', filters.severity);
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(log => ({
        id: log.id,
        action: log.action,
        description: log.description,
        category: log.category,
        severity: log.severity,
        success: log.success,
        user: log.users?.full_name || 'System',
        userEmail: log.users?.email,
        timestamp: log.created_at,
        timeAgo: this.formatTimeAgo(log.created_at),
        metadata: log.metadata
      }));
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }
  },

  async getAdminActions(filters = {}) {
    try {
      let query = supabase
        .from('admin_actions')
        .select(`
          id,
          action,
          description,
          target_type,
          target_identifier,
          old_values,
          new_values,
          reason,
          performed_at,
          users!admin_actions_admin_id_fkey(full_name, email)
        `)
        .order('performed_at', { ascending: false })
        .limit(filters.limit || 50);

      if (filters.adminId) {
        query = query.eq('admin_id', filters.adminId);
      }
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.targetType) {
        query = query.eq('target_type', filters.targetType);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(action => ({
        id: action.id,
        action: action.action,
        description: action.description,
        admin: action.users?.full_name || 'Unknown Admin',
        adminEmail: action.users?.email,
        targetType: action.target_type,
        targetIdentifier: action.target_identifier,
        oldValues: action.old_values,
        newValues: action.new_values,
        reason: action.reason,
        timestamp: action.performed_at,
        timeAgo: this.formatTimeAgo(action.performed_at)
      }));
    } catch (error) {
      console.error('Error fetching admin actions:', error);
      return [];
    }
  },

  async logAdminAction(adminId, adminEmail, action, description, options = {}) {
    try {
      const { data, error } = await supabase
        .from('admin_actions')
        .insert({
          admin_id: adminId,
          admin_email: adminEmail,
          action,
          description,
          target_type: options.targetType,
          target_id: options.targetId,
          target_identifier: options.targetIdentifier,
          old_values: options.oldValues,
          new_values: options.newValues,
          reason: options.reason
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging admin action:', error);
      throw error;
    }
  },

  // ============================================================================
  // 📈 ADVANCED ANALYTICS & REPORTING
  // ============================================================================
  async getAdvancedAnalytics(period = '30d') {
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

      const [
        userMetrics,
        taskMetrics,
        revenueMetrics,
        engagementMetrics,
        performanceMetrics
      ] = await Promise.all([
        this.getUserMetrics(startDate, endDate),
        this.getTaskMetrics(startDate, endDate),
        this.getRevenueMetrics(startDate, endDate),
        this.getEngagementMetrics(startDate, endDate),
        this.getPerformanceMetrics()
      ]);

      return {
        period,
        userMetrics,
        taskMetrics,
        revenueMetrics,
        engagementMetrics,
        performanceMetrics,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching advanced analytics:', error);
      return null;
    }
  },

  async getUserMetrics(startDate, endDate) {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, user_type, created_at, last_active, status')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      const totalUsers = users?.length || 0;
      const workers = users?.filter(u => u.user_type === 'worker').length || 0;
      const employers = users?.filter(u => u.user_type === 'employer').length || 0;
      const activeUsers = users?.filter(u => {
        const lastActive = new Date(u.last_active);
        const daysSinceActive = (new Date() - lastActive) / (1000 * 60 * 60 * 24);
        return daysSinceActive <= 7;
      }).length || 0;

      return {
        totalUsers,
        workers,
        employers,
        activeUsers,
        activeRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : 0,
        growthRate: await this.calculateGrowthRate('users', startDate, endDate)
      };
    } catch (error) {
      console.error('Error fetching user metrics:', error);
      return {};
    }
  },

  async getTaskMetrics(startDate, endDate) {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('id, status, reward_amount, created_at, completed_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      const totalTasks = tasks?.length || 0;
      const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
      const activeTasks = tasks?.filter(t => t.status === 'active').length || 0;
      const totalValue = tasks?.reduce((sum, t) => sum + parseFloat(t.reward_amount || 0), 0) || 0;
      
      const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;
      const avgTaskValue = totalTasks > 0 ? (totalValue / totalTasks).toFixed(2) : 0;

      return {
        totalTasks,
        completedTasks,
        activeTasks,
        totalValue,
        completionRate,
        avgTaskValue,
        growthRate: await this.calculateGrowthRate('tasks', startDate, endDate)
      };
    } catch (error) {
      console.error('Error fetching task metrics:', error);
      return {};
    }
  },

  async getRevenueMetrics(startDate, endDate) {
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('id, amount, type, status, created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('status', 'completed');

      if (error) throw error;

      const revenue = transactions?.filter(t => t.type === 'payment').reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
      const payouts = transactions?.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0) || 0;
      const fees = transactions?.filter(t => t.type === 'fee').reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
      const netRevenue = revenue - payouts;
      const transactionCount = transactions?.length || 0;
      const avgTransactionValue = transactionCount > 0 ? (revenue / transactionCount).toFixed(2) : 0;

      return {
        totalRevenue: revenue,
        totalPayouts: payouts,
        totalFees: fees,
        netRevenue,
        transactionCount,
        avgTransactionValue,
        growthRate: await this.calculateGrowthRate('revenue', startDate, endDate)
      };
    } catch (error) {
      console.error('Error fetching revenue metrics:', error);
      return {};
    }
  },

  async getEngagementMetrics(startDate, endDate) {
    try {
      const [submissions, reviews, notifications] = await Promise.all([
        supabase
          .from('task_submissions')
          .select('id, created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        supabase
          .from('reviews')
          .select('id, rating, created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        supabase
          .from('notifications')
          .select('id, read, created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      ]);

      const totalSubmissions = submissions.data?.length || 0;
      const totalReviews = reviews.data?.length || 0;
      const avgRating = reviews.data?.length > 0 
        ? (reviews.data.reduce((sum, r) => sum + r.rating, 0) / reviews.data.length).toFixed(2)
        : 0;
      const totalNotifications = notifications.data?.length || 0;
      const readNotifications = notifications.data?.filter(n => n.read).length || 0;
      const notificationReadRate = totalNotifications > 0 
        ? ((readNotifications / totalNotifications) * 100).toFixed(2)
        : 0;

      return {
        totalSubmissions,
        totalReviews,
        avgRating,
        totalNotifications,
        notificationReadRate
      };
    } catch (error) {
      console.error('Error fetching engagement metrics:', error);
      return {};
    }
  },

  async getPerformanceMetrics() {
    try {
      const { data: metrics, error } = await supabase
        .from('system_metrics')
        .select('metric_name, metric_value, metric_unit, recorded_at')
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (error) {
        // If table doesn't exist, return mock data
        return {
          avgResponseTime: 245,
          uptime: 99.9,
          errorRate: 0.1,
          activeConnections: 127
        };
      }

      const latestMetrics = {};
      (metrics || []).forEach(m => {
        if (!latestMetrics[m.metric_name]) {
          latestMetrics[m.metric_name] = m.metric_value;
        }
      });

      return {
        avgResponseTime: latestMetrics.response_time || 0,
        uptime: latestMetrics.uptime || 0,
        errorRate: latestMetrics.error_rate || 0,
        activeConnections: latestMetrics.active_connections || 0,
        cpuUsage: latestMetrics.cpu_usage || 0,
        memoryUsage: latestMetrics.memory_usage || 0
      };
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return {};
    }
  },

  async calculateGrowthRate(type, startDate, endDate) {
    try {
      const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
      
      let table = 'users';
      if (type === 'tasks') table = 'tasks';
      if (type === 'revenue') table = 'transactions';

      const [firstHalf, secondHalf] = await Promise.all([
        supabase
          .from(table)
          .select('id', { count: 'exact', head: true })
          .gte('created_at', startDate.toISOString())
          .lt('created_at', midDate.toISOString()),
        supabase
          .from(table)
          .select('id', { count: 'exact', head: true })
          .gte('created_at', midDate.toISOString())
          .lte('created_at', endDate.toISOString())
      ]);

      const firstCount = firstHalf.count || 0;
      const secondCount = secondHalf.count || 0;

      if (firstCount === 0) return secondCount > 0 ? 100 : 0;
      return (((secondCount - firstCount) / firstCount) * 100).toFixed(2);
    } catch (error) {
      console.error('Error calculating growth rate:', error);
      return 0;
    }
  },

  // ============================================================================
  // 📊 SYSTEM HEALTH & MONITORING
  // ============================================================================
  async getSystemHealth() {
    try {
      const [dbHealth, apiHealth, storageHealth] = await Promise.all([
        this.checkDatabaseHealth(),
        this.checkApiHealth(),
        this.checkStorageHealth()
      ]);

      const overallHealth = (dbHealth.score + apiHealth.score + storageHealth.score) / 3;

      return {
        overall: {
          status: overallHealth >= 90 ? 'healthy' : overallHealth >= 70 ? 'warning' : 'critical',
          score: overallHealth.toFixed(2)
        },
        database: dbHealth,
        api: apiHealth,
        storage: storageHealth,
        checkedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error checking system health:', error);
      return null;
    }
  },

  async checkDatabaseHealth() {
    try {
      const startTime = Date.now();
      const { error } = await supabase.from('users').select('id').limit(1);
      const responseTime = Date.now() - startTime;

      if (error) {
        return { status: 'error', score: 0, responseTime, message: error.message };
      }

      const score = responseTime < 100 ? 100 : responseTime < 500 ? 80 : 50;
      return {
        status: score >= 80 ? 'healthy' : 'warning',
        score,
        responseTime,
        message: 'Database connection successful'
      };
    } catch (error) {
      return { status: 'error', score: 0, message: error.message };
    }
  },

  async checkApiHealth() {
    try {
      // Check if we can make basic queries
      const startTime = Date.now();
      const { error } = await supabase.from('tasks').select('id').limit(1);
      const responseTime = Date.now() - startTime;

      if (error) {
        return { status: 'error', score: 0, responseTime, message: error.message };
      }

      const score = responseTime < 200 ? 100 : responseTime < 1000 ? 80 : 50;
      return {
        status: score >= 80 ? 'healthy' : 'warning',
        score,
        responseTime,
        message: 'API responding normally'
      };
    } catch (error) {
      return { status: 'error', score: 0, message: error.message };
    }
  },

  async checkStorageHealth() {
    try {
      // Mock storage check - in production, check actual storage usage
      return {
        status: 'healthy',
        score: 95,
        usedSpace: '2.5GB',
        totalSpace: '10GB',
        usagePercent: 25,
        message: 'Storage within normal limits'
      };
    } catch (error) {
      return { status: 'error', score: 0, message: error.message };
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