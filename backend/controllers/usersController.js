const pool = require('../config/database');

const getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query('SELECT id, username, email, avatar, rank, bio, created_at FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { avatar, rank, bio } = req.body;
  const loggedInUserId = req.user.id;

  if (userId != loggedInUserId) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET avatar = COALESCE($1, avatar), rank = COALESCE($2, rank), bio = COALESCE($3, bio), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, username, email, avatar, rank, bio, points',
      [avatar, rank, bio, userId]
    );

    res.json({ message: 'Profile updated', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, points, avatar, rank 
       FROM users 
       WHERE points > 0 
       ORDER BY points DESC 
       LIMIT 100`
    );

    // Add rank position
    const leaderboard = result.rows.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, updateProfile, getLeaderboard };
