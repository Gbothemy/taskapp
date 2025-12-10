const { supabase } = require('../config/supabase');

class SupabaseService {
  // User operations
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  }

  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Task operations
  async getTasks(filters = {}) {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        users!tasks_employer_id_fkey(first_name, last_name, email)
      `);

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.minPayout) {
      query = query.gte('payout_per_task', parseFloat(filters.minPayout));
    }
    if (filters.maxPayout) {
      query = query.lte('payout_per_task', parseFloat(filters.maxPayout));
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Sorting
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder === 'asc' ? 'asc' : 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      tasks: data || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalTasks: count || 0,
        hasNext: to < (count || 0) - 1,
        hasPrev: from > 0
      }
    };
  }

  async getTaskById(id) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        users!tasks_employer_id_fkey(first_name, last_name, email)
      `)
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createTask(taskData) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getTasksByEmployer(employerId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Task submission operations
  async createSubmission(submissionData) {
    const { data, error } = await supabase
      .from('task_submissions')
      .insert([submissionData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getSubmissionsByWorker(workerId) {
    const { data, error } = await supabase
      .from('task_submissions')
      .select(`
        *,
        tasks!task_submissions_task_id_fkey(id, title, category)
      `)
      .eq('worker_id', workerId)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getSubmissionsByEmployer(employerId, status = null) {
    let query = supabase
      .from('task_submissions')
      .select(`
        *,
        tasks!task_submissions_task_id_fkey(id, title, category),
        users!task_submissions_worker_id_fkey(first_name, last_name, email)
      `)
      .eq('employer_id', employerId);

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order('submitted_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async updateSubmission(id, updates) {
    const { data, error } = await supabase
      .from('task_submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Transaction operations
  async createTransaction(transactionData) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getTransactionsByUser(userId, filters = {}) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    query = query.order('created_at', { ascending: false });

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      transactions: data || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalTransactions: count || 0,
        hasNext: to < (count || 0) - 1,
        hasPrev: from > 0
      }
    };
  }

  // Dashboard stats
  async getWorkerStats(userId) {
    const user = await this.getUserById(userId);
    if (!user) return null;

    const submissions = await this.getSubmissionsByWorker(userId);
    const approvedSubmissions = submissions.filter(s => s.status === 'approved');
    const pendingSubmissions = submissions.filter(s => s.status === 'pending');
    
    const totalEarnings = approvedSubmissions.reduce((sum, s) => sum + (s.worker_earning || 0), 0);
    
    // Today's earnings
    const today = new Date().toISOString().split('T')[0];
    const todayEarnings = approvedSubmissions
      .filter(s => s.reviewed_at && s.reviewed_at.startsWith(today))
      .reduce((sum, s) => sum + (s.worker_earning || 0), 0);

    return {
      totalEarnings,
      todayEarnings,
      pendingEarnings: pendingSubmissions.reduce((sum, s) => sum + (s.worker_earning || 0), 0),
      tasksCompleted: approvedSubmissions.length,
      pendingTasks: pendingSubmissions.length,
      approvalRate: user.worker_approval_rate || 100,
      level: user.worker_level || 1
    };
  }

  async getEmployerStats(userId) {
    const tasks = await this.getTasksByEmployer(userId);
    const submissions = await this.getSubmissionsByEmployer(userId);
    const pendingSubmissions = submissions.filter(s => s.status === 'pending');

    return {
      tasksPosted: tasks.length,
      activeTasks: tasks.filter(t => t.status === 'active').length,
      totalSpent: tasks.reduce((sum, t) => sum + (t.payout_per_task * t.approved_tasks), 0),
      pendingReviews: pendingSubmissions.length,
      completedTasks: tasks.reduce((sum, t) => sum + (t.completed_tasks || 0), 0)
    };
  }

  async getAdminStats() {
    // Get user counts
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: workers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'worker');

    const { count: employers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'employer');

    // Get task counts
    const { count: totalTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true });

    const { count: activeTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: completedTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Get submission counts
    const { count: totalSubmissions } = await supabase
      .from('task_submissions')
      .select('*', { count: 'exact', head: true });

    const { count: pendingSubmissions } = await supabase
      .from('task_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: approvedSubmissions } = await supabase
      .from('task_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    const { count: rejectedSubmissions } = await supabase
      .from('task_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected');

    // Get financial data
    const { data: platformFeeTransactions } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'platform_fee')
      .eq('status', 'completed');

    const platformFees = platformFeeTransactions?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

    const { data: paymentTransactions } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'task_payment')
      .eq('status', 'completed');

    const totalVolume = paymentTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0;

    const { count: totalTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: recentUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    const { count: recentTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    const { count: recentTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    return {
      users: {
        total: totalUsers || 0,
        active: activeUsers || 0,
        workers: workers || 0,
        employers: employers || 0,
        recent: recentUsers || 0
      },
      tasks: {
        total: totalTasks || 0,
        active: activeTasks || 0,
        completed: completedTasks || 0,
        recent: recentTasks || 0
      },
      submissions: {
        total: totalSubmissions || 0,
        pending: pendingSubmissions || 0,
        approved: approvedSubmissions || 0,
        rejected: rejectedSubmissions || 0,
        approvalRate: totalSubmissions > 0 ? ((approvedSubmissions || 0) / totalSubmissions) * 100 : 0
      },
      financial: {
        totalVolume,
        platformFees,
        totalTransactions: totalTransactions || 0,
        recent: recentTransactions || 0
      }
    };
  }
}

module.exports = new SupabaseService();