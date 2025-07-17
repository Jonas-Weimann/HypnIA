import { Router } from "express";
import {
  getAllUsuarios,
  getUsuarioById,
  getPerfilDeUsuario,
  registrarUsuario,
  getSuenosPublicosByUsuario,
  getSuenosByUsuario,
  iniciarSesion,
  cambiarContrasena,
  cambiarFoto,
  cambiarNombre,
  borrarCuenta,
  eliminarUsuario,
  editarUsuario,
} from "../controladores/usuarios-controlador.js";
import {
  autenticarUsuario,
  autenticarAdmin,
  esUsuarioActivo,
} from "../middlewares/autenticacion.js";

const router = Router();

router.get("/", autenticarAdmin, getAllUsuarios);
router.get("/estado/activo", esUsuarioActivo);
router.get("/perfil", autenticarUsuario, getPerfilDeUsuario);
router.get("/:uid", autenticarAdmin, getUsuarioById);
router.get("/:uid/suenos", autenticarUsuario, getSuenosByUsuario);
router.get("/:uid/suenos-publicos", getSuenosPublicosByUsuario);
router.post("/registrar", registrarUsuario);
router.post("/iniciar-sesion", iniciarSesion);
router.put("/cambiar-contrasena", cambiarContrasena);
router.put("/cambiar-foto", autenticarUsuario, cambiarFoto);
router.put("/cambiar-nombre", autenticarUsuario, cambiarNombre);
router.put("/editar-usuario", autenticarAdmin, editarUsuario);
router.delete("/borrar-cuenta", autenticarUsuario, borrarCuenta);
router.delete("/eliminar-usuario", autenticarAdmin, eliminarUsuario);

export default router;
