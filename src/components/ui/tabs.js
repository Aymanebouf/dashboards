
import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { classNames } from 'primereact/utils';

const Tabs = ({ defaultValue, value, onValueChange, ...props }) => {
  const activeIndex = value !== undefined ? value : defaultValue;
  const onChangeTab = (e) => {
    if (onValueChange) {
      onValueChange(e.index);
    }
  };
  
  return (
    <TabView activeIndex={activeIndex} onTabChange={onChangeTab} {...props} />
  );
};

const TabsList = ({ className, ...props }) => (
  <div
    className={classNames("mb-2", className)}
    {...props}
  />
);

const TabsTrigger = ({ className, value, children, ...props }) => (
  <TabPanel
    header={children}
    headerClassName={classNames("", className)}
    {...props}
  />
);

const TabsContent = ({ className, value, children, ...props }) => (
  <div
    className={classNames("", className)}
    {...props}
  >
    {children}
  </div>
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
