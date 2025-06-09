import axios from 'axios';
import {
  InstagramAuthConfig,
  InstagramTokenResponse,
  InstagramLongLivedTokenResponse,
  InstagramTokenExchangeData,
  InstagramUser,
  InstagramError
} from '@/types/instagram';

const INSTAGRAM_CONFIG: InstagramAuthConfig = {
  client_id: process.env.INSTAGRAM_CLIENT_ID || '',
  client_secret: process.env.INSTAGRAM_CLIENT_SECRET || '',
  redirect_uri: process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || '',
  // Instagram Business API scopes for posting content
  scope: [
    'instagram_business_basic',
    'instagram_business_content_publish',
    'instagram_business_manage_messages',
    'instagram_business_manage_comments'
  ]
};

export class InstagramAuth {
  private config: InstagramAuthConfig;

  constructor(config?: Partial<InstagramAuthConfig>) {
    this.config = { ...INSTAGRAM_CONFIG, ...config };
  }

  /**
   * Generate Instagram authorization URL for Business API
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.client_id,
      redirect_uri: this.config.redirect_uri,
      response_type: 'code',
      scope: this.config.scope.join(','),
      ...(state && { state })
    });

    // Use Instagram Business API authorization endpoint
    return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for short-lived access token
   * For Instagram Business API
   */
  async exchangeCodeForToken(code: string): Promise<InstagramTokenResponse> {
    // Ensure we use the exact same redirect_uri as in authorization
    const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || this.config.redirect_uri;
    
    const formData = new URLSearchParams({
      client_id: this.config.client_id,
      client_secret: this.config.client_secret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code
    });

    try {
      console.log('Token exchange request details:', {
        url: 'https://api.instagram.com/oauth/access_token',
        client_id: this.config.client_id,
        redirect_uri: redirectUri,
        code_preview: code.substring(0, 20) + '...',
        environment: process.env.NODE_ENV
      });

      const response = await axios.post(
        'https://api.instagram.com/oauth/access_token',
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      console.log('Token exchange successful:', response.data);

      // Instagram Business API returns data directly
      if (response.data.access_token && response.data.user_id) {
        return {
          access_token: response.data.access_token,
          user_id: response.data.user_id,
          permissions: response.data.permissions || this.config.scope.join(',')
        };
      }
      
      throw new Error('Invalid token response format - missing access_token or user_id');
    } catch (error: any) {
      console.error('Token exchange error details:', {
        message: error.message,
        response_data: error.response?.data,
        response_status: error.response?.status
      });
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          throw new Error(`Instagram API Error: ${errorData}`);
        } else if (errorData.error_message) {
          throw new Error(`Instagram API Error: ${errorData.error_message}`);
        } else if (errorData.error_description) {
          throw new Error(`Instagram API Error: ${errorData.error_description}`);
        } else if (errorData.error) {
          throw new Error(`Instagram API Error: ${errorData.error}`);
        } else {
          throw new Error(`Instagram API Error: ${JSON.stringify(errorData)}`);
        }
      }
      throw error;
    }
  }

  /**
   * Exchange short-lived token for long-lived token (60 days)
   * FIXED: Use correct Basic Display API endpoint
   */
  async getLongLivedToken(shortLivedToken: string): Promise<InstagramLongLivedTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'ig_exchange_token',
      client_secret: this.config.client_secret,
      access_token: shortLivedToken
    });

    try {
      // FIXED: Use Basic Display API endpoint for long-lived tokens
      const response = await axios.get(
        `https://graph.instagram.com/access_token?${params.toString()}`
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const instagramError: InstagramError = error.response.data;
        throw new Error(`Instagram API Error: ${instagramError.error_message || JSON.stringify(instagramError)}`);
      }
      throw error;
    }
  }

  /**
   * Refresh long-lived token (must be at least 24 hours old)
   */
  async refreshLongLivedToken(longLivedToken: string): Promise<InstagramLongLivedTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'ig_refresh_token',
      access_token: longLivedToken
    });

    try {
      const response = await axios.get(
        `https://graph.instagram.com/refresh_access_token?${params.toString()}`
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const instagramError: InstagramError = error.response.data;
        throw new Error(`Instagram API Error: ${instagramError.error_message}`);
      }
      throw error;
    }
  }

  /**
   * Get user profile information
   * FIXED: Use correct Basic Display API endpoint and fields
   */
  async getUserProfile(accessToken: string, userId: string): Promise<InstagramUser> {
    const params = new URLSearchParams({
      fields: 'id,username,account_type,media_count',
      access_token: accessToken
    });

    try {
      // FIXED: Use Basic Display API endpoint
      const response = await axios.get(
        `https://graph.instagram.com/v21.0/${userId}?${params.toString()}`
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const instagramError: InstagramError = error.response.data;
        throw new Error(`Instagram API Error: ${instagramError.error_message}`);
      }
      throw error;
    }
  }

  /**
   * Validate access token
   */
  async validateToken(accessToken: string, userId: string): Promise<boolean> {
    try {
      await this.getUserProfile(accessToken, userId);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const instagramAuth = new InstagramAuth();