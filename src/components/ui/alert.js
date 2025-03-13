
import React from 'react';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';

const Alert = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const getSeverity = () => {
    switch (variant) {
      case 'default': return 'info';
      case 'destructive': return 'error';
      default: return 'info';
    }
  };

  return (
    <Message
      ref={ref}
      severity={getSeverity()}
      className={classNames("w-full rounded-lg p-4", className)}
      {...props}
    />
  );
});

Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={classNames("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));

AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames("text-sm", className)}
    {...props}
  />
));

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
