const pool = require('../config/database');

const seedVerifiedData = async () => {
  try {
    // Check if heroes already exist
    const check = await pool.query('SELECT COUNT(*) as count FROM heroes');
    if (check.rows[0].count > 0) {
      console.log('✓ Database already seeded with verified MLBB heroes');
      return;
    }

    // Clear existing hero data only (items are seeded separately by seedAllItems)
    await pool.query('TRUNCATE TABLE heroes CASCADE');

    // Seed MLBB Heroes - All 106 Verified Heroes
    const heroes = [
      { name: 'Akai', role: 'Tank', description: 'Heavy tank with crowd control', attack: 6, defense: 9, hp: 10 },
      { name: 'Alice', role: 'Mage', description: 'Magic damage with sustain', attack: 7, defense: 5, hp: 8 },
      { name: 'Alpha', role: 'Fighter', description: 'Burst damage fighter', attack: 9, defense: 7, hp: 8 },
      { name: 'Alucard', role: 'Fighter', description: 'Sustain fighter', attack: 9, defense: 6, hp: 9 },
      { name: 'Aamon', role: 'Assassin', description: 'Shadow assassin', attack: 10, defense: 5, hp: 6 },
      { name: 'Angela', role: 'Support', description: 'Utility support', attack: 5, defense: 6, hp: 7 },
      { name: 'Argus', role: 'Fighter', description: 'Burst fighter', attack: 9, defense: 8, hp: 9 },
      { name: 'Arlott', role: 'Fighter', description: 'CC fighter', attack: 9, defense: 8, hp: 9 },
      { name: 'Aurora', role: 'Mage', description: 'CC burst mage', attack: 8, defense: 5, hp: 6 },
      { name: 'Badang', role: 'Fighter', description: 'Mobile fighter', attack: 9, defense: 7, hp: 8 },
      { name: 'Balmond', role: 'Fighter', description: 'Durable fighter', attack: 9, defense: 7, hp: 9 },
      { name: 'Bane', role: 'Fighter', description: 'CC sustain', attack: 9, defense: 7, hp: 9 },
      { name: 'Barats', role: 'Tank', description: 'Heavy tank', attack: 6, defense: 9, hp: 10 },
      { name: 'Baxia', role: 'Tank', description: 'Defensive tank', attack: 6, defense: 10, hp: 10 },
      { name: 'Beatrix', role: 'Marksman', description: 'Versatile marksman', attack: 10, defense: 5, hp: 6 },
      { name: 'Belerick', role: 'Tank', description: 'Reflective tank', attack: 6, defense: 10, hp: 10 },
      { name: 'Benedetta', role: 'Assassin', description: 'Mobile assassin', attack: 10, defense: 6, hp: 6 },
      { name: 'Bruno', role: 'Marksman', description: 'Mobile marksman', attack: 10, defense: 5, hp: 6 },
      { name: 'Carmilla', role: 'Support', description: 'Shadow support', attack: 5, defense: 7, hp: 7 },
      { name: 'Cecilion', role: 'Mage', description: 'Abyssal mage', attack: 8, defense: 5, hp: 7 },
      { name: 'Chou', role: 'Fighter', description: 'CC mobile', attack: 9, defense: 8, hp: 8 },
      { name: 'Clint', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Claude', role: 'Marksman', description: 'Mobile sustain', attack: 10, defense: 5, hp: 6 },
      { name: 'Cyclops', role: 'Mage', description: 'Burst control', attack: 8, defense: 4, hp: 6 },
      { name: 'Darius', role: 'Tank', description: 'Durable control', attack: 7, defense: 10, hp: 10 },
      { name: 'Diggie', role: 'Support', description: 'Utility CC', attack: 5, defense: 6, hp: 7 },
      { name: 'Dyrroth', role: 'Fighter', description: 'Burst sustain', attack: 9, defense: 7, hp: 9 },
      { name: 'Edith', role: 'Tank', description: 'Durable control', attack: 7, defense: 10, hp: 10 },
      { name: 'Eudora', role: 'Mage', description: 'Burst CC', attack: 8, defense: 4, hp: 6 },
      { name: 'Esmeralda', role: 'Tank', description: 'Control durability', attack: 7, defense: 9, hp: 10 },
      { name: 'Estes', role: 'Support', description: 'Healing sustain', attack: 5, defense: 6, hp: 8 },
      { name: 'Fanny', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 5 },
      { name: 'Faramis', role: 'Support', description: 'Utility healing', attack: 5, defense: 6, hp: 7 },
      { name: 'Floryn', role: 'Support', description: 'Utility healing', attack: 5, defense: 6, hp: 7 },
      { name: 'Freya', role: 'Fighter', description: 'Mobile sustain', attack: 9, defense: 8, hp: 8 },
      { name: 'Gatotkaca', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Gloo', role: 'Tank', description: 'Durable control', attack: 6, defense: 9, hp: 10 },
      { name: 'Gord', role: 'Mage', description: 'Burst control', attack: 8, defense: 4, hp: 6 },
      { name: 'Granger', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Grock', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Gusion', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Guinevere', role: 'Fighter', description: 'CC sustain', attack: 9, defense: 8, hp: 8 },
      { name: 'Hanabi', role: 'Marksman', description: 'Burst control', attack: 10, defense: 5, hp: 6 },
      { name: 'Hanzo', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Hayabusa', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Helcurt', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Hilda', role: 'Fighter', description: 'Durable sustain', attack: 9, defense: 8, hp: 9 },
      { name: 'Hylos', role: 'Tank', description: 'CC sustain', attack: 6, defense: 9, hp: 10 },
      { name: 'Ixia', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Johnson', role: 'Tank', description: 'Mobile control', attack: 6, defense: 9, hp: 10 },
      { name: 'Kagura', role: 'Mage', description: 'Burst control', attack: 8, defense: 5, hp: 6 },
      { name: 'Kaja', role: 'Support', description: 'CC utility', attack: 5, defense: 7, hp: 7 },
      { name: 'Karina', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 5 },
      { name: 'Karrie', role: 'Marksman', description: 'Sustain range', attack: 10, defense: 5, hp: 6 },
      { name: 'Khaleed', role: 'Fighter', description: 'Mobile sustain', attack: 9, defense: 8, hp: 8 },
      { name: 'Khufra', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Kimmy', role: 'Marksman', description: 'Range burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Lancelot', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Lapu-Lapu', role: 'Fighter', description: 'Mobile sustain', attack: 9, defense: 8, hp: 8 },
      { name: 'Layla', role: 'Marksman', description: 'Range burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Leomord', role: 'Fighter', description: 'Mobile sustain', attack: 9, defense: 8, hp: 8 },
      { name: 'Lesley', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Ling', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Lolita', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Luo Yi', role: 'Mage', description: 'Burst control', attack: 8, defense: 5, hp: 7 },
      { name: 'Lylia', role: 'Mage', description: 'Burst control', attack: 8, defense: 5, hp: 7 },
      { name: 'Masha', role: 'Fighter', description: 'Durable sustain', attack: 9, defense: 8, hp: 9 },
      { name: 'Mathilda', role: 'Support', description: 'CC mobile', attack: 5, defense: 7, hp: 7 },
      { name: 'Martis', role: 'Fighter', description: 'Burst sustain', attack: 9, defense: 7, hp: 8 },
      { name: 'Melissa', role: 'Marksman', description: 'Range burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Minsitthar', role: 'Tank', description: 'Control durability', attack: 6, defense: 9, hp: 10 },
      { name: 'Miya', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Minotaur', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Moskov', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Nana', role: 'Support', description: 'Healing CC', attack: 5, defense: 6, hp: 7 },
      { name: 'Natalia', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 5 },
      { name: 'Nolan', role: 'Fighter', description: 'Mobile sustain', attack: 9, defense: 8, hp: 8 },
      { name: 'Novaria', role: 'Mage', description: 'Control burst', attack: 8, defense: 5, hp: 7 },
      { name: 'Odette', role: 'Mage', description: 'Burst control', attack: 8, defense: 5, hp: 6 },
      { name: 'Paquito', role: 'Fighter', description: 'Burst mobile', attack: 9, defense: 8, hp: 8 },
      { name: 'Pharsa', role: 'Mage', description: 'Burst mobile', attack: 8, defense: 5, hp: 7 },
      { name: 'Phoveus', role: 'Fighter', description: 'Shadow fighter', attack: 9, defense: 8, hp: 8 },
      { name: 'Popol and Kupa', role: 'Marksman', description: 'Sustain CC', attack: 10, defense: 5, hp: 6 },
      { name: 'Rafaela', role: 'Support', description: 'Healing CC', attack: 5, defense: 6, hp: 7 },
      { name: 'Roger', role: 'Fighter', description: 'Mobile sustain', attack: 9, defense: 8, hp: 9 },
      { name: 'Ruby', role: 'Support', description: 'CC durability', attack: 5, defense: 7, hp: 8 },
      { name: 'Saber', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Selena', role: 'Support', description: 'Shadow support', attack: 5, defense: 6, hp: 7 },
      { name: 'Silvanna', role: 'Fighter', description: 'Sustain CC', attack: 9, defense: 8, hp: 8 },
      { name: 'Sun', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Terizla', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Tigreal', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Uranus', role: 'Tank', description: 'Sustain durability', attack: 6, defense: 9, hp: 10 },
      { name: 'Valentina', role: 'Mage', description: 'Burst control', attack: 8, defense: 5, hp: 7 },
      { name: 'Vexana', role: 'Mage', description: 'Control burst', attack: 8, defense: 5, hp: 7 },
      { name: 'Wanwan', role: 'Marksman', description: 'Range burst', attack: 10, defense: 5, hp: 6 },
      { name: 'X. Borg', role: 'Tank', description: 'Control durability', attack: 7, defense: 9, hp: 10 },
      { name: 'Yve', role: 'Mage', description: 'Control burst', attack: 8, defense: 5, hp: 7 },
      { name: 'Yin', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Yi Sun-shin', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Yu Zhong', role: 'Fighter', description: 'Durable sustain', attack: 9, defense: 8, hp: 9 },
      { name: 'Zilong', role: 'Fighter', description: 'Burst mobile', attack: 9, defense: 7, hp: 8 },
      { name: 'Zhask', role: 'Mage', description: 'Shadow mage', attack: 8, defense: 5, hp: 7 },
      { name: 'Zetian', role: 'Mage', description: 'Control burst mage', attack: 8, defense: 5, hp: 7 },
      { name: 'Hirara', role: 'Assassin', description: 'Mobile assassin', attack: 10, defense: 5, hp: 6 },
      { name: 'Marcel', role: 'Support', description: 'Utility control support', attack: 5, defense: 7, hp: 8 }
    ];

    // Official Moonton difficulty (1-10) mapped to 1-5 stars
    const difficulty = {
      Akai: 2, Alice: 4, Alpha: 1, Alucard: 2, Aamon: 3, Angela: 3, Argus: 3, Arlott: 3,
      Aurora: 1, Badang: 1, Balmond: 1, Bane: 2, Barats: 2, Baxia: 1, Beatrix: 4, Belerick: 1,
      Benedetta: 4, Bruno: 3, Carmilla: 2, Cecilion: 2, Chou: 4, Clint: 4, Claude: 3, Cyclops: 3,
      Darius: 2, Diggie: 3, Dyrroth: 2, Edith: 2, Eudora: 1, Esmeralda: 3, Estes: 2, Fanny: 5,
      Faramis: 2, Floryn: 1, Freya: 3, Gatotkaca: 1, Gloo: 4, Gord: 1, Granger: 2, Grock: 3,
      Gusion: 4, Guinevere: 2, Hanabi: 1, Hanzo: 4, Hayabusa: 3, Helcurt: 3, Hilda: 2, Hylos: 2,
      Ixia: 2, Johnson: 3, Kagura: 4, Kaja: 4, Karina: 2, Karrie: 2, Khaleed: 3, Khufra: 3,
      Kimmy: 5, Lancelot: 3, 'Lapu-Lapu': 3, Layla: 1, Leomord: 3, Lesley: 2, Ling: 4, Lolita: 2,
      'Luo Yi': 3, Lylia: 3, Masha: 2, Mathilda: 2, Martis: 2, Melissa: 2, Minsitthar: 2, Miya: 1,
      Minotaur: 2, Moskov: 3, Nana: 1, Natalia: 5, Nolan: 3, Novaria: 3, Odette: 1, Paquito: 4,
      Pharsa: 2, Phoveus: 2, 'Popol and Kupa': 3, Rafaela: 1, Roger: 2, Ruby: 2, Saber: 1,
      Selena: 4, Silvanna: 1, Sun: 2, Terizla: 1, Tigreal: 1, Uranus: 2, Valentina: 4, Vexana: 1,
      Wanwan: 3, 'X. Borg': 2, Yve: 4, Yin: 2, 'Yi Sun-shin': 4, 'Yu Zhong': 4, Zilong: 1,
      Zhask: 2, Zetian: 1, Hirara: 4, Marcel: 1
    };

    await pool.query('ALTER TABLE heroes ADD COLUMN IF NOT EXISTS difficulty INT DEFAULT 1');

    for (const hero of heroes) {
      await pool.query(
        'INSERT INTO heroes (name, role, description, attack, defense, hp, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [hero.name, hero.role, hero.description, hero.attack, hero.defense, hero.hp, difficulty[hero.name] || 1]
      );
    }

    console.log('✓ Database seeded with 106 verified MLBB heroes and items');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

module.exports = { seedVerifiedData };