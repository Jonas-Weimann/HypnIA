const emocionesDeSueno = async (idSueno, dbClient) => {
  const result = await dbClient.query(
    `SELECT *
     FROM emociones e
     JOIN suenos_emociones se ON e.id_emocion = se.id_emocion
     WHERE se.id_sueno = $1`,
    [idSueno]
  );

  return result.rows;
};

const cartasDeSueno = async (id_sueno, dbClient) => {
  const result = await dbClient.query(
    `SELECT *
     FROM cartas c
     JOIN suenos_cartas sc ON c.id_carta = sc.id_carta
     WHERE sc.id_sueno = $1`,
    [id_sueno]
  );

  return result.rows;
};

const usuarioDeSueno = async (id_sueno, dbClient) => {
  const result = await dbClient.query(
    "SELECT u.id_usuario, u.nombre, u.foto_perfil FROM usuarios u JOIN suenos s ON s.id_usuario = u.id_usuario WHERE s.id_sueno = $1",
    [id_sueno]
  );
  return result.rows[0];
};

const datosDeSueno = async (id_sueno, dbClient) => {
  const emociones = await emocionesDeSueno(id_sueno, dbClient);
  const cartas = await cartasDeSueno(id_sueno, dbClient);
  const usuario = await usuarioDeSueno(id_sueno, dbClient);
  return { emociones, cartas, usuario };
};

export { emocionesDeSueno, cartasDeSueno, usuarioDeSueno, datosDeSueno };
