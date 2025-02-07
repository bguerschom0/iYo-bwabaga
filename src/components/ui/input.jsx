import React from 'react';

const Input = React.forwardRef(({ 
  className = '',
  type = 'text',
  error,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <input
        type={type}
        className={`
          flex h-10 w-full rounded-md border border-sandbeige-200 bg-white px-3 py-2 text-sm
          placeholder:text-sandbeige-500 focus:outline-none focus:ring-2 focus:ring-sandbeige-200
          disabled:cursor-not-allowed disabled:opacity-50
          ${error ? 'border-red-500 focus:ring-red-200' : ''}
          ${className}
        `}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
