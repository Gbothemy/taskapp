import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersService, transactionsService, paymentService } from '../../services/supabase';

// Async thunks
export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (userId, { rejectWithValue }) => {
    try {
      const walletData = await usersService.getWalletBalance(userId);
      const transactions = await transactionsService.getUserTransactions(userId);
      
      // Extract balance from the returned object
      const currentBalance = typeof walletData === 'object' ? walletData.balance : walletData;
      const dbTotalEarnings = typeof walletData === 'object' ? walletData.totalEarnings : 0;
      
      // Calculate stats from transactions
      const totalEarned = transactions
        .filter(t => t.type === 'earning' && t.status === 'completed')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const totalWithdrawn = Math.abs(transactions
        .filter(t => t.type === 'withdrawal' && t.status === 'completed')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0));
      
      const pendingEarnings = transactions
        .filter(t => t.type === 'earning' && t.status === 'pending')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      return {
        balance: parseFloat(currentBalance) || 0,
        pendingEarnings: parseFloat(pendingEarnings) || 0,
        totalEarned: parseFloat(dbTotalEarnings || totalEarned) || 0,
        totalWithdrawn: parseFloat(totalWithdrawn) || 0,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch wallet');
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async (userId, { rejectWithValue }) => {
    try {
      const transactions = await transactionsService.getUserTransactions(userId);
      return { 
        transactions, 
        pagination: { totalTransactions: transactions.length } 
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch transactions');
    }
  }
);

export const requestWithdrawal = createAsyncThunk(
  'wallet/requestWithdrawal',
  async ({ userId, amount, paymentMethodId, documents }, { rejectWithValue }) => {
    try {
      const request = await paymentService.submitWithdrawalRequest(
        userId, 
        amount, 
        paymentMethodId, 
        documents
      );
      return request;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to request withdrawal');
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  'wallet/fetchPaymentMethods',
  async (userId, { rejectWithValue }) => {
    try {
      const methods = await paymentService.getPaymentMethods(userId);
      return methods;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch payment methods');
    }
  }
);

export const addPaymentMethod = createAsyncThunk(
  'wallet/addPaymentMethod',
  async ({ userId, methodData }, { rejectWithValue }) => {
    try {
      const method = await paymentService.addPaymentMethod(userId, methodData);
      return method;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add payment method');
    }
  }
);

const initialState = {
  wallet: {
    balance: 0,
    pendingEarnings: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
  },
  transactions: [],
  paymentMethods: [],
  withdrawalRequests: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTransactions: 0,
    hasNext: false,
    hasPrev: false,
  },
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateBalance: (state, action) => {
      state.wallet.balance = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wallet
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Request Withdrawal
      .addCase(requestWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawalRequests.unshift(action.payload);
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Payment Methods
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = action.payload;
      })
      
      // Add Payment Method
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods.push(action.payload);
      });
  },
});

export const { clearError, updateBalance, addTransaction } = walletSlice.actions;
export default walletSlice.reducer;