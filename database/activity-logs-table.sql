-- ============================================================================
-- 📊 ACTIVITY LOGS TABLE - Advanced User Activity Tracking
-- ============================================================================
-- 🎯 Comprehensive activity logging for admin analytics and monitoring
-- 🚀 Track all user actions, system events, and performance metrics
-- ============================================================================

-- 📋 ACTIVITY LOGS TABLE - Track all user and system activities
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 👤 User & Session Info
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id VARCHAR,
  ip_address INET,
  user_agent TEXT,
  
  -- 🎯 Activity Details
  action VARCHAR NOT NULL, -- 'login', 'task_created', 'payment_made', etc.
  entity_type VARCHAR, -- 'user', 'task', 'payment', 'system'
  entity_id UUID, -- ID of the affected entity
  
  -- 📄 Event Data
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- Additional context data
  
  -- 🏷️ Categorization
  category VARCHAR DEFAULT 'general', -- 'auth', 'task', 'payment', 'admin', 'system'
  severity VARCHAR DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
  
  -- 📊 Performance Metrics
  duration_ms INTEGER, -- How long the action took
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  
  -- 🌍 Location & Context
  location JSONB, -- Geolocation data if available
  referrer VARCHAR,
  page_url VARCHAR,
  
  -- 🕐 Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- 📈 Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_category ON activity_logs(category);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- 📊 SYSTEM METRICS TABLE - Track system performance and health
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 📈 Metric Details
  metric_name VARCHAR NOT NULL, -- 'cpu_usage', 'memory_usage', 'db_connections', etc.
  metric_value DECIMAL(15,6) NOT NULL,
  metric_unit VARCHAR, -- '%', 'MB', 'count', 'ms'
  
  -- 🏷️ Context
  category VARCHAR DEFAULT 'system', -- 'system', 'database', 'api', 'user'
  source VARCHAR, -- 'server', 'database', 'application'
  
  -- 📄 Additional Data
  metadata JSONB DEFAULT '{}',
  
  -- 🕐 Timestamp
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- 📈 Create indexes for system_metrics
CREATE INDEX IF NOT EXISTS idx_system_metrics_name ON system_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_system_metrics_recorded_at ON system_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_system_metrics_category ON system_metrics(category);

-- 🚨 ADMIN ACTIONS TABLE - Track all admin activities for audit trail
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 👤 Admin Info
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  admin_email VARCHAR NOT NULL,
  
  -- 🎯 Action Details
  action VARCHAR NOT NULL, -- 'user_suspended', 'task_deleted', 'payment_approved'
  target_type VARCHAR, -- 'user', 'task', 'payment', 'system'
  target_id UUID,
  target_identifier VARCHAR, -- email, task title, etc. for easy reference
  
  -- 📄 Change Details
  description TEXT NOT NULL,
  old_values JSONB, -- Previous state
  new_values JSONB, -- New state
  reason TEXT, -- Admin's reason for the action
  
  -- 🌍 Context
  ip_address INET,
  user_agent TEXT,
  
  -- 🕐 Timestamp
  performed_at TIMESTAMP DEFAULT NOW()
);

-- 📈 Create indexes for admin_actions
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_action ON admin_actions(action);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON admin_actions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_performed_at ON admin_actions(performed_at);

-- 📊 ANALYTICS CACHE TABLE - Store pre-calculated analytics for performance
CREATE TABLE IF NOT EXISTS analytics_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 🏷️ Cache Key
  cache_key VARCHAR UNIQUE NOT NULL, -- 'user_growth_30d', 'revenue_stats_7d'
  
  -- 📄 Data
  data JSONB NOT NULL,
  
  -- ⏰ Cache Management
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 📈 Create indexes for analytics_cache
CREATE INDEX IF NOT EXISTS idx_analytics_cache_key ON analytics_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_expires ON analytics_cache(expires_at);

-- ============================================================================
-- 🔧 HELPER FUNCTIONS
-- ============================================================================

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_action VARCHAR,
  p_description TEXT,
  p_entity_type VARCHAR DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_category VARCHAR DEFAULT 'general',
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO activity_logs (
    user_id, action, description, entity_type, entity_id, category, metadata
  ) VALUES (
    p_user_id, p_action, p_description, p_entity_type, p_entity_id, p_category, p_metadata
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id UUID,
  p_admin_email VARCHAR,
  p_action VARCHAR,
  p_description TEXT,
  p_target_type VARCHAR DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_target_identifier VARCHAR DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_reason TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  action_id UUID;
BEGIN
  INSERT INTO admin_actions (
    admin_id, admin_email, action, description, target_type, target_id, 
    target_identifier, old_values, new_values, reason
  ) VALUES (
    p_admin_id, p_admin_email, p_action, p_description, p_target_type, 
    p_target_id, p_target_identifier, p_old_values, p_new_values, p_reason
  ) RETURNING id INTO action_id;
  
  RETURN action_id;
END;
$$ LANGUAGE plpgsql;

-- Function to record system metrics
CREATE OR REPLACE FUNCTION record_system_metric(
  p_metric_name VARCHAR,
  p_metric_value DECIMAL,
  p_metric_unit VARCHAR DEFAULT NULL,
  p_category VARCHAR DEFAULT 'system',
  p_source VARCHAR DEFAULT 'application',
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  metric_id UUID;
BEGIN
  INSERT INTO system_metrics (
    metric_name, metric_value, metric_unit, category, source, metadata
  ) VALUES (
    p_metric_name, p_metric_value, p_metric_unit, p_category, p_source, p_metadata
  ) RETURNING id INTO metric_id;
  
  RETURN metric_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 🎯 SAMPLE DATA FOR TESTING
-- ============================================================================

-- Sample activity logs
INSERT INTO activity_logs (user_id, action, description, category, metadata) VALUES
  (NULL, 'system_startup', 'Application server started', 'system', '{"version": "1.0.0", "environment": "production"}'),
  (NULL, 'database_backup', 'Automated database backup completed', 'system', '{"backup_size": "2.5GB", "duration": "45s"}');

-- Sample system metrics
INSERT INTO system_metrics (metric_name, metric_value, metric_unit, category) VALUES
  ('cpu_usage', 45.2, '%', 'system'),
  ('memory_usage', 68.7, '%', 'system'),
  ('active_connections', 127, 'count', 'database'),
  ('response_time', 245, 'ms', 'api');

COMMENT ON TABLE activity_logs IS 'Comprehensive activity logging for user actions and system events';
COMMENT ON TABLE system_metrics IS 'System performance and health metrics tracking';
COMMENT ON TABLE admin_actions IS 'Audit trail for all administrative actions';
COMMENT ON TABLE analytics_cache IS 'Pre-calculated analytics data for improved performance';