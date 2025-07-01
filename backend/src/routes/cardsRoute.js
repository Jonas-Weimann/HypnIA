const { Router } = require('express');
const { getAllCards, getCardById, createCard, updateCard, deleteCard } = require('../controllers/cardsController.js');

const router = Router();

router.get('/', getAllCards);
router.get('/:cid', getCardById);
router.post('/', createCard);
router.put('/:cid', updateCard);
router.delete('/:cid', deleteCard)

module.exports = router;