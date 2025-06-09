import { NextRequest, NextResponse } from 'next/server';
import { instagramAuth } from '@/lib/instagram-auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Handle authorization errors
  if (error) {
    console.error('Instagram authorization error:', error);
    return NextResponse.redirect(new URL('/?error=access_denied', request.url));
  }

  // Validate required parameters
  if (!code) {
    console.error('Missing authorization code');
    return NextResponse.redirect(new URL('/?error=missing_code', request.url));
  }

  try {
    console.log('Starting token exchange process...');
    console.log('Authorization code:', code.substring(0, 20) + '...');
    console.log('Environment check:', {
      hasClientId: !!process.env.INSTAGRAM_CLIENT_ID,
      hasClientSecret: !!process.env.INSTAGRAM_CLIENT_SECRET,
      redirectUri: process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI
    });

    // Exchange authorization code for short-lived access token
    console.log('Exchanging code for short-lived token...');
    const tokenResponse = await instagramAuth.exchangeCodeForToken(code);
    console.log('Short-lived token received:', tokenResponse.access_token.substring(0, 20) + '...');
    
    // Exchange short-lived token for long-lived token
    console.log('Exchanging for long-lived token...');
    const longLivedTokenResponse = await instagramAuth.getLongLivedToken(tokenResponse.access_token);
    console.log('Long-lived token received:', longLivedTokenResponse.access_token.substring(0, 20) + '...');
    
    // Get user profile information
    console.log('Getting user profile...');
    const userProfile = await instagramAuth.getUserProfile(
      longLivedTokenResponse.access_token,
      tokenResponse.user_id
    );
    console.log('User profile received:', userProfile.username);

    // Create response with user data and tokens
    const response = NextResponse.redirect(new URL('/?success=true', request.url));
    
    // Set secure HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: longLivedTokenResponse.expires_in,
      path: '/'
    };

    response.cookies.set('instagram_access_token', longLivedTokenResponse.access_token, cookieOptions);
    response.cookies.set('instagram_user_id', tokenResponse.user_id, cookieOptions);
    response.cookies.set('instagram_user_data', JSON.stringify(userProfile), cookieOptions);
    response.cookies.set('instagram_token_expires', (Date.now() + (longLivedTokenResponse.expires_in * 1000)).toString(), cookieOptions);

    console.log('Authentication successful, redirecting...');
    return response;
  } catch (error: any) {
    console.error('Instagram authentication error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    return NextResponse.redirect(new URL(`/?error=auth_failed&details=${encodeURIComponent(error.message)}`, request.url));
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 