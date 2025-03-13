
import React from 'react';
import { Card as PrimeCard } from 'primereact/card';
import { classNames } from 'primereact/utils';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <PrimeCard
    ref={ref}
    className={classNames("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
));

Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={classNames("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={classNames("text-sm text-muted-foreground", className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={classNames("p-6 pt-0", className)} {...props} />
));

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames("flex items-center p-6 pt-0", className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
