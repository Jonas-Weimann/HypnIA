import { Router } from "express";
import usuariosRuta from "./usuarios-ruta.js";
import cartasRuta from "./cartas-ruta.js";
import suenosRuta from "./suenos-ruta.js";
import emocionesRuta from "./emociones-ruta.js";
import emailsRuta from "./emails-ruta.js";

const router = Router();

router.use("/usuarios", usuariosRuta);
router.use("/cartas", cartasRuta);
router.use("/suenos", suenosRuta);
router.use("/emociones", emocionesRuta);
router.use("/emails", emailsRuta);

export default router;
