# Uganda Mobile Money Integration Guide

**Status**: ✅ Ready for Testing (Mock Mode) / 🔄 Production Setup Required
**Date**: 2026-01-12
**Providers**: MTN Mobile Money & Airtel Money

---

## Overview

This implementation provides a complete mobile money payment solution for the Uganda market, supporting the two dominant providers:

- **MTN Mobile Money (MoMo)** - ~60% market share
  - Prefixes: 077, 078, 076
  - Yellow branding (#FFCC00)

- **Airtel Money** - ~30% market share
  - Prefixes: 070, 075, 074
  - Red branding (#E60000)

**Why Mobile Money?**
- 90%+ of digital transactions in Uganda use mobile money
- Better than Apple/Google Pay for African market
- No need for bank accounts or cards
- Instant payments with phone approval

---

## Files Created

### Core Library
- **`src/lib/payment/mobile-money.ts`** (380 lines)
  - Phone number validation with auto-detection
  - Provider routing (MTN/Airtel)
  - Payment initiation
  - Status checking
  - UGX formatting

### UI Component
- **`src/components/checkout/MobileMoneyPayment.tsx`** (300 lines)
  - Provider selection buttons
  - Phone number input with validation
  - Auto-detection of provider from number
  - Real-time payment status
  - Branded UI per provider

### API Routes
- **`src/app/api/payments/mtn-momo/route.ts`**
  - POST: Initiate MTN payment
  - GET: Check payment status

- **`src/app/api/payments/airtel-money/route.ts`**
  - POST: Initiate Airtel payment
  - GET: Check payment status

- **`src/app/api/payments/status/[provider]/[transactionId]/route.ts`**
  - Unified status checking endpoint

---

## Features

### ✅ Implemented
- [x] Phone number validation (Uganda format)
- [x] Auto-detection of provider from phone prefix
- [x] MTN Mobile Money integration (mock)
- [x] Airtel Money integration (mock)
- [x] Real-time payment status updates
- [x] Provider-specific branding
- [x] UGX currency formatting
- [x] Error handling and validation
- [x] Responsive design (mobile-first)
- [x] Dark mode support

### 🔄 Production Setup Required
- [ ] MTN MoMo API credentials
- [ ] Airtel Money API credentials
- [ ] Webhook handlers for callbacks
- [ ] Transaction logging
- [ ] Refund handling
- [ ] Reconciliation reports

---

## How It Works

### 1. User Flow

```
1. User enters phone number (e.g., 0777 123 456)
2. System auto-detects provider (MTN)
3. User clicks "Pay with MTN MoMo"
4. System sends payment request to MTN API
5. User receives USSD prompt on their phone
6. User enters PIN to approve payment
7. System receives callback confirmation
8. Order is marked as paid
```

### 2. Phone Number Validation

The system accepts multiple formats and normalizes them:

| Input | Normalized | Provider | Valid |
|-------|------------|----------|-------|
| 0777123456 | 256777123456 | MTN | ✅ |
| 777123456 | 256777123456 | MTN | ✅ |
| +256777123456 | 256777123456 | MTN | ✅ |
| 256777123456 | 256777123456 | MTN | ✅ |
| 0700123456 | 256700123456 | Airtel | ✅ |
| 0750123456 | 256750123456 | Airtel | ✅ |
| 0712345678 | - | Invalid | ❌ |

### 3. Provider Detection

**MTN Prefixes**: 077, 078, 076
**Airtel Prefixes**: 070, 075, 074

The component automatically detects the provider and styles accordingly.

---

## Usage

### Basic Integration

```tsx
import { MobileMoneyPayment } from '@/components/checkout/MobileMoneyPayment';

function CheckoutPage() {
  const handleSuccess = (transactionId: string, reference: string) => {
    console.log('Payment successful!', { transactionId, reference });
    // Redirect to order confirmation
  };

  const handleError = (error: string) => {
    console.error('Payment failed:', error);
    // Show error message to user
  };

  return (
    <MobileMoneyPayment
      amount={150000} // UGX 150,000
      orderId="ORD-12345"
      customerName="John Doe"
      customerEmail="john@example.com"
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

### Programmatic Payment

```typescript
import { initiateMobileMoneyPayment } from '@/lib/payment/mobile-money';

const result = await initiateMobileMoneyPayment({
  provider: 'mtn', // or 'airtel'
  phoneNumber: '0777123456',
  amount: 150000,
  currency: 'UGX',
  orderId: 'ORD-12345',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
});

if (result.success) {
  console.log('Payment initiated:', result.transactionId);
} else {
  console.error('Payment failed:', result.message);
}
```

---

## Production Setup

### Step 1: Get MTN MoMo API Credentials

1. Register at [MTN MoMo Developer Portal](https://momodeveloper.mtn.com/)
2. Create a subscription (choose "Collection" product)
3. Generate API user and API key
4. Subscribe to "Collection" API

**Environment Variables:**
```bash
MTNMOMO_API_USER=your-api-user-id
MTNMOMO_API_KEY=your-api-key
MTNMOMO_SUBSCRIPTION_KEY=your-subscription-key
MTNMOMO_ENVIRONMENT=mtnuganda # or mtnsandbox for testing
```

### Step 2: Get Airtel Money API Credentials

1. Register at [Airtel Africa Developer Portal](https://developers.airtel.africa/)
2. Create an application
3. Get client ID and client secret
4. Request production access

**Environment Variables:**
```bash
AIRTEL_CLIENT_ID=your-client-id
AIRTEL_CLIENT_SECRET=your-client-secret
AIRTEL_API_KEY=your-api-key
AIRTEL_ENVIRONMENT=production # or sandbox for testing
```

### Step 3: Update API Routes

Replace the mock implementations in:
- `src/app/api/payments/mtn-momo/route.ts`
- `src/app/api/payments/airtel-money/route.ts`

See the TODO comments in those files for detailed implementation steps.

### Step 4: Set Up Webhooks

Both MTN and Airtel require webhook endpoints to receive payment confirmations:

```typescript
// src/app/api/webhooks/mtn-callback/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Verify webhook signature
  // Update order status in database
  // Send confirmation email

  return NextResponse.json({ status: 'ok' });
}
```

**Webhook URLs:**
- MTN: `https://yourdomain.com/api/webhooks/mtn-callback`
- Airtel: `https://yourdomain.com/api/webhooks/airtel-callback`

### Step 5: Testing

**Sandbox Numbers (for testing):**

MTN MoMo Sandbox:
- Success: 256777000000
- Insufficient funds: 256777000001
- User not found: 256777000002

Airtel Money Sandbox:
- Success: 256700000000
- Failure: 256700000001

---

## Security Best Practices

### 1. Never Expose API Keys
```typescript
// ❌ BAD - API keys in client code
const apiKey = 'abc123';

// ✅ GOOD - API keys in server-side env variables
const apiKey = process.env.MTNMOMO_API_KEY;
```

### 2. Validate Webhooks
```typescript
// Verify webhook signature to prevent fraud
const signature = request.headers.get('X-Signature');
const isValid = verifySignature(body, signature, secret);
if (!isValid) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}
```

### 3. Idempotency
```typescript
// Prevent duplicate charges
const existingTransaction = await db.transaction.findUnique({
  where: { orderId: order.id },
});
if (existingTransaction) {
  return { success: true, transactionId: existingTransaction.id };
}
```

### 4. Rate Limiting
```typescript
// Prevent abuse
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

await limiter.check(request, 10, 'PAYMENT_CACHE_TOKEN');
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid phone number | Wrong format/length | Show format example (0777 123 456) |
| Insufficient funds | User has low balance | Ask user to top up |
| Transaction timeout | User didn't approve | Retry or cancel |
| Duplicate transaction | Same order charged twice | Check for existing payment |
| API rate limit | Too many requests | Implement exponential backoff |
| Network error | API unreachable | Show retry button |

### User-Friendly Messages

```typescript
const errorMessages = {
  'insufficient_funds': 'Insufficient balance. Please top up your mobile money account and try again.',
  'invalid_phone': 'Please enter a valid MTN or Airtel number (e.g., 0777 123 456)',
  'timeout': 'Payment request timed out. Please try again.',
  'user_cancelled': 'Payment was cancelled. You can try again when ready.',
  'network_error': 'Network error. Please check your internet connection and try again.',
};
```

---

## Testing Checklist

### Development Testing
- [ ] Test MTN number validation (077, 078, 076)
- [ ] Test Airtel number validation (070, 075, 074)
- [ ] Test invalid numbers rejection
- [ ] Test provider auto-detection
- [ ] Test payment flow (mock)
- [ ] Test success handling
- [ ] Test error handling
- [ ] Test mobile responsive design
- [ ] Test dark mode
- [ ] Test UGX formatting

### Production Testing
- [ ] Test with real MTN sandbox account
- [ ] Test with real Airtel sandbox account
- [ ] Test webhook callbacks
- [ ] Test payment status checking
- [ ] Test refund processing
- [ ] Test concurrent payments
- [ ] Load test with 100 simultaneous payments
- [ ] Test edge cases (network failures, timeouts)

---

## Monitoring & Analytics

### Key Metrics to Track

1. **Success Rate**
   - Target: >95%
   - Track by provider (MTN vs Airtel)

2. **Average Payment Time**
   - Target: <30 seconds
   - From initiation to confirmation

3. **Error Rate**
   - Track error types
   - Alert if >5%

4. **Provider Distribution**
   - MTN vs Airtel usage
   - Optimize UX for most-used

### Logging

```typescript
// Log all payment attempts
logger.info('Payment initiated', {
  provider,
  orderId,
  amount,
  phoneNumber: phoneNumber.slice(-4), // Only last 4 digits for privacy
  timestamp: new Date().toISOString(),
});

// Log outcomes
logger.info('Payment completed', {
  transactionId,
  status: 'success',
  duration: endTime - startTime,
});
```

---

## Cost Considerations

### Transaction Fees

**MTN Mobile Money:**
- Merchant pays: 0.8% - 1.5% per transaction
- Minimum fee: UGX 500

**Airtel Money:**
- Merchant pays: 0.5% - 1.2% per transaction
- Minimum fee: UGX 400

### Volume Discounts
Both providers offer lower rates for high-volume merchants:
- >10,000 transactions/month: Negotiate custom rates
- >100,000 transactions/month: Significant discounts available

---

## Support & Troubleshooting

### MTN MoMo Support
- Email: momo@mtn.co.ug
- Phone: +256 312 200 200
- Developer Portal: https://momodeveloper.mtn.com/

### Airtel Money Support
- Email: airtel.uganda@airtel.com
- Phone: +256 200 100 100
- Developer Portal: https://developers.airtel.africa/

### Common Issues

**Issue**: "Payment request failed"
- Check API credentials
- Verify phone number format
- Check API rate limits
- Review error logs

**Issue**: "Webhook not received"
- Verify webhook URL is public
- Check firewall/security rules
- Test with webhook tester tool
- Verify signature validation

---

## Next Steps

1. **Get API Credentials** (1-2 weeks)
   - Apply for MTN MoMo merchant account
   - Apply for Airtel Money merchant account

2. **Implement Production APIs** (2-3 days)
   - Replace mock implementations
   - Add webhook handlers
   - Implement transaction logging

3. **Test in Sandbox** (1 week)
   - Full end-to-end testing
   - Error scenario testing
   - Load testing

4. **Go Live** (1 day)
   - Switch to production credentials
   - Monitor first transactions
   - Be ready for support

---

## Resources

- [MTN MoMo API Documentation](https://momodeveloper.mtn.com/api-documentation/)
- [Airtel Money API Documentation](https://developers.airtel.africa/documentation)
- [Uganda Mobile Money Statistics](https://www.bou.or.ug/bou/bouwebsite/Statistics.html)

---

**Implementation Complete**: ✅ Mock Mode Ready for Testing
**Production Ready**: 🔄 Requires API Credentials Setup

For questions or support, refer to the support contacts above or check the developer portals.
