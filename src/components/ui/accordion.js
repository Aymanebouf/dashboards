
import React from 'react';
import { Accordion as PrimeAccordion, AccordionTab } from 'primereact/accordion';
import { classNames } from 'primereact/utils';

const Accordion = React.forwardRef(({ className, ...props }, ref) => (
  <PrimeAccordion
    ref={ref}
    className={classNames("", className)}
    {...props}
  />
));

Accordion.displayName = 'Accordion';

const AccordionItem = ({ className, children, header, ...props }) => (
  <AccordionTab
    header={header}
    className={classNames("border-b", className)}
    {...props}
  >
    {children}
  </AccordionTab>
);

const AccordionTrigger = ({ className, children, ...props }) => (
  <div
    className={classNames("flex flex-1 items-center justify-between py-4 font-medium", className)}
    {...props}
  >
    {children}
  </div>
);

const AccordionContent = ({ className, children, ...props }) => (
  <div
    className={classNames("pb-4 pt-0", className)}
    {...props}
  >
    {children}
  </div>
);

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
