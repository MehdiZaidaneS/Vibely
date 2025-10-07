// controllers/AIeventController.js

const { matchEvents, matchUsers } = require("../services/AIService");
const { normalizeAI } = require("../utils/normalizeAI");
const User = require("../models/userModel");

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
  const userId = req.user._id;
  const { interests } = req.body;
  try {

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    // Call event matcher service
    const rawResponse = await matchUsers(userId, interests);

    // Log response
    if (process.env.DEBUG_GEMINI === "true") {
      console.log("EventMatcher JSON:", rawResponse);
    }
    const matchesArray = Array.isArray(rawResponse.matches) ? rawResponse.matches : [];

    const enrichedMatches = await Promise.all(matchesArray.map(async (match) => {
      const user = await User.findById(match._id).lean();
      if (!user) return null;

      return {
        _id: user._id,
        name: user.name,
        age: user.age,
        avatar: user.avatar || "/default-avatar.png",
        coverImage: user.coverImage || "/default-cover.jpg",
        bio: user.bio || "",
        location: user.location || "Unknown",
        mutualFriends: match.mutualFriends || 0,
        commonEvents: match.commonEvents || 0,
        interests: user.interests || [],
        compatibility: match.compatibility || { interests: 0, events: 0, social: 0 },
        reason: match.reason,
        matchScore: match.matchScore
      };
    }));

    // Send back normalized response
    res.status(200).json({ matches: enrichedMatches.filter(m => m !== null) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
}




module.exports = {
  EventMatches,
  UserMatches
}
