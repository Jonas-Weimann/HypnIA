const { verificarToken} = require('../utilidades/jsonwebtoken.js');

const autenticarUsuario = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const usuario = verificarToken(token);
        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
}

const autenticarAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const usuario = verificarToken(token);
        if (usuario.nombre !== 'Admin') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
}


module.exports = {
    autenticarUsuario,
    autenticarAdmin
}