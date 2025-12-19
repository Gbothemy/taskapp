import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  CreditCardIcon, 
  PlusIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PaymentMethodModal from '../../components/payment/PaymentMethodModal';
import PaymentMethodsList from '../../components/payment/PaymentMethodsList';
import MobileNav from '../../components/layout/MobileNav';
import { paymentService } from '../../services/supabase';
import toast from 'react-hot-toast';

const PaymentMethods = () => {
  const { user } = useSelector((state) => state.auth);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadPaymentMethods();
    }
  }, [user?.id]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await paymentService.getPaymentMethods(user.id);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaymentMethod = async (methodData) => {
    try {
      if (editingMethod) {
        // Update existing method
        const updatedMethod = await paymentService.updatePaymentMethod(editingMethod.id, methodData);
        setPaymentMethods(prev => 
          prev.map(method => 
            method.id === editingMethod.id ? updatedMethod : method
          )
        );
        setEditingMethod(null);
      } else {
        // Add new method
        const newMethod = await paymentService.addPaymentMethod(user.id, methodData);
        setPaymentMethods(prev => [...prev, newMethod]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save payment method:', error);
      throw error;
    }
  };

  const handleEditPaymentMethod = (method) => {
    setEditingMethod(method);
    setShowModal(true);
  };

  const handleDeletePaymentMethod = async (methodId) => {
    try {
      await paymentService.deletePaymentMethod(methodId);
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      throw error;
    }
  };

  const handleSetDefaultPaymentMethod = async (methodId) => {
    try {
      await paymentService.setDefaultPaymentMethod(methodId);
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          isDefault: method.id === methodId
        }))
      );
    } catch (error) {
      console.error('Failed to set default payment method:', error);
      throw error;
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <CreditCardIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  Payment Methods
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Manage how you receive payments
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => {
                setEditingMethod(null);
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700"
              size="lg"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-start space-x-3">
            <ShieldCheckIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Your Payment Information is Secure
              </h3>
              <p className="text-green-800 text-sm leading-relaxed">
                All payment information is encrypted using industry-standard security protocols. 
                We never store sensitive details like full card numbers or CVV codes. 
                Your financial data is protected with bank-level security.
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Methods List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Your Payment Methods
            </h2>
            <div className="text-sm text-gray-600">
              {paymentMethods.length} method{paymentMethods.length !== 1 ? 's' : ''} added
            </div>
          </div>

          <PaymentMethodsList
            paymentMethods={paymentMethods}
            onEdit={handleEditPaymentMethod}
            onDelete={handleDeletePaymentMethod}
            onSetDefault={handleSetDefaultPaymentMethod}
          />

          {paymentMethods.length === 0 && (
            <div className="text-center py-12">
              <CreditCardIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Payment Methods Added
              </h3>
              <p className="text-gray-600 mb-6">
                Add a payment method to start receiving payments for your completed tasks.
              </p>
              <Button
                onClick={() => {
                  setEditingMethod(null);
                  setShowModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Your First Payment Method
              </Button>
            </div>
          )}
        </Card>

        {/* Important Information */}
        <Card className="p-6 mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                Important Information
              </h3>
              <div className="text-amber-800 text-sm space-y-2">
                <p>
                  • Payments are processed within 1-3 business days after task approval
                </p>
                <p>
                  • Minimum withdrawal amount is $10.00
                </p>
                <p>
                  • Payment processing fees may apply depending on the method chosen
                </p>
                <p>
                  • Ensure your payment information is accurate to avoid delays
                </p>
                <p>
                  • You can change your default payment method at any time
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMethod(null);
        }}
        onSave={handleSavePaymentMethod}
        editingMethod={editingMethod}
      />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default PaymentMethods;