// src/import/ProfilePopupMinimal.jsx
import React from 'react';
import { MapPin, Calendar, Users, Activity, X, Maximize2 } from 'lucide-react';
import PortalModal from './PortalModal';
//this file is basically the popup with minimal features
const ProfilePopupMinimal = ({ isOpen, onClose, user, onExpand }) => {
  if (!isOpen || !user) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const statusColors = {
    available: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-500'
  };

  const statusLabels = {
    available: 'Available',
    away: 'Away',
    busy: 'Do not disturb',
    offline: 'Offline'
  };

  return (
    <PortalModal>
      <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-16 md:pt-24">
        <div className="absolute inset-0 bg-transparent backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4 flex justify-between items-center rounded-t-2xl">
            <h2 className="text-xl font-bold text-white">Profile</h2>
            <div className="flex space-x-2">
              {onExpand && (
                <button
                  onClick={() => {
                    onExpand();
                    onClose();
                  }}
                  className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                  title="Expand to full page"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-24 w-24 rounded-full overflow-hidden shadow-lg ring-4 ring-indigo-100 mb-4">
                {user.profile_pic ? (
                  <img src={user.profile_pic} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{getInitials(user.displayName || user.name)}</span>
                  </div>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900">{user.displayName || user.name}</h1>
              <p className="text-base text-gray-600 mb-3">@{user.username}</p>

              {/* Status Badge */}
              {user.status && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
                  <div className={`w-2 h-2 rounded-full ${statusColors[user.status] || 'bg-gray-500'}`} />
                  <span className="text-sm text-gray-700">{statusLabels[user.status] || 'Offline'}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mb-6">
                <p className="text-gray-700 text-sm text-center">{user.bio}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 text-center">
                <Activity className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-900">{user.eventsJoined || 0}</p>
                <p className="text-xs text-gray-600">Joined</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center">
                <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-900">{user.eventsCreated || 0}</p>
                <p className="text-xs text-gray-600">Created</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-3 text-center">
                <Users className="w-5 h-5 text-pink-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-900">{user.friendsCount || user.friends?.length || 0}</p>
                <p className="text-xs text-gray-600">Friends</p>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              {user.location && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm">{user.location}</span>
                </div>
              )}

              {user.joinedDate && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm">Joined {formatDate(user.joinedDate)}</span>
                </div>
              )}

              {user.createdAt && !user.joinedDate && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm">Joined {formatDate(user.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalModal>
  );
};

export default ProfilePopupMinimal;