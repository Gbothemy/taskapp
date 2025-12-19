import React from 'react';

const TaskDebugInfo = ({ task, showDetails = false }) => {
  if (!showDetails) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
      <h4 className="font-bold text-yellow-800 mb-2">Debug Info</h4>
      <div className="text-sm text-yellow-700 space-y-1">
        <div><strong>Task ID:</strong> {task.id}</div>
        <div><strong>Title:</strong> {task.title}</div>
        <div><strong>Status:</strong> {task.status}</div>
        <div><strong>Category:</strong> {JSON.stringify(task.category)}</div>
        <div><strong>Submissions:</strong> {task.submissions}</div>
        <div><strong>Budget:</strong> {task.budget}</div>
        <div><strong>Raw Data:</strong></div>
        <pre className="bg-yellow-100 p-2 rounded text-xs overflow-auto max-h-32">
          {JSON.stringify(task, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TaskDebugInfo;