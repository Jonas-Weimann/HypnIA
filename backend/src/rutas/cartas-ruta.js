import { Router } from "express";
import {
  getAllCartas,
  getCartaById,
  createCarta,
  updateCarta,
  deleteCarta,
} from "../controladores/cartas-controlador.js";
import { autenticarAdmin } from "../middlewares/autenticacion.js";

const router = Router();

router.get("/", getAllCartas);
router.get("/:cid", getCartaById);
router.post("/", autenticarAdmin, createCarta);
router.put("/:cid", autenticarAdmin, updateCarta);
router.delete("/:cid", autenticarAdmin, deleteCarta);

export default router;
