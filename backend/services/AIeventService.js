// services/eventMatcherService.js

const model = require("../config/gemini");
const Event = require("../models/eventModel");
const User = require("../models/userModel");

const matchEvents = async (userId, preferences = {}) => {
  try {
    // Get user info
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Get all events
    const events = await Event.find()
      .populate('author', 'username')
      .populate('participant', 'username');

    // If no events exist, return empty matches
    if (!events || events.length === 0) {
      return { matches: [] };
    }

    const eventList = events.map(e => ({
      id: e._id,
      title: e.title,
      content: e.content,
      type: e.type || "General",
      date: e.date || e.createdAt,
      time: e.time || "TBD",
      postedBy: e.author?.username || "Unknown",
      capacity: e.capacity || 100,
      participants: e.participant?.length || 0
    }));

    const prompt = `
      You are an intelligent event matcher.
      Based on the user's profile, preferences, and event details, return a ranked list of suitable events in JSON format.

      ### User Profile:
      {
        "name": "${user.fullname}",
        "interests": ${JSON.stringify(user.interests || [])},
        "joinedEvents": ${JSON.stringify(user.joinedEvents || [])}
      }

      ### User Preferences:
      {
        "preferredDate": "${preferences.preferredDate || "any"}",
        "preferredType": "${preferences.preferredType || "any"}",
        "maxParticipants": ${preferences.maxParticipants || "any"}
      }

      ### Events:
      ${JSON.stringify(eventList, null, 2)}

      ### Instructions:
      - Consider event type, capacity (avoid full events), and date/time.
      - Match events with user's interests and preferences.
      - Avoid events the user has already joined.
      - Always return **at least one event**, even if no perfect match.
      - Keep each field concise (1–3 sentences max).
      - Return ONLY JSON in this schema:

      {
        "matches": [
          {
            "eventId": "string",
            "matchScore": "number (0-100)",
            "reason": "short reason why this event fits"
          }
        ]
      }
    `;


    const result = await model(prompt);

    if (process.env.DEBUG_GEMINI === "true") {
      console.log("Raw Gemini response:", result);
    }

    let rawText = result.text || "";


    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawText;
    // parse
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      console.error("Failed to parse LLM output:", jsonString);
      throw new Error("Invalid JSON returned by LLM");
    }

    return parsed;



  } catch (err) {
    console.error("Error in eventMatcherService:", err);
    throw new Error("Failed to match events");
  }
}


const matchUsers = async (userId) => {
  try {

    const currentUser = await User.findById(userId)
      .populate("friends")
      .populate("friend_requests.user");
    if (!currentUser) throw new Error("User not found");


    const users = await User.find({
      _id: { $nin: [userId, ...(currentUser.friends?.map(f => f._id) || [])] }
    }).populate("friends").populate("friend_requests.user");


    const usersWithStatus = users.map(otherUser => {
      const hasSentRequest = otherUser.friend_requests?.some(req =>
        req.user?._id?.equals(userId)
      );

      const hasReceivedRequest = currentUser.friend_requests?.some(req =>
        req.user?._id?.equals(otherUser._id)
      );


      const mutualFriends = otherUser.friends.filter(f =>
        currentUser.friends.some(cf => cf._id.equals(f._id))
      ).length;

      return {
        _id: otherUser._id,
        name: otherUser.name,
        username: otherUser.username,
        interests: otherUser.interests,
        createdAt: otherUser.createdAt,
        friendRequestPending: hasSentRequest ? "Pending" : "Add Friend",
        friendRequestReceived: hasReceivedRequest ? "Respond" : null,
        mutualFriends
      };
    });


    const userList = usersWithStatus.map(u => ({
      id: u._id,
      name: u.name,
      interests: u.interests || [],
      joinedEvents: u.joinedEvents || [],
    }));

    const prompt = `
You are an intelligent users matcher.
Based on the user's profile interests and events joined, return a ranked list of suitable users in JSON format.

### User Profile:
{
  "name": "${currentUser.name}",
  "interests": ${JSON.stringify(currentUser.interests || [])},
  "joinedEvents": ${JSON.stringify(currentUser.joinedEvents || [])}
}

### Users:
${JSON.stringify(userList, null, 2)}

### Instructions:
- Match user with other users based on interests and joinedEvents.
- Avoid users that the user is already friends with.
- ALWAYS return maximum 5 matches, even if no perfect match.
- Keep each field concise (1–3 sentences max).
- ALL the reasons cannot be identical
- Return ONLY JSON in this schema:

{
  "matches": [
    {
      "_id": "string",
      "matchScore": "number (0-100)",
      "reason": "Atractive reason why matches",
    }
  ]
}
`;


    const result = await model(prompt);

    if (process.env.DEBUG_GEMINI === "true") {
      console.log("Raw Gemini response:", result);
    }

    const rawText = result.text || "";
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawText;

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      console.error("Failed to parse LLM output:", jsonString);
      throw new Error("Invalid JSON returned by LLM");
    }

    return parsed;

  } catch (err) {
    console.error("Error in usersMatcherService:", err);
    throw new Error("Failed to match users");
  }
};


module.exports = { matchEvents, matchUsers };
