
import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <InputTextarea
      className={classNames(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
