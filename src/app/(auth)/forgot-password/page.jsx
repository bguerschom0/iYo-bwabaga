'use client';


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Supabase password reset will be implemented here
      console.log('Password reset requested for:', email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        subtitle="We've sent you instructions to reset your password"
      >
        <div className="text-center space-y-6">
          <p className="text-sandbeige-800">
            If an account exists for {email}, you will receive an email with instructions 
            on how to reset your password.
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-sandbeige-800 hover:bg-sandbeige-900 text-white py-2 rounded-lg transition-colors"
            >
              Try another email
            </Button>
            <Link href="/login" className="block">
              <Button
                variant="outline"
                className="w-full border-sandbeige-200 text-sandbeige-800 hover:bg-sandbeige-100"
              >
                Return to login
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to receive reset instructions"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-sandbeige-800">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-sandbeige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sandbeige-200"
            placeholder="Enter your email"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-sandbeige-800 hover:bg-sandbeige-900 text-white py-2 rounded-lg transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Sending instructions...' : 'Send Reset Instructions'}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-sandbeige-800">
            Remember your password?{' '}
            <Link href="/login" className="text-sandbeige-900 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
