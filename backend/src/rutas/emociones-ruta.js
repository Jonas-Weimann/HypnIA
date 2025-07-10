const { Router } = require("express");
const {
  getAllEmociones,
  getEmocionById,
  createEmocion,
  updateEmocion,
  deleteEmocion,
} = require("../controladores/emociones-controlador.js");
const { autenticarAdmin } = require("../middlewares/autenticacion.js");

const router = Router();

router.get("/", getAllEmociones);
router.get("/:eid", getEmocionById);
router.post("/", autenticarAdmin, createEmocion);
router.put("/:eid", autenticarAdmin, updateEmocion);
router.delete("/:eid", autenticarAdmin, deleteEmocion);

module.exports = router;
