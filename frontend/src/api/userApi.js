const API_URL = "http://localhost:4000/api/users";




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
        return newUser

    }catch(error){
        console.error("Error creating user:", error.message)
        throw error;
    }
}

export const logUser = async(body) =>{
    try {
        const response = await fetch(`${API_URL}/login`,{
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