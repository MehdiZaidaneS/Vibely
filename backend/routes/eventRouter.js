const express = require("express")
const router = express.Router()

const {
  createEvent,
  getAllEvents,
  getEventById,
  joinEvent,
  leaveEvent,
  searchEvent
} = require("../controllers/eventController.js")



router.post("/", createEvent);

// Get all events (GET request)
router.get("/", getAllEvents);

router.get("/search", searchEvent);

// Get a single event by ID (GET request)
router.get("/:eventId", getEventById);

// Like a event (PATCH request, because you're updating the event)
router.patch("/:eventId/join", joinEvent);
router.patch("/:eventId/leave", leaveEvent);


module.exports = router;