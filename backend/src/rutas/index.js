const express = require('express');
const usuariosRuta = require('./usuarios-ruta.js');
const cartasRuta = require('./cartas-ruta.js');
const suenosRuta = require('./suenos-ruta.js');
const emocionesRuta = require('./emociones-ruta.js');

const router = express.Router();

router.use('/usuarios', usuariosRuta);
router.use('/cartas', cartasRuta);
router.use('/suenos', suenosRuta);
router.use('/emociones', emocionesRuta);

module.exports = router;

