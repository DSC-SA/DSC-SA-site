const pool = require('../config/database');

const seedHeroes2026 = async () => {
  const client = await pool.connect();
  try {
    console.log('Connecting to database...');
    
    // All 129 MLBB Heroes from 2026
    const heroes = [
      { name: 'Aamon', role: 'Assassin' },
      { name: 'Akai', role: 'Tank' },
      { name: 'Aldous', role: 'Fighter' },
      { name: 'Alice', role: 'Tank' },
      { name: 'Alpha', role: 'Fighter' },
      { name: 'Alucard', role: 'Fighter' },
      { name: 'Angela', role: 'Support' },
      { name: 'Argus', role: 'Fighter' },
      { name: 'Arlott', role: 'Fighter' },
      { name: 'Atlas', role: 'Tank' },
      { name: 'Aulus', role: 'Fighter' },
      { name: 'Aurora', role: 'Mage' },
      { name: 'Badang', role: 'Fighter' },
      { name: 'Balmond', role: 'Fighter' },
      { name: 'Bane', role: 'Fighter' },
      { name: 'Barats', role: 'Tank' },
      { name: 'Baxia', role: 'Tank' },
      { name: 'Beatrix', role: 'Marksman' },
      { name: 'Belerick', role: 'Tank' },
      { name: 'Benedetta', role: 'Assassin' },
      { name: 'Brody', role: 'Marksman' },
      { name: 'Bruno', role: 'Marksman' },
      { name: 'Carmilla', role: 'Support' },
      { name: 'Cecilion', role: 'Mage' },
      { name: "Chang'e", role: 'Mage' },
      { name: 'Chip', role: 'Support' },
      { name: 'Chou', role: 'Fighter' },
      { name: 'Cici', role: 'Fighter' },
      { name: 'Claude', role: 'Marksman' },
      { name: 'Clint', role: 'Marksman' },
      { name: 'Cyclops', role: 'Mage' },
      { name: 'Diggie', role: 'Support' },
      { name: 'Dyrroth', role: 'Fighter' },
      { name: 'Edith', role: 'Tank' },
      { name: 'Esmeralda', role: 'Tank' },
      { name: 'Estes', role: 'Support' },
      { name: 'Eudora', role: 'Mage' },
      { name: 'Fanny', role: 'Assassin' },
      { name: 'Faramis', role: 'Support' },
      { name: 'Floryn', role: 'Support' },
      { name: 'Franco', role: 'Tank' },
      { name: 'Fredrinn', role: 'Fighter' },
      { name: 'Freya', role: 'Fighter' },
      { name: 'Gatotkaca', role: 'Tank' },
      { name: 'Gloo', role: 'Tank' },
      { name: 'Gord', role: 'Mage' },
      { name: 'Granger', role: 'Marksman' },
      { name: 'Grock', role: 'Tank' },
      { name: 'Guinevere', role: 'Fighter' },
      { name: 'Gusion', role: 'Assassin' },
      { name: 'Hanabi', role: 'Marksman' },
      { name: 'Hanzo', role: 'Assassin' },
      { name: 'Harith', role: 'Mage' },
      { name: 'Harley', role: 'Assassin' },
      { name: 'Hayabusa', role: 'Assassin' },
      { name: 'Helcurt', role: 'Assassin' },
      { name: 'Hilda', role: 'Fighter' },
      { name: 'Hylos', role: 'Tank' },
      { name: 'Irithel', role: 'Marksman' },
      { name: 'Ixia', role: 'Marksman' },
      { name: 'Jawhead', role: 'Fighter' },
      { name: 'Johnson', role: 'Tank' },
      { name: 'Joy', role: 'Assassin' },
      { name: 'Julian', role: 'Assassin' },
      { name: 'Kadita', role: 'Mage' },
      { name: 'Kagura', role: 'Mage' },
      { name: 'Kaja', role: 'Support' },
      { name: 'Kalea', role: 'Support' },
      { name: 'Karina', role: 'Assassin' },
      { name: 'Karrie', role: 'Marksman' },
      { name: 'Khaleed', role: 'Fighter' },
      { name: 'Khufra', role: 'Tank' },
      { name: 'Kimmy', role: 'Marksman' },
      { name: 'Lancelot', role: 'Assassin' },
      { name: 'Lapu-Lapu', role: 'Fighter' },
      { name: 'Layla', role: 'Marksman' },
      { name: 'Leomord', role: 'Fighter' },
      { name: 'Lesley', role: 'Marksman' },
      { name: 'Ling', role: 'Assassin' },
      { name: 'Lolita', role: 'Support' },
      { name: 'Lukas', role: 'Fighter' },
      { name: 'Lunox', role: 'Mage' },
      { name: 'Luo Yi', role: 'Mage' },
      { name: 'Lylia', role: 'Mage' },
      { name: 'Marcel', role: 'Support' },
      { name: 'Martis', role: 'Fighter' },
      { name: 'Masha', role: 'Fighter' },
      { name: 'Mathilda', role: 'Support' },
      { name: 'Melissa', role: 'Marksman' },
      { name: 'Minotaur', role: 'Tank' },
      { name: 'Minsitthar', role: 'Fighter' },
      { name: 'Miya', role: 'Marksman' },
      { name: 'Moskov', role: 'Marksman' },
      { name: 'Nana', role: 'Mage' },
      { name: 'Natalia', role: 'Assassin' },
      { name: 'Natan', role: 'Marksman' },
      { name: 'Nolan', role: 'Assassin' },
      { name: 'Novaria', role: 'Mage' },
      { name: 'Obsidia', role: 'Marksman' },
      { name: 'Odette', role: 'Mage' },
      { name: 'Paquito', role: 'Fighter' },
      { name: 'Pharsa', role: 'Mage' },
      { name: 'Phoveus', role: 'Fighter' },
      { name: 'Popol and Kupa', role: 'Marksman' },
      { name: 'Rafaela', role: 'Support' },
      { name: 'Roger', role: 'Fighter' },
      { name: 'Ruby', role: 'Fighter' },
      { name: 'Saber', role: 'Assassin' },
      { name: 'Selena', role: 'Assassin' },
      { name: 'Silvanna', role: 'Fighter' },
      { name: 'Sora', role: 'Fighter' },
      { name: 'Sun', role: 'Fighter' },
      { name: 'Terizla', role: 'Fighter' },
      { name: 'Tigreal', role: 'Tank' },
      { name: 'Uranus', role: 'Tank' },
      { name: 'Vale', role: 'Mage' },
      { name: 'Valentina', role: 'Mage' },
      { name: 'Valir', role: 'Mage' },
      { name: 'Vexana', role: 'Mage' },
      { name: 'Wanwan', role: 'Marksman' },
      { name: 'X.Borg', role: 'Fighter' },
      { name: 'Xavier', role: 'Mage' },
      { name: 'Yi Sun-shin', role: 'Marksman' },
      { name: 'Yin', role: 'Fighter' },
      { name: 'Yu Zhong', role: 'Fighter' },
      { name: 'Yve', role: 'Mage' },
      { name: 'Zhask', role: 'Mage' },
      { name: 'Zhuxin', role: 'Mage' },
      { name: 'Zilong', role: 'Fighter' }
    ];

    console.log('Clearing existing heroes...');
    await client.query('TRUNCATE TABLE heroes CASCADE');
    
    console.log('Inserting 129 heroes...');
    for (const hero of heroes) {
      await client.query(
        `INSERT INTO heroes (name, role, description, attack, defense, hp) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          hero.name,
          hero.role,
          `${hero.role} hero`,
          6 + Math.floor(Math.random() * 5),
          5 + Math.floor(Math.random() * 5),
          7 + Math.floor(Math.random() * 3)
        ]
      );
    }

    console.log('✓ Successfully seeded all 129 heroes!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
};

seedHeroes2026();
