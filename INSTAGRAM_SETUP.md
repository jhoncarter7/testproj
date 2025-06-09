# Instagram OAuth Setup Guide

## Step 1: Create Instagram App on Meta for Developers

1. **Go to Meta for Developers**
   - Visit: https://developers.facebook.com/
   - Log in with your Facebook account

2. **Create a New App**
   - Click "Create App"
   - Choose "Business" as app type
   - Fill in app details:
     - App Name: "Your Video Upload App"
     - App Contact Email: your email
     - App Purpose: Business tools

3. **Add Instagram API Product**
   - In your app dashboard, click "Add Product"
   - Find "Instagram" and click "Set up"
   - Choose "Instagram API with Instagram Login"

4. **Configure Instagram Business Login Settings**
   - Go to Instagram > API setup with Instagram login
   - Complete Step 3: "Set up Instagram business login"
   - In "Business login settings", add BOTH redirect URIs:
     - Development: `http://localhost:3000/api/auth/instagram/callback`
     - Production: `https://testproj-alpha.vercel.app/api/auth/instagram/callback`

5. **Get Your Credentials**
   - Copy your **Instagram App ID** (from Instagram API settings)
   - Copy your **Instagram App Secret** (from Instagram API settings)

6. **Generate Access Token for Business Account**
   - In the Instagram API setup, you'll see "1. Generate access tokens"
   - Add your Instagram Business Account (like daily_story__2: 17841465071566093)
   - Generate token for your business account
   - This token will be used for posting content

## Step 2: Create Environment Variables

Create a `.env.local` file in your project root:

```env
# Instagram OAuth Configuration
INSTAGRAM_CLIENT_ID=1446779576314502
INSTAGRAM_CLIENT_SECRET=your_actual_instagram_app_secret_here
NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/auth/instagram/callback

# Next.js Environment
NODE_ENV=development
```

**For Production (Vercel):**
Set these environment variables in your Vercel Dashboard:

```env
INSTAGRAM_CLIENT_ID=1446779576314502
INSTAGRAM_CLIENT_SECRET=your_actual_instagram_app_secret_here
NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI=https://testproj-alpha.vercel.app/api/auth/instagram/callback
NODE_ENV=production
```

## Step 3: Test Your Setup

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit your app:**
   - Go to `http://localhost:3000`
   - Click "Connect Instagram"
   - You should be redirected to Instagram's authorization page

3. **Complete OAuth flow:**
   - Log in with your Instagram business account
   - Grant permissions
   - You should be redirected back to your app

## Step 4: Production Setup

For production deployment on Vercel:

1. **Set Environment Variables in Vercel Dashboard:**
   - Go to your Vercel project settings
   - Add environment variables as shown above
   - **Important**: `NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI=https://testproj-alpha.vercel.app/api/auth/instagram/callback`

2. **Verify Meta App Dashboard has both URLs:**
   - Development: `http://localhost:3000/api/auth/instagram/callback`
   - Production: `https://testproj-alpha.vercel.app/api/auth/instagram/callback`

3. **Redeploy your Vercel app** after setting environment variables

## Troubleshooting

### Common Issues:

1. **"Page not found" error:**
   - Check if your Instagram App ID is correct
   - Verify redirect URI matches exactly what's in Meta App Dashboard

2. **"Invalid redirect URI" error:**
   - Ensure redirect URI in `.env.local` matches Meta App Dashboard
   - Check for trailing slashes or protocol mismatches

3. **"Access denied" error:**
   - Make sure you're using an Instagram Business or Creator account
   - Check if your app needs to be reviewed by Meta

4. **"Invalid client_id" error:**
   - Verify your Instagram App ID is correct
   - Check if your app is in Development mode vs Live mode

### Required Instagram Account Type:
- **Instagram Business Account** OR **Instagram Creator Account**
- Must be connected to a Facebook Page
- Personal accounts won't work for content publishing

### Required Permissions:
- `instagram_business_basic` (required)
- `instagram_business_content_publish` (for posting videos/images)
- `instagram_business_manage_messages` (for DM management)
- `instagram_business_manage_comments` (for comment management)

## Current OAuth Flow

Your app implements the following flow:

1. User clicks "Connect Instagram" button
2. Redirects to: `https://www.instagram.com/oauth/authorize?client_id=YOUR_APP_ID&...`
3. User authorizes your app with their Instagram Business Account
4. Instagram redirects to: `http://localhost:3000/api/auth/instagram/callback?code=...`
5. Your app exchanges the code for access tokens using Instagram Business API
6. User is logged in and can post videos/content to their Instagram Business Account

## Next Steps

After setup:
1. Test the OAuth flow
2. Implement video upload functionality
3. Add Instagram content publishing features
4. Deploy to production with proper environment variables 