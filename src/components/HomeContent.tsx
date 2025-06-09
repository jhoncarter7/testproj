'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import InstagramLogin from '@/components/InstagramLogin';
import { useInstagram } from '@/context/InstagramContext';

export default function HomeContent() {
  const { user, isAuthenticated, isLoading } = useInstagram();
  const searchParams = useSearchParams();
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Handle URL parameters from OAuth callback
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'true') {
      setNotification({
        type: 'success',
        message: 'Successfully connected to Instagram!'
      });
    } else if (error) {
      let errorMessage = 'An error occurred during authentication.';
      switch (error) {
        case 'access_denied':
          errorMessage = 'Access was denied. Please try again.';
          break;
        case 'missing_code':
          errorMessage = 'Authorization code was missing.';
          break;
        case 'auth_failed':
          errorMessage = 'Authentication failed. Please try again.';
          break;
      }
      setNotification({
        type: 'error',
        message: errorMessage
      });
    }

    // Clear notification after 5 seconds
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, notification]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Banner */}
      {notification && (
        <div className={`${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-4 py-3 text-center`}>
          <p>{notification.message}</p>
          <button
            onClick={() => setNotification(null)}
            className="ml-4 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Video Upload App</h1>
              <p className="text-gray-600">Upload videos and manage Instagram content</p>
            </div>
            <InstagramLogin />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAuthenticated && user ? (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome back!</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Instagram Account</h3>
                  <p className="text-sm opacity-90">@{user.username || 'N/A'}</p>
                  <p className="text-sm opacity-90 capitalize">{user.account_type || 'Account'}</p>
                </div>
                <div className="bg-blue-500 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Media Count</h3>
                  <p className="text-2xl font-bold">{user.media_count || 0}</p>
                  <p className="text-sm opacity-90">Total posts</p>
                </div>
                <div className="bg-green-500 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Status</h3>
                  <p className="text-sm">✓ Connected</p>
                  <p className="text-sm opacity-90">Ready to upload</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Video Upload</h3>
                <p className="text-gray-600 mb-4">Upload videos to AWS S3 and optionally publish to Instagram.</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Upload Video
                </button>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Instagram Management</h3>
                <p className="text-gray-600 mb-4">Manage your Instagram content and posts.</p>
                <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                  Manage Content
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect Your Instagram</h2>
              <p className="text-gray-600 mb-8">
                Connect your Instagram business account to start uploading and managing your content.
              </p>
              <InstagramLogin showUserInfo={false} className="justify-center" />
              <div className="mt-8 text-sm text-gray-500">
                <p>• Requires Instagram Business or Creator account</p>
                <p>• Secure OAuth 2.0 authentication</p>
                <p>• No passwords stored</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 