// controllers/AIeventController.js

const { matchEvents } = require("../services/AIeventService");
const { normalizeAIevent } = require("../utils/normalizeAIevent");

async function EventMatches(req, res) {
  try {
    const { userId, preferrences } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    // Call event matcher service
    const rawResponse = await matchEvents(userId, preferrences);

    // Normalize the response
    const norm = normalizeAIevent(rawResponse);

    // Log response
    if (process.env.DEBUG_GEMINI === "true") {
      console.log("EventMatcher JSON:", norm);
    }

    // Send back normalized response
    res.status(200).json(norm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = EventMatches;
