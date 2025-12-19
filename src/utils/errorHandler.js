import toast from 'react-hot-toast';

export const handleApiError = (error, context = '') => {
  console.error(`API Error ${context}:`, error);

  // Handle different types of errors
  if (error?.status === 406) {
    toast.error('Server configuration issue. Please try again later.');
    return 'Server configuration issue';
  }

  if (error?.status === 422) {
    toast.error('Invalid data provided. Please check your input.');
    return 'Invalid data provided';
  }

  if (error?.status === 401) {
    toast.error('Authentication required. Please log in.');
    return 'Authentication required';
  }

  if (error?.status === 403) {
    toast.error('Access denied. You do not have permission.');
    return 'Access denied';
  }

  if (error?.status === 404) {
    toast.error('Resource not found.');
    return 'Resource not found';
  }

  if (error?.status === 500) {
    toast.error('Server error. Please try again later.');
    return 'Server error';
  }

  // Handle network errors
  if (error?.message?.includes('fetch')) {
    toast.error('Network error. Please check your connection.');
    return 'Network error';
  }

  // Handle Supabase specific errors
  if (error?.message?.includes('JWT')) {
    toast.error('Session expired. Please log in again.');
    return 'Session expired';
  }

  if (error?.message?.includes('duplicate key')) {
    toast.error('This record already exists.');
    return 'Duplicate record';
  }

  // Generic error handling
  const message = error?.message || error?.error_description || 'An unexpected error occurred';
  toast.error(message);
  return message;
};

export const withErrorHandling = (asyncFunction, context = '') => {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      handleApiError(error, context);
      throw error;
    }
  };
};

export default { handleApiError, withErrorHandling };