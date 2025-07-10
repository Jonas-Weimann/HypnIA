const { Router } = require("express");
const {
  getAllCartas,
  getCartaById,
  createCarta,
  updateCarta,
  deleteCarta,
} = require("../controladores/cartas-controlador.js");
const { autenticarAdmin } = require("../middlewares/autenticacion.js");

const router = Router();

router.get("/", getAllCartas);
router.get("/:cid", getCartaById);
router.post("/", autenticarAdmin, createCarta);
router.put("/:cid", autenticarAdmin, updateCarta);
router.delete("/:cid", autenticarAdmin, deleteCarta);

module.exports = router;
