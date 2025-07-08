const dbClient = require("../config/dbClient");

const obtenerDatosParaInterpretacion = async () => {
  const emociones = await dbClient.query(
    "SELECT nombre, intensidad, polaridad FROM emociones"
  );
  const cartas = await dbClient.query(
    "SELECT nombre, descripcion, elemento, polaridad FROM cartas"
  );
  const relaciones = await dbClient.query(`
    SELECT c.nombre AS carta, e.nombre AS emocion
    FROM cartas_emociones ce
    JOIN cartas c ON ce.id_carta = c.id_carta
    JOIN emociones e ON ce.id_emocion = e.id_emocion`);
  return {
    emociones: emociones.rows,
    cartas: cartas.rows,
    relaciones: relaciones.rows,
  };
};

const generarPromptInterpretacion = async (descripcion) => {
  const { emociones, cartas, relaciones } =
    await obtenerDatosParaInterpretacion();
  if (!emociones || !cartas || !relaciones) {
    return { message: "Error obteniendo datos para interpretación" };
  }
  const listaEmociones = emociones.map((e) => e.nombre).join(", ");
  const listaCartas = cartas.map((c) => c.nombre).join(", ");
  const listaRelaciones = relaciones
    .map((r) => `${r.carta} - ${r.emocion}`)
    .join(", ");
  const prompt = `Eres un experto en interpretación de sueños. Tu tarea es analizar el sueño proporcionado y ofrecer una interpretación detallada, siguiendo las siguientes pautas:
    1. Analizar el siguiente sueño.
    2. Detectar al menos 3 emociones relevantes en ese sueño, seleccionándolas únicamente de la lista de emociones provista.
    3. Para cada emoción, indicá la intensidad percibida en el sueño (de 1 a 10). No uses emociones que no estén en la lista.
    4. Seleccioná TRES cartas simbólicas desde la lista provista, teniendo en cuenta:
    - Que esté relacionada con al menos una de las emociones detectadas (según la tabla de relaciones).
    - Su significado debe tener relación simbólica con el sueño.
    - Su significado debe ser positivo, negativo o neutro según la polaridad de la emoción más dominante.
    - No pueden ser cartas repetidas.
    - No inventes cartas ni significados, usa solamente las cartas de la lista.
    5. Devolver un JSON con la interpretación detallada del sueño, las emociones detectadas, la carta seleccionada y su significado. El JSON debe tener el siguiente formato:
    {
        "interpretacion": "Texto breve de interpretación",
        "emociones": [
            { "nombre": "...", "intensidad": 5 },
            { "nombre": "...", "intensidad": 3 },
            { "nombre": "...", "intensidad": 9 }
        ],
        "cartas": [
            { "nombre": "...", "descripcion": "...", "elemento":"..." , "polaridad": "positiva/negativa/neutra" },
            { "nombre": "...", "descripcion": "...", "elemento":"..." , "polaridad": "positiva/negativa/neutra" },
            { "nombre": "...", "descripcion": "...", "elemento":"..." , "polaridad": "positiva/negativa/neutra" },
        ],
    }
    No inventes emociones ni cartas. Usá solamente los datos brindados.
    Lista de emociones: ${listaEmociones}.
    Lista de cartas: ${listaCartas}.
    Relaciones entre cartas y emociones: ${listaRelaciones}.
    `;
  return [
    { role: "system", content: prompt },
    { role: "user", content: descripcion },
  ];
};

module.exports = {
  obtenerDatosParaInterpretacion,
  generarPromptInterpretacion,
};
