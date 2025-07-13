import dbClient from '../config/dbClient.js';
import  { esElementoValido, esEmocionValida, esPolaridadValida } from '../utilidades/validacion.js';

const getAllCartas = async (req, res)=>{
    try {
        const cartas = await dbClient.query('SELECT * FROM cartas');
        res.status(200).json(cartas.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo cartas', error: error.message });
    }
}

const getCartaById = async (req, res) => {
    const { cid } = req.params;
    try {
        if (!cid || isNaN(cid)) {
            throw { status: 400, message: 'ID de carta inválido' };
        }
        const carta = await dbClient.query('SELECT * FROM cartas WHERE id_carta = $1', [cid]);
        if (carta.rows.length === 0) {
            throw { status: 404, message: 'Carta no encontrada' };
        }
        res.status(200).json(carta.rows[0]);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error obteniendo carta' });
    }
}

const createCarta = async (req, res) => {
    const { nombre, descripcion, imagen, elemento, polaridad, emociones } = req.body;
    const cliente = await dbClient.connect();
    try {
        if(!nombre || !descripcion || !elemento || !polaridad || !emociones) {
            throw { status: 400, message: 'Faltan campos requeridos' };
        }
        if (!esElementoValido(elemento)) {
            throw { status: 400, message: 'Elemento no válido' };
        }
        if (!esPolaridadValida(polaridad)) {
            throw { status: 400, message: 'Polaridad no válida' };
        }
        if (!esEmocionValida(emociones)) {
            throw { status: 400, message: 'Emociones no válidas' };
        }

        await cliente.query('BEGIN');

        const nuevaCarta = await dbClient.query(
            'INSERT INTO cartas (nombre, descripcion, imagen, elemento, polaridad) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, descripcion, imagen, elemento, polaridad]
        );
        const idCarta = nuevaCarta.rows[0].id_carta;
        const insertarEmociones = emociones.map(emocion => 
            dbClient.query('INSERT INTO cartas_emociones (id_carta, id_emocion) VALUES ($1, $2)', [idCarta, emocion])
        );
        await Promise.all(insertarEmociones);
        await cliente.query('COMMIT');
        
        res.status(201).json(nuevaCarta.rows[0]);
    } catch (error) {
        await cliente.query('ROLLBACK');
         res.status(error.status || 500).json({ message: error.message || 'Error creando carta'  });
    }
}

const updateCarta = async (req, res) => {
    const { cid } = req.params;
    const { nombre, descripcion, imagen, elemento, polaridad, emociones } = req.body;
    const cliente = await dbClient.connect();
    try {
        if (!cid || isNaN(cid)) {
            throw { status: 400, message: 'ID de carta inválido' };
        }
        if(!nombre || !descripcion || !elemento || !polaridad || !emociones) {
            throw { status: 400, message: 'Faltan campos requeridos' };
        }
        if (!esElementoValido(elemento)) {
            throw { status: 400, message: 'Elemento no válido' };
        }
        if (!esPolaridadValida(polaridad)) {
            throw { status: 400, message: 'Polaridad no válida' };
        }
        if (!esEmocionValida(emociones)) {
            throw { status: 400, message: 'Emociones no válidas' };
        }
        await cliente.query('BEGIN');
        const cartaActualizada = await dbClient.query(
            'UPDATE cartas SET nombre = $1, descripcion = $2, imagen = $3, elemento = $4, polaridad = $5 WHERE id_carta = $6 RETURNING *',
            [nombre, descripcion, imagen, elemento, polaridad, cid]
        );
        if (cartaActualizada.rows.length === 0) {
            throw { status: 404, message: 'Carta no encontrada' };
        }
        const idCarta = cartaActualizada.rows[0].id_carta;
        const insertarEmociones = emociones.map(emocion => 
            dbClient.query('INSERT INTO cartas_emociones (id_carta, id_emocion) VALUES ($1, $2)', [idCarta, emocion])
        );
        await Promise.all(insertarEmociones);
        await cliente.query('COMMIT');
        res.status(200).json(cartaActualizada.rows[0]);
    } catch (error) {
        await cliente.query('ROLLBACK');
        res.status(error.status || 500).json({ message: error.message || 'Error actualizando carta' });
    }
}

const deleteCarta = async (req, res) => {
    const { cid } = req.params;
    try {
        if(!cid || isNaN(cid)) {
            throw { status: 400, message: 'ID de carta inválido' };
        }
        const cartaEliminada = await dbClient.query('DELETE FROM cartas WHERE id_carta = $1 RETURNING *', [cid]);
        if (cartaEliminada.rows.length === 0) {
            throw { status: 404, message: 'Carta no encontrada' };
        }
        res.status(200).json({ message: 'Carta eliminada con exito' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando carta', error: error.message });
    }
}

export {
    getAllCartas,
    getCartaById,
    createCarta,
    updateCarta,
    deleteCarta
};
