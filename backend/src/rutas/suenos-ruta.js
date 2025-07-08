const { Router } = require('express');
const { getAllSuenos, getSuenosPublicos, getSuenoById, createSueno, updateSueno, deleteSueno } = require('../controladores/suenos-controlador.js');

const router = Router();

router.get('/', getAllSuenos);
router.get('/publicos', getSuenosPublicos);
router.get('/:sid', getSuenoById);
router.post('/', createSueno);
router.put('/:sid', updateSueno);
router.delete('/:sid', deleteSueno);

module.exports = router;