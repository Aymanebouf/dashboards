
import React from 'react';
import { Skeleton as PrimeSkeleton } from 'primereact/skeleton';
import { classNames } from 'primereact/utils';

function Skeleton({ className, ...props }) {
  return (
    <PrimeSkeleton
      className={classNames("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
