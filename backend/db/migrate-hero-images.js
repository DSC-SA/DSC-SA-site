const pool = require('../config/database');

const migrateHeroImages = async () => {
  try {
    await pool.query('ALTER TABLE heroes ADD COLUMN IF NOT EXISTS image_data BYTEA');
    await pool.query('ALTER TABLE heroes ADD COLUMN IF NOT EXISTS image_mimetype VARCHAR(50)');
    console.log('✓ heroes.image_data/image_mimetype columns verified');
  } catch (err) {
    console.error('Error adding hero image columns:', err.message);
  }
};

module.exports = { migrateHeroImages };