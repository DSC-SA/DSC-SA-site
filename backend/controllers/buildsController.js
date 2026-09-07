const pool = require('../config/database');

const getBuildsForHero = async (req, res) => {
  const { heroId } = req.params;

  try {
    // Get recommended builds
    const recommendedResult = await pool.query(
      `SELECT rb.id, rb.build_name, rb.description, rb.synergy_notes, rb.build_order,
        json_agg(json_build_object('id', i.id, 'name', i.name, 'stage', rbi.stage, 'order', rbi.item_order, 'image', i.image, 'icon_url', i.icon_url)) as items
      FROM recommended_builds rb
      LEFT JOIN recommended_build_items rbi ON rb.id = rbi.build_id
      LEFT JOIN items i ON rbi.item_id = i.id
      WHERE rb.hero_id = $1
      GROUP BY rb.id
      ORDER BY rb.build_order ASC`,
      [heroId]
    );

    // Get user builds
    const userBuildsResult = await pool.query(
      `SELECT ub.id, ub.build_name, ub.description, ub.likes, ub.views, u.username,
        json_agg(json_build_object('id', i.id, 'name', i.name, 'stage', ubi.stage, 'order', ubi.item_order, 'image', i.image, 'icon_url', i.icon_url)) as items
      FROM user_builds ub
      JOIN users u ON ub.user_id = u.id
      LEFT JOIN user_build_items ubi ON ub.id = ubi.build_id
      LEFT JOIN items i ON ubi.item_id = i.id
      WHERE ub.hero_id = $1 AND ub.status = 'approved'
      GROUP BY ub.id, u.username
      ORDER BY ub.likes DESC`,
      [heroId]
    );

    res.json({
      recommendedBuilds: recommendedResult.rows,
      userBuilds: userBuildsResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUserBuild = async (req, res) => {
  const { heroId, buildName, description, itemIds, stages } = req.body;
  const userId = req.user.id;

  try {
    // Insert user build
    const buildResult = await pool.query(
      'INSERT INTO user_builds (hero_id, user_id, build_name, description) VALUES ($1, $2, $3, $4) RETURNING id',
      [heroId, userId, buildName, description]
    );

    const buildId = buildResult.rows[0].id;

    // Insert build items
    for (let i = 0; i < itemIds.length; i++) {
      await pool.query(
        'INSERT INTO user_build_items (build_id, item_id, item_order, stage) VALUES ($1, $2, $3, $4)',
        [buildId, itemIds[i], i + 1, stages[i] || 'core']
      );
    }

    // Award 25 points for suggesting a build
    await pool.query(
      'UPDATE users SET points = points + 25 WHERE id = $1',
      [userId]
    );

    res.status(201).json({ message: 'Build created', buildId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBuildComments = async (req, res) => {
  const { heroId } = req.params;

  try {
    const result = await pool.query(
      `SELECT bc.id, bc.content, bc.likes, bc.created_at, u.username, u.avatar
      FROM build_comments bc
      JOIN users u ON bc.user_id = u.id
      WHERE bc.hero_id = $1 AND bc.parent_id IS NULL
      ORDER BY bc.created_at DESC`,
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
      'INSERT INTO build_comments (hero_id, user_id, content, parent_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [heroId, userId, content, parentId || null]
    );

    res.status(201).json({ message: 'Comment added', commentId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getBuildsForHero, createUserBuild, getBuildComments, addComment };
