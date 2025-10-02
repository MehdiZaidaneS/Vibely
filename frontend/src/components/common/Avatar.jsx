import React from 'react';
import { hasProfilePicture } from '../../utils/avatar';

const DefaultAvatarIcon = ({ size }) => {
  return (
    <svg viewBox="0 0 100 100" className={size}>
      {/* Background circle */}
      <circle cx="50" cy="50" r="50" fill="#E5E7EB" />

      {/* Head circle */}
      <circle cx="50" cy="35" r="16" fill="#9CA3AF" />

      {/* Body shape */}
      <ellipse cx="50" cy="75" rx="28" ry="20" fill="#9CA3AF" />
    </svg>
  );
};

const Avatar = ({ user, size = 'md', className = '', onClick }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const hasPicture = hasProfilePicture(user);

  if (hasPicture) {
    return (
      <img
        src={user.profile_pic}
        alt={user.name || 'User'}
        className={`${sizeClass} rounded-full object-cover ${className}`}
        onClick={onClick}
      />
    );
  }

  // Show default avatar icon
  return (
    <div
      className={`${sizeClass} rounded-full overflow-hidden ${className}`}
      onClick={onClick}
    >
      <DefaultAvatarIcon size={sizeClass} />
    </div>
  );
};

export default Avatar;
