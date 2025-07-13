import dbClient from '../config/dbClient.js';
import { esPolaridadValida } from '../utilidades/validacion.js';

const getAllEmociones = async (req, res)=>{
    try {
        const emociones = await dbClient.query('SELECT * FROM emociones')
        if (emociones.rows.length === 0) {
            throw { status: 404, message: 'No se encontraron emociones' };
        }
        res.status(200).json(emociones.rows);
    } catch (error){
        res.status(error.status || 500).json({ message: error.message || 'Error obteniendo emociones'});
    }
}

const getEmocionById = async (req,res)=>{
    const { eid } = req.params;
    try {
        if ( !eid || isNaN(eid)){
            throw { status: 400, message: 'ID de emoción inválido' };
        }
        const emocion = await dbClient.query('SELECT * FROM emociones WHERE id_emocion = $1', [eid]);
        if (emocion.rows.length === 0) {
            throw { status: 404, message: 'Emoción no encontrada' };
        }
        res.status(200).json(emocion.rows[0]);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error obteniendo la emoción'});
    }
}

const createEmocion = async (req, res)=>{
    const { nombre, intensidad, polaridad} = req.body;
    try {
        if (!nombre || !intensidad || !polaridad) {
            throw { status: 400, message: 'Faltan campos requeridos' };
        }
        if (typeof nombre !== 'string' || typeof intensidad !== 'number' || !esPolaridadValida(polaridad)) {
            throw { status: 400, message: 'Datos inválidos' };
        }
        const nuevaEmocion = await dbClient.query(
            'INSERT INTO emociones (nombre, intensidad, polaridad) VALUES ($1, $2, $3) RETURNING *',
            [nombre, intensidad, polaridad]
        );
        res.status(201).json(nuevaEmocion.rows[0]);
    } catch (error){
        res.status(error.status || 500).json({message: error.message || 'Error creando emoción'});
    }
}

const updateEmocion = async (req, res) =>{
    const { eid } = req.params;
    const { nombre, intensidad, polaridad } = req.body;
    try{
        if ( !eid || isNaN(eid)){
            throw { status: 400, message: 'ID de emoción inválido' };
        }
        if (!nombre || !intensidad || !polaridad) {
            throw { status: 400, message: 'Faltan campos requeridos' };
        }
        if (typeof nombre !== 'string' || typeof intensidad !== 'number' || !esPolaridadValida(polaridad)) {
            throw { status: 400, message: 'Datos inválidos' };
        }
        const emocionActualizada = await dbClient.query(
            'UPDATE emociones SET nombre = $1, intensidad = $2, polaridad = $3 WHERE id_emocion = $4 RETURNING *',
            [nombre, intensidad, polaridad, eid]
        );
        if (emocionActualizada.rows.length === 0) {
            throw { status: 404, message: 'Emoción no encontrada' };
        }
        res.status(200).json(emocionActualizada.rows[0]);
    } catch (error){
        res.status(error.status || 500).json({ message: error.message || 'Error actualizando emoción' });
    }
}

const deleteEmocion = async (req, res)=>{
    const { eid } = req.params;
    try{
        if ( !eid || isNaN(eid)){
            throw { status: 400, message: 'ID de emoción inválido' };
        }
        const emocionEliminada = await dbClient.query(
            'DELETE FROM emociones WHERE id_emocion = $1 RETURNING *',
            [eid]
        );
        if (emocionEliminada.rows.length === 0) {
            throw { status: 404, message: 'Emoción no encontrada' };
        }
        res.status(200).json({ message: 'Emoción eliminada correctamente' });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error eliminando emoción' });
    }
}

export {
    getAllEmociones,
    getEmocionById,
    createEmocion,
    updateEmocion,
    deleteEmocion
}
