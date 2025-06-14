import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = "",
      type = "text",
      ...props
    },
    ref
  ) => {
    const baseInputStyles = `
      block w-full appearance-none
      bg-transparent 
      text-sm text-light-text dark:text-dark-text 
      placeholder-light-text-secondary/70 dark:placeholder-dark-text-secondary/70
      focus:outline-none
    `;

    const containerStyles = `
      flex items-center px-3 py-2.5 w-full 
      bg-light-muted dark:bg-dark-muted 
      border border-light-border dark:border-dark-border 
      rounded-md transition-colors duration-200 ease-in-out
      focus-within:ring-2 focus-within:ring-primary focus-within:border-primary
      dark:focus-within:border-primary
      ${
        error
          ? "!border-danger focus-within:!ring-danger focus-within:!border-danger"
          : ""
      }
    `;

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <div className={`${widthStyles} ${className}`}>
        {label && (
          <label className="block mb-1.5 text-sm font-medium text-light-text dark:text-dark-text">
            {label}
          </label>
        )}

        <div className={`relative ${containerStyles}`}>
          {leftIcon && (
            <div className="flex items-center pr-2 text-light-text-secondary dark:text-dark-text-secondary">
              {leftIcon}
            </div>
          )}

          <input ref={ref} type={type} className={baseInputStyles} {...props} />

          {rightIcon && (
            <div className="flex items-center pl-2">{rightIcon}</div>
          )}
        </div>

        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}

        {helperText && !error && (
          <p className="mt-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
