import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <ExclamationTriangleIcon className="w-16 h-16 mx-auto mb-4 text-error-500" />
            <h2 className="text-xl font-bold text-secondary-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-secondary-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-primary-600 to-primary-700"
              >
                Refresh Page
              </Button>
              <Button
                onClick={() => this.setState({ hasError: false, error: null })}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-secondary-500">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-secondary-100 p-2 rounded overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;