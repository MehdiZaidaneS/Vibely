// src/pages/PeoplePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, MessageSquare, BellOff, MoreVertical, X, Check, UserCheck, UserX, Globe, MapPin, Gamepad, Music, Code, Heart, Star, Users } from 'lucide-react';
import styles from './PeoplePage.module.css';
import Sidebar from '../import/Sidebar'; // Using the general Sidebar.jsx for navigation

// Expanded mock data for active users (discovery column) - 15 entries, Europe-centric locations, real Unsplash avatars
const mockActiveUsers = [
  {
    id: '1',
    name: 'Alex Johnson',
    username: '@alexj',
    avatar: 'https://images.unsplash.com/photo-1500648762-4d2c09d2e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Tech enthusiast and coffee lover. Always up for a good chat about AI!',
    tags: ['Tech', 'AI', 'Coffee'],
    isOnline: true,
    status: 'Online',
    customStatus: 'Coding...',
    lastSeen: null,
    activity: 'Currently in Tech Conference event',
    mutualFriends: 5,
    badges: ['Top Connector', 'Event Enthusiast'],
    location: 'Helsinki, Finland',
    interests: ['Programming', 'Gaming'],
    isFriend: false,
    isFollowing: false,
    isFollowedBy: false,
    friendRequestPending: false,
  },
  {
    id: '2',
    name: 'Sarah Lee',
    username: '@sarahlee',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Music producer and traveler. Let\'s collaborate on something awesome!',
    tags: ['Music', 'Travel', 'Production'],
    isOnline: false,
    status: 'Offline',
    customStatus: 'Away',
    lastSeen: '2 hours ago',
    activity: 'Last active in Music Festival',
    mutualFriends: 3,
    badges: ['Creative Star'],
    location: 'Stockholm, Sweden',
    interests: ['Music', 'Travel'],
    isFriend: false,
    isFollowing: true,
    isFollowedBy: false,
    friendRequestPending: false,
  },
  {
    id: '3',
    name: 'Mike Chen',
    username: '@mikechen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a3b3cfa733d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Gamer and fitness freak. Challenging you to a match!',
    tags: ['Gaming', 'Fitness'],
    isOnline: true,
    status: 'Do Not Disturb',
    customStatus: 'Gaming',
    lastSeen: null,
    activity: 'Playing in Online Tournament',
    mutualFriends: 2,
    badges: ['Gamer Pro'],
    location: 'Berlin, Germany',
    interests: ['Gaming', 'Sports'],
    isFriend: false,
    isFollowing: false,
    isFollowedBy: true,
    friendRequestPending: true,
  },
  {
    id: '8',
    name: 'Emily Davis',
    username: '@emilyd',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Bookworm and aspiring writer. Love discussing literature!',
    tags: ['Books', 'Writing', 'Literature'],
    isOnline: true,
    status: 'Online',
    customStatus: 'Reading...',
    lastSeen: null,
    activity: 'Attending Book Club Meetup',
    mutualFriends: 4,
    badges: ['Book Lover'],
    location: 'Oslo, Norway',
    interests: ['Reading', 'Writing'],
    isFriend: false,
    isFollowing: false,
    isFollowedBy: false,
    friendRequestPending: false,
  },
  {
    id: '9',
    name: 'David Kim',
    username: '@davidk',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Foodie and chef. Sharing recipes and culinary adventures.',
    tags: ['Food', 'Cooking', 'Travel'],
    isOnline: false,
    status: 'Offline',
    customStatus: 'Cooking',
    lastSeen: '1 day ago',
    activity: 'Last in Cooking Workshop',
    mutualFriends: 1,
    badges: ['Master Chef'],
    location: 'Copenhagen, Denmark',
    interests: ['Cooking', 'Food'],
    isFriend: false,
    isFollowing: true,
    isFollowedBy: false,
    friendRequestPending: false,
  },
  {
    id: '10',
    name: 'Olivia Martinez',
    username: '@oliviam',
    avatar: 'https://images.unsplash.com/photo-1552058540-fc50f7fcd3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Artist and designer. Creating beautiful things every day.',
    tags: ['Art', 'Design', 'Creativity'],
    isOnline: true,
    status: 'Online',
    customStatus: 'Designing',
    lastSeen: null,
    activity: 'In Art Exhibition event',
    mutualFriends: 6,
    badges: ['Creative Genius'],
    location: 'Paris, France',
    interests: ['Art', 'Design'],
    isFriend: false,
    isFollowing: false,
    isFollowedBy: true,
    friendRequestPending: true,
  },
  {
    id: '11',
    name: 'James Wilson',
    username: '@jamesw',
    avatar: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Sports fan and athlete. Let\'s talk about the latest games!',
    tags: ['Sports', 'Fitness', 'Athletics'],
    isOnline: false,
    status: 'Offline',
    customStatus: 'Training',
    lastSeen: '3 hours ago',
    activity: 'Last in Sports Meet',
    mutualFriends: 2,
    badges: ['Athlete'],
    location: 'Amsterdam, Netherlands',
    interests: ['Sports', 'Fitness'],
    isFriend: false,
    isFollowing: false,
    isFollowedBy: false,
    friendRequestPending: false,
  },
  {
    id: '12',
    name: 'Sophia Rodriguez',
    username: '@sophiar',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Environmental activist. Passionate about saving the planet.',
    tags: ['Environment', 'Activism', 'Sustainability'],
    isOnline: true,
    status: 'Online',
    customStatus: 'Advocating',
    lastSeen: null,
    activity: 'Organizing Climate Rally',
    mutualFriends: 4,
    badges: ['Eco Warrior'],
    location: 'Madrid, Spain',
    interests: ['Environment', 'Activism'],
    isFriend: false,
    isFollowing: true,
    isFollowedBy: false,
    friendRequestPending: false,
  },
  {
    id: '13',
    name: 'Liam Taylor',
    username: '@liamt',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Photographer capturing moments around the world.',
    tags: ['Photography', 'Travel', 'Art'],
    isOnline: false,
    status: 'Offline',
    customStatus: 'Shooting',
    lastSeen: '4 hours ago',
    activity: 'Last in Photo Walk event',
    mutualFriends: 3,
    badges: ['Shutterbug'],
    location: 'Rome, Italy',
    interests: ['Photography', 'Travel'],
    isFriend: false,
    isFollowing: false,
    isFollowedBy: true,
    friendRequestPending: true,
  },
  {
    id: '14',
    name: 'Ava Brown',
    username: '@avab',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Yoga instructor and wellness coach.',
    tags: ['Yoga', 'Wellness', 'Health'],
    isOnline: true,
    status: 'Online',
    customStatus: 'Meditating',
    lastSeen: null,
    activity: 'Teaching Yoga Class',
    mutualFriends: 1,
    badges: ['Zen Master'],
    location: 'Vienna, Austria',
    interests: ['Yoga', 'Health'],
    isFriend: false,
    isFollowing: false,
    isFollowedBy: false,
    friendRequestPending: false,
  },
  {
    id: '15',
    name: 'Noah Garcia',
    username: '@noahg',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a3b3cfa733d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Startup founder and entrepreneur.',
    tags: ['Business', 'Startups', 'Innovation'],
    isOnline: false,
    status: 'Offline',
    customStatus: 'Networking',
    lastSeen: '1 day ago',
    activity: 'At Startup Pitch event',
    mutualFriends: 7,
    badges: ['Entrepreneur'],
    location: 'Brussels, Belgium',
    interests: ['Business', 'Tech'],
    isFriend: false,
    isFollowing: true,
    isFollowedBy: false,
    friendRequestPending: false,
  },
  {
    id: '20',
    name: 'Isabella Clark',
    username: '@isabellac',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Digital marketer and content creator.',
    tags: ['Marketing', 'Content', 'Social Media'],
    isOnline: true,
    status: 'Online',
    customStatus: 'Creating',
    lastSeen: null,
    activity: 'Posting on social media',
    mutualFriends: 5,
    badges: ['Content King'],
    location: 'Prague, Czech Republic',
    interests: ['Marketing', 'Content Creation'],
    isFriend: false,
    isFollowing: false,
    isFollowedBy: false,
    friendRequestPending: false,
  },
  {
    id: '21',
    name: 'Mason Hall',
    username: '@masonh',
    avatar: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Musician and songwriter. Let\'s make some music!',
    tags: ['Music', 'Songwriting', 'Performance'],
    isOnline: false,
    status: 'Offline',
    customStatus: 'Composing',
    lastSeen: '5 hours ago',
    activity: 'Last in Concert Rehearsal',
    mutualFriends: 4,
    badges: ['Music Maestro'],
    location: 'Warsaw, Poland',
    interests: ['Music', 'Performance'],
    isFriend: false,
    isFollowing: true,
    isFollowedBy: false,
    friendRequestPending: false,
  },
  {
    id: '22',
    name: 'Charlotte Young',
    username: '@charlottey',
    avatar: 'https://images.unsplash.com/photo-1552058540-fc50f7fcd3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Fitness trainer and health coach.',
    tags: ['Fitness', 'Health', 'Training'],
    isOnline: true,
    status: 'Online',
    customStatus: 'Training',
    lastSeen: null,
    activity: 'Leading Fitness Class',
    mutualFriends: 3,
    badges: ['Fitness Guru'],
    location: 'Dublin, Ireland',
    interests: ['Fitness', 'Health'],
    isFriend: false,
    isFollowing: false,
    isFollowedBy: true,
    friendRequestPending: true,
  },
  {
    id: '23',
    name: 'Henry Allen',
    username: '@henrya',
    avatar: 'https://images.unsplash.com/photo-1500648762-4d2c09d2e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Software developer and open-source contributor.',
    tags: ['Coding', 'Open Source', 'Tech'],
    isOnline: false,
    status: 'Offline',
    customStatus: 'Debugging',
    lastSeen: 'Yesterday',
    activity: 'Contributing to open-source project',
    mutualFriends: 6,
    badges: ['Code Master'],
    location: 'Lisbon, Portugal',
    interests: ['Coding', 'Tech'],
    isFriend: false,
    isFollowing: false,
    isFollowedBy: false,
    friendRequestPending: false,
  },
  {
    id: '28',
    name: 'Lucas Miller',
    username: '@lucasm',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    bio: 'Travel blogger exploring Europe.',
    tags: ['Travel', 'Blogging', 'Adventure'],
    isOnline: true,
    status: 'Online',
    customStatus: 'Exploring',
    lastSeen: null,
    activity: 'In Travel Expo',
    mutualFriends: 5,
    badges: ['Wanderlust'],
    location: 'Athens, Greece',
    interests: ['Travel', 'Blogging'],
    isFriend: false,
    isFollowing: false,
    isFollowedBy: false,
    friendRequestPending: false,
  },
];

