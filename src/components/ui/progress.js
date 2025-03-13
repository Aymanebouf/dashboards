
import React from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { classNames } from 'primereact/utils';

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressBar
    ref={ref}
    className={classNames("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    value={value}
    {...props}
  />
));

Progress.displayName = 'Progress';

export { Progress };
