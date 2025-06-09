import { NextResponse } from 'next/server';

export async function GET() {
  // Only allow in development mode
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Debug endpoint not available in production' }, { status: 404 });
  }

  const config = {
    client_id: process.env.INSTAGRAM_CLIENT_ID ? '✓ Set' : '✗ Missing',
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET ? '✓ Set' : '✗ Missing',
    redirect_uri: process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || '✗ Missing',
    node_env: process.env.NODE_ENV || 'undefined'
  };

  // Check if all required variables are set
  const allSet = process.env.INSTAGRAM_CLIENT_ID && 
                 process.env.INSTAGRAM_CLIENT_SECRET && 
                 process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI;

  return NextResponse.json({
    status: allSet ? 'Ready' : 'Configuration Incomplete',
    config,
    message: allSet 
      ? 'All Instagram OAuth environment variables are configured'
      : 'Some environment variables are missing. Check your .env.local file.'
  });
} 