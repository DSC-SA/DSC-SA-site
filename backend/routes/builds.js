const express = require('express');
const router = express.Router();
const { getBuildsForHero, createUserBuild, getBuildComments, addComment, deleteUserBuild } = require('../controllers/buildsController');
const { verifyToken } = require('../middleware/auth');

router.get('/:heroId', getBuildsForHero);
router.post('/', verifyToken, createUserBuild);
router.delete('/:buildId', verifyToken, deleteUserBuild);
router.get('/:heroId/comments', getBuildComments);
router.post('/comments/:heroId', verifyToken, addComment);

module.exports = router;
