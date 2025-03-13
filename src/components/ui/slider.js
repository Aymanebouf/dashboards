
import React from 'react';
import { Slider as PrimeSlider } from 'primereact/slider';
import { classNames } from 'primereact/utils';

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <PrimeSlider
    ref={ref}
    className={classNames("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  />
));

Slider.displayName = 'Slider';

export { Slider };
