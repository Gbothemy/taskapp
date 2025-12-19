-- ============================================================================
-- TASKAPP PROFESSIONAL - DATABASE FUNCTIONS
-- ============================================================================
-- 🎯 Essential database functions for business logic
-- 🚀 Run these after the main schema setup
-- ============================================================================

-- Function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance(user_id UUID, amount_change DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET 
    wallet_balance = wallet_balance + amount_change,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update worker stats after task completion
CREATE OR REPLACE FUNCTION update_worker_stats(worker_id UUID, earning_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET 
    total_earnings = total_earnings + earning_amount,
    wallet_balance = wallet_balance + earning_amount,
    tasks_completed = tasks_completed + 1,
    updated_at = NOW()
  WHERE id = worker_id;
  
  -- Recalculate success rate
  UPDATE users 
  SET success_rate = (
    SELECT 
      CASE 
        WHEN COUNT(*) = 0 THEN 0
        ELSE (COUNT(*) FILTER (WHERE ts.status = 'approved') * 100.0 / COUNT(*))
      END
    FROM task_submissions ts 
    WHERE ts.worker_id = worker_id
  )
  WHERE id = worker_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update employer stats after task creation/completion
CREATE OR REPLACE FUNCTION update_employer_stats(employer_id UUID, payment_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET 
    wallet_balance = wallet_balance - payment_amount,
    updated_at = NOW()
  WHERE id = employer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate user rating
CREATE OR REPLACE FUNCTION calculate_user_rating(user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  avg_rating DECIMAL;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM reviews 
  WHERE reviewee_id = user_id AND rating IS NOT NULL;
  
  -- Update user's rating
  UPDATE users 
  SET 
    rating = COALESCE(avg_rating, 0),
    updated_at = NOW()
  WHERE id = user_id;
  
  RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get task statistics
CREATE OR REPLACE FUNCTION get_task_stats(task_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_submissions', COUNT(*),
    'pending_submissions', COUNT(*) FILTER (WHERE status = 'pending'),
    'approved_submissions', COUNT(*) FILTER (WHERE status = 'approved'),
    'rejected_submissions', COUNT(*) FILTER (WHERE status = 'rejected'),
    'avg_rating', AVG(rating) FILTER (WHERE rating IS NOT NULL)
  ) INTO result
  FROM task_submissions 
  WHERE task_id = task_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user dashboard stats
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
  user_type VARCHAR;
  result JSON;
BEGIN
  SELECT users.user_type INTO user_type FROM users WHERE id = user_id;
  
  IF user_type = 'worker' THEN
    SELECT json_build_object(
      'total_earnings', COALESCE(total_earnings, 0),
      'wallet_balance', COALESCE(wallet_balance, 0),
      'tasks_completed', COALESCE(tasks_completed, 0),
      'success_rate', COALESCE(success_rate, 0),
      'rating', COALESCE(rating, 0),
      'pending_submissions', (
        SELECT COUNT(*) FROM task_submissions 
        WHERE worker_id = user_id AND status = 'pending'
      ),
      'active_tasks', (
        SELECT COUNT(*) FROM task_submissions ts
        JOIN tasks t ON ts.task_id = t.id
        WHERE ts.worker_id = user_id AND t.status = 'in_progress'
      )
    ) INTO result
    FROM users WHERE id = user_id;
    
  ELSIF user_type = 'employer' THEN
    SELECT json_build_object(
      'wallet_balance', COALESCE(wallet_balance, 0),
      'tasks_created', COALESCE(tasks_created, 0),
      'active_tasks', (
        SELECT COUNT(*) FROM tasks 
        WHERE employer_id = user_id AND status IN ('active', 'in_progress')
      ),
      'completed_tasks', (
        SELECT COUNT(*) FROM tasks 
        WHERE employer_id = user_id AND status = 'completed'
      ),
      'pending_reviews', (
        SELECT COUNT(*) FROM tasks t
        JOIN task_submissions ts ON t.id = ts.task_id
        WHERE t.employer_id = user_id AND ts.status = 'pending'
      )
    ) INTO result
    FROM users WHERE id = user_id;
    
  ELSE
    -- Admin stats
    SELECT json_build_object(
      'total_users', (SELECT COUNT(*) FROM users),
      'total_tasks', (SELECT COUNT(*) FROM tasks),
      'total_transactions', (SELECT COUNT(*) FROM transactions),
      'platform_revenue', (
        SELECT SUM(processor_fee) FROM transactions 
        WHERE status = 'completed'
      )
    ) INTO result;
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update user's last_active timestamp
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET last_active = NOW() 
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating last_active
DROP TRIGGER IF EXISTS update_last_active_on_task_submission ON task_submissions;
CREATE TRIGGER update_last_active_on_task_submission
  AFTER INSERT ON task_submissions
  FOR EACH ROW EXECUTE FUNCTION update_last_active();

DROP TRIGGER IF EXISTS update_last_active_on_notification ON notifications;
CREATE TRIGGER update_last_active_on_notification
  AFTER INSERT ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_last_active();

-- Function to clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS VOID AS $$
BEGIN
  DELETE FROM notifications 
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND read = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;