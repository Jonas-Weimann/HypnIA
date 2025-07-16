import dbClient from "../config/dbClient.js";
import { obtenerFechaActual } from "../utilidades/fecha.js";
import { generarHash, compararHash } from "../utilidades/encriptacion.js";
import { generarToken, verificarToken } from "../utilidades/jsonwebtoken.js";
import { datosDeSueno } from "../utilidades/datosDeSueno.js";

const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await dbClient.query("SELECT * FROM usuarios");
    res.status(200).json(usuarios.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

const getUsuarioById = async (req, res) => {
  const { uid } = req.params;
  try {
    if (!uid || isNaN(uid)) {
      throw { status: 400, message: "ID de usuario inválido" };
    }
    const usuario = await dbClient.query(
      "SELECT * FROM usuarios WHERE id_usuario = $1",
      [uid]
    );
    if (usuario.rows.length === 0) {
      throw { status: 404, message: "Usuario no encontrado" };
    }
    res.status(200).json(usuario.rows[0]);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error obteniendo usuario" });
  }
};

const getUsuarioByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      throw { status: 400, message: "Email es requerido" };
    }
    const usuario = await dbClient.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );
    if (usuario.rows.length === 0) {
      throw { status: 404, message: "Usuario no encontrado" };
    }
    res.status(200).json(usuario.rows[0]);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error obteniendo usuario por email" });
  }
};

const getSuenosByUsuario = async (req, res) => {
  const { uid } = req.params;
  const { id_usuario } = req.usuario || {};
  try {
    if (!uid || isNaN(uid)) {
      throw { status: 400, message: "ID de usuario inválido" };
    }
    if (!id_usuario || id_usuario !== parseInt(uid)) {
      throw {
        status: 403,
        message: "No tienes permiso para acceder a los sueños de este usuario",
      };
    }
    const suenos = await dbClient.query(
      "SELECT * FROM suenos WHERE id_usuario = $1",
      [uid]
    );
    if (suenos.rows.length === 0) {
      throw {
        status: 404,
        message: "No se encontraron sueños para este usuario",
      };
    }
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
    res.status(error.status || 500).json({
      message: error.message || "Error obteniendo sueños del usuario",
    });
  }
};

const getSuenosPublicosByUsuario = async (req, res) => {
  const { uid } = req.params;
  try {
    if (!uid || isNaN(uid)) {
      throw { status: 400, message: "ID de usuario inválido" };
    }
    const suenosPublicos = await dbClient.query(
      `SELECT s.id_sueno, s.fecha, s.descripcion, s.interpretacion, s.publico
             FROM suenos s
             JOIN usuarios u ON s.id_usuario = u.id_usuario
             WHERE u.id_usuario = $1 AND s.publico = 'true'`,
      [uid]
    );
    if (suenosPublicos.rows.length === 0) {
      throw {
        status: 404,
        message: "No se encontraron sueños públicos para este usuario",
      };
    }

    const suenosPublicosCompletos = await Promise.all(
      suenosPublicos.rows.map(async (sueno) => {
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
    res.status(200).json(suenosPublicosCompletos);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Error obteniendo sueños públicos del usuario",
    });
  }
};

const registrarUsuario = async (req, res) => {
  const { nombre, email, contrasena } = req.body;
  const fecha_actual = obtenerFechaActual();
  try {
    if (!nombre || !email || !contrasena) {
      throw { status: 400, message: "Faltan campos requeridos" };
    }
    const usuarioExistente = await dbClient.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );
    if (usuarioExistente.rows.length > 0) {
      throw { status: 409, message: "El email ya está registrado" };
    }

    const contrasenaHasheada = await generarHash(contrasena);
    const nuevoUsuario = await dbClient.query(
      "INSERT INTO usuarios (nombre, email, contrasena, fecha_registro) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, email, contrasenaHasheada, fecha_actual]
    );
    res.status(201).json(nuevoUsuario.rows[0]);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error creando usuario" });
  }
};

const iniciarSesion = async (req, res) => {
  const { email, contrasena } = req.body;
  const sesionActiva = req.usuario;
  try {
    if (sesionActiva) {
      throw { status: 403, message: "El usuario ya está autenticado" };
    }
    if (!email || !contrasena) {
      throw { status: 400, message: "Email y contraseña son requeridos" };
    }
    const resultado = await dbClient.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );
    if (resultado.rows.length === 0) {
      throw { status: 401, message: "Credenciales incorrectas" };
    }
    const usuario = resultado.rows[0];
    const contrasenaValida = await compararHash(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      throw { status: 401, message: "Credenciales incorrectas" };
    }
    const token = generarToken(usuario);
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error iniciando sesión" });
  }
};

const cambiarContrasena = async (req, res) => {
  try {
    const { contrasena, token } = req.body;
    if (!contrasena || !token) {
      throw { status: 400, message: "Faltan datos obligatorios" };
    }
    const datos = verificarToken(token);
    if (!datos) throw { status: 401, message: "Token inválido o expirado" };

    const contrasenaHasheada = await generarHash(contrasena);
    await dbClient.query(
      "UPDATE usuarios SET contrasena = $1 WHERE id_usuario = $2",
      [contrasenaHasheada, datos.id]
    );
    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error iniciando sesión" });
  }
};

const cambiarFoto = async (req, res) => {
  try {
    const { fotoPerfil } = req.body;
    const { id_usuario } = req.usuario;
    if (!fotoPerfil || !id_usuario) {
      throw { status: 400, message: "Datos faltantes" };
    }
    await dbClient.query(
      "UPDATE usuarios SET foto_perfil = $1 WHERE id_usuario = $2",
      [fotoPerfil, id_usuario]
    );
    res
      .status(200)
      .json({ message: "Foto de perfil actualizada correctamente" });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error al actualizar foto de perfil" });
  }
};

const cambiarNombre = async (req, res) => {
  try {
    const { nuevoNombre } = req.body;
    const { id_usuario } = req.usuario;
    if (!nuevoNombre || !id_usuario) {
      throw { status: 400, message: "Datos faltantes" };
    }
    await dbClient.query(
      "UPDATE usuarios SET nombre = $1 WHERE id_usuario = $2",
      [nuevoNombre, id_usuario]
    );
    res
      .status(200)
      .json({ message: "Nombre de usuario actualizado correctamente" });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Error al actualizar nombre de usuario",
    });
  }
};

const borrarCuenta = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    if (!id_usuario) {
      throw { status: 400, message: "Datos faltantes" };
    }
    await dbClient.query("DELETE FROM usuarios WHERE id_usuario = $1", [
      id_usuario,
    ]);
    res.status(200).json({ message: "Cuenta eliminada correctamente" });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Error al eliminar cuenta",
    });
  }
};

export {
  getAllUsuarios,
  getUsuarioById,
  getUsuarioByEmail,
  getSuenosByUsuario,
  getSuenosPublicosByUsuario,
  registrarUsuario,
  iniciarSesion,
  cambiarContrasena,
  cambiarFoto,
  cambiarNombre,
  borrarCuenta,
};
