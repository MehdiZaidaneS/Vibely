// services/eventMatcherService.js

const model = require("../config/gemini");
const Event = require("../models/eventModule");
const User = require("../models/userModule");

async function matchEvents(userId) {
  try {
    // 1. Get user info
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // 2. Get all upcoming events
    const events = await Event.find({ date: { $gte: new Date() } });

    // 3. Prepare event + user data for LLM
    const eventList = events.map(e => ({
      id: e._id,
      title: e.title,
      type: e.type,
      date: e.date,
      time: e.time,
      postedBy: e.postedBy,
      capacity: e.capacity,
      participants: e.participants?.length || 0
    }));

    const prompt = `
      You are an intelligent event matcher.
      Based on the user's profile and event details, return a ranked list of suitable events in JSON format.

      ### User Profile:
      {
        "name": "${user.name}",
        "interests": ${JSON.stringify(user.interests || [])},
        "joinedEvents": ${JSON.stringify(user.joinedEvents || [])}
      }

      ### Events:
      ${JSON.stringify(eventList, null, 2)}

      ### Instructions:
      - Consider event type, capacity (avoid full events), and time.
      - Prioritize matches with user interests and avoid events already joined.
      - Keep each field concise (1–3 sentences max).
      - Return ONLY JSON with the following schema:

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

    // 4. Call LLM
    const result = await model(prompt);

    if (process.env.DEBUG_GEMINI === "true") {
      console.log("🔍 Raw Gemini response:", result);
    }

    // 5. Return structured output
    return JSON.parse(result.text);

  } catch (err) {
    console.error("Error in eventMatcherService:", err);
    throw new Error("Failed to match events");
  }
}

module.exports = { matchEvents };
