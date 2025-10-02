

export const getMyNotifications = async (setNotifications)=>{

    const userId = localStorage.getItem("userId")

    try {
        const response = await fetch(`http://localhost:5000/api/notifications/${userId}`)

        if (!response.ok) throw new Error("Failed to fetch joined events");
        const data = await response.json();

        setNotifications(data)

    } catch (error) {
         console.error("Error fetching notifications:", err);
    }
}


export const deleteNotification = async (notificationId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete notification");
    }

    // Some APIs return 204 No Content for DELETE
    let data = null;
    if (response.status !== 204) {
      data = await response.json().catch(() => null); // safe parse
    }
    return data;

  } catch (err) {
    console.error("Error deleting notifications:", err);
  }
};

// export const createNotification = async (body)=>{

//    const token = localStorage.getItem("user")
//   try {
//     const response = await fetch(`http://localhost:5000/api/notifications`, {
//       method: "POST",
//       body: JSON.stringify({
//       })
//     });

//     if (!response.ok) {
//       throw new Error("Failed to create notification");
//     }
//     const data = await response.json();

//     return data;

//   } catch (err) {
//     console.error("Error creating notifications:", err);
//   }
// }


