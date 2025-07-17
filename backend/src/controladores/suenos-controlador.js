import dbClient from "../config/dbClient.js";
import { obtenerFechaActual } from "../utilidades/fecha.js";
import {
  obtenerIdEmociones,
  obtenerIdCartas,
} from "../utilidades/traduccion.js";

import {
  cartasDeSueno,
  datosDeSueno,
  emocionesDeSueno,
} from "../utilidades/datosDeSueno.js";

import { esEmocionValida } from "../utilidades/validacion.js";

const getAllSuenos = async (req, res) => {
  try {
    const suenos = await dbClient.query("SELECT * FROM suenos");
    const suenosCompletos = await Promise.all(
      suenos.rows.map(async (sueno) => {
        const { emociones, cartas } = await datosDeSueno(
          sueno.id_sueno,
          dbClient
        );
        return {
          ...sueno,
          emociones,
          cartas,
        };
      })
    );
    res.status(200).json(suenosCompletos);
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

    const suenoCompleto = await datosDeSueno(sueno.rows[0].id_sueno, dbClient);

    res.status(200).json({ ...sueno.rows[0], ...suenoCompleto });
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
    const suenosPublicosCompletos = await Promise.all(
      suenosPublicos.rows.map(async (sueno) => {
        const { emociones, cartas, usuario } = await datosDeSueno(
          sueno.id_sueno,
          dbClient
        );
        return {
          ...sueno,
          emociones,
          cartas,
          usuario,
        };
      })
    );
    res.status(200).json(suenosPublicosCompletos);
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
    const { interpretacion, emociones, cartas } = req.analisis;
    const idEmociones = await obtenerIdEmociones(emociones);
    const idCartas = await obtenerIdCartas(cartas);
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
    const insertarEmociones = idEmociones.map(async (idEmocion) => {
      return await cliente.query(
        "INSERT INTO suenos_emociones (id_sueno, id_emocion) VALUES ($1, $2)",
        [idSueno, idEmocion]
      );
    });
    await Promise.all(insertarEmociones);

    const insertarCartas = idCartas.map(async (idCarta) => {
      return await cliente.query(
        "INSERT INTO suenos_cartas (id_sueno, id_carta) VALUES ($1, $2)",
        [idSueno, idCarta]
      );
    });
    await Promise.all(insertarCartas);

    await cliente.query("COMMIT");

    res.status(201).json({
      ...nuevoSueno.rows[0],
      emociones: await emocionesDeSueno(idSueno, cliente),
      cartas: await cartasDeSueno(idSueno, cliente),
    });
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
  const cliente = await dbClient.connect();
  try {
    const { sid } = req.params;
    const { descripcion, publico } = req.body;
    const fecha = obtenerFechaActual();
    const { id_usuario } = req.usuario;

    const { interpretacion, emociones, cartas } = req.analisis;
    const idEmociones = await obtenerIdEmociones(emociones);
    const idCartas = await obtenerIdCartas(cartas);

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

    const insertarEmociones = idEmociones.map(async (idEmocion) => {
      return await cliente.query(
        "INSERT INTO suenos_emociones (id_sueno, id_emocion) VALUES ($1, $2)",
        [idSueno, idEmocion]
      );
    });
    await Promise.all(insertarEmociones);

    await cliente.query("DELETE FROM suenos_cartas WHERE id_sueno = $1 ", [
      idSueno,
    ]);

    const insertarCartas = idCartas.map(async (idCarta) => {
      return await cliente.query(
        "INSERT INTO suenos_cartas (id_sueno, id_carta) VALUES ($1, $2)",
        [idSueno, idCarta]
      );
    });
    await Promise.all(insertarCartas);

    await cliente.query("COMMIT");
    res.status(200).json({
      ...suenoActualizado.rows[0],
      emociones: await emocionesDeSueno(idSueno, dbClient),
      cartas: await cartasDeSueno(idSueno, dbClient),
    });
  } catch (error) {
    console.log(error);
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

    res.status(200).json({
      message: "Sueño eliminado exitosamente",
      suenoEliminado: suenoEliminado.rows[0],
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Error eliminando sueño",
    });
  }
};

export {
  getAllSuenos,
  getSuenoById,
  getSuenosPublicos,
  createSueno,
  updateSueno,
  deleteSueno,
};
