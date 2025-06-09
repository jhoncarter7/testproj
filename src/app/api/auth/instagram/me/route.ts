import { NextRequest, NextResponse } from 'next/server';
import { instagramAuth } from '@/lib/instagram-auth';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('instagram_access_token')?.value;
    const userId = request.cookies.get('instagram_user_id')?.value;
    const userData = request.cookies.get('instagram_user_data')?.value;
    const tokenExpires = request.cookies.get('instagram_token_expires')?.value;

    if (!accessToken || !userId || !userData) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Check if token is expired
    const expirationTime = tokenExpires ? parseInt(tokenExpires) : 0;
    const now = Date.now();

    if (expirationTime <= now) {
      // Token expired
      return NextResponse.json({ authenticated: false, error: 'Token expired' }, { status: 401 });
    }

    // Validate token with Instagram API
    const isValid = await instagramAuth.validateToken(accessToken, userId);
    
    if (!isValid) {
      return NextResponse.json({ authenticated: false, error: 'Invalid token' }, { status: 401 });
    }

    // Return user data
    const user = JSON.parse(userData);
    return NextResponse.json({
      authenticated: true,
      user,
      accessToken,
      expiresAt: expirationTime
    });

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Session validation failed' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 