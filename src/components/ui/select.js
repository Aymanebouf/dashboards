
import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

const Select = ({ children, ...props }) => {
  return <Dropdown {...props} />;
};

const SelectItem = ({ children, ...props }) => {
  return {
    label: children,
    ...props
  };
};

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <Dropdown
    ref={ref}
    className={classNames(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
      className
    )}
    {...props}
  >
    {children}
  </Dropdown>
));

SelectTrigger.displayName = 'SelectTrigger';

export { Select, SelectItem, SelectTrigger };
