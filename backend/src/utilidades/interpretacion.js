import dbClient from "../config/dbClient.js";

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
    1. Analiza el sueño en profundidad, siendo creativo en los significados, desestructurado en la redacción y agregando un toque místico y espiritual.

    2. Detecta al menos 3 emociones relevantes en el sueño, seleccionándolas exclusivamente de la lista de emociones provista.

    3. Para cada emoción, indica la intensidad percibida en el sueño (de 1 a 10). No utilices emociones que no estén en la lista.

    4. Selecciona TRES cartas simbólicas de la lista provista, teniendo en cuenta lo siguiente:
      - Cada carta debe estar relacionada con al menos una de las emociones detectadas (según la tabla de relaciones).
      - El significado simbólico de cada carta debe tener relación con el contenido del sueño.
      - La polaridad de cada carta debe coincidir con la emoción más dominante (la de mayor intensidad).
      - No repitas cartas. No inventes cartas ni sus descripciones. Usa solo las cartas de la lista.

    5. Devuelve SOLO un objeto JSON con:
      - Una interpretación general del sueño.
      - Las emociones detectadas con su intensidad.
      - Las tres cartas seleccionadas y sus propiedades.

    6. El JSON debe tener el siguiente formato EXACTO:

    {
      "interpretacion": "Texto breve de interpretación",
      "emociones": [
        { "nombre": "...", "intensidad": 5 },
        { "nombre": "...", "intensidad": 3 },
        { "nombre": "...", "intensidad": 9 }
      ],
      "cartas": [
        { "nombre": "...", "descripcion": "...", "elemento": "...", "polaridad": "positiva/negativa/neutra" },
        { "nombre": "...", "descripcion": "...", "elemento": "...", "polaridad": "positiva/negativa/neutra" },
        { "nombre": "...", "descripcion": "...", "elemento": "...", "polaridad": "positiva/negativa/neutra" }
      ]
    }

    7. No agregues ningún texto adicional antes o después del JSON. No escribas encabezados, aclaraciones, ni comentarios. Solo devuelve el JSON crudo, completamente válido.

    8. Asegúrate de que el JSON sea válido según el estándar (todas las propiedades deben tener comillas dobles, y no debe haber comas finales innecesarias).
        
    Lista de emociones: ${listaEmociones}.
        
    Lista de cartas: ${listaCartas}.
        
    Relaciones entre cartas y emociones: ${listaRelaciones}.`;
  return [
    { role: "system", content: prompt },
    { role: "user", content: descripcion },
  ];
};

export {
  obtenerDatosParaInterpretacion,
  generarPromptInterpretacion,
};
