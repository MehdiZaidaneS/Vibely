
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const getAllUsers = async () => {
  const token = localStorage.getItem("user");
  try {
    const response = await fetch(`${API_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting users:", error.message);
    throw error;
  }
};

export const createUser = async (body) => {
  try {
    const response = await fetch(`${API_URL}/api/users`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    const newUser = await response.json();
    localStorage.setItem("user", newUser.token);
    localStorage.setItem("userId", newUser.user._id);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

export const getUserbyId = async () => {
  const userId = localStorage.getItem("userId");
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting user:", error.message);
    throw error;
  }
};

export const logUser = async (body) => {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    const user = await response.json();
    localStorage.setItem("user", user.token);
    localStorage.setItem("userId", user.user._id);
    return user;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

export const addInfo = async (body) => {
  const token = localStorage.getItem("user");
  const userId = localStorage.getItem("userId");
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json(); // updated user data from backend
    return data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

export const declineFriendRequest = async (friend_request_id) => {
  const token = localStorage.getItem("user");
  try {
    const response = await fetch(`${API_URL}/api/users/delete/${friend_request_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error declining friend request:", error);
    throw error;
  }
};

export const acceptFriendResquest = async (friend_request_id) => {
  const token = localStorage.getItem("user");
  try {
    const response = await fetch(`${API_URL}/api/users/accept/${friend_request_id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error accept friend request:", error);
    throw error;
  }
};

export const getFriendRequests = async () => {
  const token = localStorage.getItem("user");
  try {
    const response = await fetch(`${API_URL}/api/users/friend-requests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error geetting requests:", error);
    throw error;
  }
};

export const checkUserName = async (username) => {
  const token = localStorage.getItem("user");
  try {
    const response = await fetch(`${API_URL}/api/users/check-username/${username}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return data.status;
  } catch (error) {
    console.error("Error checking usermae:", error);
    throw error;
  }
};

export const sendFriendRequest = async (userId) => {
  const token = localStorage.getItem("user");
  try {
    const response = await fetch(`${API_URL}/api/users/add/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending friend request", error);
    throw error;
  }
};

export const getFriends = async () => {
  const token = localStorage.getItem("user");
  try {
    const response = await fetch(`${API_URL}/api/users/friends`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error geetting requests:", error);
    throw error;
  }
};

export const getSuggestedUsers = async () => {
  const token = localStorage.getItem("user");
  try {
    const response = await fetch(`${API_URL}/api/users/matched-users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.matches;
  } catch (error) {
    console.error("Error geetting requests:", error);
    throw error;
  }
};

export const getPrivateChatRoom = async (targetUserId) => {
  try {
    const currentUserId = localStorage.getItem("userId");
    const res = await fetch(
      `${API_URL}/api/chatrooms/searchPri/${currentUserId}`
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const chatRooms = await res.json();

    const room = chatRooms.find(
      (r) => !r.isGroup && r.otherUserId === targetUserId
    );
    return room ? room.id : null;
  } catch (error) {
    console.error("Failed to open private chat:", error);
    return null;
  }
};


export const getUnreadPrivateChats = async () => {
    const token = localStorage.getItem("user")
    try {
        const response = await fetch(`${API_URL}/api/chatrooms/unread-chats`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error geetting requests:", error);
        throw error;
    }
}

export const markAsRead = async (id) => {

    const token = localStorage.getItem("user")
    try {
        const response = await fetch(`${API_URL}/api/chatrooms/${id}/markAsRead`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                "Authorization": `Bearer ${token}` 
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error geetting requests:", error);
        throw error;
    }
}

export const getActivities = async () => {
  const token = localStorage.getItem("user");
  try {
    const response = await fetch(`${API_URL}/api/users/activities`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error geetting requests:", error);
    throw error;
  }
};

export const recommendusers = async (setActiveMenu, setUsers) => {
  const token = localStorage.getItem("user");
  const userId = localStorage.getItem("userId");

  setActiveMenu("Recommended");

  if (!userId || !token) {
    console.log("User not authenticated");
    setUsers([]);
    return;
  }

  try {
    console.log("Fetching recommendations for user:", userId);

    const response = await fetch(`${API_URL}/api/users/matched-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      throw new Error("Failed to get recommended users");
    }

    const data = await response.json();
    console.log("Recommendation response:", data);

    const matches = Array.isArray(data.matches) ? data.matches : [];

    if (matches.length === 0) {
      console.log("No recommendations found");
      setUsers([]);
      return;
    }

    // Sort by match score descending
    const sortedMatches = matches.sort((a, b) => b.matchScore - a.matchScore);

    console.log("Valid recommended users:", sortedMatches);
    setUsers(sortedMatches);
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    setUsers([]);
  }
};
