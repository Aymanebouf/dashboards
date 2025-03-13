
import React from 'react';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';

const Badge = ({ className, variant = 'default', ...props }) => {
  const getSeverity = () => {
    switch (variant) {
      case 'default': return null;
      case 'secondary': return 'info';
      case 'destructive': return 'danger';
      case 'outline': return null;
      case 'success': return 'success';
      case 'warning': return 'warning';
      default: return null;
    }
  };

  return (
    <Tag
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        className
      )}
      severity={getSeverity()}
      {...props}
    />
  );
};

export { Badge };
