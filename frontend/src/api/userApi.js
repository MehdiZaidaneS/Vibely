
const API_URL = `http://localhost:5000/api/users`;



export const createUser = async (body) => {

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            }
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        const newUser = await response.json()
        localStorage.setItem("user", newUser.token);
        localStorage.setItem("userId", newUser.user._id);
        return newUser

    } catch (error) {
        console.error("Error creating user:", error.message)
        throw error;
    }
}

export const getUserbyId = async (setUser) => {
    const userId = localStorage.getItem("userId")
    try {
        const response = await fetch(`${API_URL}/${userId}`)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }
        const user = await response.json()
        setUser(user)
        return user

    } catch (error) {
        console.error("Error getting user:", error.message)
        throw error;

    }
}

export const logUser = async (body) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            }

        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        const user = await response.json()
        localStorage.setItem("user", user.token);
        localStorage.setItem("userId", user.user._id);
        return user



    } catch (error) {
        console.error("Error creating user:", error.message)
        throw error;

    }
}

export const addInfo = async (body) => {
    const token = localStorage.getItem("user")
    const userId = localStorage.getItem("userId")
    try {
        const response = await fetch(`${API_URL}/${userId}`, {
            method: "PATCH",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json(); // updated user data from backend
        return data;


    } catch (error) {
        console.error("Error updating user info:", error);
        throw error;

    }
}


export const declineFriendRequest = async (friend_request_id) => {

    const token = localStorage.getItem("user")
    try {

        const response = await fetch(`${API_URL}/delete/${friend_request_id}`,{
            method: "DELETE",
            headers:{
                "Authorization": `Bearer ${token}`,
            }
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json(); 
        return data;


    } catch (error) {
        console.error("Error declining friend request:", error);
        throw error;

    }
}


export const acceptFriendResquest = async(friend_request_id) =>{
    const token = localStorage.getItem("user")
    try {

        const response = await fetch(`${API_URL}/accept/${friend_request_id}`,{
            method: "POST",
            headers:{
                "Authorization": `Bearer ${token}`,
            }
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json(); 
        return data;


    } catch (error) {
        console.error("Error accept friend request:", error);
        throw error;

    }

}