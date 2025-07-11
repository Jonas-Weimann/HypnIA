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

const obtenerIdCartas = async (cartas) => {
  if (!Array.isArray(cartas)) return [];

  const buscarCartas = cartas.map(async (carta) => {
    const { rows } = await dbClient.query(
      `SELECT id_carta FROM cartas WHERE nombre = $1`,
      [carta.nombre]
    );
    return rows[0]?.id_carta;
  });
  const resultados = await Promise.all(buscarCartas);
  return resultados;
};

module.exports = { obtenerIdEmociones, obtenerIdCartas };
