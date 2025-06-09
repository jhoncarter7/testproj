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

3. **Add Instagram Product**
   - In your app dashboard, click "Add Product"
   - Find "Instagram" and click "Set up"
   - Choose "Instagram API with Instagram Login"

4. **Configure Instagram Settings**
   - Go to Instagram > API setup with Instagram login
   - Complete Step 3: "Set up Instagram business login"
   - In "Business login settings":
     - Add OAuth redirect URI: `http://localhost:3000/api/auth/instagram/callback`
     - For production, also add: `https://yourdomain.com/api/auth/instagram/callback`

5. **Get Your Credentials**
   - Copy your **Instagram App ID**
   - Copy your **Instagram App Secret**

## Step 2: Create Environment Variables

Create a `.env.local` file in your project root:

```env
# Instagram OAuth Configuration
INSTAGRAM_CLIENT_ID=your_actual_instagram_app_id_here
INSTAGRAM_CLIENT_SECRET=your_actual_instagram_app_secret_here
NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/auth/instagram/callback

# Next.js Environment
NODE_ENV=development
```

**Replace the placeholder values with your actual credentials from Step 1.**

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

For production deployment:

1. **Update redirect URI in Meta App Dashboard:**
   - Add your production domain redirect URI
   - Example: `https://yourdomain.com/api/auth/instagram/callback`

2. **Update environment variables:**
   ```env
   NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI=https://yourdomain.com/api/auth/instagram/callback
   NODE_ENV=production
   ```

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
- Personal accounts won't work with this API

### Required Permissions:
- `instagram_business_basic` (required)
- `instagram_business_content_publish`
- `instagram_business_manage_messages`
- `instagram_business_manage_comments`

## Current OAuth Flow

Your app implements the following flow:

1. User clicks "Connect Instagram" button
2. Redirects to: `https://www.instagram.com/oauth/authorize?client_id=YOUR_APP_ID&...`
3. User authorizes your app
4. Instagram redirects to: `http://localhost:3000/api/auth/instagram/callback?code=...`
5. Your app exchanges the code for access tokens
6. User is logged in and can access Instagram features

## Next Steps

After setup:
1. Test the OAuth flow
2. Implement video upload functionality
3. Add Instagram content publishing features
4. Deploy to production with proper environment variables 