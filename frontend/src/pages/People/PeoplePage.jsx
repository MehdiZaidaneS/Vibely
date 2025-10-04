
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { Search, UserPlus, MessageSquare, BellOff, MoreVertical, X, Check, UserCheck, UserX, Globe, MapPin, Gamepad, Music, Code, Heart, Star, Users } from 'lucide-react';
import styles from './PeoplePage.module.css';
import Sidebar from '../../import/Sidebar'; // Using the general Sidebar.jsx for navigation
import { getAllUsers, getFriends, declineFriendRequest, getFriendRequests, sendFriendRequest, acceptFriendResquest, getSuggestedUsers, getPrivateChatRoom, markAsRead } from '../../api/userApi';


const PeoplePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('discovery');
  const [selectedUser, setSelectedUser] = useState(null);
  const [friendsCategory, setFriendsCategory] = useState('all');
  const [activeUsers, setActiveUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const fetchUsers = async () => {
    const users = await getAllUsers();
    setActiveUsers(users);
  };

 const fetchSuggestedUsers = async () => {

  const suggested = await getSuggestedUsers(); // array of { _id, matchScore, reason }

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
    }));

  setSuggestedUsers(suggestedUserList);
  setActiveTab("suggestions");
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
      return; // stop here
    }
    navigate(`/private-chat/${room}`);
     markAsRead(room)

  };

  const acceptRequest = async (requestId) => {
    acceptFriendResquest(requestId)

    setFriendRequests(prev => prev.filter(r => r._id !== requestId));
    setActiveUsers(prev => prev.filter(r => r._id !== requestId))
    setSuggestedUsers(prev => prev.filter(r => r._id !== requestId))
  };

  const declineRequest = async (requestId) => {
    declineFriendRequest(requestId)
    setFriendRequests(prev => prev.filter(r => r._id !== requestId));
    setActiveUsers(prev => prev.filter(r => r._id !== requestId))
    setSuggestedUsers(prev => prev.filter(r => r._id !== requestId))
  };


  const inviteToEvent = async (userId, eventId) => {
    console.log('Inviting user to event:', userId, eventId);
    navigate('/events'); // Redirect to events page
  };

  // Filter active users based on search and filter
  const filteredActiveUsers = activeUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filter === 'all' ||
      (filter === 'online' && user.isOnline) ||
      (filter === 'recommended' && user.mutualFriends > 2) || // Example logic
      (filter === 'mutual' && user.mutualFriends > 0))
  );



  return (
    <div className={`${styles.pageContainer} ${styles.animateFadeIn}`}>
      {/* Imported Sidebar - toggles on button click */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />


      <div className={styles.contentWrapper}>

        <aside className={`${styles.sidebar} ${styles.animateSlideInLeft}`}>
          <h2 className={styles.sidebarTitle}>
            <Users className={styles.icon} /> Friends ({friends.length})
          </h2>

          <div className={styles.friendsList}>
            {friends.map(friend => (
              <div key={friend._id} className={`${styles.userCard} ${styles.animateSlideUp}`}>
                <div className={styles.userInfo}>
                  <div className={styles.avatarContainer}>
                    <img src={friend.profile_pic} alt={friend.name} className={styles.avatar} />
                  </div>
                  <div>
                    <p className={styles.userName}>{friend.name}</p>
                    <p className={styles.userName}>{friend.username}</p>
                    <p className={styles.lastMessage}>{friend.lastMessage}</p>
                  </div>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => sendMessage(friend._id)} className={styles.actionButton}><MessageSquare className={styles.iconSmall} /></button>
                  <div className="relative">
                    <button className={styles.actionButton}><MoreVertical className={styles.iconSmall} /></button>
                  </div>
                </div>
              </div>
            ))}
            {friends.length === 0 && <p className={styles.noResults}>No friends in this category</p>}
          </div>
        </aside>

        {/* Main Column: Discovery / Active Users */}
        <main className={styles.mainContent}>
          <div className={`${styles.discoveryCard} ${styles.animateBounceIn}`}>
            <h1 className={styles.pageTitle}>
              <Globe className={styles.icon} /> Discover People
            </h1>
            <div className={styles.searchContainer}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by name, username, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

            </div>

            {/* Tabs for sections */}
            <div className={styles.tabs}>
              <button onClick={() => setActiveTab('discovery')} className={`${styles.tab} ${activeTab === 'discovery' ? styles.activeTab : ''}`}>Find Users</button>
              <button onClick={() => setActiveTab('requests')} className={`${styles.tab} ${activeTab === 'requests' ? styles.activeTab : ''}`}>Requests ({friendRequests.length})</button>
              <button onClick={() => fetchSuggestedUsers()} className={`${styles.tab} ${activeTab === 'suggestions' ? styles.activeTab : ''}`}>Suggestions ({suggestedUsers.length})</button>
            </div>

            <div className={styles.userGrid}>
              {activeTab === 'discovery' && filteredActiveUsers.map(user => (
                <div key={user._id} className={`${styles.userCard} ${styles.animateSlideInRight}`}>
                  <div className={styles.userHeader}>
                    <div className={styles.avatarContainer}>
                      <img src={user.profile_pic} alt={user.name} className={styles.avatar} />
                      {user.isOnline ? <span className={`${styles.onlineIndicator} ${styles.animateOnlineIndicator}`}></span> : null}
                    </div>
                    <div>
                      <p className={styles.userName}>{user.name}</p>
                      <p className={styles.username}>{user.username}</p>
                    </div>
                  </div>
                  <p className={styles.bio}>{user.bio}</p>
                  <div className={styles.tags}>
                    {user.tags?.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                  </div>
                  <p className={styles.info}><MapPin className={styles.iconSmall} /> Joined: {format(new Date(user.createdAt), "PPP")}</p>
                  <p className={styles.info}><Heart className={styles.iconSmall} /> Interests: {user.interests?.join(', ')}</p>
                  {user.mutualFriends !== 0 && <p className={styles.info}>{user.mutualFriends} mutual friends</p>}

                  <div className={styles.actions}>
                    {user.friendRequestReceived ? (
                      // Received a friend request from this user → show Accept / Decline
                      <div className={styles.buttonGroup}>
                        <button
                          onClick={() => acceptRequest(user._id)}
                          className={styles.primaryButton}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => declineRequest(user._id)}
                          className={styles.secondaryButton}
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      // No request received, check if current user sent one
                      <button
                        onClick={
                          user.friendRequestPending === "Add Friend"
                            ? () => addFriend(user._id, setActiveUsers)
                            : () => console.log("Friend request pending")
                        }
                        className={styles.primaryButton}
                        disabled={user.friendRequestPending === "Pending"} // disable if pending
                      >
                        <UserPlus className={styles.iconSmall} /> {user.friendRequestPending}
                      </button>
                    )}
                  </div>

                  <div className={styles.actions}>

                    <button onClick={() => inviteToEvent(user.id, 'event123')} className={styles.inviteButton}>
                      <Users className={styles.iconSmall} /> Invite to Event
                    </button>
                  </div>
                  <div className={styles.moreMenu}>
                    <button className={styles.actionButton}><MoreVertical className={styles.iconSmall} /></button>
                  </div>
                </div>
              ))}

              {activeTab === 'requests' && friendRequests.map(request => (
                <div key={request._id} className={`${styles.userCard} ${styles.animateSlideInRight}`}>
                  <div className={styles.userHeader}>
                    <div className={styles.avatarContainer}>
                      <img src={request.profile_pic} alt={request.name} className={styles.avatar} />
                    </div>
                    <div>
                      <p className={styles.userName}>{request.name}</p>
                      <p className={styles.username}>{request.username}</p>
                    </div>
                  </div>
                  <p className={styles.info}>{request.mutualFriends} mutual friends</p>
                  <p className={styles.info}>Sent {format(new Date(request.sentAt), "PPP p")}</p>

                  <div className={styles.actions}>
                    <button onClick={() => acceptRequest(request._id)} className={styles.acceptButton}>
                      <Check className={styles.iconSmall} /> Accept
                    </button>
                    <button onClick={() => declineRequest(request._id)} className={styles.declineButton}>
                      <X className={styles.iconSmall} /> Decline
                    </button>
                  </div>
                </div>
              ))}

              {activeTab === 'suggestions' && suggestedUsers.map(sugg => (
                <div key={sugg._id} className={`${styles.userCard} ${styles.animateSlideInRight}`}>
                  <div className={styles.userHeader}>
                    <div className={styles.avatarContainer}>
                      <img src={sugg.profile_pic} alt={sugg.name} className={styles.avatar} />
                    </div>
                    <div>
                      <p className={styles.userName}>{sugg.name}</p>
                      <p className={styles.username}>{sugg.username}</p>
                    </div>
                  </div>
                  <p className={styles.activity}>{sugg.reason}</p>
                  <p className={styles.info}><MapPin className={styles.iconSmall} /> Joined: {format(new Date(sugg.createdAt), "PPP")}</p>
                  <p className={styles.info}>{sugg.matchScore}/100 match</p>
                  <div className={styles.actions}>
                    {sugg.friendRequestReceived ? (
                      // Received a friend request from this user → show Accept / Decline
                      <div className={styles.buttonGroup}>
                        <button
                          onClick={() => acceptRequest(sugg._id)}
                          className={styles.primaryButton}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => declineRequest(sugg._id)}
                          className={styles.secondaryButton}
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      // No request received, check if current user sent one
                      <button
                        onClick={
                          sugg.friendRequestPending === "Add Friend"
                            ? () => addFriend(sugg._id, setSuggestedUsers)
                            : () => console.log("Friend request pending")
                        }
                        className={styles.primaryButton}
                        disabled={sugg.friendRequestPending === "Pending"} // disable if pending
                      >
                        <UserPlus className={styles.iconSmall} /> {sugg.friendRequestPending}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Bio Modal (View Info) */}
      {selectedUser && (
        <div className={`${styles.modalOverlay} ${styles.animateFadeIn}`}>
          <div className={`${styles.modal} ${styles.animateBounceIn}`}>
            <button onClick={() => setSelectedUser(null)} className={styles.closeButton}><X className={styles.icon} /></button>
            <h2 className={styles.modalTitle}>{selectedUser.name}</h2>
            <p className={styles.bio}>{selectedUser.bio}</p>
            <p className={styles.info}><MapPin className={styles.iconSmall} /> {selectedUser.location}</p>
            <p className={styles.info}><Heart className={styles.iconSmall} /> Interests: {selectedUser.interests.join(', ')}</p>
            <p className={styles.info}>{selectedUser.mutualFriends} mutual friends</p>
            <p className={styles.info}><Star className={styles.iconSmall} /> Badges: {selectedUser.badges.join(', ')}</p>
            <div className={styles.tags}>
              {selectedUser.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
            </div>
            <p className={styles.activity}>{selectedUser.activity || selectedUser.lastSeen}</p>
          </div>
        </div>
      )}
    </div>
  );
};


export default PeoplePage;