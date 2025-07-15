const { Router } = require('express');
const { getAllEmociones, getEmocionById, createEmocion, updateEmocion, deleteEmocion } = require('../controladores/emociones-controlador.js');

const router = Router();

router.get('/', getAllEmociones);
router.get('/:eid', getEmocionById);
router.post('/', createEmocion);
router.put('/:eid', updateEmocion);
router.delete('/:eid', deleteEmocion);

module.exports = router;