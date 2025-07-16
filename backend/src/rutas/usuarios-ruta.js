import { Router } from "express";
import {
  getAllUsuarios,
  getUsuarioById,
  registrarUsuario,
  getSuenosPublicosByUsuario,
  getSuenosByUsuario,
  iniciarSesion,
  cambiarContrasena,
  cambiarFoto,
  cambiarNombre,
  borrarCuenta,
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
router.get("/activo", esUsuarioActivo);
router.put("/cambiar-contrasena", cambiarContrasena);
router.put("/cambiar-foto", autenticarUsuario, cambiarFoto);
router.put("/cambiar-nombre", autenticarUsuario, cambiarNombre);
router.delete("/borrar-cuenta", autenticarUsuario, borrarCuenta);

export default router;
