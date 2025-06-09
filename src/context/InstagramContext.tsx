'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { InstagramUser } from '@/types/instagram';
import { instagramAuth } from '@/lib/instagram-auth';

interface InstagramContextType {
  user: InstagramUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const InstagramContext = createContext<InstagramContextType | undefined>(undefined);

export function InstagramProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<InstagramUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!(user && accessToken);

  // Load authentication state from server on mount
  useEffect(() => {
    const loadAuthState = async () => {
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/auth/instagram/me');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setAccessToken(data.accessToken);
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const clearAuthState = () => {
    setAccessToken(null);
    setUser(null);
  };

  const login = useCallback(() => {
    const state = Math.random().toString(36).substring(2, 15);
    const authUrl = instagramAuth.getAuthorizationUrl(state);
    
    // Store state in sessionStorage for CSRF protection
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('instagram_oauth_state', state);
      window.location.href = authUrl;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/instagram/logout', { method: 'POST' });
      clearAuthState();
    } catch (error) {
      console.error('Error during logout:', error);
      clearAuthState();
    }
  }, []);

  const refreshToken = useCallback(async () => {
    // Token refresh is handled by the server-side API
    const loadAuthState = async () => {
      try {
        const response = await fetch('/api/auth/instagram/me');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setAccessToken(data.accessToken);
            setUser(data.user);
          } else {
            clearAuthState();
          }
        }
      } catch (error) {
        console.error('Error refreshing auth state:', error);
        clearAuthState();
      }
    };
    
    await loadAuthState();
  }, []);

  const value: InstagramContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshToken
  };

  return (
    <InstagramContext.Provider value={value}>
      {children}
    </InstagramContext.Provider>
  );
}

export function useInstagram() {
  const context = useContext(InstagramContext);
  if (context === undefined) {
    throw new Error('useInstagram must be used within an InstagramProvider');
  }
  return context;
} 