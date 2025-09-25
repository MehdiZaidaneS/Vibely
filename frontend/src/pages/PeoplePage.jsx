// src/pages/PeoplePage.jsx
// Version 2: My own modern design (tabbed interface for active users/friends; search bar + advanced filters in sidebar; profile previews with hover cards for info; single "Connect" button that opens a modal for add friend/view info).

import React, { useState } from "react";
import Sidebar from "../import/Sidebar";
import "./PeoplePage.css"; // Separate CSS for this version

function PeoplePageAlt() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active"); // Tabs for Active Users / Friends
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ age: "", interest: "" });
  const [selectedUser, setSelectedUser] = useState(null); // For modal preview

  // Mock data
  const activeUsers = [
    { id: 1, name: "Alice Smith", age: 25, interests: ["Sports", "Music"], online: true, avatar: "../assets/images/user1.png", bio: "Loves outdoor activities." },
    { id: 2, name: "Bob Johnson", age: 30, interests: ["Gaming", "Photography"], online: true, avatar: "../assets/images/user2.png", bio: "Gamer and photographer." },
    // Add more...
  ];

  const friends = [
    { id: 3, name: "Charlie Brown", avatar: "../assets/images/friend1.png", bio: "Best friend forever." },
    // Add more...
  ];

  // Filter users
  const filteredUsers = activeUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAge = filters.age ? user.age === parseInt(filters.age) : true;
    const matchesInterest = filters.interest ? user.interests.includes(filters.interest) : true;
    return matchesSearch && matchesAge && matchesInterest;
  });

  // Sidebar toggle
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className={`people-container-alt ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <main className="people-main-alt">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="tabs">
          <button className={activeTab === "active" ? "active" : ""} onClick={() => setActiveTab("active")}>Active Users</button>
          <button className={activeTab === "friends" ? "active" : ""} onClick={() => setActiveTab("friends")}>Friends</button>
        </div>
        <div className="filter-sidebar">
          <h3>Filters</h3>
          <select value={filters.age} onChange={e => setFilters({ ...filters, age: e.target.value })}>
            <option value="">Age</option>
            <option value="20">20-24</option>
            <option value="25">25-29</option>
            {/* More ranges */}
          </select>
          <select value={filters.interest} onChange={e => setFilters({ ...filters, interest: e.target.value })}>
            <option value="">Interest</option>
            <option>Sports</option>
            <option>Gaming</option>
            {/* More */}
          </select>
        </div>
        <div className="content-area">
          {activeTab === "active" ? (
            <div className="user-grid">
              {filteredUsers.map(user => (
                <div key={user.id} className="user-card-alt" onMouseEnter={() => setSelectedUser(user)} onMouseLeave={() => setSelectedUser(null)}>
                  <img src={user.avatar} alt={user.name} />
                  <h3>{user.name}</h3>
                  <button onClick={() => console.log(`Connect with ${user.name}`)}>Connect</button>
                  {selectedUser?.id === user.id && (
                    <div className="hover-preview">
                      <p>Age: {user.age}</p>
                      <p>Interests: {user.interests.join(", ")}</p>
                      <p>{user.bio}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="friends-list-alt">
              {friends.map(friend => (
                <div key={friend.id} className="friend-item-alt">
                  <img src={friend.avatar} alt={friend.name} />
                  <h3>{friend.name}</h3>
                  <p>{friend.bio}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PeoplePageAlt;