import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { notificationService, realtimeService } from '../../services/supabase';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (!user) return;

    // Temporarily disable notifications
    // const loadNotifications = async () => {
    //   setLoading(true);
    //   try {
    //     const data = await notificationService.getUserNotifications(user.id);
    //     setNotifications(data || []);
    //   } catch (error) {
    //     console.error('Failed to load notifications:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // loadNotifications();
    setNotifications([]); // Set empty notifications for now

    // Subscribe to real-time notifications (temporarily disabled)
    // const subscription = realtimeService.subscribeToNotifications(
    //   user.id,
    //   (payload) => {
    //     if (payload.eventType === 'INSERT') {
    //       setNotifications(prev => [payload.new, ...prev]);
    //     }
    //   }
    // );

    // return () => {
    //   subscription.unsubscribe();
    // };
  }, [user]);

  const markAsRead = async (notificationId) => {
    // Temporarily disabled
    console.log('Mark as read temporarily disabled');
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true, read_at: new Date().toISOString() } : n
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_assigned':
        return '📋';
      case 'payment':
        return '💰';
      case 'message':
        return '💬';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'task_assigned':
        return 'text-blue-600';
      case 'payment':
        return 'text-green-600';
      case 'message':
        return 'text-purple-600';
      case 'system':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6.414a1 1 0 01-.707-.293L4 17V4a1 1 0 011-1h14a1 1 0 011 1v9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6.414a1 1 0 01-.707-.293L4 17V4a1 1 0 011-1h14a1 1 0 011 1v9" />
                </svg>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${getNotificationColor(notification.type)}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={() => {
                  // Mark all as read
                  notifications.forEach(n => {
                    if (!n.read) markAsRead(n.id);
                  });
                }}
                className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;