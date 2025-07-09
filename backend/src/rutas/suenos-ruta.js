const { Router } = require("express");
const {
  getAllSuenos,
  getSuenosPublicos,
  getSuenoById,
  createSueno,
  updateSueno,
  deleteSueno,
} = require("../controladores/suenos-controlador.js");
const { autenticarUsuario } = require("../middlewares/autenticacion.js");
const { interpretarSueno } = require("../middlewares/interpretarSueno.js");

const router = Router();

router.get("/", getAllSuenos);
router.get("/publicos", getSuenosPublicos);
router.get("/:sid", getSuenoById);
router.post("/", /*autenticarUsuario,*/ interpretarSueno, createSueno);
router.put("/:sid", interpretarSueno, updateSueno);
router.delete("/:sid", deleteSueno);

module.exports = router;
