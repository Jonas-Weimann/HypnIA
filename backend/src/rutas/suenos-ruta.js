import { Router } from "express";
import {
  getAllSuenos,
  getSuenosPublicos,
  getSuenoById,
  createSueno,
  updateSueno,
  deleteSueno,
} from "../controladores/suenos-controlador.js";
import {
  autenticarUsuario,
  autenticarAdmin,
} from "../middlewares/autenticacion.js";
import { interpretarSueno } from "../middlewares/interpretarSueno.js";

const router = Router();

router.get("/", autenticarAdmin, getAllSuenos);
router.get("/publicos", getSuenosPublicos);
router.get("/:sid", autenticarAdmin, getSuenoById);
router.post("/", autenticarUsuario, interpretarSueno, createSueno);
router.put("/:sid", autenticarUsuario, interpretarSueno, updateSueno);
router.delete("/:sid", autenticarUsuario, deleteSueno);

export default router;
