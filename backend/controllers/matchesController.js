const pool = require('../config/database');

// Get all matches
const getAllMatches = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM matches ORDER BY match_date DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching matches' });
  }
};

// Create match
const createMatch = async (req, res) => {
  const { title, description, matchDate, status, image } = req.body;

  if (!title || !matchDate) {
    return res.status(400).json({ message: 'Title and date are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO matches (title, description, match_date, status, image) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [title, description || '', matchDate, status || 'upcoming', image || null]
    );

    res.status(201).json({ 
      message: 'Match created successfully',
      matchId: result.rows[0].id 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating match', error: err.message });
  }
};

// Delete match
const deleteMatch = async (req, res) => {
  const { matchId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM matches WHERE id = $1 RETURNING id',
      [matchId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json({ message: 'Match deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting match' });
  }
};

module.exports = {
  getAllMatches,
  createMatch,
  deleteMatch
};
