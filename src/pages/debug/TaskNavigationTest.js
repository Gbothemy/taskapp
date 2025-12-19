import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { employerService } from '../../services/employerService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const TaskNavigationTest = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.id) return;
      
      try {
        const tasksData = await employerService.getEmployerTasks(user.id);
        console.log('Test page - loaded tasks:', tasksData);
        setTasks(tasksData);
      } catch (error) {
        console.error('Test page - error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const testNavigation = (taskId, action) => {
    console.log('Testing navigation:', action, 'for task:', taskId);
    
    switch (action) {
      case 'view':
        const viewUrl = `/employer/task/${taskId}`;
        console.log('Navigating to:', viewUrl);
        navigate(viewUrl);
        break;
      case 'edit':
        const editUrl = `/employer/edit-task/${taskId}`;
        console.log('Navigating to:', editUrl);
        navigate(editUrl);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  if (loading) {
    return <div className="p-8">Loading tasks...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="p-8">
          <h1 className="text-2xl font-bold mb-6">Task Navigation Test</h1>
          
          <div className="mb-4">
            <p><strong>User ID:</strong> {user?.id}</p>
            <p><strong>Tasks Found:</strong> {tasks.length}</p>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No tasks found for testing</p>
              <Button onClick={() => navigate('/employer/create-task')}>
                Create a Test Task
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-600">ID: {task.id}</p>
                      <p className="text-sm text-gray-600">Status: {task.status}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => testNavigation(task.id, 'view')}
                        variant="outline"
                        size="sm"
                      >
                        Test View
                      </Button>
                      <Button
                        onClick={() => testNavigation(task.id, 'edit')}
                        variant="outline"
                        size="sm"
                      >
                        Test Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-4 border-t">
            <Button onClick={() => navigate('/employer/my-tasks')}>
              Back to My Tasks
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TaskNavigationTest;