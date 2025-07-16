import dbClient from "../config/dbClient.js";

const obtenerUsuarioByEmail = async (email) => {
  if (!email) throw { status: 400, message: "Email es requerido" };
  const resultado = await dbClient.query(
    "SELECT * FROM usuarios WHERE email = $1",
    [email]
  );
  if (resultado.rows.length === 0) {
    throw { status: 404, message: "Usuario no encontrado" };
  }
  return resultado.rows[0];
};
export { obtenerUsuarioByEmail };
