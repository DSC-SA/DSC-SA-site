const express = require('express');
const router = express.Router();
const { getAllEvents, createEvent, joinEvent, deleteEvent } = require('../controllers/eventsController');
const { verifyToken } = require('../middleware/auth');

router.get('/', getAllEvents);
router.post('/', createEvent);  // Allow creating events without auth (admin only)
router.delete('/:eventId', deleteEvent);  // Delete event
router.post('/:eventId/join', verifyToken, joinEvent);

module.exports = router;
