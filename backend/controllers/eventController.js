const activityModel = require('../models/activityModel');
const Event = require('../models/eventModel');
const notificationModel = require('../models/notificationModel');
const User = require('../models/userModel');

exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      author: req.body.author,
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      date: req.body.date,
      time: req.body.time,
      endTime: req.body.endTime,
      location: req.body.location,
      capacity: req.body.capacity,
      participant: req.body.participant || []
    };

    // If image file was uploaded, add the path
    if (req.file) {
      eventData.imageUrl = `/uploads/events/${req.file.filename}`;
    }

    const newEvent = new Event(eventData);
    const savedEvent = await newEvent.save();

    //Creating activitiy

    const activity = await activityModel.create({
      user: req.body.author,
      type: "Created Event",
      content: `You created, ${req.body.title} event!`
    })

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('author', 'username email profile_pic')
      .populate('participant', 'username email');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate('author', 'username email profile_pic')
      .populate('participant', 'username email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error });
  }
};

exports.joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    const userID = req.body.user;
    const user = await User.findById(userID);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.participant.includes(userID)) {
      return res.status(400).json({ message: 'You already joined this event' });
    }
    event.participant.push(userID);

    if (!user.joinedEvents.includes(event._id)) {
      user.joinedEvents.push(event._id);
    }

    await event.save();
    await user.save();

    //Creating notification
    const notification = await notificationModel.create({
      receiver: userID,
      content: `Joined successfully, ${event.title} event!`,
      type: "Message"
    });

    //Creating activitiy

    const activity = await activityModel.create({
      user: userID,
      type: "Joined Event",
      content: `Joined successfully, ${event.title}!`
    })

    res.status(200).json({ message: 'Joined event successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error joining event', error });
  }
};

exports.leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    const user = req.user;
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const index = event.participant.indexOf(user._id);
    if (index === -1) {
      return res.status(400).json({ message: 'You are not a participant of this event' });
    }
    event.participant.splice(index, 1);

    const joinedIndex = user.joinedEvents.indexOf(event._id);
    if (joinedIndex !== -1) {
      user.joinedEvents.splice(joinedIndex, 1);
    }

    await event.save();
    await user.save();
    res.status(200).json({ message: 'Left event successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error leaving event', error });
  }
};

exports.searchEvent = async (req, res) => {
  const { name } = req.query;
  const event = await Event.findOne({ title: name });
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
};


exports.getEventCreatedbyUser = async (req, res) => {
  try {

    const userId = req.user._id;


    const events = await Event.find({ author: userId })
      .populate('author', 'username email profile_pic')
      .populate('participant', 'username email');


    res.status(200).json(events || []);
  } catch (error) {
    console.error('Error fetching user-created events:', error);
    res.status(500).json({ message: 'Error fetching user-created events', error: error.message });
  }
};

