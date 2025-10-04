// src/import/ProfilePopupFull.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, Edit3, Check, X, MapPin, Calendar, Users, Activity, Globe, Github, Linkedin, Mail, Maximize2
} from 'lucide-react';
import { getUserbyId, addInfo } from '../../api/userApi';
import { getEventCreatedbyUser } from '../../api/eventsApi';
import PortalModal from './PortalModal';
//this file has mostly all the features as the orignal ProfilePage
const ProfilePopupFull = ({ isOpen, onClose, user: initialUser, setUser: setParentUser, onExpand }) => {

  const [user, setUser] = useState({})

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

  useEffect(() => {
    getUserbyId((fetchedUser) => {
      const fullUser = { ...user, ...fetchedUser };
      setUser(fullUser);
      setEditUsername(fullUser.username || "");
      setEditDisplayName(fullUser.name || "");
      setEditBio(fullUser.bio || "");
      setEditLocation(fullUser.location || "");
      setEditEmail(fullUser.email || "")
      setEditPhone(fullUser.phone || "")
    });
    getEventCreatedbyUser(setCreatedEvents)
  }, []);



  const profilePicInputRef = useRef(null);

  const statusOptions = [
    { value: 'available', label: 'Available', color: 'bg-green-500' },
    { value: 'away', label: 'Away', color: 'bg-yellow-500' },
    { value: 'busy', label: 'Do not disturb', color: 'bg-red-500' },
    { value: 'offline', label: 'Appear offline', color: 'bg-gray-500' }
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      const updatedUser = { ...user, profile_pic: base64Image };

      try {
        setUser(updatedUser);
        if (setParentUser) setParentUser(updatedUser);
        const updatedFromDB = await addInfo({ profile_pic: base64Image });
        if (setParentUser) setParentUser(updatedFromDB);
      } catch (err) {
        console.error(" Error updating profile picture:", err);
      }
    };

    reader.readAsDataURL(file);
  };


  const saveUsername = async () => {
    const updatedUser = { ...user, username: editUsername, name: editDisplayName };
    setUser(updatedUser);
    if (setParentUser) setParentUser(updatedUser);
    await addInfo({ name: editDisplayName, username: editUsername });
    setIsEditingUsername(false);
  };

  const saveBio = async () => {
    const updatedUser = { ...user, bio: editBio };
    setUser(updatedUser);
    if (setParentUser) setParentUser(updatedUser);
    await addInfo({ bio: editBio });
    setIsEditingBio(false);
  };

  const saveLocation = async () => {
    const updatedUser = { ...user, location: editLocation };
    setUser(updatedUser);
    if (setParentUser) setParentUser(updatedUser);
    await addInfo({ location: editLocation });
    setIsEditingLocation(false);
  };

  const saveEmail = async () => {
    const updatedUser = { ...user, email: editEmail };
    setUser(updatedUser);
    if (setParentUser) setParentUser(updatedUser);
    await addInfo({ email: editEmail });
    setIsEditingEmail(false);
  };

  const savePhone = async () => {
    const updatedUser = { ...user, phone: editPhone };
    setUser(updatedUser);
    if (setParentUser) setParentUser(updatedUser);
    await addInfo({ phone: editPhone });
    setIsEditingPhone(false);
  };




  const updateStatus = async (newStatus) => {
    const updatedUser = { ...user, status: newStatus };
    setUser(updatedUser);
    if (setParentUser) setParentUser(updatedUser);
    await addInfo({status: newStatus})
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleExpandClick = () => {
    if (onExpand) {
      onExpand();
    }
    onClose();
  };

  const currentStatus = statusOptions.find(s => s.value === user.status);

  if (!isOpen) return null;

  return (
    <PortalModal>
      <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-16 md:pt-24">
        <div className="absolute inset-0 bg-transparent backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
          {/* Header with Expand Button */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Profile</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleExpandClick}
                className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                title="Expand to full page"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden shadow-lg ring-4 ring-indigo-100">
                  {user.profile_pic ? (
                    <img src={user.profile_pic} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{getInitials(user.name)}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => profilePicInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  <Camera className="w-3 h-3" />
                </button>
                <input
                  ref={profilePicInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </div>

              <div className="flex-1">
                {isEditingUsername ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editDisplayName}
                      onChange={(e) => setEditDisplayName(e.target.value)}
                      className="text-xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none w-full"
                      placeholder="Display Name"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">@</span>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="text-base text-gray-600 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                        placeholder="username"
                      />
                      <button onClick={saveUsername} className="text-green-600 hover:text-green-700">
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditUsername(user.username);
                          setEditDisplayName(user.name);
                          setIsEditingUsername(false);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                      <button
                        onClick={() => setIsEditingUsername(true)}
                        className="text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-base text-gray-600">@{user.username}</p>
                  </div>
                )}

                <div className="mt-2 flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${currentStatus.color}`} />
                  <select
                    value={user.status}
                    onChange={(e) => updateStatus(e.target.value)}
                    className="text-sm text-gray-600 bg-transparent border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mb-6">
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
                    <button onClick={saveBio} className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
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
                  <p className="text-gray-700 flex-1 text-sm">{user.bio || 'No bio added yet.'}</p>
                  <button onClick={() => setIsEditingBio(true)} className="text-gray-500 hover:text-indigo-600 transition-colors">
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-gray-600">
              {/* Email */}
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {isEditingEmail ? (
                  <div className="flex items-center space-x-1 flex-1">
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="flex-1 border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-sm"
                      placeholder="Add email"
                    />
                    <button onClick={saveEmail} className="text-green-600 hover:text-green-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setEditEmail(user.email); setIsEditingEmail(false); }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm">{user.email || 'Add email'}</span>
                    <button
                      onClick={() => setIsEditingEmail(true)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>

              {/* Phone number */}
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-400" />
                {isEditingPhone ? (
                  <div className="flex items-center space-x-1 flex-1">
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="flex-1 border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-sm"
                      placeholder="Add phone number"
                    />
                    <button onClick={savePhone} className="text-green-600 hover:text-green-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setEditPhone(user.phone); setIsEditingPhone(false); }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm">{user.phone || 'Add phone number'}</span>
                    <button
                      onClick={() => setIsEditingPhone(true)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
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
                    <button onClick={() => { setEditLocation(user.location); setIsEditingLocation(false); }} className="text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm">{user.location || 'Add location'}</span>
                    <button onClick={() => setIsEditingLocation(true)} className="text-gray-400 hover:text-indigo-600">
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

            




            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{user.joinedEvents?.length}</p>
                <p className="text-xs text-gray-600">Events Joined</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{createdEvents.length}</p>
                <p className="text-xs text-gray-600">Events Created</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{user.friends.length}</p>
                <p className="text-xs text-gray-600">Friends</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalModal>
  );
};

export default ProfilePopupFull;