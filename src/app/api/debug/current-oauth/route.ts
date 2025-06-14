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
      step2: "Navigate to: Instagram > API setup with Instagram login",
      step3: "Complete Step 3: Set up Instagram business login",
      step4: "In Business login settings:",
      step5: `Add this EXACT redirect URI: ${redirectUri}`,
      step6: "Generate Access Token for your Instagram Business Account",
      step7: "Click Save Changes and wait 2-3 minutes"
    },
    
    common_issues: [
      "Need Instagram Business Account (not personal account)",
      "App ID/Secret should be from Instagram API with Instagram Login product",
      "Redirect URI not added to Business login settings",
      "Instagram account not connected to a Facebook Page",
      "Facebook Page not linked to Instagram Business Account",
      "Insufficient permissions for content publishing",
      "Trailing slash mismatch (/callback vs /callback/)",
      "Protocol mismatch (http vs https)",
      "Domain mismatch",
      "Case sensitivity issues"
    ]
  });
} 