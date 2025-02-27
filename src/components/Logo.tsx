
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-logitag-primary to-logitag-secondary opacity-30 blur-sm rounded-full animate-pulse-gentle"></div>
        <svg 
          className={`relative ${sizeClasses[size]}`} 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="60" cy="60" r="55" fill="#7056AB" />
          <path d="M60 20C38.9543 20 22 36.9543 22 58C22 79.0457 38.9543 96 60 96C81.0457 96 98 79.0457 98 58C98 36.9543 81.0457 20 60 20ZM60 30C75.4902 30 88 42.5098 88 58C88 73.4902 75.4902 86 60 86C44.5098 86 32 73.4902 32 58C32 42.5098 44.5098 30 60 30Z" fill="white" />
          <path d="M60 40C50.0589 40 42 48.0589 42 58C42 67.9411 50.0589 76 60 76C69.9411 76 78 67.9411 78 58C78 48.0589 69.9411 40 60 40ZM60 50C64.4183 50 68 53.5817 68 58C68 62.4183 64.4183 66 60 66C55.5817 66 52 62.4183 52 58C52 53.5817 55.5817 50 60 50Z" fill="white" />
          <path d="M90 25C90 28.866 86.866 32 83 32C79.134 32 76 28.866 76 25C76 21.134 79.134 18 83 18C86.866 18 90 21.134 90 25Z" fill="#F97CE5" />
        </svg>
      </div>
      <div className="ml-2">
        <h1 className="font-bold text-lg text-logitag-primary">LOGITAG</h1>
        <p className="text-xs tracking-widest text-logitag-secondary">ASSET TRACKING</p>
      </div>
    </div>
  );
};

export default Logo;
