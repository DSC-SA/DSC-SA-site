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
  const { username, rank, bio } = req.body;
  const loggedInUserId = req.user.id;

  if (userId != loggedInUserId) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  try {
    // Validate username if provided
    if (username) {
      if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ error: 'Username must be 3-30 characters' });
      }

      // Check if username already exists (except current user)
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId]
      );
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    let query = 'UPDATE users SET rank = $1, bio = $2, updated_at = CURRENT_TIMESTAMP';
    const values = [rank, bio];
    
    // Add username if provided
    if (username) {
      values.push(username);
      query += `, username = $${values.length}`;
    }
    
    // If there's a file upload (avatar image)
    if (req.file) {
      values.push(req.file.buffer);
      query += `, avatar_data = $${values.length}`;
    }
    
    query += ` WHERE id = $${values.length + 1} RETURNING id, username, email, avatar_data, rank, bio, points`;
    values.push(userId);

    const result = await pool.query(query, values);

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
