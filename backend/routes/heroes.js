const express = require('express');
const router = express.Router();
const { getAllHeroes, getHeroById } = require('../controllers/heroesController');

router.get('/', getAllHeroes);
router.get('/:id', getHeroById);

module.exports = router;
