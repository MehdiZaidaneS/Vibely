/**
 * Gets user initials from name
 */
export const getInitials = (name) => {
  if (!name) return 'U';

  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generates a background color based on name
 */
export const getAvatarColor = (name) => {
  if (!name) return '#6366f1';

  const colors = [
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#3b82f6', // blue
  ];

  // Generate a hash from the name to consistently pick the same color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Check if user has a custom profile picture
 */
export const hasProfilePicture = (user) => {
  return user?.profile_pic &&
         user.profile_pic !== '' &&
         !user.profile_pic.includes('placeholder');
};
