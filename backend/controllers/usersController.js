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

const getProfileAvatar = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT avatar_data FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const avatarData = result.rows[0].avatar_data;
    if (!avatarData) {
      return res.status(404).json({ error: 'No avatar found for this user' });
    }

    // Set appropriate headers and send binary data
    res.type('image/png');
    res.send(avatarData);
  } catch (err) {
    console.error('❌ Error retrieving user avatar:', err);
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { rank, bio } = req.body;
  const loggedInUserId = req.user.id;

  if (userId != loggedInUserId) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  try {
    let avatarData = null;
    
    // If there's a file upload (avatar image)
    if (req.file) {
      avatarData = req.file.buffer;
    }

    // Update profile with avatar_data if provided
    const updateFields = ['rank = COALESCE($1, rank)', 'bio = COALESCE($2, bio)', 'updated_at = CURRENT_TIMESTAMP'];
    const values = [rank, bio, userId];
    
    if (avatarData) {
      updateFields.push(`avatar_data = $${values.length + 1}`);
      values.push(avatarData);
    }

    const result = await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${updateFields.length + (avatarData ? 0 : 1)} RETURNING id, username, email, avatar_data, rank, bio, points`,
      [...values.slice(0, -1), userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'Profile updated', 
      user: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email,
        rank: result.rows[0].rank,
        bio: result.rows[0].bio,
        points: result.rows[0].points,
        hasAvatar: !!result.rows[0].avatar_data
      }
    });
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

module.exports = { getProfile, getProfileAvatar, updateProfile, getLeaderboard };
