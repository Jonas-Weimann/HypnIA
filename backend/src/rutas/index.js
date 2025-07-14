import { Router } from "express";
import usuariosRuta from './usuarios-ruta.js';
import cartasRuta from './cartas-ruta.js';
import suenosRuta from './suenos-ruta.js';
import emocionesRuta from './emociones-ruta.js';

const router = Router();

router.use('/usuarios', usuariosRuta);
router.use('/cartas', cartasRuta);
router.use('/suenos', suenosRuta);
router.use('/emociones', emocionesRuta);

export default router;

