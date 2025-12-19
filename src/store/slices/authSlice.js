import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authentication';

// Async thunks for auth operations
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.signIn(email, password);
      return {
        user: data.user,
        profile: data.profile,
        session: data.session
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.signUp(userData);
      return {
        user: data.user,
        profile: data.profile,
        session: data.session
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { user, profile } = await authService.getCurrentUser();
      if (!user) {
        throw new Error('No user session found');
      }
      return { user, profile };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load user session');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      await authService.resetPassword(email);
      return { message: 'Password reset email sent' };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send reset email');
    }
  }
);

const initialState = {
  user: null,
  profile: null,
  session: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSession: (state, action) => {
      if (action.payload && action.payload.user) {
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = true;
        // Profile will be loaded by checkAuth
      } else {
        state.user = null;
        state.profile = null;
        state.session = null;
        state.isAuthenticated = false;
      }
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.session = action.payload.session;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.session = action.payload.session;
        state.isAuthenticated = !!action.payload.user;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
        state.session = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.profile = null;
        state.session = null;
        state.isAuthenticated = false;
      })
      
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSession, updateProfile } = authSlice.actions;
export default authSlice.reducer;