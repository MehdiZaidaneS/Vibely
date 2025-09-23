// services/eventMatcherService.js

const model = require("../config/gemini");
const Event = require("../models/eventModel");
const User = require("../models/userModel");

async function matchEvents(userId, preferences = {}) {
  try {
    // Get user info
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Get all events
    const events = await Event.find()
          .populate('author', 'username')
          .populate('participant', 'username');


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

module.exports = { matchEvents };
