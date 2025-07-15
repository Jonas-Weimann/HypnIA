import { Router } from "express";
import {
  getAllUsuarios,
  getUsuarioById,
  registrarUsuario,
  getSuenosPublicosByUsuario,
  getSuenosByUsuario,
  iniciarSesion,
} from "../controladores/usuarios-controlador.js";
import {
  autenticarUsuario,
  autenticarAdmin,
  esUsuarioActivo,
} from "../middlewares/autenticacion.js";

const router = Router();

router.get("/", autenticarAdmin, getAllUsuarios);
router.get("/:uid", autenticarAdmin, getUsuarioById);
router.get("/:uid/suenos", autenticarUsuario, getSuenosByUsuario);
router.get("/:uid/suenos-publicos", getSuenosPublicosByUsuario);
router.post("/registrar", registrarUsuario);
router.post("/iniciar-sesion", iniciarSesion);
router.get('/activo', esUsuarioActivo)

export default router;
