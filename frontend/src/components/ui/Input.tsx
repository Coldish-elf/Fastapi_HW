import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const inputStyles = `
      block px-4 py-2.5 w-full 
      bg-white border rounded-md 
      text-sm text-text focus:outline-none
      ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 
      'border-gray-300 focus:ring-primary/50 focus:border-primary'}
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon ? 'pr-10' : ''}
    `;

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <div className={`${widthStyles} ${className}`}>
        {label && (
          <label className="block mb-1 text-sm font-medium text-text">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={inputStyles}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
