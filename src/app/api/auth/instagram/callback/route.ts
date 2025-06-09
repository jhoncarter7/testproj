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
    // Exchange authorization code for short-lived access token
    const tokenResponse = await instagramAuth.exchangeCodeForToken(code);
    
    // Exchange short-lived token for long-lived token
    const longLivedTokenResponse = await instagramAuth.getLongLivedToken(tokenResponse.access_token);
    
    // Get user profile information
    const userProfile = await instagramAuth.getUserProfile(
      longLivedTokenResponse.access_token,
      tokenResponse.user_id
    );

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

    return response;
  } catch (error) {
    console.error('Instagram authentication error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 