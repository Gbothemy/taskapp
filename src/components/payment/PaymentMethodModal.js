import React, { useState } from 'react';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';

const PaymentMethodModal = ({ isOpen, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'card',
    name: '',
    details: {
      // Card details
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      // Bank details
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      accountType: 'checking',
      // Bank Transfer details
      beneficiaryName: '',
      beneficiaryAddress: '',
      swiftCode: '',
      iban: '',
      transferType: 'domestic',
      intermediaryBank: '',
      // PayPal details
      paypalEmail: '',
      // Crypto details
      walletAddress: '',
      cryptoType: 'bitcoin'
    },
    isDefault: false
  });

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPaymentMethod(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPaymentMethod(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentMethod.name.trim()) {
      toast.error('Please enter a name for this payment method');
      return;
    }

    // Validate based on payment type
    if (paymentMethod.type === 'card') {
      if (!paymentMethod.details.cardNumber || !paymentMethod.details.cardholderName) {
        toast.error('Please fill in all card details');
        return;
      }
    } else if (paymentMethod.type === 'bank') {
      if (!paymentMethod.details.bankName || !paymentMethod.details.accountNumber) {
        toast.error('Please fill in all bank details');
        return;
      }
    } else if (paymentMethod.type === 'bank_transfer') {
      if (!paymentMethod.details.beneficiaryName || !paymentMethod.details.bankName) {
        toast.error('Please fill in all bank transfer details');
        return;
      }
      if (paymentMethod.details.transferType === 'international' && !paymentMethod.details.swiftCode) {
        toast.error('SWIFT code is required for international transfers');
        return;
      }
    } else if (paymentMethod.type === 'paypal') {
      if (!paymentMethod.details.paypalEmail) {
        toast.error('Please enter PayPal email');
        return;
      }
    } else if (paymentMethod.type === 'crypto') {
      if (!paymentMethod.details.walletAddress) {
        toast.error('Please enter wallet address');
        return;
      }
    }

    setLoading(true);
    try {
      await onSave(paymentMethod);
      toast.success('Payment method added successfully!');
      onClose();
      // Reset form
      setPaymentMethod({
        type: 'card',
        name: '',
        details: {
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          cardholderName: '',
          bankName: '',
          accountNumber: '',
          routingNumber: '',
          accountType: 'checking',
          beneficiaryName: '',
          beneficiaryAddress: '',
          swiftCode: '',
          iban: '',
          transferType: 'domestic',
          intermediaryBank: '',
          paypalEmail: '',
          walletAddress: '',
          cryptoType: 'bitcoin'
        },
        isDefault: false
      });
    } catch (error) {
      toast.error('Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderPaymentFields = () => {
    switch (paymentMethod.type) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                value={paymentMethod.details.cardholderName}
                onChange={(e) => handleInputChange('details.cardholderName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={paymentMethod.details.cardNumber}
                onChange={(e) => handleInputChange('details.cardNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <select
                  value={paymentMethod.details.expiryMonth}
                  onChange={(e) => handleInputChange('details.expiryMonth', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={paymentMethod.details.expiryYear}
                  onChange={(e) => handleInputChange('details.expiryYear', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">YYYY</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={paymentMethod.details.cvv}
                  onChange={(e) => handleInputChange('details.cvv', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="123"
                  maxLength="4"
                />
              </div>
            </div>
          </div>
        );

      case 'bank':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                value={paymentMethod.details.bankName}
                onChange={(e) => handleInputChange('details.bankName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Chase Bank"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                value={paymentMethod.details.accountNumber}
                onChange={(e) => handleInputChange('details.accountNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Routing Number
              </label>
              <input
                type="text"
                value={paymentMethod.details.routingNumber}
                onChange={(e) => handleInputChange('details.routingNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="021000021"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <select
                value={paymentMethod.details.accountType}
                onChange={(e) => handleInputChange('details.accountType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
          </div>
        );

      case 'bank_transfer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer Type
              </label>
              <select
                value={paymentMethod.details.transferType}
                onChange={(e) => handleInputChange('details.transferType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="domestic">Domestic Transfer</option>
                <option value="international">International Wire Transfer</option>
                <option value="ach">ACH Transfer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiary Name *
              </label>
              <input
                type="text"
                value={paymentMethod.details.beneficiaryName}
                onChange={(e) => handleInputChange('details.beneficiaryName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                value={paymentMethod.details.bankName}
                onChange={(e) => handleInputChange('details.bankName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Chase Bank"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                value={paymentMethod.details.accountNumber}
                onChange={(e) => handleInputChange('details.accountNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="1234567890"
              />
            </div>

            {paymentMethod.details.transferType === 'domestic' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routing Number
                </label>
                <input
                  type="text"
                  value={paymentMethod.details.routingNumber}
                  onChange={(e) => handleInputChange('details.routingNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="021000021"
                />
              </div>
            )}

            {paymentMethod.details.transferType === 'international' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SWIFT Code *
                  </label>
                  <input
                    type="text"
                    value={paymentMethod.details.swiftCode}
                    onChange={(e) => handleInputChange('details.swiftCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="CHASUS33"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IBAN (if applicable)
                  </label>
                  <input
                    type="text"
                    value={paymentMethod.details.iban}
                    onChange={(e) => handleInputChange('details.iban', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="GB29 NWBK 6016 1331 9268 19"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intermediary Bank (if required)
                  </label>
                  <input
                    type="text"
                    value={paymentMethod.details.intermediaryBank}
                    onChange={(e) => handleInputChange('details.intermediaryBank', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Correspondent Bank Name"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiary Address
              </label>
              <textarea
                value={paymentMethod.details.beneficiaryAddress}
                onChange={(e) => handleInputChange('details.beneficiaryAddress', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                placeholder="123 Main St, City, State, ZIP, Country"
              />
            </div>
          </div>
        );

      case 'paypal':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PayPal Email *
              </label>
              <input
                type="email"
                value={paymentMethod.details.paypalEmail}
                onChange={(e) => handleInputChange('details.paypalEmail', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="user@example.com"
              />
            </div>
          </div>
        );

      case 'crypto':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cryptocurrency Type
              </label>
              <select
                value={paymentMethod.details.cryptoType}
                onChange={(e) => handleInputChange('details.cryptoType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="bitcoin">Bitcoin (BTC)</option>
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="usdc">USD Coin (USDC)</option>
                <option value="usdt">Tether (USDT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Address *
              </label>
              <input
                type="text"
                value={paymentMethod.details.walletAddress}
                onChange={(e) => handleInputChange('details.walletAddress', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Add Payment Method</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { type: 'card', label: 'Credit/Debit Card', icon: CreditCardIcon },
                { type: 'bank', label: 'Bank Account', icon: BanknotesIcon },
                { type: 'bank_transfer', label: 'Bank Transfer', icon: ArrowsRightLeftIcon },
                { type: 'paypal', label: 'PayPal', icon: CheckCircleIcon },
                { type: 'crypto', label: 'Cryptocurrency', icon: BanknotesIcon }
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPaymentMethod(prev => ({ ...prev, type }))}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                    paymentMethod.type === type
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method Name *
            </label>
            <input
              type="text"
              value={paymentMethod.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="My Primary Card"
            />
          </div>

          {/* Payment Method Fields */}
          {renderPaymentFields()}

          {/* Default Payment Method */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={paymentMethod.isDefault}
              onChange={(e) => handleInputChange('isDefault', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
              Set as default payment method
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Add Payment Method'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethodModal;