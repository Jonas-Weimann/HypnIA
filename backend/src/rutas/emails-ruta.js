import { Router } from "express";
import { enviarEmailBienvenida } from "../controladores/emails-controlador.js";

const router = Router();

router.post("/registro-exitoso", enviarEmailBienvenida);

export default router;
