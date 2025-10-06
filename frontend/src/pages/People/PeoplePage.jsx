//./pages/People/PeoplePage
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { Search, UserPlus, MessageSquare, BellOff, MoreVertical, X, Check, UserCheck, UserX, Globe, MapPin, Gamepad, Music, Code, Heart, Star, Users, Sparkles, Filter, Moon, Sun, Loader2, TrendingUp, Calendar } from 'lucide-react';
import Sidebar from '../../import/Sidebar';
import { getAllUsers, getFriends, declineFriendRequest, getFriendRequests, sendFriendRequest, acceptFriendResquest, getSuggestedUsers, getPrivateChatRoom, markAsRead } from '../../api/userApi';

const PeoplePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('discovery');
  const [selectedUser, setSelectedUser] = useState(null);
  const [friendsCategory, setFriendsCategory] = useState('all');

  const [friends, setFriends] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(null);

  const [activeUsers, setActiveUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    const users = await getAllUsers();
    setActiveUsers(users);
    setIsLoadingUsers(false);
  };

  const fetchSuggestedUsers = async () => {
    setIsLoadingSuggestions(true);
    const suggested = await getSuggestedUsers();

    const suggestedMap = new Map();
    suggested.forEach(match => {
      suggestedMap.set(match._id, { matchScore: match.matchScore, reason: match.reason });
    });

    const suggestedUserList = activeUsers
      .filter(user => suggestedMap.has(user._id))
      .map(user => ({
        ...user,
        matchScore: suggestedMap.get(user._id).matchScore,
        reason: suggestedMap.get(user._id).reason
      }))
      .sort((a, b) => b.matchScore - a.matchScore);

    setSuggestedUsers(suggestedUserList);
    setActiveTab("suggestions");
    setIsLoadingSuggestions(false);
  };


  useEffect(() => {
    const fetchRequests = async () => {
      const friend_requests = await getFriendRequests();
      setFriendRequests(friend_requests);
    };

    const fetchFriends = async () => {
      const friends = await getFriends()
      setFriends(friends)
    }

    fetchUsers();
    fetchRequests();
    fetchFriends();

  }, []);

  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const addFriend = async (userId, setState) => {
    try {
      await sendFriendRequest(userId);
      setState(prev =>
        prev.map(u =>
          u._id === userId
            ? { ...u, friendRequestPending: "Pending" }
            : u
        )
      );
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const sendMessage = async (userId) => {
    const room = await getPrivateChatRoom(userId);
    if (!room) {
      console.log('No private chat exists yet.');
      return;
    }
    navigate(`/private-chat/${room}`);
    markAsRead(room)
  };

  const acceptRequest = async (requestId) => {
    try {
      await acceptFriendResquest(requestId);
      setFriendRequests(prev => prev.filter(r => r._id !== requestId));
      setActiveUsers(prev => prev.filter(r => r._id !== requestId));
      setSuggestedUsers(prev => prev.filter(r => r._id !== requestId));
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const declineRequest = async (requestId) => {
    try {
      await declineFriendRequest(requestId);
      setFriendRequests(prev => prev.filter(r => r._id !== requestId));
      setActiveUsers(prev => prev.filter(r => r._id !== requestId));
      setSuggestedUsers(prev => prev.filter(r => r._id !== requestId));
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  const removeFriendHandler = async (friendId) => {
    const token = localStorage.getItem("user");
    try {
      const response = await fetch(`http://localhost:5000/api/users/remove/${friendId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setFriends(prev => prev.filter(f => f._id !== friendId));
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const inviteToEvent = async (userId, eventId) => {
    console.log('Inviting user to event:', userId, eventId);
    navigate('/');
  };

  const filteredActiveUsers = activeUsers.filter(user =>
    user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filter === 'all' ||
      (filter === 'online' && user.isOnline) ||
      (filter === 'recommended' && user.mutualFriends > 2) ||
      (filter === 'mutual' && user.mutualFriends > 0))
  );

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl border-2 ${darkMode ? 'border-gray-700' : 'border-slate-200'} p-6 animate-pulse`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-slate-200'}`}></div>
        <div className="flex-1">
          <div className={`h-5 ${darkMode ? 'bg-gray-700' : 'bg-slate-200'} rounded w-3/4 mb-2`}></div>
          <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-slate-200'} rounded w-1/2`}></div>
        </div>
      </div>
      <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-slate-200'} rounded w-full mb-2`}></div>
      <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-slate-200'} rounded w-5/6 mb-4`}></div>
      <div className={`h-10 ${darkMode ? 'bg-gray-700' : 'bg-slate-200'} rounded w-full`}></div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-purple-950 via-indigo-950 to-violet-950' : 'bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100'}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Spacer div that takes up sidebar width when open */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Dark Mode Toggle - Floating */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`fixed top-6 right-6 z-40 p-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-indigo-600 text-white'
            }`}
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>

        <div className="flex gap-6 max-w-7xl mx-auto p-6">
          {/* Friends Sidebar */}
          <aside className="w-80 flex-shrink-0 animate-slide-in-left">
            <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'} rounded-2xl shadow-2xl border overflow-hidden sticky top-6 transition-colors duration-300`}>
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Users className="w-6 h-6 animate-bounce-subtle" />
                  Friends
                  <span className="ml-auto bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm animate-pulse">
                    {friends.length}
                  </span>
                </h2>
              </div>

              <div className="p-4 max-h-[calc(100vh-12rem)] overflow-y-auto space-y-3 custom-scrollbar">
                {friends.map((friend, index) => (
                  <div
                    key={friend._id}
                    className={`group ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-purple-500' : 'bg-gradient-to-br from-purple-50 to-white border-purple-200 hover:border-purple-400'} p-4 rounded-xl border hover:shadow-xl transition-all duration-300 animate-slide-up cursor-pointer hover:-translate-y-1`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-3" onClick={() => navigate(`/profile/${friend._id}`)} style={{ cursor: 'pointer' }}>
                      <div className="relative flex-shrink-0">
                        <img src={friend.profile_pic} alt={friend.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-300 group-hover:ring-purple-500 transition-all group-hover:scale-110" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} truncate`}>{friend.name}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'} truncate`}>@{friend.username}</p>
                        {friend.lastMessage && (
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-slate-400'} truncate mt-1`}>{friend.lastMessage}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={(e) => { e.stopPropagation(); sendMessage(friend._id); }} className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium hover:shadow-lg transform hover:scale-105">
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMoreMenu(showMoreMenu === friend._id ? null : friend._id);
                          }}
                          className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-purple-100 hover:bg-purple-200 text-purple-600'} p-2 rounded-lg transition-all duration-200 hover:scale-110`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {showMoreMenu === friend._id && (
                          <div className={`absolute right-0 top-8 w-48 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl border z-50`}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFriendHandler(friend._id);
                                setShowMoreMenu(null);
                              }}
                              className={`w-full px-4 py-2 text-left text-red-600 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'} rounded-lg transition-colors flex items-center gap-2`}
                            >
                              <UserX className="w-4 h-4" />
                              Remove Friend
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {friends.length === 0 && (
                  <div className="text-center py-12">
                    <Users className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-purple-300'} mx-auto mb-3`} />
                    <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No friends yet</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-400'} mt-1`}>Start connecting with people!</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'} rounded-2xl shadow-2xl border overflow-hidden animate-bounce-in transition-colors duration-300`}>
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-6 animate-fade-in">
                  <Globe className="w-8 h-8 animate-spin-slow" />
                  Discover People
                </h1>

                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
                  <input
                    type="text"
                    placeholder="Search by name, username, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm rounded-xl border-2 border-transparent focus:border-white focus:outline-none transition-all duration-200 ${darkMode ? 'text-gray-900' : 'text-slate-800'} placeholder-purple-400 shadow-lg hover:shadow-xl`}
                  />
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm hover:scale-105"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {showFilters && <X className="w-4 h-4" />}
                </button>

                {/* Filter Options */}
                {showFilters && (
                  <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-4 animate-slide-down">
                    <div className="flex flex-wrap gap-2">
                      {['all', 'online', 'recommended', 'mutual'].map((filterOption) => (
                        <button
                          key={filterOption}
                          onClick={() => setFilter(filterOption)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${filter === filterOption
                              ? 'bg-white text-purple-600 shadow-lg scale-105'
                              : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                        >
                          {filterOption}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-slate-200 bg-purple-50/50'} transition-colors duration-300`}>
                <div className="flex gap-1 p-2">
                  <button
                    onClick={() => setActiveTab('discovery')}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === 'discovery'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-300/50 scale-105'
                        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-slate-600 hover:bg-white'} hover:text-purple-600`
                      }`}
                  >
                    Find Users
                  </button>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 relative ${activeTab === 'requests'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-300/50 scale-105'
                        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-slate-600 hover:bg-white'} hover:text-purple-600`
                      }`}
                  >
                    Requests
                    {friendRequests.length > 0 && (
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold animate-bounce-subtle ${activeTab === 'requests' ? 'bg-white/20' : 'bg-red-500 text-white'
                        }`}>
                        {friendRequests.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => fetchSuggestedUsers()}
                    disabled={isLoadingSuggestions}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'suggestions'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-300/50 scale-105'
                        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-slate-600 hover:bg-white'} hover:text-purple-600`
                      } ${isLoadingSuggestions ? 'cursor-wait' : ''}`}
                  >
                    {isLoadingSuggestions ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Suggestions
                        {suggestedUsers.length > 0 && (
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeTab === 'suggestions' ? 'bg-white/20' : 'bg-purple-500 text-white'
                            }`}>
                            {suggestedUsers.length}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* User Grid */}
              <div className="p-6">
                {isLoadingSuggestions && activeTab === 'suggestions' && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
                      <Sparkles className="w-8 h-8 text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mt-6 mb-2`}>AI is analyzing matches...</h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'} text-center max-w-md`}>
                      We're finding the perfect connections for you based on your interests, activity, and mutual connections.
                    </p>
                    <div className="flex gap-2 mt-6">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}

                {!isLoadingSuggestions && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Discovery Tab */}
                    {activeTab === 'discovery' && (
                      isLoadingUsers ? (
                        <>
                          <SkeletonCard />
                          <SkeletonCard />
                          <SkeletonCard />
                          <SkeletonCard />
                        </>
                      ) : (
                        filteredActiveUsers.map((user, index) => (
                          <div
                            key={user._id}
                            className={`group ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-purple-500' : 'bg-gradient-to-br from-white to-purple-50 border-purple-200 hover:border-purple-400'} rounded-xl border-2 hover:shadow-2xl transition-all duration-300 overflow-hidden animate-slide-in-right hover:-translate-y-2`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="p-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="relative flex-shrink-0 cursor-pointer" onClick={() => navigate(`/profile/${user._id}`)}>
                                  <img src={user.profile_pic} alt={user.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-200 group-hover:ring-purple-400 transition-all group-hover:scale-110" />
                                  {user.isOnline && (
                                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white animate-pulse-ring"></span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/profile/${user._id}`)}>
                                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'} truncate`}>{user.name}</h3>
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'} truncate`}>@{user.username}</p>
                                </div>
                              </div>

                              {user.bio && (
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'} mb-4 line-clamp-2`}>{user.bio}</p>
                              )}

                              {user.tags && user.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {user.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="space-y-2 mb-4">
                                <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                  <Calendar className="w-4 h-4" />
                                  <span>Joined {user.createdAt ? format(new Date(user.createdAt), "PPP") : 'Recently'}</span>
                                </div>
                                {
                                   user.location &&
                                  <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                    <MapPin className="w-4 h-4" />
                                    <span >{user.location}</span>
                                  </div>
                                }
                                {user.interests && user.interests.length > 0 && (
                                  <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                    <Heart className="w-4 h-4" />
                                    <span className="truncate">{user.interests.join(', ')}</span>
                                  </div>
                                )}
                                {user.mutualFriends !== 0 && (
                                  <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                                    <Users className="w-4 h-4" />
                                    <span>{user.mutualFriends} mutual friends</span>
                                  </div>
                                )}
                              </div>

                              {user.friendRequestReceived ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => acceptRequest(user._id)}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
                                  >
                                    <Check className="w-4 h-4" />
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => declineRequest(user._id)}
                                    className={`flex-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'} px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105`}
                                  >
                                    <X className="w-4 h-4" />
                                    Decline
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={
                                    user.friendRequestPending === "Add Friend"
                                      ? () => addFriend(user._id, setActiveUsers)
                                      : () => console.log("Friend request pending")
                                  }
                                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${user.friendRequestPending === "Pending"
                                      ? `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-slate-100 text-slate-500'} cursor-not-allowed`
                                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                    }`}
                                  disabled={user.friendRequestPending === "Pending"}
                                >
                                  <UserPlus className="w-4 h-4" />
                                  {user.friendRequestPending}
                                </button>
                              )}

                              <button
                                onClick={() => inviteToEvent(user.id, 'event123')}
                                className="w-full mt-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
                              >
                                <Users className="w-4 h-4" />
                                Invite to Event
                              </button>
                            </div>
                          </div>
                        ))
                      )
                    )}

                    {/* Requests Tab */}
                    {activeTab === 'requests' && friendRequests.map((request, index) => (
                      <div
                        key={request._id}
                        className={`group ${darkMode ? 'bg-gray-800 border-blue-700 hover:border-blue-500' : 'bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:border-blue-400'} rounded-xl border-2 hover:shadow-2xl transition-all duration-300 overflow-hidden animate-slide-in-right hover:-translate-y-2`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="relative flex-shrink-0 cursor-pointer" onClick={() => navigate(`/profile/${request._id}`)}>
                              <img src={request.profile_pic} alt={request.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-200 transition-all group-hover:scale-110" />
                            </div>
                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/profile/${request._id}`)}>
                              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'} truncate`}>{request.name}</h3>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'} truncate`}>@{request.username}</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            {request.mutualFriends > 0 && (
                              <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                                <Users className="w-4 h-4" />
                                <span>{request.mutualFriends} mutual friends</span>
                              </div>
                            )}
                            <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                              <span>Sent {format(new Date(request.sentAt), "PPP p")}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptRequest(request._id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                              <Check className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={() => declineRequest(request._id)}
                              className={`flex-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'} px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105`}
                            >
                              <X className="w-4 h-4" />
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Suggestions Tab */}
                    {activeTab === 'suggestions' && suggestedUsers.map((sugg, index) => (
                      <div
                        key={sugg._id}
                        className={`group ${darkMode ? 'bg-gray-800 border-purple-700 hover:border-purple-500' : 'bg-gradient-to-br from-white to-purple-50 border-purple-200 hover:border-purple-400'} rounded-xl border-2 hover:shadow-2xl transition-all duration-300 overflow-hidden animate-slide-in-right hover:-translate-y-2`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="relative flex-shrink-0 cursor-pointer" onClick={() => navigate(`/profile/${sugg._id}`)}>
                              <img src={sugg.profile_pic} alt={sugg.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-200 transition-all group-hover:scale-110" />
                              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-1 animate-bounce-subtle">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/profile/${sugg._id}`)}>
                              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'} truncate`}>{sugg.name}</h3>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'} truncate`}>@{sugg.username}</p>
                            </div>
                          </div>

                          {sugg.reason && (
                            <div className="bg-purple-100 border border-purple-200 rounded-lg p-3 mb-4 animate-pulse-subtle">
                              <p className="text-sm text-purple-800 font-medium flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                {sugg.reason}
                              </p>
                            </div>
                          )}

                          <div className="space-y-2 mb-4">
                            <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                              <MapPin className="w-4 h-4" />
                              <span>Joined {sugg.createdAt ? format(new Date(sugg.createdAt), "PPP") : 'Recently'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Match Score</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-1000 animate-progress"
                                    style={{ width: `${sugg.matchScore}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold text-purple-600">{sugg.matchScore}%</span>
                              </div>
                            </div>
                          </div>

                          {sugg.friendRequestReceived ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => acceptRequest(sugg._id)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
                              >
                                <Check className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => declineRequest(sugg._id)}
                                className={`flex-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'} px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105`}
                              >
                                <X className="w-4 h-4" />
                                Decline
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={
                                sugg.friendRequestPending === "Add Friend"
                                  ? () => addFriend(sugg._id, setSuggestedUsers)
                                  : () => console.log("Friend request pending")
                              }
                              className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${sugg.friendRequestPending === "Pending"
                                  ? `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-slate-100 text-slate-500'} cursor-not-allowed`
                                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                }`}
                              disabled={sugg.friendRequestPending === "Pending"}
                            >
                              <UserPlus className="w-4 h-4" />
                              {sugg.friendRequestPending}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty States */}
                {!isLoadingUsers && !isLoadingSuggestions && (
                  <>
                    {activeTab === 'discovery' && filteredActiveUsers.length === 0 && (
                      <div className="text-center py-20 animate-fade-in">
                        <Globe className={`w-20 h-20 ${darkMode ? 'text-gray-600' : 'text-purple-300'} mx-auto mb-4`} />
                        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-700'} mb-2`}>No users found</h3>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Try adjusting your search criteria</p>
                      </div>
                    )}

                    {activeTab === 'requests' && friendRequests.length === 0 && (
                      <div className="text-center py-20 animate-fade-in">
                        <UserCheck className={`w-20 h-20 ${darkMode ? 'text-gray-600' : 'text-purple-300'} mx-auto mb-4`} />
                        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-700'} mb-2`}>No pending requests</h3>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>You're all caught up!</p>
                      </div>
                    )}

                    {activeTab === 'suggestions' && suggestedUsers.length === 0 && !isLoadingSuggestions && (
                      <div className="text-center py-20 animate-fade-in">
                        <Sparkles className={`w-20 h-20 ${darkMode ? 'text-gray-600' : 'text-purple-300'} mx-auto mb-4 animate-pulse`} />
                        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-700'} mb-2`}>No suggestions yet</h3>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Check back later for personalized recommendations</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-bounce-in transition-colors duration-300`}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 relative">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <img src={selectedUser.profile_pic} alt={selectedUser.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-white/50" />
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
                  <p className="text-white/80">@{selectedUser.username}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {selectedUser.bio && (
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mb-2`}>Bio</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{selectedUser.bio}</p>
                </div>
              )}

              {selectedUser.location && (
                <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  <MapPin className="w-5 h-5" />
                  <span>{selectedUser.location}</span>
                </div>
              )}

              {selectedUser.interests && selectedUser.interests.length > 0 && (
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mb-2 flex items-center gap-2`}>
                    <Heart className="w-5 h-5" />
                    Interests
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{selectedUser.interests.join(', ')}</p>
                </div>
              )}

              {selectedUser.mutualFriends > 0 && (
                <div className="flex items-center gap-2 text-purple-600 font-medium">
                  <Users className="w-5 h-5" />
                  <span>{selectedUser.mutualFriends} mutual friends</span>
                </div>
              )}

              {selectedUser.badges && selectedUser.badges.length > 0 && (
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mb-2 flex items-center gap-2`}>
                    <Star className="w-5 h-5" />
                    Badges
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{selectedUser.badges.join(', ')}</p>
                </div>
              )}

              {selectedUser.tags && selectedUser.tags.length > 0 && (
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mb-2`}>Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.activity && (
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'} italic`}>
                  {selectedUser.activity}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-left {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-down {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.95); opacity: 0; }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes progress {
          from { width: 0; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.4s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-pulse-subtle { animation: pulse-subtle 2s ease-in-out infinite; }
        .animate-progress { animation: progress 1s ease-out; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(147, 51, 234, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(147, 51, 234, 0.5); }
      `}</style>
    </div>
  );
};

export default PeoplePage;