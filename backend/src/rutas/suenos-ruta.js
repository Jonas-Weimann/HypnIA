const { Router } = require("express");
const {
  getAllSuenos,
  getSuenosPublicos,
  getSuenoById,
  createSueno,
  updateSueno,
  deleteSueno,
} = require("../controladores/suenos-controlador.js");
const {
  autenticarUsuario,
  autenticarAdmin,
} = require("../middlewares/autenticacion.js");
const { interpretarSueno } = require("../middlewares/interpretarSueno.js");

const router = Router();

router.get("/", autenticarAdmin, getAllSuenos);
router.get("/publicos", getSuenosPublicos);
router.get("/:sid", autenticarAdmin, getSuenoById);
router.post("/", autenticarUsuario, interpretarSueno, createSueno);
router.put("/:sid", autenticarUsuario, interpretarSueno, updateSueno);
router.delete("/:sid", autenticarUsuario, deleteSueno);

module.exports = router;
