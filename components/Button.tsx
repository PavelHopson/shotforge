import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', isLoading, className = '', disabled, ...props
}) => {
  const base = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:pointer-events-none";

  const variants = {
    primary: "text-white",
    secondary: "bg-glass border border-glass-border text-dim hover:text-sf-200 hover:border-sf-700/50",
    outline: "bg-transparent border border-glass-border text-dim hover:text-sf-300 hover:border-sf-700/50",
    ghost: "bg-transparent text-dim hover:text-sf-300 hover:bg-glass-hover"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-sm"
  };

  const primaryStyle = variant === 'primary' ? {
    background: 'linear-gradient(135deg, #4A7FD4, #6BA3FF)',
    boxShadow: '0 2px 16px rgba(107,163,255,0.25)',
  } : {};

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      style={primaryStyle}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Обработка...
        </span>
      ) : children}
    </button>
  );
};
