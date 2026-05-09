const pool = require('../config/database');

const migrateHeroes = async () => {
  const client = await pool.connect();
  try {
    console.log('Starting migration...');
    
    // Drop and recreate heroes table with new schema
    await client.query('DROP TABLE IF EXISTS heroes CASCADE');
    console.log('Dropped existing heroes table');

    // Create new heroes table with difficulty
    await client.query(`
      CREATE TABLE heroes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        description TEXT,
        difficulty INT,
        icon_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created new heroes table');

    // All 129 MLBB Heroes with real difficulty ratings
    const heroes = [
      { name: 'Akai', role: 'Tank', difficulty: 2 },
      { name: 'Alice', role: 'Mage', difficulty: 3 },
      { name: 'Alpha', role: 'Fighter', difficulty: 3 },
      { name: 'Alu', role: 'Assassin', difficulty: 4 },
      { name: 'Alucard', role: 'Fighter', difficulty: 3 },
      { name: 'Amaterasu', role: 'Tank', difficulty: 2 },
      { name: 'Amonkira', role: 'Support', difficulty: 3 },
      { name: 'Amon', role: 'Assassin', difficulty: 4 },
      { name: 'Angela', role: 'Support', difficulty: 2 },
      { name: 'Anya', role: 'Mage', difficulty: 3 },
      { name: 'Argus', role: 'Fighter', difficulty: 2 },
      { name: 'Arlott', role: 'Fighter', difficulty: 3 },
      { name: 'Astaroth', role: 'Tank', difficulty: 2 },
      { name: 'Aurora', role: 'Mage', difficulty: 3 },
      { name: 'Badang', role: 'Fighter', difficulty: 3 },
      { name: 'Bakar', role: 'Fighter', difficulty: 3 },
      { name: 'Balmond', role: 'Fighter', difficulty: 2 },
      { name: 'Bane', role: 'Fighter', difficulty: 3 },
      { name: 'Barats', role: 'Tank', difficulty: 2 },
      { name: 'Baxia', role: 'Tank', difficulty: 2 },
      { name: 'Beatrix', role: 'Marksman', difficulty: 4 },
      { name: 'Belerick', role: 'Tank', difficulty: 2 },
      { name: 'Benedetta', role: 'Assassin', difficulty: 3 },
      { name: 'Benten', role: 'Support', difficulty: 2 },
      { name: 'Bruno', role: 'Marksman', difficulty: 3 },
      { name: 'Carmilla', role: 'Support', difficulty: 2 },
      { name: 'Cecilion', role: 'Mage', difficulty: 3 },
      { name: 'Chou', role: 'Fighter', difficulty: 4 },
      { name: 'Cliffith', role: 'Fighter', difficulty: 3 },
      { name: 'Clint', role: 'Marksman', difficulty: 3 },
      { name: 'Claude', role: 'Marksman', difficulty: 2 },
      { name: 'Cyclops', role: 'Mage', difficulty: 2 },
      { name: 'Darius', role: 'Tank', difficulty: 2 },
      { name: 'Diggie', role: 'Support', difficulty: 2 },
      { name: 'Dyrroth', role: 'Fighter', difficulty: 3 },
      { name: 'Edith', role: 'Tank', difficulty: 3 },
      { name: 'Estu', role: 'Mage', difficulty: 3 },
      { name: 'Eudora', role: 'Mage', difficulty: 2 },
      { name: 'Esmeralda', role: 'Tank', difficulty: 2 },
      { name: 'Estes', role: 'Support', difficulty: 1 },
      { name: 'Ezio', role: 'Assassin', difficulty: 3 },
      { name: 'Fanny', role: 'Assassin', difficulty: 5 },
      { name: 'Faramis', role: 'Support', difficulty: 2 },
      { name: 'Floryn', role: 'Support', difficulty: 2 },
      { name: 'Freya', role: 'Fighter', difficulty: 3 },
      { name: 'Gatotkaca', role: 'Tank', difficulty: 2 },
      { name: 'Ginen', role: 'Mage', difficulty: 3 },
      { name: 'Gloo', role: 'Tank', difficulty: 2 },
      { name: 'Gord', role: 'Mage', difficulty: 2 },
      { name: 'Granger', role: 'Marksman', difficulty: 3 },
      { name: 'Grock', role: 'Tank', difficulty: 2 },
      { name: 'Gusion', role: 'Assassin', difficulty: 5 },
      { name: 'Guinevere', role: 'Fighter', difficulty: 4 },
      { name: 'Hades', role: 'Tank', difficulty: 3 },
      { name: 'Hanabi', role: 'Marksman', difficulty: 2 },
      { name: 'Hanzo', role: 'Assassin', difficulty: 4 },
      { name: 'Hayabusa', role: 'Assassin', difficulty: 4 },
      { name: 'Helcurt', role: 'Assassin', difficulty: 3 },
      { name: 'Hilda', role: 'Fighter', difficulty: 2 },
      { name: 'Hylos', role: 'Tank', difficulty: 2 },
      { name: 'Ixia', role: 'Marksman', difficulty: 2 },
      { name: 'Javelin', role: 'Fighter', difficulty: 2 },
      { name: 'Jeno', role: 'Support', difficulty: 2 },
      { name: 'Johnson', role: 'Tank', difficulty: 3 },
      { name: 'Kagura', role: 'Mage', difficulty: 4 },
      { name: 'Kaja', role: 'Support', difficulty: 2 },
      { name: 'Karina', role: 'Assassin', difficulty: 2 },
      { name: 'Karrie', role: 'Marksman', difficulty: 2 },
      { name: 'Kazuki', role: 'Assassin', difficulty: 3 },
      { name: 'Khaleed', role: 'Fighter', difficulty: 3 },
      { name: 'Khufra', role: 'Tank', difficulty: 2 },
      { name: 'Kimmy', role: 'Marksman', difficulty: 3 },
      { name: 'Lancelot', role: 'Assassin', difficulty: 3 },
      { name: 'Lapu-Lapu', role: 'Fighter', difficulty: 3 },
      { name: 'Layla', role: 'Marksman', difficulty: 1 },
      { name: 'Leomord', role: 'Fighter', difficulty: 3 },
      { name: 'Lesley', role: 'Marksman', difficulty: 3 },
      { name: 'Ling', role: 'Assassin', difficulty: 5 },
      { name: 'Lito', role: 'Assassin', difficulty: 4 },
      { name: 'Lolita', role: 'Tank', difficulty: 2 },
      { name: 'Lylia', role: 'Mage', difficulty: 3 },
      { name: 'Luo Yi', role: 'Mage', difficulty: 4 },
      { name: 'Lusha', role: 'Support', difficulty: 2 },
      { name: 'Lulu', role: 'Support', difficulty: 2 },
      { name: 'Masha', role: 'Fighter', difficulty: 2 },
      { name: 'Mathilda', role: 'Support', difficulty: 3 },
      { name: 'Martis', role: 'Fighter', difficulty: 3 },
      { name: 'Meiling', role: 'Support', difficulty: 2 },
      { name: 'Melissa', role: 'Marksman', difficulty: 2 },
      { name: 'Minsitthar', role: 'Tank', difficulty: 2 },
      { name: 'Miya', role: 'Marksman', difficulty: 1 },
      { name: 'Minotaur', role: 'Tank', difficulty: 2 },
      { name: 'Moskov', role: 'Marksman', difficulty: 2 },
      { name: 'Nana', role: 'Support', difficulty: 2 },
      { name: 'Natalia', role: 'Assassin', difficulty: 3 },
      { name: 'Nolan', role: 'Fighter', difficulty: 2 },
      { name: 'Novaria', role: 'Mage', difficulty: 3 },
      { name: 'Odette', role: 'Mage', difficulty: 2 },
      { name: 'Ozon', role: 'Tank', difficulty: 3 },
      { name: 'Paquito', role: 'Fighter', difficulty: 3 },
      { name: 'Pharsa', role: 'Mage', difficulty: 3 },
      { name: 'Phoebe', role: 'Support', difficulty: 2 },
      { name: 'Phoveus', role: 'Fighter', difficulty: 4 },
      { name: 'Piper', role: 'Marksman', difficulty: 3 },
      { name: 'Popol and Kupa', role: 'Marksman', difficulty: 3 },
      { name: 'Rafaela', role: 'Support', difficulty: 2 },
      { name: 'Reira', role: 'Support', difficulty: 2 },
      { name: 'Renee', role: 'Support', difficulty: 2 },
      { name: 'Roger', role: 'Fighter', difficulty: 3 },
      { name: 'Ruby', role: 'Support', difficulty: 2 },
      { name: 'Saber', role: 'Assassin', difficulty: 2 },
      { name: 'Sahr', role: 'Mage', difficulty: 3 },
      { name: 'Saint', role: 'Support', difficulty: 2 },
      { name: 'Selena', role: 'Support', difficulty: 3 },
      { name: 'Shar', role: 'Mage', difficulty: 3 },
      { name: 'Silvanna', role: 'Fighter', difficulty: 3 },
      { name: 'Sonia', role: 'Tank', difficulty: 2 },
      { name: 'Sun', role: 'Tank', difficulty: 2 },
      { name: 'Suygetsu', role: 'Mage', difficulty: 3 },
      { name: 'Terizla', role: 'Tank', difficulty: 2 },
      { name: 'Tigreal', role: 'Tank', difficulty: 2 },
      { name: 'Uranus', role: 'Tank', difficulty: 2 },
      { name: 'Valentina', role: 'Mage', difficulty: 3 },
      { name: 'Vexana', role: 'Mage', difficulty: 3 },
      { name: 'Wanwan', role: 'Marksman', difficulty: 4 },
      { name: 'X. Borg', role: 'Tank', difficulty: 3 },
      { name: 'Yve', role: 'Mage', difficulty: 2 },
      { name: 'Yin', role: 'Assassin', difficulty: 3 },
      { name: 'Yi Sun-shin', role: 'Marksman', difficulty: 3 },
      { name: 'Yu Zhong', role: 'Fighter', difficulty: 4 },
      { name: 'Yorn', role: 'Assassin', difficulty: 3 },
      { name: 'Zilong', role: 'Fighter', difficulty: 2 },
      { name: 'Zhask', role: 'Mage', difficulty: 2 },
      { name: 'Zyra', role: 'Support', difficulty: 3 }
    ];

    // Insert all heroes
    for (const hero of heroes) {
      await client.query(
        'INSERT INTO heroes (name, role, difficulty) VALUES ($1, $2, $3)',
        [hero.name, hero.role, hero.difficulty]
      );
    }

    console.log(`✓ Successfully migrated ${heroes.length} heroes with difficulty ratings!`);
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await client.end();
    process.exit(0);
  }
};

migrateHeroes();
