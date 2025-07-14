const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const JWT_KEY = process.env.JWT_KEY
dotenv.config();


const generarToken = (usuario)=>{
    try {
        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, email: usuario.email, nombre: usuario.nombre },
            JWT_KEY,
            { expiresIn: '1h' }
        );
        return token;
    } catch (error) {
        throw { status: 500, message: 'Error al generar el token' };
    }
}

const verificarToken = (token) => {
    try {
        return jwt.verify(token, JWT_KEY);
    } catch (error) {
        throw { status: 401, message: 'Token inválido o expirado' };
    }
}

module.exports = {
    generarToken,
    verificarToken
}