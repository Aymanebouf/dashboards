
import React from 'react';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';

const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <Divider
      ref={ref}
      layout={orientation}
      className={classNames(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);

Separator.displayName = 'Separator';

export { Separator };
