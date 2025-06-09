export interface InstagramUser {
  id: string;
  username?: string;
  account_type?: string;
  media_count?: number;
}

export interface InstagramTokenResponse {
  access_token: string;
  user_id: string;
  permissions: string;
}

export interface InstagramLongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface InstagramAuthConfig {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scope: string[];
}

export interface InstagramTokenExchangeData {
  client_id: string;
  client_secret: string;
  grant_type: string;
  redirect_uri: string;
  code: string;
}

export interface InstagramError {
  error_type: string;
  code: number;
  error_message: string;
} 