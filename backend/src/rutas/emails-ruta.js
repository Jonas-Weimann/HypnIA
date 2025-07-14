import { Router } from "express";
import {
  enviarEmailBienvenida,
  enviarEmailRecuperacion,
} from "../controladores/emails-controlador.js";

const router = Router();

router.post("/registro-exitoso", enviarEmailBienvenida);
router.post("/recuperar-contrasena", enviarEmailRecuperacion);

export default router;
