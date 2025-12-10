import React, { useState } from 'react';
import { CheckIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ReviewSubmissions = () => {
  const [submissions] = useState([
    {
      id: '1',
      taskTitle: 'Website Review and Feedback',
      workerName: 'John Worker',
      workerEmail: 'worker@taskapp.com',
      submittedAt: new Date().toISOString(),
      proofData: {
        type: 'text',
        content: 'I thoroughly reviewed the website and found several usability issues. The navigation menu is confusing, the search function doesn\'t work properly, and the checkout process has too many steps. I recommend simplifying the user flow and fixing the technical issues.'
      },
      payoutDetails: {
        amount: 15.00,
        workerEarning: 14.25
      },
      status: 'pending'
    }
  ]);

  const [reviewData, setReviewData] = useState({});

  const handleReview = async (submissionId, approved) => {
    try {
      const review = reviewData[submissionId] || {};
      await api.post('/payments/process-task-payment', {
        submissionId,
        approved,
        review: approved ? review : undefined
      });
      
      toast.success(`Submission ${approved ? 'approved' : 'rejected'} successfully!`);
      // In a real app, you would refresh the submissions list here
    } catch (error) {
      toast.error('Failed to process review');
    }
  };

  const updateReviewData = (submissionId, field, value) => {
    setReviewData(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Submissions</h1>
          <p className="text-gray-600 mt-2">
            Review worker submissions and provide feedback.
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-gray-400 mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending submissions</h3>
            <p className="text-gray-600">
              Worker submissions will appear here for your review.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div key={submission.id} className="card p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {submission.taskTitle}
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p>Submitted by: <span className="font-medium">{submission.workerName}</span></p>
                      <p>Email: {submission.workerEmail}</p>
                      <p>Date: {new Date(submission.submittedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary-600">
                      ${submission.payoutDetails.amount}
                    </div>
                    <div className="text-sm text-gray-600">Total payout</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Worker Submission:</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm">
                      <span className="font-medium">Type:</span> {submission.proofData.type}
                    </p>
                    <div className="mt-2">
                      <span className="font-medium">Content:</span>
                      <p className="mt-1 text-gray-700">{submission.proofData.content}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Your Review:</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating (1-5 stars)
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateReviewData(submission.id, 'rating', star)}
                            className={`p-1 ${
                              (reviewData[submission.id]?.rating || 0) >= star
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            <StarIcon className="h-6 w-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feedback (optional)
                      </label>
                      <textarea
                        rows={3}
                        className="input-field"
                        placeholder="Provide feedback to help the worker improve..."
                        value={reviewData[submission.id]?.feedback || ''}
                        onChange={(e) => updateReviewData(submission.id, 'feedback', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleReview(submission.id, true)}
                    className="btn-primary flex items-center flex-1 justify-center"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Approve & Pay ${submission.payoutDetails.workerEarning}
                  </button>
                  <button
                    onClick={() => handleReview(submission.id, false)}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center flex-1 justify-center"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Reject Submission
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmissions;