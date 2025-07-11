const dbClient = require("../config/dbClient.js");
const { obtenerFechaActual } = require("../utilidades/fecha.js");
const {
  generarPromptInterpretacion,
} = require("../utilidades/interpretacion.js");
const { obtenerIdEmociones } = require("../utilidades/traduccion.js");
const { esEmocionValida } = require("../utilidades/validacion.js");

const getAllSuenos = async (req, res) => {
  try {
    const dreams = await dbClient.query("SELECT * FROM suenos");
    res.status(200).json(dreams.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error obteniendo sueños", error: error.message });
  }
};

const getSuenoById = async (req, res) => {
  try {
    const { sid } = req.params;
    const sueno = await dbClient.query(
      "SELECT * FROM suenos WHERE id_sueno = $1",
      [sid]
    );
    if (sueno.rows.length === 0) {
      throw { status: 404, message: "Sueño no encontrado" };
    }
    res.status(200).json(sueno.rows[0]);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error obteniendo sueño" });
  }
};

const getSuenosPublicos = async (req, res) => {
  try {
    const suenosPublicos = await dbClient.query(
      "SELECT * FROM suenos WHERE publico = true"
    );
    res.status(200).json(suenosPublicos.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo sueños públicos",
      error: error.message,
    });
  }
};

const createSueno = async (req, res) => {
  const cliente = await dbClient.connect();
  try {
    const { descripcion, publico } = req.body;
    const fecha = obtenerFechaActual();
    const { id_usuario } = req.usuario;
    const { interpretacion, emociones } = req.analisis;
    const idEmociones = await obtenerIdEmociones(emociones);
    await cliente.query("BEGIN");

    if (!id_usuario) {
      throw { status: 401, message: "Usuario no autenticado" };
    }
    if (!descripcion || !fecha) {
      throw { status: 400, message: "Faltan campos requeridos" };
    }
    if (!esEmocionValida(idEmociones)) {
      throw { status: 400, message: "Emociones no válidas." };
    }

    const nuevoSueno = await cliente.query(
      "INSERT INTO suenos (id_usuario, descripcion, fecha, publico, interpretacion) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id_usuario, descripcion, fecha, publico || false, interpretacion]
    );
    const idSueno = nuevoSueno.rows[0].id_sueno;
    const insertarEmociones = idEmociones.map((idEmocion) => {
      cliente.query(
        "INSERT INTO suenos_emociones (id_sueno, id_emocion) VALUES ($1, $2)",
        [idSueno, idEmocion]
      );
    });
    await Promise.all(insertarEmociones);

    await cliente.query("COMMIT");
    res.status(201).json(nuevoSueno.rows[0]);
  } catch (error) {
    await cliente.query("ROLLBACK");
    res.status(error.status || 500).json({
      message: error.message || "Error creando sueño",
    });
  } finally {
    cliente.release();
  }
};

const updateSueno = async (req, res) => {
  try {
    const { sid } = req.params;
    const { descripcion, publico } = req.body;
    const fecha = obtenerFechaActual();
    const { id_usuario } = req.usuario;
    const { interpretacion, emociones } = req.analisis;
    const idEmociones = await obtenerIdEmociones(emociones);
    const cliente = await dbClient.connect();
    await cliente.query("BEGIN");

    if (!id_usuario) {
      throw { status: 401, message: "Usuario no autenticado" };
    }
    if (!descripcion || !fecha) {
      throw { status: 400, message: "Faltan campos requeridos" };
    }
    if (!esEmocionValida(idEmociones)) {
      throw { status: 400, message: "Emociones no válidas." };
    }

    const suenoActualizado = await cliente.query(
      "UPDATE suenos SET descripcion = $1, fecha = $2, publico = $3, interpretacion = $4 WHERE id_sueno = $5 AND id_usuario = $6 RETURNING *",
      [
        descripcion,
        fecha,
        publico || false,
        interpretacion || null,
        sid,
        id_usuario,
      ]
    );

    if (suenoActualizado.rows.length === 0) {
      throw { status: 404, message: "Sueño no encontrado" };
    }

    const idSueno = suenoActualizado.rows[0].id_sueno;
    await cliente.query("DELETE FROM suenos_emociones WHERE id_sueno = $1 ", [
      idSueno,
    ]);
    if (emocionesEliminadas.rows.length === 0) {
      throw { status: 404, message: "Sueño no encontrado" };
    }
    const insertarEmociones = idEmociones.map((idEmocion) => {
      cliente.query(
        "INSERT INTO suenos_emociones (id_sueno, id_emocion) VALUES ($1, $2)",
        [idSueno, idEmocion]
      );
    });
    await Promise.all(insertarEmociones);

    await cliente.query("COMMIT");
    res.status(200).json(suenoActualizado.rows[0]);
  } catch (error) {
    await cliente.query("ROLLBACK");
    res.status(error.status || 500).json({
      message: error.message || "Error actualizando sueño",
    });
  } finally {
    cliente.release();
  }
};

const deleteSueno = async (req, res) => {
  try {
    const { sid } = req.params;
    const { id_usuario } = req.usuario;
    const suenoEliminado = await dbClient.query(
      "DELETE FROM suenos WHERE id_sueno = $1 AND id_usuario = $2 RETURNING *",
      [sid, id_usuario]
    );
    if (suenoEliminado.rows.length === 0) {
      throw { status: 404, message: "Sueño no encontrado" };
    }
    res.status(200).json({ message: "Sueño eliminado exitosamente" });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Error eliminando sueño",
    });
  }
};

module.exports = {
  getAllSuenos,
  getSuenoById,
  getSuenosPublicos,
  createSueno,
  updateSueno,
  deleteSueno,
};
