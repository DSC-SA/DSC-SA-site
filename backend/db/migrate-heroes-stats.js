const pool = require('../config/database');

const migrateHeroesStats = async () => {
  try {
    console.log('Running migration: add hero stat columns (attack, defense, hp)...');
    await pool.query(`
      ALTER TABLE heroes
      ADD COLUMN IF NOT EXISTS attack INT,
      ADD COLUMN IF NOT EXISTS defense INT,
      ADD COLUMN IF NOT EXISTS hp INT
    `);
    console.log('✓ Migration completed: hero stat columns added');
  } catch (err) {
    console.error('Hero stats migration error:', err);
    throw err;
  }
};

module.exports = { migrateHeroesStats };
