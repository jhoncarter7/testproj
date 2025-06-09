import { NextResponse } from 'next/server';
import { instagramAuth } from '@/lib/instagram-auth';

export async function GET() {
  const state = 'test-' + Math.random().toString(36).substring(2, 15);
  const authUrl = instagramAuth.getAuthorizationUrl(state);
  
  // Parse the generated URL to extract parameters
  const url = new URL(authUrl);
  const redirectUri = url.searchParams.get('redirect_uri');
  
  return NextResponse.json({
    current_oauth_url: authUrl,
    extracted_redirect_uri: redirectUri,
    environment_redirect_uri: process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI,
    client_id: url.searchParams.get('client_id'),
    
    // What you need to add in Meta App Dashboard
    meta_dashboard_instructions: {
      step1: "Go to https://developers.facebook.com/apps/1446779576314502",
      step2: "Navigate to: Instagram Basic Display > Basic Display",
      step3: "Click 'Create New App' if you haven't, or 'Edit' if app exists",
      step4: `Add this EXACT redirect URI to 'Valid OAuth Redirect URIs': ${redirectUri}`,
      step5: "Add deauth URL: http://localhost:3000/api/auth/instagram/deauth",
      step6: "Add data deletion URL: http://localhost:3000/api/auth/instagram/delete",
      step7: "Click Save Changes and wait 2-3 minutes"
    },
    
    common_issues: [
      "Using wrong Instagram product (use 'Instagram Basic Display', not 'Instagram API with Instagram Login')",
      "Redirect URI not added to 'Valid OAuth Redirect URIs' in Instagram Basic Display settings",
      "Missing required URLs (deauth and data deletion callback URLs)",
      "App ID/Secret from wrong Instagram product (should be from Instagram Basic Display)",
      "Trailing slash mismatch (/callback vs /callback/)",
      "Protocol mismatch (http vs https)",
      "Domain mismatch",
      "Case sensitivity issues"
    ]
  });
} 