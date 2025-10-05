// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, Edit3, Check, X, MapPin, Calendar, Link2, Users, Activity, Settings, Share2, Globe, Github, Linkedin, Mail
} from 'lucide-react';
import Sidebar from '../../import/Sidebar';
import { getUserbyId, addInfo, getActivities } from "../../api/userApi";
import { getEventCreatedbyUser } from '../../api/eventsApi';
import './ProfilePage.css';
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar
  const [user, setUser] = useState({});
  const navigate = useNavigate()



  // Edit states
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [createdEvents, setCreatedEvents] = useState([])
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editDisplayName, setEditDisplayName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editLocation, setEditLocation] = useState(user.location);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editEmail, setEditEmail] = useState(user.email);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [activities, setActivities] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUser = await getUserbyId();
        const fullUser = { ...user, ...fetchedUser };
        setUser(fullUser);
        setEditUsername(fullUser.username || "");
        setEditDisplayName(fullUser.name || "");
        setEditBio(fullUser.bio || "");
        setEditLocation(fullUser.location || "");
        setEditEmail(fullUser.email || "");
        setEditPhone(fullUser.phone || "");
      } catch (err) {
        console.error("Failed to load user:", err);
      }

      try {
        const events = await getEventCreatedbyUser();
        setCreatedEvents(events || []);
      } catch (err) {
        console.error("Error fetching created events:", err);
        setCreatedEvents([]);
      }

      try {

        const activityList = await getActivities()
        setActivities(activityList || [])

      } catch (err) {
        console.error("Error fetching created events:", err);
        setCreatedEvents([]);
      }
    };

    fetchData();
  }, []);


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
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      const updatedUser = { ...user, profile_pic: base64Image };

      try {
        setUser(updatedUser);
        const updatedFromDB = await addInfo({ profile_pic: base64Image })
      } catch (err) {
        console.error(" Error updating profile picture:", err);
      }
    };

    reader.readAsDataURL(file);
  };

  // Handle banner change
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      const updatedUser = { ...user, banner: base64Image };

      try {
        setUser(updatedUser);
        const updatedFromDB = await addInfo({ banner: base64Image });
      } catch (err) {
        console.error(" Error updating profile picture:", err);
      }
    };

    reader.readAsDataURL(file);
  };

  // Save username
  const saveUsername = async () => {
    setUser(prev => ({
      ...prev,
      username: editUsername,
      name: editDisplayName
    }));
    await addInfo({ name: editDisplayName, username: editUsername });
    setIsEditingUsername(false);
  };

  // Save bio
  const saveBio = async () => {
    setUser(prev => ({ ...prev, bio: editBio }));
    await addInfo({ bio: editBio });
    setIsEditingBio(false);
  };

  // Save location
  const saveLocation = async () => {
    setUser(prev => ({ ...prev, location: editLocation }));
    await addInfo({ location: editLocation });
    setIsEditingLocation(false);
  };

  // Format joined date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Update status
  const updateStatus = async (newStatus) => {
    setUser(prev => ({ ...prev, status: newStatus }));
    await addInfo({ status: newStatus })

  };

  const currentStatus = statusOptions.find(s => s.value === user.status) || statusOptions[0];

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

            <button
              onClick={() => navigate("/")}
              className="p-2 border border-pink-500 text-pink-500 rounded-lg bg-transparent 
             hover:bg-pink-500/10 transition-colors duration-200"
            >
              Back
            </button>


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
                                {getInitials(user.name)}
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
                                  setEditDisplayName(user.name);
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
                                {user.name}
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
                        <span className="text-sm">Joined {formatDate(user.createdAt)}</span>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Events Joined</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{user.joinedEvents?.length}</p>
                      </div>
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <Activity className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Events Created</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{createdEvents.length}</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>

                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Friends</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{user.friends?.length}</p>
                      </div>
                      <div className="p-3 bg-pink-100 rounded-lg">
                        <Users className="w-6 h-6 text-pink-600" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 mb-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>

                    {activities.length === 0 ? (
                      <p className="text-gray-500 text-sm">No recent activity.</p>
                    ) : (
                      <div className="space-y-4">
                        {activities.map((activity, idx) => (
                          <div
                            key={idx}
                            className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="p-2 rounded-lg" style={{ backgroundColor: activity.type === "Accepted Friend" ? "#FBCFE8" : activity.type === "Created Event" ? "#E9D5FF" : "#DBEAFE" }}>
                              {activity.type === "Accepted Friend" ? (
                                <Users className="w-4 h-4 text-pink-600" />
                              ) : activity.type === "Created Event" ? (
                                <Calendar className="w-4 h-4 text-purple-600" />
                              ) : (
                                <Activity className="w-4 h-4 text-indigo-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{activity.content}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {activity.createdAt
                                  ? formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })
                                  : ''}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main >
      </div >
    </div >
  );
};

export default ProfilePage;