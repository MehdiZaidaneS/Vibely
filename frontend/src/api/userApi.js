
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