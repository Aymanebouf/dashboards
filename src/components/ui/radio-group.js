
import React from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { classNames } from 'primereact/utils';

const RadioGroup = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={classNames("grid gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});

RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef(({ className, value, checked, onChange, label, ...props }, ref) => {
  return (
    <div className="flex items-center">
      <RadioButton
        ref={ref}
        className={classNames("mr-2", className)}
        value={value}
        checked={checked}
        onChange={onChange}
        {...props}
      />
      {label && <label className="ml-2">{label}</label>}
    </div>
  );
});

RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
