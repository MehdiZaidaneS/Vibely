// controllers/AIeventController.js

const { matchEvents, matchUsers } = require("../services/AIService");
const { normalizeAI } = require("../utils/normalizeAI");

const EventMatches = async (req, res) => {
  try {
    const { userId, preferrences } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    // Call event matcher service
    const rawResponse = await matchEvents(userId, preferrences);

    // Normalize the response
    const norm = normalizeAI(rawResponse);

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


const UserMatches = async (req, res) => {
   const userId  = req.user._id;
  try {

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    // Call event matcher service
    const rawResponse = await matchUsers(userId);

    // Log response
    if (process.env.DEBUG_GEMINI === "true") {
      console.log("EventMatcher JSON:", rawResponse);
    }

    // Send back normalized response
    res.status(200).json(rawResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
}




module.exports =  {
  EventMatches,
  UserMatches
}
