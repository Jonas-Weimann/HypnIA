const dbClient = require("../config/dbClient.js");

const obtenerIdEmociones = async (emociones) => {
  if (!Array.isArray(emociones)) return [];

  const buscarEmociones = emociones.map(async (emocion) => {
    const { rows } = await dbClient.query(
      `SELECT id_emocion FROM emociones WHERE nombre = $1`,
      [emocion.nombre]
    );
    return rows[0]?.id_emocion;
  });

  const resultados = await Promise.all(buscarEmociones);
  return resultados;
};

module.exports = { obtenerIdEmociones };
