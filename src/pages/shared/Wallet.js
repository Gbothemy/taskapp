import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  CurrencyDollarIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { fetchWallet, fetchTransactions } from '../../store/slices/walletSlice';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MobileNav from '../../components/layout/MobileNav';
import toast from 'react-hot-toast';

const Wallet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profile } = useSelector((state) => state.auth);
  const { wallet, transactions, loading } = useSelector((state) => state.wallet);
  const [activeTab, setActiveTab] = useState('overview');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWallet(user.id));
      dispatch(fetchTransactions(user.id));
    }
  }, [dispatch, user?.id]);

  // Helper function to safely format currency
  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '$0.00';
    }
    return `$${Number(value).toFixed(2)}`;
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'earning':
        return <ArrowUpIcon className="w-5 h-5 text-success-600" />;
      case 'withdrawal':
        return <ArrowDownIcon className="w-5 h-5 text-error-600" />;
      case 'payment':
        return <CreditCardIcon className="w-5 h-5 text-info-600" />;
      default:
        return <BanknotesIcon className="w-5 h-5 text-secondary-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="sm">Completed</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'failed':
        return <Badge variant="error" size="sm">Failed</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(withdrawAmount) > (wallet?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      // In a real implementation, this would call the withdrawal service
      toast.success('Withdrawal request submitted successfully!');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
    } catch (error) {
      toast.error('Failed to submit withdrawal request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-xl">
              <CurrencyDollarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-secondary-900">
                My Wallet
              </h1>
              <p className="text-secondary-600 mt-2 text-lg">
                Manage your earnings and payments
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-success-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-success-600 bg-success-100 px-2 py-1 rounded-full">
                Available
              </span>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {formatCurrency(wallet?.balance)}
            </div>
            <div className="text-sm text-secondary-600">Current Balance</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {formatCurrency(wallet?.totalEarned)}
            </div>
            <div className="text-sm text-secondary-600">Total Earned</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-warning-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-warning-600 bg-warning-100 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {formatCurrency(wallet?.pendingEarnings)}
            </div>
            <div className="text-sm text-secondary-600">Pending Earnings</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-info-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-info-500 to-info-600 rounded-xl flex items-center justify-center">
                <ArrowDownIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-info-600 bg-info-100 px-2 py-1 rounded-full">
                Withdrawn
              </span>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {formatCurrency(wallet?.totalWithdrawn)}
            </div>
            <div className="text-sm text-secondary-600">Total Withdrawn</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={() => setShowWithdrawModal(true)}
            className="bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800"
            size="lg"
          >
            <ArrowDownIcon className="w-5 h-5 mr-2" />
            Withdraw Funds
          </Button>
          <Button 
            onClick={() => navigate('/payment-methods')}
            variant="outline"
            size="lg"
          >
            <CreditCardIcon className="w-5 h-5 mr-2" />
            Payment Methods
          </Button>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl shadow-xl">
          <div className="border-b border-primary-200/50">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'transactions', name: 'Transactions', icon: BanknotesIcon },
                { id: 'earnings', name: 'Earnings', icon: ArrowUpIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-secondary-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {transactions?.slice(0, 5).map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            {getTransactionIcon(transaction.type)}
                            <div>
                              <div className="font-semibold text-secondary-900">
                                {transaction.description || `${transaction.type} transaction`}
                              </div>
                              <div className="text-sm text-secondary-600">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${
                              transaction.type === 'earning' ? 'text-success-600' : 'text-error-600'
                            }`}>
                              {transaction.type === 'earning' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                            </div>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-secondary-500">
                          No transactions yet
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-secondary-900 mb-4">Earnings Summary</h3>
                    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-secondary-700">This Month</span>
                          <span className="font-bold text-secondary-900">{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-secondary-700">Last Month</span>
                          <span className="font-bold text-secondary-900">{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-secondary-700">Average per Task</span>
                          <span className="font-bold text-secondary-900">{formatCurrency(0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <h3 className="text-lg font-bold text-secondary-900 mb-4">All Transactions</h3>
                <div className="space-y-3">
                  {transactions?.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <div className="font-semibold text-secondary-900">
                            {transaction.description || `${transaction.type} transaction`}
                          </div>
                          <div className="text-sm text-secondary-600">
                            {new Date(transaction.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${
                          transaction.type === 'earning' ? 'text-success-600' : 'text-error-600'
                        }`}>
                          {transaction.type === 'earning' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-12 text-secondary-500">
                      <BanknotesIcon className="w-12 h-12 mx-auto mb-4 text-secondary-400" />
                      <p>No transactions found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div>
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Earnings Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-success-50 rounded-xl p-6">
                    <h4 className="font-bold text-success-900 mb-4">Completed Tasks</h4>
                    <div className="text-3xl font-black text-success-900 mb-2">
                      {formatCurrency(wallet?.totalEarned)}
                    </div>
                    <div className="text-sm text-success-700">
                      From {profile?.tasks_completed || 0} completed tasks
                    </div>
                  </div>
                  
                  <div className="bg-warning-50 rounded-xl p-6">
                    <h4 className="font-bold text-warning-900 mb-4">Pending Payments</h4>
                    <div className="text-3xl font-black text-warning-900 mb-2">
                      {formatCurrency(wallet?.pendingEarnings)}
                    </div>
                    <div className="text-sm text-warning-700">
                      Awaiting approval
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-secondary-900 mb-4">Withdraw Funds</h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Amount to Withdraw
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
                max={wallet?.balance || 0}
              />
              <div className="text-sm text-secondary-600 mt-1">
                Available: {formatCurrency(wallet?.balance)}
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleWithdraw}
                className="flex-1 bg-gradient-to-r from-success-600 to-success-700"
              >
                Withdraw
              </Button>
              <Button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default Wallet;