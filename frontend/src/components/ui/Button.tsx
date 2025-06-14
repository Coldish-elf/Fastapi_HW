import React, { useRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const baseStyles = `
    relative overflow-hidden
    inline-flex items-center justify-center font-medium rounded-md
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary 
    dark:focus-visible:ring-offset-dark-background 
    transition-all duration-200 ease-in-out
  `;

  const variantStyles = {
    primary: `
      bg-primary text-white 
      hover:bg-primary-light 
      active:bg-primary-dark
      dark:bg-primary dark:hover:bg-primary-light dark:active:bg-primary-dark
      focus-visible:ring-primary
    `,
    secondary: `
      bg-primary/10 text-primary 
      hover:bg-primary/20 
      active:bg-primary/30
      dark:bg-primary/20 dark:text-primary-light dark:hover:bg-primary/30 dark:active:bg-primary/40
      focus-visible:ring-primary
    `,
    outline: `
      bg-transparent border border-primary text-primary 
      hover:bg-primary/5 
      active:bg-primary/10
      dark:border-primary dark:text-primary-light dark:hover:bg-primary/10 dark:active:bg-primary/20
      focus-visible:ring-primary
    `,
    danger: `
      bg-danger text-white 
      hover:bg-danger-hover 
      active:bg-red-700
      dark:hover:bg-danger-hover
      focus-visible:ring-danger
    `,
    ghost: `
      bg-transparent text-light-text-secondary 
      hover:bg-slate-500/10 
      active:bg-slate-500/20
      dark:text-dark-text-secondary dark:hover:bg-slate-400/10 dark:active:bg-slate-400/20
      focus-visible:ring-primary
    `,
  };

  const sizeStyles = {
    sm: "text-xs py-1.5 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-base py-2.5 px-5",
  };

  const disabledStyles =
    disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const widthStyles = fullWidth ? "w-full" : "";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || disabled) return;

    const button = buttonRef.current;
    if (!button) return;

    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = "absolute bg-white/30 rounded-full animate-ripple";

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    if (onClick) onClick(e);
  };

  return (
    <button
      ref={buttonRef}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${widthStyles}
        ${className}
      `}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!isLoading && icon && (
        <span className={`mr-2 ${children ? "" : "mr-0"}`}>{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button;