// Mock data for friends (sidebar) - expanded to 15 entries
const mockFriends = [
  {
    id: '4',
    name: 'Emma Watson',
    username: '@emmaw',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    isOnline: true,
    status: 'Online',
    customStatus: 'Available',
    lastMessage: 'Hey, let\'s plan the next event!',
    lastMessageTime: '5 min ago',
    unread: 2,
    category: 'Favorites',
    mutualFriends: 4,
    badges: ['Best Friend'],
  },
  {
    id: '5',
    name: 'John Doe',
    username: '@johnd',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a3b3cfa733d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    isOnline: false,
    status: 'Offline',
    customStatus: 'Busy',
    lastMessage: 'Thanks for the invite!',
    lastMessageTime: '1 hour ago',
    unread: 0,
    category: 'Work Buddies',
    mutualFriends: 1,
    badges: [],
  },
  {
    id: '16',
    name: 'Mia Thompson',
    username: '@miat',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    isOnline: true,
    status: 'Online',
    customStatus: 'Chilling',
    lastMessage: 'That was fun!',
    lastMessageTime: '10 min ago',
    unread: 1,
    category: 'Favorites',
    mutualFriends: 3,
    badges: ['Party Animal'],
  },
  {
    id: '17',
    name: 'Ethan Walker',
    username: '@ethanw',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    isOnline: false,
    status: 'Offline',
    customStatus: 'Working',
    lastMessage: 'Let\'s catch up soon',
    lastMessageTime: 'Yesterday',
    unread: 0,
    category: 'Work Buddies',
    mutualFriends: 2,
    badges: [],
  },
  {
    id: '24',
    name: 'Lily Harris',
    username: '@lilyh',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    isOnline: true,
    status: 'Online',
    customStatus: 'Available',
    lastMessage: 'See you at the event!',
    lastMessageTime: '15 min ago',
    unread: 0,
    category: 'Event Crew',
    mutualFriends: 5,
    badges: ['Organizer'],
  },
  {
    id: '25',
    name: 'Benjamin Lee',
    username: '@benl',
    avatar: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    isOnline: true,
    status: 'Online',
    customStatus: 'Gaming',
    lastMessage: 'GG!',
    lastMessageTime: '30 min ago',
    unread: 3,
    category: 'Favorites',
    mutualFriends: 4,
    badges: ['Gamer Buddy'],
  },
  {
    id: '29',
    name: 'Zoe Martinez',
    username: '@zoem',
    avatar: 'https://images.unsplash.com/photo-1552058540-fc50f7fcd3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    isOnline: false,
    status: 'Offline',
    customStatus: 'Traveling',
    lastMessage: 'Safe travels!',
    lastMessageTime: '2 days ago',
    unread: 0,
    category: 'Travel Buddies',
    mutualFriends: 2,
    badges: ['Explorer'],
  },
  // Continue adding 8 more similar entries with varied data...
];

