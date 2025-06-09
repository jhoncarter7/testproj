import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Instagram will send a POST request when a user requests data deletion
    const body = await request.json();
    
    console.log('Instagram data deletion request:', body);
    
    // Here you would typically:
    // 1. Delete all user data from your database
    // 2. Remove access tokens and refresh tokens
    // 3. Delete any cached Instagram data
    // 4. Log the deletion request with timestamp
    // 5. Return a confirmation URL if required
    
    // For now, just log it
    if (body.user_id) {
      console.log(`Data deletion requested for user ${body.user_id}`);
    }
    
    // Instagram expects a confirmation URL in the response
    return NextResponse.json({ 
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/data-deletion-confirmation`,
      confirmation_code: `del_${Date.now()}_${body.user_id || 'unknown'}`
    });
  } catch (error) {
    console.error('Data deletion callback error:', error);
    return NextResponse.json({ error: 'Failed to process data deletion request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Instagram requires this endpoint to be available
  return NextResponse.json({ 
    message: 'Instagram data deletion callback endpoint',
    method: 'POST required for actual deletion requests',
    info: 'This endpoint handles user data deletion requests from Instagram'
  });
} 