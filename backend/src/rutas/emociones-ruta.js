import { Router } from "express";
import {
  getAllEmociones,
  getEmocionById,
  createEmocion,
  updateEmocion,
  deleteEmocion,
} from "../controladores/emociones-controlador.js";
import { autenticarAdmin } from "../middlewares/autenticacion.js";

const router = Router();

router.get("/", getAllEmociones);
router.get("/:eid", getEmocionById);
router.post("/", autenticarAdmin, createEmocion);
router.put("/:eid", autenticarAdmin, updateEmocion);
router.delete("/:eid", autenticarAdmin, deleteEmocion);

export default router;
