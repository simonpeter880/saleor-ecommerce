/**
 * Uganda Mobile Money Payment Integration
 *
 * Supports:
 * - MTN Mobile Money (MoMo)
 * - Airtel Money
 *
 * These are the dominant payment methods in Uganda (>90% of digital transactions)
 */

export type MobileMoneyProvider = 'mtn' | 'airtel';

export interface MobileMoneyPaymentRequest {
  provider: MobileMoneyProvider;
  phoneNumber: string; // Format: 256XXXXXXXXX (Uganda country code)
  amount: number;
  currency: 'UGX'; // Uganda Shillings
  orderId: string;
  customerName: string;
  customerEmail?: string;
  reference?: string;
}

export interface MobileMoneyPaymentResponse {
  success: boolean;
  transactionId?: string;
  reference?: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  message: string;
  provider: MobileMoneyProvider;
}

/**
 * Validate Uganda phone number format
 * Accepts: 0777123456, 777123456, 256777123456, +256777123456
 */
export function validateUgandaPhoneNumber(phoneNumber: string): {
  isValid: boolean;
  formatted?: string; // Returns 256XXXXXXXXX format
  provider?: MobileMoneyProvider;
  error?: string;
} {
  // Remove spaces and special characters
  let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

  // Remove + if present
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // If starts with 0, remove it and add 256
  if (cleaned.startsWith('0')) {
    cleaned = '256' + cleaned.substring(1);
  }

  // If doesn't start with 256, add it
  if (!cleaned.startsWith('256')) {
    cleaned = '256' + cleaned;
  }

  // Should now be 256XXXXXXXXX (12 digits total)
  if (cleaned.length !== 12) {
    return {
      isValid: false,
      error: 'Invalid phone number length. Must be 10 digits (07XXXXXXXX)',
    };
  }

  // Extract network prefix (after 256)
  const networkPrefix = cleaned.substring(3, 6);

  // MTN prefixes: 077, 078, 076
  const mtnPrefixes = ['077', '078', '076'];
  // Airtel prefixes: 070, 075, 074
  const airtelPrefixes = ['070', '075', '074'];

  let provider: MobileMoneyProvider | undefined;

  if (mtnPrefixes.includes(networkPrefix)) {
    provider = 'mtn';
  } else if (airtelPrefixes.includes(networkPrefix)) {
    provider = 'airtel';
  } else {
    return {
      isValid: false,
      error: 'Phone number is not MTN or Airtel. Only MTN (077/078/076) and Airtel (070/075/074) are supported.',
    };
  }

  return {
    isValid: true,
    formatted: cleaned,
    provider,
  };
}

/**
 * Format amount for Uganda Shillings (no decimals)
 */
export function formatUGX(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Initiate MTN Mobile Money payment
 * This would integrate with MTN MoMo API in production
 */
export async function initiateMTNPayment(
  request: MobileMoneyPaymentRequest
): Promise<MobileMoneyPaymentResponse> {
  try {
    // Validate phone number
    const validation = validateUgandaPhoneNumber(request.phoneNumber);
    if (!validation.isValid) {
      return {
        success: false,
        status: 'failed',
        message: validation.error || 'Invalid phone number',
        provider: 'mtn',
      };
    }

    if (validation.provider !== 'mtn') {
      return {
        success: false,
        status: 'failed',
        message: 'Phone number is not MTN. Please use MTN number (077/078/076)',
        provider: 'mtn',
      };
    }

    // TODO: Replace with actual MTN MoMo API integration
    // For now, return mock response for development
    const response = await fetch('/api/payments/mtn-momo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: validation.formatted,
        amount: request.amount,
        currency: request.currency,
        orderId: request.orderId,
        reference: request.reference || `ORDER-${request.orderId}`,
      }),
    });

    const data = await response.json();

    return {
      success: data.success,
      transactionId: data.transactionId,
      reference: data.reference,
      status: data.status,
      message: data.message,
      provider: 'mtn',
    };
  } catch (error) {
    console.error('MTN MoMo payment error:', error);
    return {
      success: false,
      status: 'failed',
      message: 'Payment failed. Please try again.',
      provider: 'mtn',
    };
  }
}

/**
 * Initiate Airtel Money payment
 * This would integrate with Airtel Money API in production
 */
export async function initiateAirtelPayment(
  request: MobileMoneyPaymentRequest
): Promise<MobileMoneyPaymentResponse> {
  try {
    // Validate phone number
    const validation = validateUgandaPhoneNumber(request.phoneNumber);
    if (!validation.isValid) {
      return {
        success: false,
        status: 'failed',
        message: validation.error || 'Invalid phone number',
        provider: 'airtel',
      };
    }

    if (validation.provider !== 'airtel') {
      return {
        success: false,
        status: 'failed',
        message: 'Phone number is not Airtel. Please use Airtel number (070/075/074)',
        provider: 'airtel',
      };
    }

    // TODO: Replace with actual Airtel Money API integration
    const response = await fetch('/api/payments/airtel-money', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: validation.formatted,
        amount: request.amount,
        currency: request.currency,
        orderId: request.orderId,
        reference: request.reference || `ORDER-${request.orderId}`,
      }),
    });

    const data = await response.json();

    return {
      success: data.success,
      transactionId: data.transactionId,
      reference: data.reference,
      status: data.status,
      message: data.message,
      provider: 'airtel',
    };
  } catch (error) {
    console.error('Airtel Money payment error:', error);
    return {
      success: false,
      status: 'failed',
      message: 'Payment failed. Please try again.',
      provider: 'airtel',
    };
  }
}

/**
 * Unified mobile money payment function
 */
export async function initiateMobileMoneyPayment(
  request: MobileMoneyPaymentRequest
): Promise<MobileMoneyPaymentResponse> {
  // Auto-detect provider if not specified
  if (!request.provider) {
    const validation = validateUgandaPhoneNumber(request.phoneNumber);
    if (!validation.isValid || !validation.provider) {
      return {
        success: false,
        status: 'failed',
        message: validation.error || 'Could not detect mobile money provider',
        provider: 'mtn',
      };
    }
    request.provider = validation.provider;
  }

  // Route to appropriate provider
  switch (request.provider) {
    case 'mtn':
      return initiateMTNPayment(request);
    case 'airtel':
      return initiateAirtelPayment(request);
    default:
      return {
        success: false,
        status: 'failed',
        message: 'Unsupported mobile money provider',
        provider: request.provider,
      };
  }
}

/**
 * Check payment status
 */
export async function checkMobileMoneyPaymentStatus(
  transactionId: string,
  provider: MobileMoneyProvider
): Promise<{
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  message: string;
}> {
  try {
    const response = await fetch(`/api/payments/status/${provider}/${transactionId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    return {
      status: 'failed',
      message: 'Could not check payment status',
    };
  }
}

/**
 * Get provider info and branding
 */
export function getProviderInfo(provider: MobileMoneyProvider) {
  const providers = {
    mtn: {
      name: 'MTN Mobile Money',
      shortName: 'MTN MoMo',
      color: '#FFCC00',
      textColor: '#000000',
      logo: '/images/mtn-momo-logo.png',
      prefixes: ['077', '078', '076'],
      instructions: 'You will receive a prompt on your phone to approve the payment',
    },
    airtel: {
      name: 'Airtel Money',
      shortName: 'Airtel Money',
      color: '#E60000',
      textColor: '#FFFFFF',
      logo: '/images/airtel-money-logo.png',
      prefixes: ['070', '075', '074'],
      instructions: 'You will receive a prompt on your phone to approve the payment',
    },
  };

  return providers[provider];
}
