const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const requireAuth = require("../middleware/requireAuth");
const {EventMatches} = require("../controllers/AIeventController.js")

const {
  createEvent,
  getAllEvents,
  getEventById,
  joinEvent,
  leaveEvent,
  searchEvent,
  getEventCreatedbyUser
} = require("../controllers/eventController.js")

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/events/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})





// Get all events (GET request)
router.get("/", getAllEvents);
router.get("/search", searchEvent);
router.get("/:eventId", getEventById);


router.use(requireAuth);
router.post("/recommend-event", EventMatches)
router.post("/created-events", getEventCreatedbyUser)


router.post("/:eventId/join", joinEvent);
router.post("/:eventId/leave", leaveEvent);
router.post("/", upload.single('image'), createEvent);


module.exports = router;