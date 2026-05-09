const pool = require('../config/database');

const seedRealHeroes = async () => {
  const client = await pool.connect();
  try {
    console.log('Starting cleanup - removing fake heroes...');
    
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

    // REAL 129 MLBB Heroes only (from 2026 official list)
    const heroes = [
      { name: 'Aamon', role: 'Assassin', difficulty: 3, icon_url: 'https://cdn.dribbble.com/userupload/6866139/file/still-03c0e8983f352c6bc8bb1196596eb022.png?resize=1600x1200' },
      { name: 'Akai', role: 'Tank', difficulty: 2 },
      { name: 'Aldous', role: 'Fighter', difficulty: 3 },
      { name: 'Alice', role: 'Mage', difficulty: 3 },
      { name: 'Alpha', role: 'Fighter', difficulty: 3 },
      { name: 'Alucard', role: 'Fighter', difficulty: 3 },
      { name: 'Angela', role: 'Support', difficulty: 2 },
      { name: 'Argus', role: 'Fighter', difficulty: 2 },
      { name: 'Arlott', role: 'Fighter', difficulty: 3 },
      { name: 'Atlas', role: 'Tank', difficulty: 3 },
      { name: 'Aulus', role: 'Fighter', difficulty: 3 },
      { name: 'Aurora', role: 'Mage', difficulty: 3 },
      { name: 'Badang', role: 'Fighter', difficulty: 3 },
      { name: 'Balmond', role: 'Fighter', difficulty: 2 },
      { name: 'Bane', role: 'Fighter', difficulty: 3 },
      { name: 'Barats', role: 'Tank', difficulty: 2 },
      { name: 'Baxia', role: 'Tank', difficulty: 2 },
      { name: 'Beatrix', role: 'Marksman', difficulty: 4 },
      { name: 'Belerick', role: 'Tank', difficulty: 2 },
      { name: 'Benedetta', role: 'Assassin', difficulty: 3 },
      { name: 'Brody', role: 'Marksman', difficulty: 3 },
      { name: 'Bruno', role: 'Marksman', difficulty: 3 },
      { name: 'Carmilla', role: 'Support', difficulty: 2 },
      { name: 'Cecilion', role: 'Mage', difficulty: 3 },
      { name: "Chang'e", role: 'Mage', difficulty: 2 },
      { name: 'Chip', role: 'Support', difficulty: 2 },
      { name: 'Chou', role: 'Fighter', difficulty: 4 },
      { name: 'Cici', role: 'Fighter', difficulty: 2 },
      { name: 'Claude', role: 'Marksman', difficulty: 2 },
      { name: 'Clint', role: 'Marksman', difficulty: 3 },
      { name: 'Cyclops', role: 'Mage', difficulty: 2 },
      { name: 'Diggie', role: 'Support', difficulty: 2 },
      { name: 'Dyrroth', role: 'Fighter', difficulty: 3 },
      { name: 'Edith', role: 'Tank', difficulty: 3 },
      { name: 'Esmeralda', role: 'Tank', difficulty: 2 },
      { name: 'Estes', role: 'Support', difficulty: 1 },
      { name: 'Eudora', role: 'Mage', difficulty: 2 },
      { name: 'Fanny', role: 'Assassin', difficulty: 5 },
      { name: 'Faramis', role: 'Support', difficulty: 2 },
      { name: 'Floryn', role: 'Support', difficulty: 2 },
      { name: 'Franco', role: 'Tank', difficulty: 2 },
      { name: 'Fredrinn', role: 'Fighter', difficulty: 3 },
      { name: 'Freya', role: 'Fighter', difficulty: 3 },
      { name: 'Gatotkaca', role: 'Tank', difficulty: 2 },
      { name: 'Gloo', role: 'Tank', difficulty: 2 },
      { name: 'Gord', role: 'Mage', difficulty: 2 },
      { name: 'Granger', role: 'Marksman', difficulty: 3 },
      { name: 'Grock', role: 'Tank', difficulty: 2 },
      { name: 'Guinevere', role: 'Fighter', difficulty: 4 },
      { name: 'Gusion', role: 'Assassin', difficulty: 5 },
      { name: 'Hanabi', role: 'Marksman', difficulty: 2 },
      { name: 'Hanzo', role: 'Assassin', difficulty: 4 },
      { name: 'Harith', role: 'Mage', difficulty: 3 },
      { name: 'Harley', role: 'Assassin', difficulty: 3 },
      { name: 'Hayabusa', role: 'Assassin', difficulty: 4 },
      { name: 'Helcurt', role: 'Assassin', difficulty: 3 },
      { name: 'Hilda', role: 'Fighter', difficulty: 2 },
      { name: 'Hylos', role: 'Tank', difficulty: 2 },
      { name: 'Irithel', role: 'Marksman', difficulty: 2 },
      { name: 'Ixia', role: 'Marksman', difficulty: 2 },
      { name: 'Jawhead', role: 'Fighter', difficulty: 3 },
      { name: 'Johnson', role: 'Tank', difficulty: 3 },
      { name: 'Joy', role: 'Assassin', difficulty: 3 },
      { name: 'Julian', role: 'Assassin', difficulty: 4 },
      { name: 'Kadita', role: 'Mage', difficulty: 3 },
      { name: 'Kagura', role: 'Mage', difficulty: 4 },
      { name: 'Kaja', role: 'Support', difficulty: 2 },
      { name: 'Kalea', role: 'Support', difficulty: 3 },
      { name: 'Karina', role: 'Assassin', difficulty: 2 },
      { name: 'Karrie', role: 'Marksman', difficulty: 2 },
      { name: 'Khaleed', role: 'Fighter', difficulty: 3 },
      { name: 'Khufra', role: 'Tank', difficulty: 2 },
      { name: 'Kimmy', role: 'Marksman', difficulty: 3 },
      { name: 'Lancelot', role: 'Assassin', difficulty: 3 },
      { name: 'Lapu-Lapu', role: 'Fighter', difficulty: 3 },
      { name: 'Layla', role: 'Marksman', difficulty: 1 },
      { name: 'Leomord', role: 'Fighter', difficulty: 3 },
      { name: 'Lesley', role: 'Marksman', difficulty: 3 },
      { name: 'Ling', role: 'Assassin', difficulty: 5 },
      { name: 'Lolita', role: 'Support', difficulty: 2 },
      { name: 'Lukas', role: 'Fighter', difficulty: 2 },
      { name: 'Lunox', role: 'Mage', difficulty: 3 },
      { name: 'Luo Yi', role: 'Mage', difficulty: 4 },
      { name: 'Lylia', role: 'Mage', difficulty: 3 },
      { name: 'Marcel', role: 'Support', difficulty: 2 },
      { name: 'Martis', role: 'Fighter', difficulty: 3 },
      { name: 'Masha', role: 'Fighter', difficulty: 2 },
      { name: 'Mathilda', role: 'Support', difficulty: 3 },
      { name: 'Melissa', role: 'Marksman', difficulty: 2 },
      { name: 'Minotaur', role: 'Tank', difficulty: 2 },
      { name: 'Minsitthar', role: 'Fighter', difficulty: 2 },
      { name: 'Miya', role: 'Marksman', difficulty: 1 },
      { name: 'Moskov', role: 'Marksman', difficulty: 2 },
      { name: 'Nana', role: 'Mage', difficulty: 2 },
      { name: 'Natalia', role: 'Assassin', difficulty: 3 },
      { name: 'Natan', role: 'Marksman', difficulty: 2 },
      { name: 'Nolan', role: 'Assassin', difficulty: 2 },
      { name: 'Novaria', role: 'Mage', difficulty: 3 },
      { name: 'Obsidia', role: 'Marksman', difficulty: 2 },
      { name: 'Odette', role: 'Mage', difficulty: 2 },
      { name: 'Paquito', role: 'Fighter', difficulty: 3 },
      { name: 'Pharsa', role: 'Mage', difficulty: 3 },
      { name: 'Phoveus', role: 'Fighter', difficulty: 4 },
      { name: 'Popol and Kupa', role: 'Marksman', difficulty: 3 },
      { name: 'Rafaela', role: 'Support', difficulty: 2 },
      { name: 'Roger', role: 'Fighter', difficulty: 3 },
      { name: 'Ruby', role: 'Support', difficulty: 2 },
      { name: 'Saber', role: 'Assassin', difficulty: 2 },
      { name: 'Selena', role: 'Support', difficulty: 3 },
      { name: 'Silvanna', role: 'Fighter', difficulty: 3 },
      { name: 'Sora', role: 'Assassin', difficulty: 4 },
      { name: 'Sun', role: 'Fighter', difficulty: 2 },
      { name: 'Terizla', role: 'Fighter', difficulty: 2 },
      { name: 'Tigreal', role: 'Tank', difficulty: 2 },
      { name: 'Uranus', role: 'Tank', difficulty: 2 },
      { name: 'Vale', role: 'Mage', difficulty: 3 },
      { name: 'Valentina', role: 'Mage', difficulty: 3 },
      { name: 'Valir', role: 'Mage', difficulty: 2 },
      { name: 'Vexana', role: 'Mage', difficulty: 3 },
      { name: 'Wanwan', role: 'Marksman', difficulty: 4 },
      { name: 'X.Borg', role: 'Fighter', difficulty: 3 },
      { name: 'Xavier', role: 'Mage', difficulty: 3 },
      { name: 'Yi Sun-shin', role: 'Marksman', difficulty: 3 },
      { name: 'Yin', role: 'Assassin', difficulty: 3 },
      { name: 'Yu Zhong', role: 'Fighter', difficulty: 4 },
      { name: 'Yve', role: 'Mage', difficulty: 2 },
      { name: 'Zhask', role: 'Mage', difficulty: 2 },
      { name: 'Zhuxin', role: 'Mage', difficulty: 3 },
      { name: 'Zilong', role: 'Fighter', difficulty: 2 }
    ];

    // Insert all real heroes
    for (const hero of heroes) {
      await client.query(
        'INSERT INTO heroes (name, role, difficulty, icon_url) VALUES ($1, $2, $3, $4)',
        [hero.name, hero.role, hero.difficulty, hero.icon_url || null]
      );
    }

    console.log(`✓ Successfully seeded ${heroes.length} REAL heroes with correct difficulty ratings!`);
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await client.end();
    process.exit(0);
  }
};

seedRealHeroes();
