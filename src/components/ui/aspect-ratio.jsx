
import React from 'react';

const AspectRatio = ({ ratio = 1, children, className }) => {
  return (
    <div 
      className={className} 
      style={{ 
        position: 'relative',
        width: '100%',
        paddingBottom: `${(1 / ratio) * 100}%`,
      }}
    >
      <div style={{ 
        position: 'absolute', 
        height: '100%', 
        width: '100%', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0 
      }}>
        {children}
      </div>
    </div>
  );
};

export { AspectRatio };
