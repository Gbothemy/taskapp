import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MobileNav from '../../components/layout/MobileNav';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const PaymentManagement = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const filters = {
          type: filterType,
          status: filterStatus,
          search: searchTerm
        };
        const paymentsData = await adminService.getAllPayments(filters);
        setPayments(paymentsData);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [searchTerm, filterType, filterStatus]);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || payment.type === filterType;
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'withdrawal':
        return <ArrowUpIcon className="w-5 h-5 text-error-600" />;
      case 'payment':
        return <ArrowDownIcon className="w-5 h-5 text-success-600" />;
      case 'refund':
        return <BanknotesIcon className="w-5 h-5 text-warning-600" />;
      default:
        return <CurrencyDollarIcon className="w-5 h-5 text-secondary-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="sm">Completed</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'processing':
        return <Badge variant="info" size="sm">Processing</Badge>;
      case 'failed':
        return <Badge variant="error" size="sm">Failed</Badge>;
      case 'cancelled':
        return <Badge variant="default" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  const handlePaymentAction = async (paymentId, action) => {
    try {
      let newStatus;
      switch (action) {
        case 'approve':
          newStatus = 'processing';
          break;
        case 'complete':
          newStatus = 'completed';
          break;
        case 'reject':
          newStatus = 'failed';
          break;
        default:
          return;
      }

      await adminService.updatePaymentStatus(paymentId, newStatus);
      
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { 
              ...payment, 
              status: newStatus,
              processedDate: new Date().toISOString().split('T')[0]
            }
          : payment
      ));

      toast.success(`Payment ${action}d successfully`);
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment');
    }
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalProcessed = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-success-50/30 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-success-50/30 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 mx-auto mb-4 text-error-500" />
          <h2 className="text-xl font-bold text-secondary-900 mb-2">Error Loading Payments</h2>
          <p className="text-secondary-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-success-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-xl">
              <CurrencyDollarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-secondary-900">
                Payment Management
              </h1>
              <p className="text-secondary-600 mt-2 text-lg">
                Monitor and process all platform payments
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-warning-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {payments.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-sm text-secondary-600">Pending Approval</div>
            <div className="text-xs text-warning-600 mt-1">
              {formatCurrency(totalPending)} total
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-info-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-info-500 to-info-600 rounded-xl flex items-center justify-center">
                <ArrowUpIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {payments.filter(p => p.status === 'processing').length}
            </div>
            <div className="text-sm text-secondary-600">Processing</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-success-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {payments.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-secondary-600">Completed</div>
            <div className="text-xs text-success-600 mt-1">
              {formatCurrency(totalProcessed)} total
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-error-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-error-500 to-error-600 rounded-xl flex items-center justify-center">
                <XCircleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {payments.filter(p => p.status === 'failed').length}
            </div>
            <div className="text-sm text-secondary-600">Failed</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search by user or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="payment">Payments</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="refund">Refunds</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-secondary-200/50">
            <h3 className="text-lg font-bold text-secondary-900">Payments ({filteredPayments.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(payment.type)}
                        <div>
                          <div className="font-semibold text-secondary-900 capitalize">
                            {payment.type}
                          </div>
                          <div className="text-sm text-secondary-600">
                            {payment.reference}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-secondary-900">{payment.user}</div>
                        <div className="text-sm text-secondary-600 capitalize">{payment.userType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-bold text-lg ${
                        payment.type === 'payment' ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {payment.type === 'payment' ? '+' : '-'}{formatCurrency(payment.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-secondary-900">{payment.method}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-secondary-900">
                          Requested: {new Date(payment.requestDate).toLocaleDateString()}
                        </div>
                        {payment.processedDate && (
                          <div className="text-secondary-600">
                            Processed: {new Date(payment.processedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => toast('Payment details view coming soon!')}
                          variant="outline"
                          size="sm"
                          className="text-info-600 border-info-600 hover:bg-info-50"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                        {payment.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handlePaymentAction(payment.id, 'approve')}
                              variant="outline"
                              size="sm"
                              className="text-success-600 border-success-600 hover:bg-success-50"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handlePaymentAction(payment.id, 'reject')}
                              variant="outline"
                              size="sm"
                              className="text-error-600 border-error-600 hover:bg-error-50"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {payment.status === 'processing' && (
                          <Button
                            onClick={() => handlePaymentAction(payment.id, 'complete')}
                            variant="outline"
                            size="sm"
                            className="text-success-600 border-success-600 hover:bg-success-50"
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default PaymentManagement;