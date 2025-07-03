const { Router } = require('express');
const { getAllUsuarios, getUsuarioById, registrarUsuario, getUsuarioByEmail, getSuenosPublicosByUsuario, getSuenosByUsuario } = require('../controladores/usuarios-controlador.js');

const router = Router();

router.get('/', getAllUsuarios);
router.get('/:uid', getUsuarioById);
router.get('/', getUsuarioByEmail)
router.get('/:uid/suenos', getSuenosByUsuario);
router.get('/:uid/suenos-publicos', getSuenosPublicosByUsuario);
router.post('/registrar', registrarUsuario);

module.exports = router;