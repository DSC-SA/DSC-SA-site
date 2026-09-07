const pool = require('../config/database');

const getAllEvents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY event_date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEvent = async (req, res) => {
  const { title, description, eventDate, status, image } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO events (title, description, event_date, status, image) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [title, description, eventDate, status || 'upcoming', image || null]
    );

    res.status(201).json({ message: 'Event created', eventId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const joinEvent = async (req, res) => {
  const { eventId } = req.params;
  const { teamName } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      'INSERT INTO event_participants (event_id, user_id, team_name) VALUES ($1, $2, $3)',
      [eventId, userId, teamName]
    );

    res.status(201).json({ message: 'Joined event' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 RETURNING id',
      [eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllEvents, createEvent, joinEvent, deleteEvent };
