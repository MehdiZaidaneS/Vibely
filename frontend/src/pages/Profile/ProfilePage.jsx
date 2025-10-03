// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import {  Camera,  Edit3,  Check,  X,  MapPin,  Calendar, Link2, Users, Activity, Settings, Share2, Globe, Github, Linkedin,Mail
} from 'lucide-react';
import Sidebar from '../../import/Sidebar'; 
import './ProfilePage.css';

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar
  const [user, setUser] = useState({
    id: '123',
    username: 'johndoe',
    displayName: 'John Doe',
    bio: 'Passionate event organizer and community builder. Love connecting people through meaningful experiences.',
    profile_pic: null,
    banner: null,
    location: 'San Francisco, CA',
    status: 'available',
    joinedDate: '2024-01-15',
    eventsJoined: 42,
    eventsCreated: 8,
    friendsCount: 156,
    socialLinks: {
      website: 'https://johndoe.com',
      twitter: 'johndoe',
      github: 'johndoe',
      linkedin: 'johndoe'
    }
  });

  // Edit states
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editDisplayName, setEditDisplayName] = useState(user.displayName);
  const [editBio, setEditBio] = useState(user.bio);
  const [editLocation, setEditLocation] = useState(user.location);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  
  // File input refs
  const profilePicInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Status options
  const statusOptions = [
    { value: 'available', label: 'Available', color: 'bg-green-500' },
    { value: 'away', label: 'Away', color: 'bg-yellow-500' },
    { value: 'busy', label: 'Do not disturb', color: 'bg-red-500' },
    { value: 'offline', label: 'Appear offline', color: 'bg-gray-500' }
  ];

  // Sidebar handlers
  const openSidebar = () => {
    setIsSidebarOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    document.body.style.overflow = 'auto';
  };
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? 'hidden' : 'auto';
      return next;
    });
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, profile_pic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle banner change
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, banner: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save username
  const saveUsername = () => {
    setUser(prev => ({ 
      ...prev, 
      username: editUsername,
      displayName: editDisplayName 
    }));
    setIsEditingUsername(false);
  };

  // Save bio
  const saveBio = () => {
    setUser(prev => ({ ...prev, bio: editBio }));
    setIsEditingBio(false);
  };

  // Save location
  const saveLocation = () => {
    setUser(prev => ({ ...prev, location: editLocation }));
    setIsEditingLocation(false);
  };

  // Format joined date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Update status
  const updateStatus = (newStatus) => {
    setUser(prev => ({ ...prev, status: newStatus }));
  };

  const currentStatus = statusOptions.find(s => s.value === user.status);

  // Handle Escape key for sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  return (
    <div className={`main-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onToggle={toggleSidebar} />

      <div className="content-wrapper">
        {/* Header */}
        <header className="header">
          <div className="header-top">
            <button className="hamburger" onClick={openSidebar}>
              ☰
            </button>
            <h1 className="page-title">Profile</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header with Banner */}
            <div className="relative">
              <div 
                className="h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden"
                style={{
                  backgroundImage: user.banner ? `url(${user.banner})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!user.banner && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20" />
                )}
                
                <button
                  onClick={() => bannerInputRef.current?.click()}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg hover:bg-white transition-colors shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </div>

              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-24">
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-5">
                      <div className="relative">
                        <div className="h-32 w-32 rounded-full bg-white ring-4 ring-white overflow-hidden shadow-xl">
                          {user.profile_pic ? (
                            <img 
                              src={user.profile_pic} 
                              alt="Profile" 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white text-3xl font-bold">
                                {getInitials(user.displayName)}
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => profilePicInputRef.current?.click()}
                          className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <input
                          ref={profilePicInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                          className="hidden"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        {isEditingUsername ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editDisplayName}
                                onChange={(e) => setEditDisplayName(e.target.value)}
                                className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none"
                                placeholder="Display Name"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">@</span>
                              <input
                                type="text"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                className="text-lg text-gray-600 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                                placeholder="username"
                              />
                              <button
                                onClick={saveUsername}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditUsername(user.username);
                                  setEditDisplayName(user.displayName);
                                  setIsEditingUsername(false);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-2">
                              <h1 className="text-2xl font-bold text-gray-900 truncate">
                                {user.displayName}
                              </h1>
                              <button
                                onClick={() => setIsEditingUsername(true)}
                                className="text-gray-500 hover:text-indigo-600 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-lg text-gray-600">@{user.username}</p>
                          </div>
                        )}

                        <div className="mt-3 flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${currentStatus.color}`} />
                          <select
                            value={user.status}
                            onChange={(e) => updateStatus(e.target.value)}
                            className="text-sm text-gray-600 bg-transparent border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500"
                          >
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                        <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-6">
                      {isEditingBio ? (
                        <div className="space-y-2">
                          <textarea
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
                            rows="3"
                            placeholder="Write something about yourself..."
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={saveBio}
                              className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditBio(user.bio);
                                setIsEditingBio(false);
                              }}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start space-x-2">
                          <p className="text-gray-700 flex-1">{user.bio || 'No bio added yet.'}</p>
                          <button
                            onClick={() => setIsEditingBio(true)}
                            className="text-gray-500 hover:text-indigo-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {isEditingLocation ? (
                          <div className="flex items-center space-x-1 flex-1">
                            <input
                              type="text"
                              value={editLocation}
                              onChange={(e) => setEditLocation(e.target.value)}
                              className="flex-1 border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-sm"
                              placeholder="Add location"
                            />
                            <button onClick={saveLocation} className="text-green-600">
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setEditLocation(user.location);
                                setIsEditingLocation(false);
                              }}
                              className="text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-sm">{user.location || 'Add location'}</span>
                            <button
                              onClick={() => setIsEditingLocation(true)}
                              className="text-gray-400 hover:text-indigo-600"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">Joined {formatDate(user.joinedDate)}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-3">
                      {user.socialLinks.github && (
                        <a href={`https://github.com/${user.socialLinks.github}`} className="text-gray-400 hover:text-gray-700 transition-colors">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {user.socialLinks.linkedin && (
                        <a href={`https://linkedin.com/in/${user.socialLinks.linkedin}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <Mail className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Events Joined</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{user.eventsJoined}</p>
                      </div>
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <Activity className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-green-600">
                        <span className="font-medium">+12%</span>
                        <span className="text-gray-500 ml-2">from last month</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Events Created</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{user.eventsCreated}</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-green-600">
                        <span className="font-medium">+2</span>
                        <span className="text-gray-500 ml-2">this month</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Friends</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{user.friendsCount}</p>
                      </div>
                      <div className="p-3 bg-pink-100 rounded-lg">
                        <Users className="w-6 h-6 text-pink-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-green-600">
                        <span className="font-medium">+8</span>
                        <span className="text-gray-500 ml-2">new connections</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 mb-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Activity className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Joined <span className="font-semibold">Summer Music Festival</span></p>
                          <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Created event <span className="font-semibold">Tech Meetup 2025</span></p>
                          <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <Users className="w-4 h-4 text-pink-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Connected with <span className="font-semibold">5 new friends</span></p>
                          <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;