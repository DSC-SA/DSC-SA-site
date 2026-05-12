const pool = require('../config/database');

const getComments = async (req, res) => {
  const { heroId } = req.params;

  try {
    const result = await pool.query(
      `SELECT bc.id, bc.content, bc.likes, bc.created_at, u.username, u.avatar, u.id as user_id, bc.parent_id
      FROM build_comments bc
      JOIN users u ON bc.user_id = u.id
      WHERE bc.hero_id = $1
      ORDER BY bc.parent_id NULLS FIRST, bc.likes DESC, bc.created_at DESC`,
      [heroId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addComment = async (req, res) => {
  const { heroId, content, parentId } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO build_comments (hero_id, user_id, content, parent_id) VALUES ($1, $2, $3, $4) RETURNING id, content, created_at, likes',
      [heroId, userId, content, parentId || null]
    );

    // Award 10 points for commenting
    await pool.query(
      'UPDATE users SET points = points + 10 WHERE id = $1',
      [userId]
    );

    // Get user data to return
    const userResult = await pool.query('SELECT username, avatar FROM users WHERE id = $1', [userId]);

    res.status(201).json({ 
      message: 'Comment added', 
      comment: {
        ...result.rows[0],
        user_id: userId,
        username: userResult.rows[0].username,
        avatar: userResult.rows[0].avatar,
        parent_id: parentId || null
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const likeComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const result = await pool.query(
      'UPDATE build_comments SET likes = likes + 1 WHERE id = $1 RETURNING likes',
      [commentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Liked', likes: result.rows[0].likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addReply = async (req, res) => {
  const { commentId } = req.params;
  const { heroId, content } = req.body;
  const userId = req.user.id;

  try {
    // Check if parent comment exists
    const parentCheck = await pool.query('SELECT hero_id FROM build_comments WHERE id = $1', [commentId]);
    if (parentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Parent comment not found' });
    }

    const result = await pool.query(
      'INSERT INTO build_comments (hero_id, user_id, content, parent_id) VALUES ($1, $2, $3, $4) RETURNING id, content, created_at, likes',
      [parentCheck.rows[0].hero_id, userId, content, commentId]
    );

    // Award 10 points for replying
    await pool.query(
      'UPDATE users SET points = points + 10 WHERE id = $1',
      [userId]
    );

    // Get user data to return
    const userResult = await pool.query('SELECT username, avatar FROM users WHERE id = $1', [userId]);

    res.status(201).json({ 
      message: 'Reply added', 
      comment: {
        ...result.rows[0],
        user_id: userId,
        username: userResult.rows[0].username,
        avatar: userResult.rows[0].avatar,
        parent_id: commentId
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    // Check if user owns comment
    const commentResult = await pool.query('SELECT user_id FROM build_comments WHERE id = $1', [commentId]);
    if (commentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (commentResult.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('DELETE FROM build_comments WHERE id = $1', [commentId]);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getComments, addComment, deleteComment, likeComment, addReply };
