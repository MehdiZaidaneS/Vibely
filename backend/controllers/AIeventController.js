// controllers/AIeventController.js

const { matchEventsForUser } = require("../services/AIeventService");
const { normalizeAIevent } = require("../utils/normalizeAIevent");

async function EventMatches(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    // Call event matcher service
    const rawResponse = await matchEventsForUser(userId);

    // Handle possible fenced code block JSON
    const jsonMatch = rawResponse.text?.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawResponse.text || rawResponse;

    if (process.env.DEBUG_GEMINI === "true") {
      console.log("EventMatcher JSON:", jsonString);
    }

    // Parse JSON
    let parsedEvents;
    try {
      parsedEvents = JSON.parse(jsonString);
    } catch (err) {
      return res.status(500).json({ error: "Error parsing JSON response." });
    }

    // Normalize output
    const normalizedEvents = normalizeAIevent(parsedEvents);

    // Send back response
    res.json(normalizedEvents);

  } catch (err) {
    console.error("Error in AIeventController:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

module.exports = EventMatches;
