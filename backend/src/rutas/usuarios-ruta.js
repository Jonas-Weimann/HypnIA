const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.status(200).send('Ruta usuarios funcionando correctamente.');
})

module.exports = router;