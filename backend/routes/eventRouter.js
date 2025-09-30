const express = require("express")
const router = express.Router()
const requireAuth = require("../middleware/requireAuth");
const EventMatches = require("../controllers/AIeventController.js")

const {
  createEvent,
  getAllEvents,
  getEventById,
  joinEvent,
  leaveEvent,
  searchEvent
} = require("../controllers/eventController.js")





// Get all events (GET request)
router.get("/", getAllEvents);
router.get("/search", searchEvent);
router.get("/:eventId", getEventById);
router.post("/recommend-event", EventMatches)

router.use(requireAuth);



router.post("/:eventId/join", joinEvent);
router.post("/:eventId/leave", leaveEvent);
router.post("/", createEvent);


module.exports = router;