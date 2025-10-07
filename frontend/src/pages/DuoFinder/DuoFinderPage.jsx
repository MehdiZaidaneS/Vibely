import React, { useState, useEffect } from 'react';
import { Heart, X, User, MessageCircle, Sparkles, Users, MapPin, Calendar, TrendingUp, Zap, Target, Award, Star, Filter, RefreshCw } from 'lucide-react';
import Sidebar from '../../import/Sidebar';
import { sendFriendRequest, getPrivateChatRoom } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
const interests = [
  { name: "Football", icon: "⚽", color: "from-green-400 to-green-600" },
  { name: "Gaming", icon: "🎮", color: "from-purple-400 to-purple-600" },
  { name: "Cooking", icon: "🍳", color: "from-orange-400 to-orange-600" },
  { name: "Fitness", icon: "💪", color: "from-red-400 to-red-600" },
  { name: "Movies", icon: "🎬", color: "from-rose-400 to-rose-600" },
  { name: "Photography", icon: "📷", color: "from-blue-400 to-blue-600" },
  { name: "Hiking", icon: "🥾", color: "from-emerald-400 to-emerald-600" },
  { name: "Tech", icon: "💻", color: "from-indigo-400 to-indigo-600" },
  { name: "Art", icon: "🎨", color: "from-yellow-400 to-yellow-600" },
  { name: "Travel", icon: "✈️", color: "from-cyan-400 to-cyan-600" }
];

