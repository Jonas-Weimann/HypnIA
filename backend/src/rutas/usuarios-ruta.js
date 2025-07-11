const { Router } = require("express");
const {
  getAllUsuarios,
  getUsuarioById,
  registrarUsuario,
  getSuenosPublicosByUsuario,
  getSuenosByUsuario,
  iniciarSesion,
} = require("../controladores/usuarios-controlador.js");
const {
  autenticarUsuario,
  autenticarAdmin,
} = require("../middlewares/autenticacion.js");

const router = Router();

router.get("/", autenticarAdmin, getAllUsuarios);
router.get("/:uid", autenticarAdmin, getUsuarioById);
router.get("/:uid/suenos", autenticarUsuario, getSuenosByUsuario);
router.get("/:uid/suenos-publicos", getSuenosPublicosByUsuario);
router.post("/registrar", registrarUsuario);
router.post("/iniciar-sesion", iniciarSesion);

module.exports = router;
