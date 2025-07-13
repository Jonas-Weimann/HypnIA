import dbClient from '../config/dbClient.js';
import { obtenerFechaActual } from '../utilidades/fecha.js';
import { generarHash, compararHash } from '../utilidades/encriptacion.js';
import { generarToken } from '../utilidades/jsonwebtoken.js';

const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await dbClient.query('SELECT * FROM usuarios');
        res.status(200).json(usuarios.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
}

const getUsuarioById = async (req, res) => {
    const { uid } = req.params;
    try {
        if (!uid || isNaN(uid)) {
            throw { status: 400, message: 'ID de usuario inválido' };
        }
        const usuario = await dbClient.query('SELECT * FROM usuarios WHERE id_usuario = $1', [uid]);
        if (usuario.rows.length === 0) {
            throw { status: 404, message: 'Usuario no encontrado' };
        }
        res.status(200).json(usuario.rows[0]);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error obteniendo usuario' });
    }
}

const getUsuarioByEmail = async (req, res) => {
    const {email} = req.body;
    try {
        if (!email) {
            throw { status: 400, message: 'Email es requerido' };
        }
        const usuario = await dbClient.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (usuario.rows.length === 0) {
            throw { status: 404, message: 'Usuario no encontrado' };
        }
        res.status(200).json(usuario.rows[0]);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error obteniendo usuario por email' });
    }
}

const getSuenosByUsuario = async (req, res)=>{
    const { uid } = req.params;
    const {id_usuario} = req.usuario || {};
    try {
        if (!uid || isNaN(uid)) {
            throw { status: 400, message: 'ID de usuario inválido' };
        }
        if (!id_usuario || id_usuario !== parseInt(uid)) {
            throw { status: 403, message: 'No tienes permiso para acceder a los sueños de este usuario' };
        }
        const suenos = await dbClient.query('SELECT * FROM suenos WHERE id_usuario = $1', [uid]);
        if (suenos.rows.length === 0) {
            throw { status: 404, message: 'No se encontraron sueños para este usuario' };
        }
        res.status(200).json(suenos.rows);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error obteniendo sueños del usuario' });
    }
}

const getSuenosPublicosByUsuario = async (req, res) => {
    const { uid } = req.params;
    try {
        if (!uid || isNaN(uid)) {
            throw { status: 400, message: 'ID de usuario inválido' };
        }
        const suenosPublicos = await dbClient.query(
            `SELECT s.id_sueno, s.fecha, s.descripcion, s.interpretacion, s.publico
             FROM suenos s
             JOIN usuarios u ON s.id_usuario = u.id_usuario
             WHERE u.id_usuario = $1 AND s.publico = 'true'`,
            [uid])
        if (suenosPublicos.rows.length === 0) {
            throw { status: 404, message: 'No se encontraron sueños públicos para este usuario' };
        }
        res.status(200).json(suenosPublicos.rows);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error obteniendo sueños públicos del usuario' });
    }
}


const registrarUsuario = async (req, res) => {
    const { nombre, email, contrasena } = req.body;
    const fecha_actual = obtenerFechaActual();
    
    try {
        if (!nombre || !email || !contrasena) {
            throw { status: 400, message: 'Faltan campos requeridos' };
        }
        const usuarioExistente = await dbClient.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (usuarioExistente.rows.length > 0) {
            throw { status: 409, message: 'El email ya está registrado' };
        }
        
        const contrasenaHasheada = await generarHash(contrasena);
        const nuevoUsuario = await dbClient.query(
            'INSERT INTO usuarios (nombre, email, contrasena, fecha_registro) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, email, contrasenaHasheada, fecha_actual]
        );
        res.status(201).json(nuevoUsuario.rows[0]);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error creando usuario' });
    }
}


const iniciarSesion = async (req, res) => {
    const { email, contrasena } = req.body;
    const sesionActiva = req.usuario;
    try {
        if (sesionActiva) {
            throw { status: 403, message: 'El usuario ya está autenticado'}
        }
        if (!email || !contrasena) {
            throw { status: 400, message: 'Email y contraseña son requeridos' };
        }
        const resultado = await dbClient.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (resultado.rows.length === 0) {
            throw { status: 401, message: 'Credenciales incorrectas' };
        }
        const usuario = resultado.rows[0];
        const contrasenaValida = await compararHash(contrasena, usuario.contrasena);
        if (!contrasenaValida) {
            throw { status: 401, message: 'Credenciales incorrectas' };
        }
        const token = generarToken(usuario);
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });
        
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error iniciando sesión' });
    }
}


export {
    getAllUsuarios,
    getUsuarioById,
    getUsuarioByEmail,
    getSuenosByUsuario,
    getSuenosPublicosByUsuario,
    registrarUsuario,
    iniciarSesion
}