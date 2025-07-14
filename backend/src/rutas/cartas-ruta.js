const { Router } = require('express');
const { getAllCartas, getCartaById, createCarta, updateCarta, deleteCarta } = require('../controladores/cartas-controlador.js');

const router = Router();

router.get('/', getAllCartas);
router.get('/:cid', getCartaById);
router.post('/', createCarta);
router.put('/:cid', updateCarta);
router.delete('/:cid', deleteCarta)

module.exports = router;