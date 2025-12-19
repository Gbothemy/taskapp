import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tasksService, submissionsService } from '../../services/supabase';

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const tasks = await tasksService.getTasks(filters);
      return { tasks, pagination: { totalTasks: tasks.length } };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId, { rejectWithValue }) => {
    try {
      const task = await tasksService.getTaskById(taskId);
      return task;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const task = await tasksService.createTask(taskData);
      return task;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updates }, { rejectWithValue }) => {
    try {
      const task = await tasksService.updateTask(taskId, updates);
      return task;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await tasksService.deleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

export const submitTask = createAsyncThunk(
  'tasks/submitTask',
  async ({ taskId, submissionData }, { rejectWithValue }) => {
    try {
      const submission = await submissionsService.submitTask(taskId, submissionData);
      return submission;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit task');
    }
  }
);

export const fetchMyTasks = createAsyncThunk(
  'tasks/fetchMyTasks',
  async (userId, { rejectWithValue }) => {
    try {
      const tasks = await tasksService.getUserTasks(userId);
      return tasks;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch my tasks');
    }
  }
);

export const fetchMySubmissions = createAsyncThunk(
  'tasks/fetchMySubmissions',
  async (userId, { rejectWithValue }) => {
    try {
      const submissions = await submissionsService.getUserSubmissions(userId);
      return submissions;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch submissions');
    }
  }
);

export const reviewSubmission = createAsyncThunk(
  'tasks/reviewSubmission',
  async ({ submissionId, status, feedback, rating }, { rejectWithValue }) => {
    try {
      const submission = await submissionsService.updateSubmissionStatus(
        submissionId, 
        status, 
        feedback, 
        rating
      );
      return submission;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to review submission');
    }
  }
);

const initialState = {
  tasks: [],
  currentTask: null,
  myTasks: [],
  mySubmissions: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    category: '',
    minReward: '',
    maxReward: '',
    difficulty: '',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  },
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateTaskInList: (state, action) => {
      const { taskId, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
      }
      
      const myTaskIndex = state.myTasks.findIndex(task => task.id === taskId);
      if (myTaskIndex !== -1) {
        state.myTasks[myTaskIndex] = { ...state.myTasks[myTaskIndex], ...updates };
      }
    },
    addSubmission: (state, action) => {
      state.mySubmissions.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Task By ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.myTasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const taskIndex = state.myTasks.findIndex(task => task.id === action.payload.id);
        if (taskIndex !== -1) {
          state.myTasks[taskIndex] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.myTasks = state.myTasks.filter(task => task.id !== action.payload);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
      })
      
      // Submit Task
      .addCase(submitTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitTask.fulfilled, (state, action) => {
        state.loading = false;
        state.mySubmissions.unshift(action.payload);
      })
      .addCase(submitTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch My Tasks
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.myTasks = action.payload;
      })
      
      // Fetch My Submissions
      .addCase(fetchMySubmissions.fulfilled, (state, action) => {
        state.mySubmissions = action.payload;
      })
      
      // Review Submission
      .addCase(reviewSubmission.fulfilled, (state, action) => {
        const submissionIndex = state.mySubmissions.findIndex(sub => sub.id === action.payload.id);
        if (submissionIndex !== -1) {
          state.mySubmissions[submissionIndex] = action.payload;
        }
      });
  },
});

export const { 
  setFilters, 
  clearCurrentTask, 
  clearError, 
  updateTaskInList, 
  addSubmission 
} = taskSlice.actions;

export default taskSlice.reducer;