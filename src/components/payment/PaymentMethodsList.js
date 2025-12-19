import React, { useState } from 'react';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import toast from 'react-hot-toast';

const PaymentMethodsList = ({ paymentMethods, onEdit, onDelete, onSetDefault }) => {
  const [deletingId, setDeletingId] = useState(null);

  // Add safety check for paymentMethods prop
  const safeMethods = Array.isArray(paymentMethods) ? paymentMethods : [];

  const getPaymentMethodIcon = (type) => {
    switch (type) {
      case 'card':
        return <CreditCardIcon className="w-6 h-6 text-blue-600" />;
      case 'bank':
        return <BanknotesIcon className="w-6 h-6 text-green-600" />;
      case 'bank_transfer':
        return <ArrowsRightLeftIcon className="w-6 h-6 text-purple-600" />;
      case 'paypal':
        return <CheckCircleIcon className="w-6 h-6 text-blue-500" />;
      case 'crypto':
        return <BanknotesIcon className="w-6 h-6 text-orange-500" />;
      default:
        return <CreditCardIcon className="w-6 h-6 text-gray-600" />;
    }
  };

  const getPaymentMethodDetails = (method) => {
    // Add debugging
    console.log('Processing payment method:', method);
    
    const details = method.details || {};
    
    switch (method.type) {
      case 'card':
        return {
          title: `${details.cardholderName || 'Card'}`,
          subtitle: `**** **** **** ${details.cardNumber?.slice(-4) || '****'}`,
          extra: details.expiryMonth && details.expiryYear 
            ? `Expires ${details.expiryMonth}/${details.expiryYear}`
            : null
        };
      case 'bank':
        return {
          title: details.bankName || 'Bank Account',
          subtitle: `${details.accountType || 'Account'} ****${details.accountNumber?.slice(-4) || '****'}`,
          extra: details.routingNumber ? `Routing: ${details.routingNumber}` : null
        };
      case 'bank_transfer':
        return {
          title: `${details.transferType?.toUpperCase() || 'Bank'} Transfer`,
          subtitle: `${details.beneficiaryName || 'Beneficiary'} - ${details.bankName || 'Bank'}`,
          extra: details.swiftCode ? `SWIFT: ${details.swiftCode}` : 
                details.routingNumber ? `Routing: ${details.routingNumber}` : null
        };
      case 'paypal':
        return {
          title: 'PayPal',
          subtitle: details.paypalEmail || 'PayPal Account',
          extra: null
        };
      case 'crypto':
        return {
          title: `${details.cryptoType?.toUpperCase() || 'Crypto'} Wallet`,
          subtitle: `${details.walletAddress?.slice(0, 8) || ''}...${details.walletAddress?.slice(-8) || ''}`,
          extra: null
        };
      default:
        return {
          title: method.name || 'Payment Method',
          subtitle: 'Unknown type',
          extra: null
        };
    }
  };

  const handleDelete = async (methodId) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    setDeletingId(methodId);
    try {
      await onDelete(methodId);
      toast.success('Payment method deleted successfully');
    } catch (error) {
      toast.error('Failed to delete payment method');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      await onSetDefault(methodId);
      toast.success('Default payment method updated');
    } catch (error) {
      toast.error('Failed to update default payment method');
    }
  };

  if (!safeMethods || safeMethods.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCardIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Methods</h3>
        <p className="text-gray-600">Add a payment method to receive payments</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {safeMethods.map((method) => {
        // Add safety check for method object
        if (!method || !method.id) {
          console.warn('Invalid payment method object:', method);
          return null;
        }
        
        const details = getPaymentMethodDetails(method);
        
        return (
          <div
            key={method.id}
            className={`bg-white border-2 rounded-xl p-6 transition-all duration-200 ${
              method.isDefault 
                ? 'border-primary-200 bg-primary-50/50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getPaymentMethodIcon(method.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {method.name}
                    </h4>
                    {method.isDefault && (
                      <Badge variant="success" size="sm">
                        <StarIconSolid className="w-3 h-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="font-medium">{details.title}</div>
                    <div>{details.subtitle}</div>
                    {details.extra && (
                      <div className="text-xs text-gray-500">{details.extra}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!method.isDefault && (
                  <Button
                    onClick={() => handleSetDefault(method.id)}
                    variant="outline"
                    size="sm"
                    className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                  >
                    <StarIcon className="w-4 h-4 mr-1" />
                    Set Default
                  </Button>
                )}
                
                <Button
                  onClick={() => onEdit(method)}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={() => handleDelete(method.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  disabled={deletingId === method.id}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-600">
                  <div className="font-medium">Secure & Encrypted</div>
                  <div>Your payment information is encrypted and stored securely.</div>
                </div>
              </div>
            </div>
          </div>
        );
      }).filter(Boolean)}
    </div>
  );
};

export default PaymentMethodsList;