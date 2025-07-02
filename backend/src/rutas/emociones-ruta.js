const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.status(200).send('Ruta emociones funcionando correctamente.');
})

module.exports = router;