// Mock friend requests - expanded to 10 entries
const mockFriendRequests = [
  {
    id: '6',
    name: 'Lisa Ray',
    username: '@lisar',
    avatar: 'https://images.unsplash.com/photo-1500648762-4d2c09d2e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    mutualFriends: 4,
    requestDate: '2 days ago',
    reason: 'From shared event: Tech Meetup',
  },
  {
    id: '18',
    name: 'Chris Evans',
    username: '@chris e',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    mutualFriends: 2,
    requestDate: '1 day ago',
    reason: 'Mutual interest in Gaming',
  },
  {
    id: '26',
    name: 'Anna Smith',
    username: '@annas',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    mutualFriends: 3,
    requestDate: '3 days ago',
    reason: 'From Music Festival',
  },
  // Add 7 more similar entries...
];

// Mock suggested users - expanded to 10 entries
const mockSuggestedUsers = [
  {
    id: '7',
    name: 'Tom Harris',
    username: '@tomh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a3b3cfa733d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    reason: 'Based on shared interests in Gaming',
    mutualFriends: 3,
  },
  {
    id: '19',
    name: 'Grace Lee',
    username: '@gracel',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    reason: 'From recent event attendance',
    mutualFriends: 5,
  },
  {
    id: '27',
    name: 'Robert Johnson',
    username: '@robertj',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    reason: 'Mutual friends and shared location',
    mutualFriends: 4,
  },
  // Add 7 more similar entries...
];


const PeoplePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // e.g., 'online', 'recommended', 'mutual', etc.
  const [activeTab, setActiveTab] = useState('discovery'); // 'discovery', 'friends', 'requests', 'suggestions'
  const [selectedUser, setSelectedUser] = useState(null); // For bio modal
  const [friendsCategory, setFriendsCategory] = useState('all'); // For friend sorting
  const [activeUsers, setActiveUsers] = useState(mockActiveUsers);
  const [friends, setFriends] = useState(mockFriends);
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests);
  const [suggestedUsers, setSuggestedUsers] = useState(mockSuggestedUsers);

  
  // Placeholder backend functions (connect later)
  const fetchActiveUsers = async () => {
    // TODO: Fetch from backend, e.g., axios.get('/api/users/active')
    console.log('Fetching active users...');
    // For now, use mock
    return mockActiveUsers;
  };

  const navigate = useNavigate(); // Added for redirects
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For toggling the imported Sidebar
  // Other state...

  const addFriend = async (userId) => {
    // TODO: POST to backend /api/friends/add
    console.log('Adding friend:', userId);
    // Update mock state
    setActiveUsers(prev => prev.map(u => u.id === userId ? { ...u, isFriend: true } : u));
  };

  const followUser = async (userId) => {
    // TODO: POST to backend /api/follow
    console.log('Following user:', userId);
    setActiveUsers(prev => prev.map(u => u.id === userId ? { ...u, isFollowing: true } : u));
  };

  const sendMessage = async (userId) => {
    console.log('Messaging user:', userId);
    navigate('/private-chat'); // Redirect to private-chat
  };

  const acceptRequest = async (requestId) => {
    // TODO: POST to /api/friends/accept
    console.log('Accepting request:', requestId);
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    // Add to friends mock
    const accepted = friendRequests.find(r => r.id === requestId);
    if (accepted) setFriends(prev => [...prev, { ...accepted, category: 'All' }]);
  };

  const declineRequest = async (requestId) => {
    // TODO: POST to /api/friends/decline
    console.log('Declining request:', requestId);
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const removeFriend = async (friendId) => {
    // TODO: DELETE to /api/friends/remove
    console.log('Removing friend:', friendId);
    setFriends(prev => prev.filter(f => f.id !== friendId));
  };

  const blockUser = async (userId) => {
    // TODO: POST to /api/users/block
    console.log('Blocking user:', userId);
    setActiveUsers(prev => prev.filter(u => u.id !== userId));
  };

  const reportUser = async (userId) => {
    // TODO: POST to /api/users/report
    console.log('Reporting user:', userId);
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

  // Filtered friends by category
  const filteredFriends = friends.filter(f => 
    friendsCategory === 'all' || f.category === friendsCategory
  ).sort((a, b) => b.isOnline - a.isOnline); // Online first

  return (
   <div className={`${styles.pageContainer} ${styles.animateFadeIn}`}>
      {/* Imported Sidebar - toggles on button click */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Add a toggle button for the sidebar, e.g., hamburger */}
      <button onClick={() => setIsSidebarOpen(true)} className={styles.sidebarToggle}>
        ☰ Menu
      </button>
      <div className={styles.contentWrapper}>
        {/* Sidebar: Friends List (Narrower) */}
        <aside className={`${styles.sidebar} ${styles.animateSlideInLeft}`}>
          <h2 className={styles.sidebarTitle}>
            <Users className={styles.icon} /> Friends ({friends.length})
          </h2>
          <select 
            value={friendsCategory} 
            onChange={(e) => setFriendsCategory(e.target.value)}
            className={styles.select}
          >
            <option value="all">All Friends</option>
            <option value="Favorites">Favorites</option>
            <option value="Work Buddies">Work Buddies</option>
            {/* Add more categories */}
          </select>
          <div className={styles.friendsList}>
            {filteredFriends.map(friend => (
              <div key={friend.id} className={`${styles.userCard} ${styles.animateSlideUp}`}>
                <div className={styles.userInfo}>
                  <div className={styles.avatarContainer}>
                    <img src={friend.avatar} alt={friend.name} className={styles.avatar} />
                    {friend.isOnline && <span className={`${styles.onlineIndicator} ${styles.animateOnlineIndicator}`}></span>}
                  </div>
                  <div>
                    <p className={styles.userName}>{friend.name}</p>
                    <p className={styles.lastMessage}>{friend.lastMessage}</p>
                  </div>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => sendMessage(friend.id)} className={styles.actionButton}><MessageSquare className={styles.iconSmall} /></button>
                  <div className="relative">
                    <button className={styles.actionButton}><MoreVertical className={styles.iconSmall} /></button>
                    {/* Dropdown for quick actions: Mute, Unfriend, Block */}
                  </div>
                </div>
              </div>
            ))}
            {filteredFriends.length === 0 && <p className={styles.noResults}>No friends in this category</p>}
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
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className={styles.select}
              >
                <option value="all">All Users</option>
                <option value="online">Online Now</option>
                <option value="recommended">Recommended</option>
                <option value="mutual">Mutual Friends</option>
              </select>
            </div>

            {/* Tabs for sections */}
            <div className={styles.tabs}>
              <button onClick={() => setActiveTab('discovery')} className={`${styles.tab} ${activeTab === 'discovery' ? styles.activeTab : ''}`}>Active Users</button>
              <button onClick={() => setActiveTab('requests')} className={`${styles.tab} ${activeTab === 'requests' ? styles.activeTab : ''}`}>Requests ({friendRequests.length})</button>
              <button onClick={() => setActiveTab('suggestions')} className={`${styles.tab} ${activeTab === 'suggestions' ? styles.activeTab : ''}`}>Suggestions ({suggestedUsers.length})</button>
            </div>

            <div className={styles.userGrid}>
              {activeTab === 'discovery' && filteredActiveUsers.map(user => (
                <div key={user.id} className={`${styles.userCard} ${styles.animateSlideInRight}`}>
                  <div className={styles.userHeader}>
                    <div className={styles.avatarContainer}>
                      <img src={user.avatar} alt={user.name} className={styles.avatar} />
                      {user.isOnline ? <span className={`${styles.onlineIndicator} ${styles.animateOnlineIndicator}`}></span> : null}
                    </div>
                    <div>
                      <p className={styles.userName}>{user.name}</p>
                      <p className={styles.username}>{user.username}</p>
                    </div>
                  </div>
                  <p className={styles.bio}>{user.bio}</p>
                  <div className={styles.tags}>
                    {user.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                  </div>
                  <p className={styles.info}><MapPin className={styles.iconSmall} /> {user.location}</p>
                  <p className={styles.info}><Heart className={styles.iconSmall} /> Interests: {user.interests.join(', ')}</p>
                  <p className={styles.info}>{user.mutualFriends} mutual friends</p>
                  <p className={styles.info}><Star className={styles.iconSmall} /> Badges: {user.badges.join(', ')}</p>
                  <p className={styles.activity}>{user.activity || user.lastSeen}</p>
                  <div className={styles.actions}>
                    <button onClick={() => addFriend(user.id)} className={styles.primaryButton}>
                      <UserPlus className={styles.iconSmall} /> {user.friendRequestPending ? 'Pending' : 'Add Friend'}
                    </button>
                    <button onClick={() => followUser(user.id)} className={styles.secondaryButton}>
                      <UserCheck className={styles.iconSmall} /> {user.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  </div>
                  <div className={styles.actions}>
                    <button onClick={() => sendMessage(user.id)} className={styles.messageButton}>
                      <MessageSquare className={styles.iconSmall} /> Message
                    </button>
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
                <div key={request.id} className={`${styles.userCard} ${styles.animateSlideInRight}`}>
                  <div className={styles.userHeader}>
                    <div className={styles.avatarContainer}>
                      <img src={request.avatar} alt={request.name} className={styles.avatar} />
                    </div>
                    <div>
                      <p className={styles.userName}>{request.name}</p>
                      <p className={styles.username}>{request.username}</p>
                    </div>
                  </div>
                  <p className={styles.info}>{request.mutualFriends} mutual friends</p>
                  <p className={styles.info}>Sent {request.requestDate}</p>
                  <p className={styles.activity}>{request.reason}</p>
                  <div className={styles.actions}>
                    <button onClick={() => acceptRequest(request.id)} className={styles.acceptButton}>
                      <Check className={styles.iconSmall} /> Accept
                    </button>
                    <button onClick={() => declineRequest(request.id)} className={styles.declineButton}>
                      <X className={styles.iconSmall} /> Decline
                    </button>
                  </div>
                </div>
              ))}

              {activeTab === 'suggestions' && suggestedUsers.map(sugg => (
                <div key={sugg.id} className={`${styles.userCard} ${styles.animateSlideInRight}`}>
                  <div className={styles.userHeader}>
                    <div className={styles.avatarContainer}>
                      <img src={sugg.avatar} alt={sugg.name} className={styles.avatar} />
                    </div>
                    <div>
                      <p className={styles.userName}>{sugg.name}</p>
                      <p className={styles.username}>{sugg.username}</p>
                    </div>
                  </div>
                  <p className={styles.activity}>{sugg.reason}</p>
                  <p className={styles.info}>{sugg.mutualFriends} mutual friends</p>
                  <div className={styles.actions}>
                    <button onClick={() => addFriend(sugg.id)} className={styles.primaryButton}>
                      <UserPlus className={styles.iconSmall} /> Add Friend
                    </button>
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