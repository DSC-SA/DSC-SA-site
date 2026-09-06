const pool = require('../config/database');

const migrateClearArt = async () => {
  try {
    const heroRes = await pool.query('SELECT 1 FROM heroes WHERE icon_url IS NOT NULL LIMIT 1');
    const itemRes = await pool.query(
      'SELECT 1 FROM items WHERE image IS NOT NULL OR image_data IS NOT NULL LIMIT 1'
    );

    if (heroRes.rows.length > 0) {
      await pool.query('UPDATE heroes SET icon_url = NULL');
      console.log('  Cleared hero icon_url (all art removed)');
    }

    if (itemRes.rows.length > 0) {
      await pool.query('UPDATE items SET image = NULL, image_data = NULL, image_mimetype = NULL');
      console.log('  Cleared item images (all art removed)');
    }

    if (heroRes.rows.length === 0 && itemRes.rows.length === 0) {
      console.log('  No hero/item art to clear');
    }
  } catch (err) {
    console.error('  Error clearing hero/item art:', err.message);
  }
};

module.exports = { migrateClearArt };
