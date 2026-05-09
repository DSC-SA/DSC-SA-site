const pool = require('../config/database');

const migrateToEmailAuth = async () => {
  try {
    console.log('🔄 Starting database migration...');

    // Add new columns
    const migrations = [
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_method VARCHAR(20) DEFAULT \'email\';',
      'ALTER TABLE users DROP COLUMN IF EXISTS whatsapp_number;'
    ];

    for (const migration of migrations) {
      try {
        await pool.query(migration);
        console.log(`✅ ${migration.substring(0, 50)}...`);
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`⏭️  Column already exists, skipping...`);
        } else {
          console.error(`❌ Migration error: ${err.message}`);
        }
      }
    }

    // Make email unique (if not already)
    try {
      await pool.query('ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);');
      console.log('✅ Added unique constraint to email');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('⏭️  Email constraint already exists');
      }
    }

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
};

migrateToEmailAuth();
