const pool = require('../config/database');

const HERO_COLUMNS = `id, name, role, description, difficulty, attack, defense, hp,
  icon_url, (image_data IS NOT NULL) AS has_image, created_at`;

const getAllHeroes = async (req, res) => {
  try {
    const result = await pool.query(`SELECT ${HERO_COLUMNS} FROM heroes ORDER BY name ASC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHeroById = async (req, res) => {
  const { id } = req.params;

  try {
    const heroResult = await pool.query(`SELECT ${HERO_COLUMNS} FROM heroes WHERE id = $1`, [id]);
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

const getHeroImage = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT image_data, image_mimetype FROM heroes WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hero not found' });
    }

    const imageData = result.rows[0].image_data;
    if (!imageData) {
      return res.status(404).json({ error: 'No image found for this hero' });
    }

    res.type(result.rows[0].image_mimetype || 'image/webp');
    // Images rarely change; allow browser/edge caching for 1 hour to cut API load.
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(imageData);
  } catch (err) {
    console.error('Error retrieving hero image:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllHeroes, getHeroById, getHeroImage };
