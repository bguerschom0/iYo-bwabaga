import React from 'react';
import { Card } from '@/components/ui/card';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-sandbeige-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sandbeige-900">{title}</h1>
          {subtitle && <p className="text-sandbeige-800 mt-2">{subtitle}</p>}
        </div>
        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;
