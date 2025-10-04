


export const createEvent = async (newEventData, setEvents, setIsCreateModalOpen, setToast) => {

    const token = localStorage.getItem("user")

    try {
        // Check if newEventData is FormData (for image uploads) or regular object
        const isFormData = newEventData instanceof FormData;

        const headers = {
            "Authorization": `Bearer ${token}`
        };

        // Only set Content-Type for JSON, let browser set it for FormData
        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }

        const response = await fetch("http://localhost:5000/api/events", {
            method: "POST",
            headers: headers,
            body: isFormData ? newEventData : JSON.stringify(newEventData),
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



export const joinEvent = async (selectedEvent, setIsCreateModalOpen, setSelectedEvent, setToast, setEvents) => {
    const token = localStorage.getItem("user")
    const userId = localStorage.getItem("userId")

    try {
        const eventID = selectedEvent._id
        console.log(eventID)

        const response = await fetch(`http://localhost:5000/api/events/${eventID}/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "user": userId })
        });

        if (!response.ok) {
            throw new Error("Failed to join event");
        }

        const joinedEvent = await response.json();

        // Update local state to reflect the join
        if (setEvents) {
            setEvents(prevEvents =>
                prevEvents.map(e =>
                    e._id === eventID
                        ? { ...e, participant: [...(e.participant || []), userId] }
                        : e
                )
            );
        }

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

export const getJoinedEvents = async (setEvents) => {
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

        setEvents(normalized)

    } catch (err) {
        console.error("Error fetching events:", err);
    }
}

export const leaveEvent = async (event, setIsCreateModalOpen, setSelectedEvent, setToast) => {
    const userId = localStorage.getItem("userId")
    const token = localStorage.getItem("user")

    try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}/leave-event`, {
            method: "PATCH",
            body: JSON.stringify({ event: event._id }),
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

const getEventById = async (eventId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`)
        const event = await response.json()

        return event
    } catch (error) {
        console.log("Error getting event by id")
    }

}


export const recommendEvents = async (setActiveMenu, setEvents) => {
  const token = localStorage.getItem("user");
  const userId = localStorage.getItem("userId");

  setActiveMenu("Recommended");

  if (!userId || !token) {
    console.log("User not authenticated");
    setEvents([]);
    return;
  }

  try {
    console.log("Fetching recommendations for user:", userId);

    const response = await fetch("http://localhost:5000/api/events/recommend-event", {
      method: "POST",
      body: JSON.stringify({ userId, preferences: [] }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      throw new Error("Failed to get recommended events");
    }

    const recommendedEventsResponse = await response.json();
    console.log("Recommendation response:", recommendedEventsResponse);

    const recommendedArray = Array.isArray(recommendedEventsResponse.matches)
      ? recommendedEventsResponse.matches
      : [];

    console.log("Matches found:", recommendedArray.length);

    if (recommendedArray.length === 0) {
      console.log("No recommendations found");
      setEvents([]);
      return;
    }

    const recommended = await Promise.all(
      recommendedArray.map(async (match) => {
        const event = await getEventById(match.eventId);
        if (!event) return null;
        return { matchScore: match.matchScore, ...event };
      })
    );

    const validRecommended = recommended.filter(e => e !== null);
    console.log("Valid recommended events:", validRecommended);
    setEvents(validRecommended);
  } catch (error) {
    console.error("Error fetching recommended events:", error);
    setEvents([]);
  }
};


export const getEventCreatedbyUser = async () => {
  const token = localStorage.getItem("user");

  try {
    const response = await fetch("http://localhost:5000/api/events/created-events", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch created events");
    }

    const data = await response.json();

    const normalized = data.map(ev => ({
      ...ev,
      id: ev._id, // unify with MongoDB’s _id
    }));

    return normalized;

  } catch (error) {
    console.error("Error fetching created events:", error);
    return [];
  }
};

