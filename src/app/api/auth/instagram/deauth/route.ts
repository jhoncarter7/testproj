import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Instagram will send a POST request when a user deauthorizes your app
    const body = await request.json();
    
    console.log('Instagram deauthorization callback:', body);
    
    // Here you would typically:
    // 1. Remove the user's access tokens from your database
    // 2. Clean up any user data related to Instagram
    // 3. Log the deauthorization event
    
    // For now, just log it
    if (body.user_id) {
      console.log(`User ${body.user_id} deauthorized the app`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Deauthorization callback error:', error);
    return NextResponse.json({ error: 'Failed to process deauthorization' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Instagram requires this endpoint to be available
  return NextResponse.json({ 
    message: 'Instagram deauthorization callback endpoint',
    method: 'POST required for actual deauthorization'
  });
} 