// Clean Supabase service without any verification references
import { authService, supabase } from './authentication';

// Re-export auth service
export { authService };
export { supabase };

// Clean services without verification
export const categoriesService = {
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('sort_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.log('Categories not available');
      return [];
    }
  }
};

export const tasksService = {
  async getTasks(filters = {}) {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          categories(name, color, icon),
          users!tasks_employer_id_fkey(full_name, rating, avatar_url),
          task_submissions(id, status, worker_id)
        `)
        .eq('status', 'active');

      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.minReward) {
        query = query.gte('reward_amount', filters.minReward);
      }
      if (filters.maxReward) {
        query = query.lte('reward_amount', filters.maxReward);
      }
      if (filters.difficulty) {
        query = query.eq('difficulty_level', filters.difficulty);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(filters.limit || 20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  async getTaskById(taskId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          categories(name, color, icon),
          users!tasks_employer_id_fkey(full_name, rating, avatar_url, company),
          task_submissions(
            id, 
            submission_text, 
            submission_files, 
            status, 
            rating, 
            feedback,
            submitted_at,
            users!task_submissions_worker_id_fkey(full_name, avatar_url, rating)
          )
        `)
        .eq('id', taskId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  async createTask(taskData) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          description: taskData.description,
          employer_id: taskData.employer_id,
          category_id: taskData.category_id,
          reward_amount: taskData.reward_amount,
          deadline: taskData.deadline,
          difficulty_level: taskData.difficulty_level || 'medium',
          required_skills: taskData.required_skills || [],
          attachments: taskData.attachments || [],
          deliverables: taskData.deliverables || [],
          max_submissions: taskData.max_submissions || 1,
          allow_revisions: taskData.allow_revisions !== false,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async updateTask(taskId, updates) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
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

  async getUserTasks(userId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          categories(name, color, icon),
          task_submissions(
            id, 
            status, 
            submitted_at,
            users!task_submissions_worker_id_fkey(full_name, avatar_url)
          )
        `)
        .eq('employer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      return [];
    }
  }
};

export const usersService = {
  async getProfile(userId) {
    return await authService.getProfile(userId);
  },

  async updateProfile(userId, updates) {
    return await authService.updateProfile(userId, updates);
  },

  async getWalletBalance(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('wallet_balance, total_earnings')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return {
        balance: data.wallet_balance || 0,
        totalEarnings: data.total_earnings || 0
      };
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return { balance: 0, totalEarnings: 0 };
    }
  },

  async getUserStats(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          rating,
          total_earnings,
          tasks_completed,
          tasks_created,
          success_rate,
          wallet_balance
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        rating: 0,
        total_earnings: 0,
        tasks_completed: 0,
        tasks_created: 0,
        success_rate: 0,
        wallet_balance: 0
      };
    }
  },

  async updateUserStats(userId, stats) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...stats,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }
};

export const fileService = {
  async uploadFile(file, bucket = 'task-files', folder = '') {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        data: {
          path: data.path,
          publicUrl,
          fullPath: data.fullPath,
          id: data.id
        }
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async deleteFile(filePath, bucket = 'task-files') {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  async getFileUrl(filePath, bucket = 'task-files') {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
  },

  async uploadMultipleFiles(files, bucket = 'task-files', folder = '') {
    try {
      const uploadPromises = files.map(file => 
        this.uploadFile(file, bucket, folder)
      );

      const results = await Promise.all(uploadPromises);
      return results.map(result => result.data);
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  }
};

// Removed subscription service - no longer needed for pricing

export const transactionsService = {
  async getUserTransactions(userId) { 
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }
  },

  async createTransaction(transactionData) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: transactionData.user_id,
          amount: transactionData.amount,
          type: transactionData.type,
          status: transactionData.status || 'pending',
          description: transactionData.description,
          reference_id: transactionData.reference_id,
          reference_type: transactionData.reference_type,
          payment_method: transactionData.payment_method,
          payment_processor: transactionData.payment_processor,
          processor_transaction_id: transactionData.processor_transaction_id,
          processor_fee: transactionData.processor_fee || 0
        }])
        .select()
        .single();

      if (error) throw error;

      // Update user wallet balance if transaction is completed
      if (transactionData.status === 'completed') {
        await this.updateWalletBalance(transactionData.user_id, transactionData.amount);
      }

      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  async updateWalletBalance(userId, amount) {
    try {
      const { error } = await supabase.rpc('update_wallet_balance', {
        user_id: userId,
        amount_change: amount
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating wallet balance:', error);
    }
  },

  async getTransactionById(transactionId) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }
};

export const paymentService = {
  async processPayment(paymentData) { 
    try {
      // Create transaction record
      const transaction = await transactionsService.createTransaction({
        user_id: paymentData.user_id,
        amount: paymentData.amount,
        type: paymentData.type || 'payment',
        status: 'processing',
        description: paymentData.description,
        reference_id: paymentData.reference_id,
        reference_type: paymentData.reference_type,
        payment_method: paymentData.payment_method,
        payment_processor: 'stripe' // Default to Stripe
      });

      // In a real implementation, you would integrate with Stripe/PayPal here
      // For now, we'll simulate successful payment
      setTimeout(async () => {
        await supabase
          .from('transactions')
          .update({ 
            status: 'completed',
            processed_at: new Date().toISOString()
          })
          .eq('id', transaction.id);
      }, 2000);

      return { success: true, transaction };
    } catch (error) {
      console.error('Error processing payment:', error);
      return { success: false, error: error.message };
    }
  },

  async submitWithdrawalRequest(userId, amount, paymentMethodId, documents) {
    try {
      // Check if user has sufficient balance
      const { balance } = await usersService.getWalletBalance(userId);
      if (balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Create withdrawal transaction
      const transaction = await transactionsService.createTransaction({
        user_id: userId,
        amount: -amount,
        type: 'withdrawal',
        status: 'pending',
        description: `Withdrawal request for $${amount}`,
        payment_method: paymentMethodId
      });

      // In a real implementation, integrate with payment processor
      return {
        id: transaction.id,
        userId,
        amount,
        status: 'pending',
        created_at: transaction.created_at
      };
    } catch (error) {
      console.error('Error submitting withdrawal request:', error);
      throw error;
    }
  },

  async getPaymentMethods(userId) {
    try {
      // In a real implementation, this would fetch from a payment_methods table
      // For now, return mock data
      return [
        {
          id: 'pm_1',
          type: 'card',
          last4: '4242',
          brand: 'visa',
          exp_month: 12,
          exp_year: 2025,
          is_default: true
        },
        {
          id: 'pm_2',
          type: 'paypal',
          email: 'user@example.com',
          is_default: false
        }
      ];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  },

  async addPaymentMethod(userId, methodData) {
    try {
      // In a real implementation, this would integrate with Stripe/PayPal
      // and store the payment method securely
      const paymentMethod = {
        id: `pm_${Date.now()}`,
        user_id: userId,
        type: methodData.type,
        ...methodData,
        created_at: new Date().toISOString()
      };

      return paymentMethod;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  },

  async processWithdrawal(withdrawalId) {
    try {
      // Update withdrawal status
      const { data, error } = await supabase
        .from('transactions')
        .update({ 
          status: 'processing',
          processed_at: new Date().toISOString()
        })
        .eq('id', withdrawalId)
        .select()
        .single();

      if (error) throw error;

      // In a real implementation, process with payment provider
      // For now, simulate processing
      setTimeout(async () => {
        await supabase
          .from('transactions')
          .update({ status: 'completed' })
          .eq('id', withdrawalId);
      }, 5000);

      return data;
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      throw error;
    }
  }
};

export const submissionsService = {
  async getUserSubmissions(userId) { 
    try {
      const { data, error } = await supabase
        .from('task_submissions')
        .select(`
          *,
          tasks(
            id,
            title,
            reward_amount,
            deadline,
            status,
            users!tasks_employer_id_fkey(full_name, avatar_url, company)
          )
        `)
        .eq('worker_id', userId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user submissions:', error);
      return [];
    }
  },

  async submitTask(taskId, submissionData) {
    try {
      const { data, error } = await supabase
        .from('task_submissions')
        .insert([{
          task_id: taskId,
          worker_id: submissionData.worker_id,
          submission_text: submissionData.submission_text,
          submission_files: submissionData.submission_files || [],
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Update task status to in_progress if it's the first submission
      await supabase
        .from('tasks')
        .update({ 
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .eq('status', 'active');

      return data;
    } catch (error) {
      console.error('Error submitting task:', error);
      throw error;
    }
  },

  async updateSubmissionStatus(submissionId, status, feedback, rating) {
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
          tasks(id, reward_amount, employer_id),
          users!task_submissions_worker_id_fkey(id, full_name)
        `)
        .single();

      if (error) throw error;

      // If approved, handle payment and task completion
      if (status === 'approved') {
        await this.handleApprovedSubmission(data);
      }

      return data;
    } catch (error) {
      console.error('Error updating submission status:', error);
      throw error;
    }
  },

  async handleApprovedSubmission(submission) {
    try {
      const { task_id, worker_id } = submission;
      const { reward_amount, employer_id } = submission.tasks;

      // Update task status to completed
      await supabase
        .from('tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', task_id);

      // Create earning transaction for worker
      await transactionsService.createTransaction({
        user_id: worker_id,
        amount: reward_amount,
        type: 'earning',
        status: 'completed',
        description: `Payment for task completion`,
        reference_id: task_id,
        reference_type: 'task'
      });

      // Create payment transaction for employer
      await transactionsService.createTransaction({
        user_id: employer_id,
        amount: -reward_amount,
        type: 'payment',
        status: 'completed',
        description: `Payment for task completion`,
        reference_id: task_id,
        reference_type: 'task'
      });

      // Update user balances and stats
      await this.updateUserStats(worker_id, employer_id, reward_amount);

    } catch (error) {
      console.error('Error handling approved submission:', error);
    }
  },

  async updateUserStats(workerId, employerId, amount) {
    try {
      // Update worker stats
      await supabase.rpc('update_worker_stats', {
        worker_id: workerId,
        earning_amount: amount
      });

      // Update employer stats  
      await supabase.rpc('update_employer_stats', {
        employer_id: employerId,
        payment_amount: amount
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }
};

export const notificationService = {
  async getUserNotifications(userId) { 
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  },

  async createNotification(userId, title, message, type, referenceId, referenceType) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          title,
          message,
          type: type || 'info',
          reference_id: referenceId,
          reference_type: referenceType
        }])
        .select()
        .single();

      if (error) throw error;

      // Trigger real-time notification
      await this.sendRealtimeNotification(userId, data);

      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async sendRealtimeNotification(userId, notification) {
    try {
      // Send real-time notification via Supabase channels
      await supabase.channel(`notifications:${userId}`)
        .send({
          type: 'broadcast',
          event: 'new_notification',
          payload: notification
        });
    } catch (error) {
      console.error('Error sending real-time notification:', error);
    }
  },

  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  },

  async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
};

