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

const datosDeSueno = async (id_sueno, dbClient) => {
  const emociones = await emocionesDeSueno(id_sueno, dbClient);
  const cartas = await cartasDeSueno(id_sueno, dbClient);
  return { emociones, cartas };
};

export { emocionesDeSueno, cartasDeSueno, datosDeSueno };
