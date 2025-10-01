import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'default',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  const colorClasses = {
    default: {
      cart: 'text-blue-600',
      text: 'text-gray-800'
    },
    white: {
      cart: 'text-white',
      text: 'text-white'
    },
    dark: {
      cart: 'text-blue-500',
      text: 'text-gray-900'
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Gradient background for the cart */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-900 rounded-lg shadow-lg"></div>
        <div className="relative flex items-center justify-center w-full h-full">
          <ShoppingCart 
            className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : size === 'lg' ? 'w-6 h-6' : 'w-8 h-8'} text-white`}
            strokeWidth={2.5}
          />
        </div>
        {/* Small dot indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSizeClasses[size]} ${colorClasses[variant].text} leading-none`}>
            Fast<span className="text-green-900">Deal</span>
          </span>
          {size !== 'sm' && (
            <span className={`text-xs text-black  mt-1`}>
              Électronique d&apos;occasion
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;