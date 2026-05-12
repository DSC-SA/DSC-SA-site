const pool = require('../config/database');

const getAllItems = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY category ASC, name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getItemsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const result = await pool.query('SELECT * FROM items WHERE category = $1 ORDER BY name ASC', [category]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadItemImage = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('📤 Upload attempt - Item ID:', id, 'File:', req.file?.originalname);

    if (!req.file) {
      console.log('❌ No file uploaded for item', id);
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📤 Uploading item image to database:', { itemId: id, fileName: req.file.originalname, size: req.file.size, bufferLength: req.file.buffer.length });

    // Use the buffer directly from memory storage
    const imageBuffer = req.file.buffer;
    
    // Store image data in database
    const result = await pool.query(
      'UPDATE items SET image_data = $1 WHERE id = $2 RETURNING id, name, image_data',
      [imageBuffer, id]
    );

    if (result.rows.length === 0) {
      console.log('❌ Item not found:', id);
      return res.status(404).json({ error: 'Item not found' });
    }

    console.log('✅ Item image uploaded to database successfully:', result.rows[0].name);
    res.json({ 
      message: 'Item image uploaded successfully', 
      itemId: id,
      item: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        hasImage: !!result.rows[0].image_data
      }
    });
  } catch (err) {
    console.error('❌ Item upload error:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

const getItemImage = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT image_data FROM items WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const imageData = result.rows[0].image_data;
    if (!imageData) {
      return res.status(404).json({ error: 'No image found for this item' });
    }

    // Set appropriate headers and send binary data
    res.type('image/png');
    res.send(imageData);
  } catch (err) {
    console.error('❌ Error retrieving item image:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllItems, getItemsByCategory, uploadItemImage, getItemImage };
