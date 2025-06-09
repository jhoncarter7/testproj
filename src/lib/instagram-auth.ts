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
  scope: [
    'instagram_business_basic',
    'instagram_business_content_publish',
    'instagram_business_manage_messages',
    'instagram_business_manage_comments',
    'instagram_business_manage_insights'
  ]
};

export class InstagramAuth {
  private config: InstagramAuthConfig;

  constructor(config?: Partial<InstagramAuthConfig>) {
    this.config = { ...INSTAGRAM_CONFIG, ...config };
  }

  /**
   * Generate Instagram authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.client_id,
      redirect_uri: this.config.redirect_uri,
      response_type: 'code',
      scope: this.config.scope.join(','),
      enable_fb_login: '0', // Force Instagram login instead of Facebook
      force_authentication: '1', // Force re-authentication
      ...(state && { state })
    });

    return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for short-lived access token
   */
  async exchangeCodeForToken(code: string): Promise<InstagramTokenResponse> {
    // Ensure we use the exact same redirect_uri as in authorization
    const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || this.config.redirect_uri;
    
    const formData = new URLSearchParams({
      client_id: this.config.client_id,
      client_secret: this.config.client_secret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri, // Use the explicit redirectUri
      code
    });

    try {
      console.log('Token exchange request details:', {
        url: 'https://api.instagram.com/oauth/access_token',
        client_id: this.config.client_id,
        redirect_uri: redirectUri,
        code_preview: code.substring(0, 20) + '...',
        environment: process.env.NODE_ENV,
        all_env_vars: {
          INSTAGRAM_CLIENT_ID: !!process.env.INSTAGRAM_CLIENT_ID,
          INSTAGRAM_CLIENT_SECRET: !!process.env.INSTAGRAM_CLIENT_SECRET,
          NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI: process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI
        }
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

      console.log('Token exchange successful:', {
        has_data: !!response.data,
        has_data_array: !!(response.data?.data),
        data_length: response.data?.data?.length
      });

      if (response.data.data && response.data.data[0]) {
        return response.data.data[0];
      }
      
      throw new Error('Invalid token response format - missing data array');
    } catch (error: any) {
      console.error('Token exchange error details:', {
        message: error.message,
        response_data: error.response?.data,
        response_status: error.response?.status,
        response_headers: error.response?.headers,
        request_config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          throw new Error(`Instagram API Error: ${errorData}`);
        } else if (errorData.error_message) {
          throw new Error(`Instagram API Error: ${errorData.error_message}`);
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
   */
  async getLongLivedToken(shortLivedToken: string): Promise<InstagramLongLivedTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'ig_exchange_token',
      client_secret: this.config.client_secret,
      access_token: shortLivedToken
    });

    try {
      const response = await axios.get(
        `https://graph.instagram.com/access_token?${params.toString()}`
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
   */
  async getUserProfile(accessToken: string, userId: string): Promise<InstagramUser> {
    const params = new URLSearchParams({
      fields: 'id,username,account_type,media_count',
      access_token: accessToken
    });

    try {
      const response = await axios.get(
        `https://graph.instagram.com/${userId}?${params.toString()}`
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