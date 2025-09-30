


export const createEvent = async (newEventData, setEvents, setIsCreateModalOpen, setToast) => {

    const token = localStorage.getItem("user")

    try {
        const response = await fetch("http://localhost:5000/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newEventData),

        });

        if (!response.ok) {
            throw new Error("Failed to create event");
        }

        const savedEvent = await response.json();

        setEvents((prev) => [...prev, savedEvent]);

        setIsCreateModalOpen(false);
        setToast({ visible: true, message: "Event created successfully!" });
    } catch (error) {
        console.error(error);
        setToast({ visible: true, message: "Error creating event!" });
    }
};



export const joinEvent = async (selectedEvent, setIsCreateModalOpen, setSelectedEvent, setToast) => {
    const token = localStorage.getItem("user")
    try {
        const eventID = selectedEvent._id
        console.log(eventID)

        const response = await fetch(`http://localhost:5000/api/events/${eventID}/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "user": localStorage.getItem("userId") })
        });

        if (!response.ok) {
            throw new Error("Failed to joinn event");
        }

        const joinedEvent = await response.json();

        setIsCreateModalOpen(false);
        setSelectedEvent(null);
        setToast({ visible: true, message: `You've joined "${joinedEvent.event.title}"` });

    } catch (error) {
        setToast({ visible: true, message: `failed to join` });
        setIsCreateModalOpen(false);
        setSelectedEvent(null);
    }
};


export const getAllEvents = async (setEvents, setActiveMenu) => {
    setActiveMenu("All Events")
    try {
        const response = await fetch("http://localhost:5000/api/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();

        const normalized = data.map(ev => ({
            ...ev,
            id: ev._id, // use MongoDB _id for all events from backend
        }));

        setEvents(normalized);

    } catch (err) {
        console.error("Error fetching events:", err);
    }
}

export const getJoinedEvents = async (setEvents, setActiveMenu) => {
    setActiveMenu("Joined Events")
    const token = localStorage.getItem("user")
    const userId = localStorage.getItem("userId")
    try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}/joined-events`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error("Failed to fetch joined events");
        const data = await response.json();

        const normalized = data.map(ev => ({
            ...ev,
            id: ev._id, // use MongoDB _id for all events from backend
        }));

        setEvents(normalized);

    } catch (err) {
        console.error("Error fetching events:", err);
    }
}

export const leaveEvent = async (event,setIsCreateModalOpen,setSelectedEvent,setToast) => {
    const userId = localStorage.getItem("userId")
    const token = localStorage.getItem("user")

    try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}/leave-event`, {
            method: "PATCH",
            body: JSON.stringify({event: event._id}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error("Failed to leave event");
        const leftEvent = await response.json();

        setIsCreateModalOpen(false);
        setSelectedEvent(null);
        setToast({ visible: true, message: `You've left "${event.title}"` });

    } catch (error) {
        setToast({ visible: true, message: `failed to leave` });
        setIsCreateModalOpen(false);
        setSelectedEvent(null);
    }

}
