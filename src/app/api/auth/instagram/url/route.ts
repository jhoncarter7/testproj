import { NextResponse } from 'next/server';
import { instagramAuth } from '@/lib/instagram-auth';

export async function GET() {
  try {
    const state = Math.random().toString(36).substring(2, 15);
    const authUrl = instagramAuth.getAuthorizationUrl(state);
    
    return NextResponse.json({
      authUrl,
      state,
      config: {
        client_id: process.env.INSTAGRAM_CLIENT_ID ? 'Set (hidden)' : 'Missing',
        redirect_uri: process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || 'Missing',
        scopes: [
          'instagram_business_basic',
          'instagram_business_content_publish',
          'instagram_business_manage_messages',
          'instagram_business_manage_comments'
        ]
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to generate authorization URL',
      message: error.message,
      suggestion: 'Check if your Instagram app credentials are properly configured in .env.local'
    }, { status: 500 });
  }
} 