
import React from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import { classNames } from 'primereact/utils';

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <InputSwitch
    ref={ref}
    className={classNames("", className)}
    {...props}
  />
));

Switch.displayName = 'Switch';

export { Switch };
