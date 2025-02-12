'use client';


import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      // Supabase password reset confirmation will be implemented here
      console.log('Password reset with:', formData);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Set New Password" 
      subtitle="Create a new password for your account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-sandbeige-800">
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-sandbeige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sandbeige-200"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sandbeige-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-sandbeige-800">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-sandbeige-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sandbeige-200"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sandbeige-400"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-sandbeige-800 hover:bg-sandbeige-900 text-white py-2 rounded-lg transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Updating password...' : 'Update Password'}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-sandbeige-800">
            Remember your old password?{' '}
            <Link href="/login" className="text-sandbeige-900 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
