const pool = require('../config/database');

const getAllHeroes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM heroes ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHeroById = async (req, res) => {
  const { id } = req.params;

  try {
    const heroResult = await pool.query('SELECT * FROM heroes WHERE id = $1', [id]);
    if (heroResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hero not found' });
    }

    const hero = heroResult.rows[0];

    // Get recommended builds
    const buildsResult = await pool.query(
      `SELECT rb.*, 
        json_agg(json_build_object('id', i.id, 'name', i.name, 'stage', rbi.stage, 'item_order', rbi.item_order)) as items
      FROM recommended_builds rb
      LEFT JOIN recommended_build_items rbi ON rb.id = rbi.build_id
      LEFT JOIN items i ON rbi.item_id = i.id
      WHERE rb.hero_id = $1
      GROUP BY rb.id
      ORDER BY rb.build_order ASC`,
      [id]
    );

    hero.recommendedBuilds = buildsResult.rows;

    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllHeroes, getHeroById };
