const express = require("express");
const cors = require("cors");
const apiRutas = require("./rutas");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use("/api", apiRutas);

app.get("/", (req, res) => {
  res.status(200).send("API corriendo con exito.");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}.\n`);
});