export const realtimeService = {
  subscribeToNotifications(userId, callback) {
    try {
      const channel = supabase
        .channel(`notifications:${userId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, (payload) => {
          callback(payload.new);
        })
        .on('broadcast', { event: 'new_notification' }, (payload) => {
          callback(payload.payload);
        })
        .subscribe();

      return {
        unsubscribe: () => {
          supabase.removeChannel(channel);
        }
      };
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      return {
        unsubscribe: () => {}
      };
    }
  },

  subscribeToTasks(callback) {
    try {
      const channel = supabase
        .channel('tasks')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'tasks'
        }, (payload) => {
          callback(payload);
        })
        .subscribe();

      return {
        unsubscribe: () => {
          supabase.removeChannel(channel);
        }
      };
    } catch (error) {
      console.error('Error subscribing to tasks:', error);
      return {
        unsubscribe: () => {}
      };
    }
  },

  subscribeToSubmissions(taskId, callback) {
    try {
      const channel = supabase
        .channel(`submissions:${taskId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'task_submissions',
          filter: `task_id=eq.${taskId}`
        }, (payload) => {
          callback(payload);
        })
        .subscribe();

      return {
        unsubscribe: () => {
          supabase.removeChannel(channel);
        }
      };
    } catch (error) {
      console.error('Error subscribing to submissions:', error);
      return {
        unsubscribe: () => {}
      };
    }
  },

  subscribeToUserActivity(userId, callback) {
    try {
      const channel = supabase
        .channel(`user:${userId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        }, (payload) => {
          callback(payload.new);
        })
        .subscribe();

      return {
        unsubscribe: () => {
          supabase.removeChannel(channel);
        }
      };
    } catch (error) {
      console.error('Error subscribing to user activity:', error);
      return {
        unsubscribe: () => {}
      };
    }
  }
};
export const analyticsService = {
  async trackEvent(eventName, properties = {}) {
    console.log('Analytics:', eventName, properties);
  },
  async trackPageView(pageName, properties = {}) {
    console.log('Page View:', pageName, properties);
  },
  async trackTaskInteraction(action, taskId, properties = {}) {
    console.log('Task Interaction:', action, taskId, properties);
  }
};

export default supabase;