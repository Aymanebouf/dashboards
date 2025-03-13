
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <InputText
      type={type}
      className={classNames(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base", 
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
