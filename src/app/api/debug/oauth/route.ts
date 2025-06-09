import { NextResponse } from 'next/server';
import { instagramAuth } from '@/lib/instagram-auth';

export async function GET() {
  // Only allow in development mode or for debugging
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Debug endpoint not available in production' }, { status: 404 });
  }

  const state = 'debug-test-state';
  const authUrl = instagramAuth.getAuthorizationUrl(state);
  
  // Parse the URL to extract redirect_uri
  const url = new URL(authUrl);
  const authRedirectUri = url.searchParams.get('redirect_uri');
  
  const envRedirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI;
  
  return NextResponse.json({
    oauth_analysis: {
      generated_auth_url: authUrl,
      auth_redirect_uri: authRedirectUri,
      env_redirect_uri: envRedirectUri,
      uris_match: authRedirectUri === envRedirectUri,
      url_encoded_correctly: authRedirectUri?.includes('testproj-alpha.vercel.app'),
    },
    environment_check: {
      node_env: process.env.NODE_ENV,
      instagram_client_id: process.env.INSTAGRAM_CLIENT_ID ? 'Set' : 'Missing',
      instagram_client_secret: process.env.INSTAGRAM_CLIENT_SECRET ? 'Set' : 'Missing', 
      redirect_uri: envRedirectUri || 'Missing'
    },
    recommendations: [
      'Ensure redirect_uri in authorization URL matches token exchange',
      'Verify Meta App Dashboard has exact redirect_uri configured',
      'Check that environment variables are set correctly in Vercel'
    ]
  });
} 