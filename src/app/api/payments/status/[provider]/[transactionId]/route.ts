/**
 * Payment Status Check API Route
 *
 * Check the status of a mobile money payment
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string; transactionId: string } }
) {
  const { provider, transactionId } = params;

  if (!provider || !transactionId) {
    return NextResponse.json(
      {
        status: 'failed',
        message: 'Provider and transaction ID are required',
      },
      { status: 400 }
    );
  }

  try {
    // TODO: Implement actual status checking based on provider
    if (provider === 'mtn') {
      // Check MTN MoMo API
      // const response = await checkMTNStatus(transactionId);
    } else if (provider === 'airtel') {
      // Check Airtel Money API
      // const response = await checkAirtelStatus(transactionId);
    }

    // Mock response for development
    return NextResponse.json({
      status: 'success',
      message: 'Payment completed successfully',
      transactionId,
      provider,
    });
  } catch (error) {
    console.error(`Error checking ${provider} payment status:`, error);
    return NextResponse.json(
      {
        status: 'failed',
        message: 'Could not check payment status',
      },
      { status: 500 }
    );
  }
}
