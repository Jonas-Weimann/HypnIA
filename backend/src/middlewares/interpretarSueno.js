const { gptclient } = require("../config/openai.mjs");
const {
  generarPromptInterpretacion,
} = require("../utilidades/interpretacion.js");

const interpretarSueno = async (req, res, next) => {
  try {
    const { descripcion } = req.body;
    // const { id_usuario } = req.usuario;
    // if (!id_usuario) {
    //   throw { status: 401, message: "Usuario no autenticado" };
    // }
    if (!descripcion) {
      throw { status: 400, message: "Faltan campos requeridos" };
    }

    const prompt = await generarPromptInterpretacion(descripcion);
    if (!prompt) {
      throw {
        status: 500,
        message: "Error generando prompt de interpretación",
      };
    }
    const respuesta = await gptclient.chat.completions.create({
      model: "gpt-4",
      messages: prompt,
      max_tokens: 2500,
      temperature: 0.7,
    });

    const contenido = respuesta?.choices?.[0]?.message?.content;
    if (!contenido) {
      throw {
        status: 500,
        message: "Error procesando la respuesta de la IA",
      };
    }
    let analisis;
    try {
      analisis = JSON.parse(contenido);
    } catch (error) {
      throw {
        status: 500,
        message:
          "Error interpretando el sueño, verifica que tu relato sea coherente.",
      };
    }

    req.body.analisis = analisis;
    next();
  } catch (error) {
    console.log({
      message:
        error.message || "Error interpretando sueño, intentalo de nuevo.",
    });
  }
};

module.exports = { interpretarSueno };
