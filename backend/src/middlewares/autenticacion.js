import { verificarToken } from "../utilidades/jsonwebtoken.js";

const autenticarUsuario = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const usuario = verificarToken(token);
    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

const autenticarAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const usuario = verificarToken(token);
    if (usuario.email !== "admin@admin.com" || usuario.nombre !== "Admin") {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

const esUsuarioActivo = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ activo: false, message: "Token no provisto" });
    }

    const token = authHeader.split(" ")[1];
    const usuarioActivo = verificarToken(token);
    if (!usuarioActivo)
      return res
        .status(401)
        .json({ activo: false, message: "Token inválido o expirado" });
    return res.status(200).json({ activo: true });
  } catch (error) {
    res
      .status(401)
      .json({ activo: false, message: "Token inválido o expirado" });
  }
};

const esAdministrador = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ esAdmin: false, message: "Token no provisto" });
    }

    const token = authHeader.split(" ")[1];
    const usuarioActivo = verificarToken(token);
    if (!usuarioActivo) {
      return res
        .status(401)
        .json({ esAdmin: false, message: "Token inválido o expirado" });
    }

    const esAdmin =
      usuarioActivo.email === "admin@admin.com" &&
      usuarioActivo.nombre === "Admin";

    return res.status(200).json({ esAdmin });
  } catch (error) {
    res
      .status(401)
      .json({ esAdmin: false, message: "Token inválido o expirado" });
  }
};

export { autenticarUsuario, autenticarAdmin, esUsuarioActivo, esAdministrador };
