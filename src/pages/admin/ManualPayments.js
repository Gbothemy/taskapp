import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  CurrencyDollarIcon, 
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AdminLayout from '../../components/admin/AdminLayout';
import { transactionsService, usersService } from '../../services/supabase';
import toast from 'react-hot-toast';

const ManualPayments = () => {
  const { user } = useSelector((state) => state.auth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [processNotes, setProcessNotes] = useState('');

  useEffect(() => {
    loadPendingTransactions();
  }, []);

  const loadPendingTransactions = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch pending withdrawal requests
      const mockTransactions = [
        {
          id: 'txn_1',
          user_id: 'user_1',
          user_name: 'John Doe',
          user_email: 'john@example.com',
          amount: 150.00,
          type: 'withdrawal',
          status: 'pending',
          description: 'Withdrawal request',
          payment_method: 'PayPal - john@example.com',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          requested_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'txn_2',
          user_id: 'user_2',
          user_name: 'Jane Smith',
          user_email: 'jane@example.com',
          amount: 75.50,
          type: 'withdrawal',
          status: 'pending',
          description: 'Withdrawal request',
          payment_method: 'Bank Transfer - Chase ****1234',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          requested_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'txn_3',
          user_id: 'user_3',
          user_name: 'Mike Johnson',
          user_email: 'mike@example.com',
          amount: 200.00,
          type: 'withdrawal',
          status: 'processing',
          description: 'Withdrawal request',
          payment_method: 'Crypto - Bitcoin',
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          requested_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast.error('Failed to load pending transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (transactionId, action, notes = '') => {
    setProcessing(prev => ({ ...prev, [transactionId]: true }));
    
    try {
      // In a real implementation, this would update the transaction status
      // and potentially trigger actual payment processing
      
      const newStatus = action === 'approve' ? 'completed' : 'failed';
      const statusText = action === 'approve' ? 'approved' : 'rejected';
      
      // Update local state
      setTransactions(prev => 
        prev.map(txn => 
          txn.id === transactionId 
            ? { 
                ...txn, 
                status: newStatus,
                processed_at: new Date().toISOString(),
                admin_notes: notes,
                processed_by: user.id
              }
            : txn
        )
      );

      toast.success(`Payment ${statusText} successfully`);
      
      // Close modal if open
      setShowProcessModal(false);
      setSelectedTransaction(null);
      setProcessNotes('');
      
    } catch (error) {
      console.error('Failed to process payment:', error);
      toast.error('Failed to process payment');
    } finally {
      setProcessing(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning" size="sm">Pending Review</Badge>;
      case 'processing':
        return <Badge variant="info" size="sm">Processing</Badge>;
      case 'completed':
        return <Badge variant="success" size="sm">Completed</Badge>;
      case 'failed':
        return <Badge variant="error" size="sm">Failed</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: transactions.filter(t => t.status === 'pending').length,
    processing: transactions.filter(t => t.status === 'processing').length,
    completed: transactions.filter(t => t.status === 'completed').length,
    totalAmount: transactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0)
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="xl" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manual Payments</h1>
              <p className="text-gray-600">Process withdrawal requests and manual payments</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <DocumentTextIcon className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalAmount.toFixed(2)}</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-gray-500" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by user name, email, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Transactions List */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Payment Requests ({filteredTransactions.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {transaction.user_name}
                        </h4>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <p className="text-sm text-gray-600">{transaction.user_email}</p>
                      <p className="text-xs text-gray-500">
                        Requested {new Date(transaction.requested_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {transaction.payment_method}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {transaction.id}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {transaction.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowProcessModal(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          Review
                        </Button>
                        <Button
                          onClick={() => handleProcessPayment(transaction.id, 'approve')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={processing[transaction.id]}
                        >
                          {processing[transaction.id] ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <CheckCircleIcon className="w-4 h-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleProcessPayment(transaction.id, 'reject')}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          disabled={processing[transaction.id]}
                        >
                          <XCircleIcon className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {transaction.status === 'processing' && (
                      <Button
                        onClick={() => handleProcessPayment(transaction.id, 'approve')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={processing[transaction.id]}
                      >
                        {processing[transaction.id] ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          'Mark Complete'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="p-12 text-center">
                <CurrencyDollarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Requests</h3>
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No requests match your current filters'
                    : 'No pending payment requests at this time'
                  }
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Process Payment Modal */}
      {showProcessModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Process Payment Request
            </h3>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2 text-sm">
                <div><strong>User:</strong> {selectedTransaction.user_name}</div>
                <div><strong>Email:</strong> {selectedTransaction.user_email}</div>
                <div><strong>Amount:</strong> ${selectedTransaction.amount.toFixed(2)}</div>
                <div><strong>Method:</strong> {selectedTransaction.payment_method}</div>
                <div><strong>Requested:</strong> {new Date(selectedTransaction.requested_at).toLocaleString()}</div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processing Notes (Optional)
              </label>
              <textarea
                value={processNotes}
                onChange={(e) => setProcessNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                placeholder="Add any notes about this payment processing..."
              />
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => handleProcessPayment(selectedTransaction.id, 'approve', processNotes)}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={processing[selectedTransaction.id]}
              >
                {processing[selectedTransaction.id] ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Approve & Process'
                )}
              </Button>
              <Button
                onClick={() => handleProcessPayment(selectedTransaction.id, 'reject', processNotes)}
                variant="outline"
                className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                disabled={processing[selectedTransaction.id]}
              >
                Reject
              </Button>
              <Button
                onClick={() => {
                  setShowProcessModal(false);
                  setSelectedTransaction(null);
                  setProcessNotes('');
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManualPayments;