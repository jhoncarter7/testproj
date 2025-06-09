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
    const tokenData: InstagramTokenExchangeData = {
      client_id: this.config.client_id,
      client_secret: this.config.client_secret,
      grant_type: 'authorization_code',
      redirect_uri: this.config.redirect_uri,
      code
    };

    try {
      const response = await axios.post(
        'https://api.instagram.com/oauth/access_token',
        tokenData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data.data && response.data.data[0]) {
        return response.data.data[0];
      }
      
      throw new Error('Invalid token response format');
    } catch (error: any) {
      if (error.response?.data) {
        const instagramError: InstagramError = error.response.data;
        throw new Error(`Instagram API Error: ${instagramError.error_message}`);
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