
import React from 'react';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ElementType;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  type = 'button'
}) => {
  const baseClasses = 'font-semibold rounded-xl flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/20 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/20 shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:-translate-y-0.5',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary/20',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {Icon && <Icon className="mr-2 h-5 w-5" />}
      {children}
    </button>
  );
};

export default Button;