export default function DuoFinderAdvanced() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [step, setStep] = useState('welcome');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [likedMatches, setLikedMatches] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem('currentMatchIndex', currentMatchIndex.toString());
  }, [currentMatchIndex]);
  useEffect(() => {
    sessionStorage.setItem('matches', JSON.stringify(matches));
    sessionStorage.setItem('likedMatches', JSON.stringify(likedMatches));
  }, [matches, likedMatches]);

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

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const startSearch = () => {
    setStep('select');
  };

  const findDuo = async () => {
    setStep('loading');
    try {
      const token = localStorage.getItem("user");
      const userId = localStorage.getItem("userId");

      if (!userId || !token) {
        setStep('complete');
        return;
      }

      const response = await fetch(`${API_URL}/api/users/matched-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ interests: selectedInterests })
      });

      if (!response.ok) {
        throw new Error("Failed to get recommended users");
      }

      const data = await response.json();
      const matches = Array.isArray(data.matches) ? data.matches : [];
      const sortedMatches = matches.sort((a, b) => b.matchScore - a.matchScore);

      setMatches(sortedMatches);
      setStep('results');
    } catch (error) {
      console.error("Error fetching recommended users:", error);
      setStep('complete');
    }
  };

  const handleLike = async () => {

    handleSwipe('right');
  };

  const handleSwipe = async (direction) => {
    const swipeDistance = direction === 'right' ? 1000 : -1000;
    setCardPosition({ x: swipeDistance, y: -100 });

    if (direction === 'right') {
      try {
        await sendFriendRequest(currentMatch._id);
       
      } catch (error) {
        console.error("Failed to send friend request", error);
      }
      setLikedMatches(prev => [...prev, currentMatch]);
    }

    setTimeout(() => {
      if (currentMatchIndex < matches.length - 1) {
        setCurrentMatchIndex(prev => prev + 1);
        setCardPosition({ x: 0, y: 0 });
      } else {
        setStep('complete');
      }
    }, 400);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging && e.movementX !== 0) {
      setCardPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY * 0.5
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(cardPosition.x) > 150) {
      handleSwipe(cardPosition.x > 0 ? 'right' : 'left');
    } else {
      setCardPosition({ x: 0, y: 0 });
    }
  };

  const resetSearch = () => {
    setStep('welcome');
    sessionStorage.clear();
    setSelectedInterests([]);
    setMatches([]);
    setCurrentMatchIndex(0);
    setLikedMatches([]);
    setCardPosition({ x: 0, y: 0 });
  };

  const currentMatch = matches[currentMatchIndex];
  const rotation = cardPosition.x / 20;

  return (
    <div className={`main-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onToggle={toggleSidebar} />

      <div className="content-wrapper">
        <header className="header">
          <div className="header-top">
            <button className="hamburger" onClick={openSidebar}>
              ☰
            </button>
            <h1 className="page-title">DuoFinder</h1>

            <button
              onClick={() => navigate("/")}
              className="p-2 border border-pink-500 text-pink-500 rounded-lg bg-transparent 
             hover:bg-pink-500/10 transition-colors duration-200"
            >
              Back
            </button>
          </div>
        </header>

        <main className="main-content">
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 px-4 lg:px-8 pb-8 pt-4">
              {step === 'welcome' && (
                <div className="max-w-4xl mx-auto min-h-[80vh] flex items-center justify-center">
                  <div className="text-center animate-fadeInUp">
                    <div className="relative inline-block mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                      <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                        <Sparkles className="w-16 h-16 text-white" />
                      </div>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4">
                      Find Your
                      <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        Perfect Duo
                      </span>
                    </h1>

                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                      AI-powered matching to connect you with event companions who share your passions
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all group">
                        <Target className="w-12 h-12 text-purple-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <h3 className="text-white font-bold mb-2">Smart Matching</h3>
                        <p className="text-gray-400 text-sm">AI analyzes interests, events, and connections</p>
                      </div>
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all group">
                        <Zap className="w-12 h-12 text-pink-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <h3 className="text-white font-bold mb-2">Instant Connect</h3>
                        <p className="text-gray-400 text-sm">Message directly, even without being friends</p>
                      </div>
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all group">
                        <Award className="w-12 h-12 text-blue-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <h3 className="text-white font-bold mb-2">Verified Profiles</h3>
                        <p className="text-gray-400 text-sm">Safe and authentic community members</p>
                      </div>
                    </div>

                    <button
                      onClick={startSearch}
                      className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-xl text-white shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                    >
                      <span className="relative z-10">Start Your Journey</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    </button>
                  </div>
                </div>
              )}

              {step === 'select' && (
                <div className="max-w-5xl mx-auto animate-fadeIn">
                  <div className="text-center mb-8">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">What Excites You?</h2>
                    <p className="text-gray-300 text-lg">Select your interests to find like-minded companions</p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-10 border border-white/10 shadow-2xl mb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                      {interests.map((interest) => (
                        <button
                          key={interest.name}
                          onClick={() => toggleInterest(interest.name)}
                          className={`relative overflow-hidden py-4 px-4 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 ${selectedInterests.includes(interest.name)
                            ? `bg-gradient-to-br ${interest.color} text-white shadow-xl scale-105`
                            : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                            }`}
                        >
                          <div className="text-3xl mb-2">{interest.icon}</div>
                          <div className="text-sm">{interest.name}</div>
                          {selectedInterests.includes(interest.name) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-xs">✓</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={findDuo}
                      disabled={selectedInterests.length === 0}
                      className="w-full py-5 rounded-2xl font-bold text-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-2xl disabled:shadow-none relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6" />
                        Find My Perfect Duo
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    </button>
                  </div>
                </div>
              )}

              {step === 'loading' && (
                <div className="max-w-2xl mx-auto min-h-[70vh] flex items-center justify-center">
                  <div className="text-center animate-fadeIn">
                    <div className="relative w-40 h-40 mx-auto mb-8">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-ping opacity-20"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-purple-500/30 border-t-purple-500 animate-spin"></div>
                      <div className="absolute inset-4 rounded-full border-8 border-pink-500/30 border-t-pink-500 animate-spin-reverse"></div>
                      <Sparkles className="absolute inset-0 m-auto w-16 h-16 text-white animate-pulse" />
                    </div>

                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">Searching the Universe...</h3>
                    <p className="text-gray-300 mb-8 text-lg">Our AI is working its magic to find your perfect matches</p>

                    <div className="space-y-4 max-w-md mx-auto">
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce"></div>
                          <span className="text-white">Analyzing {selectedInterests.length} interests...</span>
                        </div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 animate-pulse" style={{ animationDelay: '0.5s' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <span className="text-white">Scanning event histories...</span>
                        </div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 animate-pulse" style={{ animationDelay: '1s' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          <span className="text-white">Finding mutual connections...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 'results' && currentMatch && (
                <div className="max-w-4xl mx-auto animate-fadeIn">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-bold">Match {currentMatchIndex + 1} of {matches.length}</span>
                    </div>
                  </div>
                  

                  <div className="relative" style={{ height: '650px' }}>
                    {matches.slice(currentMatchIndex, currentMatchIndex + 3).map((match, index) => (
                      <div
                        key={match._id}
                        className={`absolute inset-0 transition-all duration-300 ${index === 0 ? 'z-30' : index === 1 ? 'z-20' : 'z-10'}`}
                        style={{
                          transform: `translateY(${index * 20}px) scale(${1 - index * 0.05}) rotate(${index * 2}deg)`,
                          opacity: 1 - index * 0.3
                        }}
                      >
                        {index === 0 && (
                          <div
                            className="bg-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl cursor-grab active:cursor-grabbing"
                            style={{
                              transform: `translateX(${cardPosition.x}px) translateY(${cardPosition.y}px) rotate(${rotation}deg)`,
                              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                          >
                            {Math.abs(cardPosition.x) > 50 && (
                              <>
                                <div className={`absolute top-8 right-8 z-50 px-6 py-3 rounded-2xl font-bold text-2xl border-4 transform rotate-12 ${cardPosition.x > 0 ? 'bg-green-500 border-green-300 text-white' : 'opacity-0'}`}>
                                  LIKE
                                </div>
                                <div className={`absolute top-8 left-8 z-50 px-6 py-3 rounded-2xl font-bold text-2xl border-4 transform -rotate-12 ${cardPosition.x < 0 ? 'bg-red-500 border-red-300 text-white' : 'opacity-0'}`}>
                                  NOPE
                                </div>
                              </>
                            )}

                            <div className="relative h-72 overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
                                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="text-white text-sm font-medium">{match.lastActive}</span>
                              </div>

                              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl px-5 py-3 shadow-2xl border border-white/20">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-6 h-6 text-white" />
                                  <span className="font-bold text-white text-2xl">{(match.matchScore || 0)}%</span>
                                </div>
                              </div>

                              <div className="absolute bottom-4 left-4 flex items-end gap-4">
                                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-2xl overflow-hidden">
                                  <img src={match.avatar} alt={match.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="mb-2">
                                  <h2 className="text-3xl font-bold text-white drop-shadow-2xl">{match.name}, {match.age}</h2>
                                  <div className="flex items-center gap-2 text-white/90">
                                    <MapPin className="w-4 h-4" />
                                    <span className="font-medium">{match.location}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-6">
                              <p className="text-gray-300 text-lg mb-6">{match.bio}</p>

                              <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                                  <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                                  <div className="text-2xl font-bold text-white">{match.mutualFriends}</div>
                                  <div className="text-xs text-gray-400">Mutual Friends</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                                  <Calendar className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                                  <div className="text-2xl font-bold text-white">{match.commonEvents}</div>
                                  <div className="text-xs text-gray-400">Common Events</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                                  <Sparkles className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                  <div className="text-2xl font-bold text-white">{(typeof match.interests === 'string' ? match.interests.split(',').map(s => s.trim()) : match.interests || []).length}</div>
                                  <div className="text-xs text-gray-400">Shared Interests</div>
                                </div>
                              </div>

                              {/* New AI score and reason block */}
                              <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl p-5 mb-6 border border-purple-400/30 animate-fadeIn">
                                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                  <Sparkles className="w-5 h-5 text-purple-400" />
                                  AI Match Reason
                                </h3>
                                <p className="text-gray-300 leading-relaxed">{match.reason}</p>
                              </div>

                              <div className="mb-6">
                                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                  <Star className="w-5 h-5 text-yellow-400" />
                                  Interests
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {(typeof match.interests === 'string' ? match.interests.split(',').map(s => s.trim()) : match.interests || []).map((interest, idx) => {
                                    const interestData = interests.find(i => i.name === interest);
                                    return (
                                      <span key={idx} className={`px-4 py-2 bg-gradient-to-r ${interestData?.color} rounded-xl text-white text-sm font-semibold shadow-lg`}>
                                        {interestData?.icon} {interest}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Buttons - slightly below cards */}
                  <div className="relative z-50 mt-6 flex justify-center items-center gap-6">
                    <button
                      onClick={() => handleSwipe('left')}
                      className="group w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 border-4 border-red-400/50"
                      aria-label="Pass"
                    >
                      <X className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                      onClick={handleLike}
                      className="group w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 border-4 border-green-400/50"
                      aria-label="Like"
                    >
                      <Heart className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                    </button>
                  </div>


                  <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">Drag the card or use buttons to swipe</p>
                  </div>
                </div>
              )}

              {step === 'complete' && (
                <div className="max-w-3xl mx-auto min-h-[70vh] flex items-center justify-center">
                  <div className="text-center animate-fadeInUp">
                    <div className="relative inline-block mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                      <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                        <Award className="w-16 h-16 text-white" />
                      </div>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                      You've Seen All Matches!
                    </h2>

                    <p className="text-xl text-gray-300 mb-8">
                      {likedMatches.length > 0
                        ? `You liked ${likedMatches.length} ${likedMatches.length === 1 ? 'person' : 'people'}! They have received a friend request from you!`
                        : "No matches this time, but don't worry! Try adjusting your interests or check back later."
                      }
                    </p>

                    {likedMatches.length > 0 && (
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/10 max-w-md mx-auto">
                        <h3 className="text-white font-bold mb-4 flex items-center justify-center gap-2">
                          <Heart className="w-5 h-5 text-pink-400" />
                          Your Matches
                        </h3>
                        <div className="flex flex-wrap justify-center gap-3">
                          {likedMatches.map((match) => (
                            <div
                              key={match._id}
                              className="group relative cursor-pointer"
                              onClick={() => navigate(`/profile/${match._id}`)}
                            >
                              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-400 hover:scale-110 transition-transform">
                                <img src={match.avatar} alt={match.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                                <Heart className="w-3 h-3 text-white fill-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={resetSearch}
                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Find More Duos
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <style>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(40px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              .animate-fadeIn {
                animation: fadeIn 0.5s ease-out forwards;
              }

              .animate-fadeInUp {
                animation: fadeInUp 0.6s ease-out forwards;
              }

              @keyframes spin-reverse {
                from {
                  transform: rotate(360deg);
                }
                to {
                  transform: rotate(0deg);
                }
              }

              .animate-spin-reverse {
                animation: spin-reverse 1.5s linear infinite;
              }

              @keyframes blob {
                0% {
                  transform: translate(0px, 0px) scale(1);
                }
                33% {
                  transform: translate(30px, -50px) scale(1.1);
                }
                66% {
                  transform: translate(-20px, 20px) scale(0.9);
                }
                100% {
                  transform: translate(0px, 0px) scale(1);
                }
              }

              .animate-blob {
                animation: blob 7s infinite;
              }

              .animation-delay-2000 {
                animation-delay: 2s;
              }

              .animation-delay-4000 {
                animation-delay: 4s;
              }

              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: linear-gradient(to right, #a855f7, #ec4899);
                cursor: pointer;
                box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
              }

              input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: linear-gradient(to right, #a855f7, #ec4899);
                cursor: pointer;
                border: none;
                box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
              }
            `}</style>
          </div>
        </main>
      </div>
    </div>
  );
}