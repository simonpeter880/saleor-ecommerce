/**
 * MobileMoneyPayment Component
 *
 * Uganda-specific mobile money payment interface
 * Supports MTN Mobile Money and Airtel Money
 */

'use client';

import React, { useState } from 'react';
import {
  validateUgandaPhoneNumber,
  formatUGX,
  initiateMobileMoneyPayment,
  getProviderInfo,
  type MobileMoneyProvider,
} from '@/lib/payment/mobile-money';

interface MobileMoneyPaymentProps {
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail?: string;
  onSuccess: (transactionId: string, reference: string) => void;
  onError: (error: string) => void;
}

export function MobileMoneyPayment({
  amount,
  orderId,
  customerName,
  customerEmail,
  onSuccess,
  onError,
}: MobileMoneyPaymentProps) {
  const [selectedProvider, setSelectedProvider] = useState<MobileMoneyProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');

  // Auto-detect provider from phone number
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setPhoneError('');

    const validation = validateUgandaPhoneNumber(value);
    if (value.length >= 10) {
      if (!validation.isValid) {
        setPhoneError(validation.error || 'Invalid phone number');
        setSelectedProvider(null);
      } else {
        setSelectedProvider(validation.provider || null);
      }
    } else {
      setSelectedProvider(null);
    }
  };

  const handlePayment = async () => {
    // Validate phone number
    const validation = validateUgandaPhoneNumber(phoneNumber);
    if (!validation.isValid) {
      setPhoneError(validation.error || 'Invalid phone number');
      return;
    }

    if (!validation.provider) {
      setPhoneError('Could not detect mobile money provider');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('pending');

    try {
      const result = await initiateMobileMoneyPayment({
        provider: validation.provider,
        phoneNumber: validation.formatted!,
        amount,
        currency: 'UGX',
        orderId,
        customerName,
        customerEmail,
      });

      if (result.success && result.transactionId && result.reference) {
        setPaymentStatus('success');
        onSuccess(result.transactionId, result.reference);
      } else {
        setPaymentStatus('failed');
        onError(result.message);
      }
    } catch (error) {
      setPaymentStatus('failed');
      onError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const providerInfo = selectedProvider ? getProviderInfo(selectedProvider) : null;

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* MTN Mobile Money */}
          <button
            onClick={() => {
              setSelectedProvider('mtn');
              setPhoneNumber('');
              setPhoneError('');
            }}
            className={`p-6 border-2 rounded-lg transition ${
              selectedProvider === 'mtn'
                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-yellow-300'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">📱</div>
              <div className="font-semibold">MTN MoMo</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                077, 078, 076
              </div>
            </div>
          </button>

          {/* Airtel Money */}
          <button
            onClick={() => {
              setSelectedProvider('airtel');
              setPhoneNumber('');
              setPhoneError('');
            }}
            className={`p-6 border-2 rounded-lg transition ${
              selectedProvider === 'airtel'
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">📲</div>
              <div className="font-semibold">Airtel Money</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                070, 075, 074
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Phone Number Input */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          Mobile Money Number
        </label>
        <div className="relative">
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="0777 123 456"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
              phoneError
                ? 'border-red-500 focus:ring-red-500'
                : providerInfo
                ? 'border-green-500 focus:ring-green-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {providerInfo && !phoneError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: providerInfo.color,
                  color: providerInfo.textColor,
                }}
              >
                {providerInfo.shortName}
              </div>
            </div>
          )}
        </div>
        {phoneError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{phoneError}</p>
        )}
        {providerInfo && !phoneError && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {providerInfo.instructions}
          </p>
        )}
      </div>

      {/* Amount Display */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Amount to Pay:</span>
          <span className="text-2xl font-bold">{formatUGX(amount)}</span>
        </div>
      </div>

      {/* Payment Status */}
      {paymentStatus === 'pending' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <div>
              <div className="font-semibold text-blue-900 dark:text-blue-100">
                Processing Payment...
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Check your phone for a payment prompt from {providerInfo?.shortName}
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <div className="font-semibold text-green-900 dark:text-green-100">
                Payment Successful!
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Your order is being processed
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <div className="font-semibold text-red-900 dark:text-red-100">
                Payment Failed
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">
                Please try again or contact support
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={!phoneNumber || !!phoneError || !selectedProvider || isProcessing}
        className={`w-full py-4 rounded-lg font-semibold transition ${
          !phoneNumber || !!phoneError || !selectedProvider || isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : providerInfo
            ? 'hover:opacity-90'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        style={
          providerInfo && !phoneError && !isProcessing
            ? {
                backgroundColor: providerInfo.color,
                color: providerInfo.textColor,
              }
            : undefined
        }
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
            Processing...
          </span>
        ) : (
          `Pay ${formatUGX(amount)} with ${providerInfo?.shortName || 'Mobile Money'}`
        )}
      </button>

      {/* Help Text */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Secure payment powered by {providerInfo?.name || 'Mobile Money'}</p>
        <p className="mt-1">You will receive a prompt on your phone to confirm payment</p>
      </div>
    </div>
  );
}

export default MobileMoneyPayment;
