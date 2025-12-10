import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { 
  CurrencyDollarIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  PlusIcon,
  BanknotesIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { 
  fetchWallet, 
  fetchTransactions, 
  requestWithdrawal, 
  depositFunds 
} from '../../store/slices/walletSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Wallet = () => {
  const dispatch = useDispatch();
  const { wallet, transactions, loading } = useSelector((state) => state.wallet);
  const { user } = useSelector((state) => state.auth);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  const {
    register: registerWithdraw,
    handleSubmit: handleWithdrawSubmit,
    formState: { errors: withdrawErrors },
    reset: resetWithdraw,
  } = useForm();

  const {
    register: registerDeposit,
    handleSubmit: handleDepositSubmit,
    formState: { errors: depositErrors },
    reset: resetDeposit,
  } = useForm();

  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleWithdrawal = async (data) => {
    try {
      await dispatch(requestWithdrawal(data)).unwrap();
      toast.success('Withdrawal request submitted successfully!');
      setShowWithdrawModal(false);
      resetWithdraw();
      dispatch(fetchWallet());
      dispatch(fetchTransactions());
    } catch (error) {
      toast.error(error || 'Failed to process withdrawal');
    }
  };

  const handleDeposit = async (data) => {
    try {
      await dispatch(depositFunds(data)).unwrap();
      toast.success('Funds deposited successfully!');
      setShowDepositModal(false);
      resetDeposit();
      dispatch(fetchWallet());
      dispatch(fetchTransactions());
    } catch (error) {
      toast.error(error || 'Failed to process deposit');
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'task_payment':
        return <ArrowUpIcon className="h-5 w-5 text-green-500" />;
      case 'withdrawal':
        return <ArrowDownIcon className="h-5 w-5 text-red-500" />;
      case 'deposit':
        return <ArrowUpIcon className="h-5 w-5 text-blue-500" />;
      case 'platform_fee':
        return <ArrowDownIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type, amount) => {
    if (amount > 0) return 'text-green-600';
    if (amount < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatTransactionType = (type) => {
    const types = {
      task_payment: 'Task Payment',
      withdrawal: 'Withdrawal',
      deposit: 'Deposit',
      platform_fee: 'Platform Fee',
      refund: 'Refund',
    };
    return types[type] || type;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      completed: 'badge-success',
      failed: 'badge-error',
      cancelled: 'badge-info',
    };
    return badges[status] || 'badge-info';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600 mt-2">
            Manage your balance, view transactions, and withdraw earnings.
          </p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${wallet.balance?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${wallet.pendingEarnings?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <ArrowUpIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${wallet.totalEarned?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <ArrowDownIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${wallet.totalSpent?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {user?.role === 'worker' && (
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={wallet.balance < 10}
              className="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownIcon className="h-4 w-4 mr-2" />
              Withdraw Funds
            </button>
          )}
          
          {user?.role === 'employer' && (
            <button
              onClick={() => setShowDepositModal(true)}
              className="btn-primary flex items-center justify-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Funds
            </button>
          )}
          
          <button
            onClick={() => dispatch(fetchTransactions())}
            className="btn-outline flex items-center justify-center"
          >
            <BanknotesIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Transaction History */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <CurrencyDollarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {formatTransactionType(transaction.type)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString()} at{' '}
                        {new Date(transaction.createdAt).toLocaleTimeString()}
                      </p>
                      {transaction.description && (
                        <p className="text-xs text-gray-500">{transaction.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getTransactionColor(transaction.type, transaction.amount)}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <span className={`badge ${getStatusBadge(transaction.status)} text-xs`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Withdrawal Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Funds</h3>
              
              <form onSubmit={handleWithdrawSubmit(handleWithdrawal)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    {...registerWithdraw('amount', {
                      required: 'Amount is required',
                      min: { value: 10, message: 'Minimum withdrawal is $10' },
                      max: { value: wallet.balance, message: 'Amount exceeds available balance' },
                    })}
                    type="number"
                    step="0.01"
                    className="input-field"
                    placeholder="Enter amount"
                  />
                  {withdrawErrors.amount && (
                    <p className="mt-1 text-sm text-red-600">{withdrawErrors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Withdrawal Method
                  </label>
                  <select
                    {...registerWithdraw('method', { required: 'Please select a method' })}
                    className="input-field"
                  >
                    <option value="">Select method</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="crypto">Cryptocurrency</option>
                  </select>
                  {withdrawErrors.method && (
                    <p className="mt-1 text-sm text-red-600">{withdrawErrors.method.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Details
                  </label>
                  <textarea
                    {...registerWithdraw('details.account', { required: 'Payment details are required' })}
                    className="input-field"
                    rows={3}
                    placeholder="Enter your payment account details"
                  />
                  {withdrawErrors.details?.account && (
                    <p className="mt-1 text-sm text-red-600">{withdrawErrors.details.account.message}</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Processing...' : 'Submit Withdrawal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Funds</h3>
              
              <form onSubmit={handleDepositSubmit(handleDeposit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    {...registerDeposit('amount', {
                      required: 'Amount is required',
                      min: { value: 1, message: 'Minimum deposit is $1' },
                    })}
                    type="number"
                    step="0.01"
                    className="input-field"
                    placeholder="Enter amount"
                  />
                  {depositErrors.amount && (
                    <p className="mt-1 text-sm text-red-600">{depositErrors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    {...registerDeposit('method', { required: 'Please select a method' })}
                    className="input-field"
                  >
                    <option value="">Select method</option>
                    <option value="demo">Demo (Instant)</option>
                    <option value="stripe">Credit Card (Stripe)</option>
                    <option value="paypal">PayPal</option>
                  </select>
                  {depositErrors.method && (
                    <p className="mt-1 text-sm text-red-600">{depositErrors.method.message}</p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    💡 This is a demo environment. Funds will be added instantly for testing purposes.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Processing...' : 'Add Funds'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDepositModal(false)}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;