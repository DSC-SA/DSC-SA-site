const express = require('express');
const router = express.Router();
const { getAllHeroes, getHeroById, getHeroImage } = require('../controllers/heroesController');

router.get('/', getAllHeroes);
router.get('/:id/image', getHeroImage);
router.get('/:id', getHeroById);

module.exports = router;
