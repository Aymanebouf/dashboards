
import React from 'react';
import { Dialog as PrimeDialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';

const Dialog = ({ children, className, ...props }) => {
  return (
    <PrimeDialog
      className={classNames("", className)}
      {...props}
    >
      {children}
    </PrimeDialog>
  );
};

const DialogContent = ({ className, children, ...props }) => {
  return (
    <div
      className={classNames("p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const DialogHeader = ({ className, ...props }) => (
  <div
    className={classNames("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
);

const DialogFooter = ({ className, ...props }) => (
  <div
    className={classNames("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);

const DialogTitle = ({ className, ...props }) => (
  <h3
    className={classNames("text-lg font-semibold", className)}
    {...props}
  />
);

const DialogDescription = ({ className, ...props }) => (
  <p
    className={classNames("text-sm text-muted-foreground", className)}
    {...props}
  />
);

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
};
