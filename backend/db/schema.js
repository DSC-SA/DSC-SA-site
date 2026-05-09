const pool = require('../config/database');

const createTables = async () => {
  const queries = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE,
      password_hash VARCHAR(255),
      google_id VARCHAR(255),
      verified BOOLEAN DEFAULT FALSE,
      email_verified BOOLEAN DEFAULT FALSE,
      verification_code VARCHAR(6),
      verification_code_expires TIMESTAMP,
      avatar VARCHAR(255),
      rank VARCHAR(50),
      bio TEXT,
      points INT DEFAULT 0,
      auth_method VARCHAR(20) DEFAULT 'email',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Heroes table
    `CREATE TABLE IF NOT EXISTS heroes (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(50) NOT NULL,
      description TEXT,
      difficulty INT,
      icon_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Items table
    `CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category VARCHAR(50) NOT NULL,
      damage_type VARCHAR(50),
      description TEXT,
      icon_url VARCHAR(255),
      image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Recommended builds (official - admin curated, 3 per hero)
    `CREATE TABLE IF NOT EXISTS recommended_builds (
      id SERIAL PRIMARY KEY,
      hero_id INT NOT NULL,
      build_name VARCHAR(100) NOT NULL,
      build_order INT NOT NULL,
      description TEXT,
      synergy_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hero_id) REFERENCES heroes(id) ON DELETE CASCADE
    )`,

    // Build items (junction table for recommended builds)
    `CREATE TABLE IF NOT EXISTS recommended_build_items (
      id SERIAL PRIMARY KEY,
      build_id INT NOT NULL,
      item_id INT NOT NULL,
      item_order INT NOT NULL,
      stage VARCHAR(20),
      FOREIGN KEY (build_id) REFERENCES recommended_builds(id) ON DELETE CASCADE,
      FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
    )`,

    // User builds (community submissions)
    `CREATE TABLE IF NOT EXISTS user_builds (
      id SERIAL PRIMARY KEY,
      hero_id INT NOT NULL,
      user_id INT NOT NULL,
      build_name VARCHAR(100) NOT NULL,
      description TEXT,
      likes INT DEFAULT 0,
      views INT DEFAULT 0,
      status VARCHAR(20) DEFAULT 'approved',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hero_id) REFERENCES heroes(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

    // User build items (junction table for user builds)
    `CREATE TABLE IF NOT EXISTS user_build_items (
      id SERIAL PRIMARY KEY,
      build_id INT NOT NULL,
      item_id INT NOT NULL,
      item_order INT NOT NULL,
      stage VARCHAR(20),
      FOREIGN KEY (build_id) REFERENCES user_builds(id) ON DELETE CASCADE,
      FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
    )`,

    // Build comments
    `CREATE TABLE IF NOT EXISTS build_comments (
      id SERIAL PRIMARY KEY,
      hero_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      likes INT DEFAULT 0,
      parent_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hero_id) REFERENCES heroes(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES build_comments(id) ON DELETE CASCADE
    )`,

    // Events table
    `CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      event_date TIMESTAMP NOT NULL,
      status VARCHAR(20) DEFAULT 'upcoming',
      image TEXT,
      winner_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (winner_id) REFERENCES users(id)
    )`,

    // Event participants
    `CREATE TABLE IF NOT EXISTS event_participants (
      id SERIAL PRIMARY KEY,
      event_id INT NOT NULL,
      user_id INT NOT NULL,
      team_name VARCHAR(100),
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

    // Matches
    `CREATE TABLE IF NOT EXISTS matches (
      id SERIAL PRIMARY KEY,
      event_id INT,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      team1_name VARCHAR(100),
      team2_name VARCHAR(100),
      winner_team VARCHAR(100),
      match_date TIMESTAMP NOT NULL,
      result_details TEXT,
      image TEXT,
      status VARCHAR(20) DEFAULT 'upcoming',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )`
  ];

  for (const query of queries) {
    try {
      await pool.query(query);
      console.log('✓ Table created/verified');
    } catch (err) {
      console.error('Error creating table:', err.message);
    }
  }
};

module.exports = { createTables };
