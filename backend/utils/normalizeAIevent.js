// utils/normalizeAIevent.js

function normalizeAIevent(result) {
  let eventMatches = result;

  // If it's still a JSON string, try parsing
  if (typeof eventMatches === "string") {
    try {
      eventMatches = JSON.parse(eventMatches);
    } catch (err) {
      console.error("Failed to parse event matcher JSON:", err);
      return { matches: [] };
    }
  }

  // Ensure we always return the expected schema
  if (!Array.isArray(eventMatches.matches)) {
    eventMatches.matches = [];
  }

  // Normalize each match entry with safe defaults
  const normalizedMatches = eventMatches.matches.map((m) => ({
    eventId: m.eventId || "unknown",
    matchScore: typeof m.matchScore === "number" ? m.matchScore : 0,
    reason: m.reason || "No reason provided",
  }));

  return { matches: normalizedMatches };
}

module.exports = { normalizeAIevent };
