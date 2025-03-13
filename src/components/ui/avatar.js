
import React from 'react';
import { Avatar as PrimeAvatar } from 'primereact/avatar';
import { AvatarGroup as PrimeAvatarGroup } from 'primereact/avatargroup';
import { classNames } from 'primereact/utils';

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <PrimeAvatar
    ref={ref}
    className={classNames("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));

Avatar.displayName = 'Avatar';

const AvatarImage = ({ src, alt, className, ...props }) => (
  <Avatar image={src} imageAlt={alt} className={className} {...props} />
);

const AvatarFallback = ({ children, className, ...props }) => (
  <Avatar label={children} className={className} {...props} />
);

export { Avatar, AvatarImage, AvatarFallback, PrimeAvatarGroup as AvatarGroup };
