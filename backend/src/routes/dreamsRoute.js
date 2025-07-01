const { Router } = require('express');
const { getAllDreams, getDreamById, getPublicDreams, createDream, updateDream, deleteDream } = require('../controllers/dreamsController.js');

const router = Router();

router.get('/', getAllDreams);
router.get('/public', getPublicDreams);
router.get('/:did', getDreamById);
router.post('/', createDream);
router.put('/:did', updateDream);
router.delete('/:did', deleteDream);

module.exports = router;