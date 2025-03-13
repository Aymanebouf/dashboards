
import React from 'react';
import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <PrimeCheckbox
    ref={ref}
    className={classNames("", className)}
    {...props}
  />
));

Checkbox.displayName = 'Checkbox';

export { Checkbox };
