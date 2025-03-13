
import React from 'react';
import { Button as PrimeButton } from 'primereact/button';
import { classNames } from 'primereact/utils';

const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default',
  children,
  asChild = false,
  ...props 
}, ref) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'default': return 'p-button-primary';
      case 'destructive': return 'p-button-danger';
      case 'outline': return 'p-button-outlined';
      case 'secondary': return 'p-button-secondary';
      case 'ghost': return 'p-button-text';
      case 'link': return 'p-button-link';
      default: return 'p-button-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'default': return '';
      case 'sm': return 'p-button-sm';
      case 'lg': return 'p-button-lg';
      case 'icon': return 'p-button-icon-only';
      default: return '';
    }
  };

  return (
    <PrimeButton
      ref={ref}
      className={classNames(getVariantClass(), getSizeClass(), className)}
      {...props}
    >
      {children}
    </PrimeButton>
  );
});

Button.displayName = 'Button';

export { Button };
