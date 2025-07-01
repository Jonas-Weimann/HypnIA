const dbClient = require('../config/dbClient.js');
const {esEmocionValida} = require('../utils/validation.js');

const getAllDreams = async (req, res) =>{
    try{
        const dreams = await dbClient.query('SELECT * FROM suenos');
        res.status(200).json(dreams.rows);
    } catch (error){
        res.status(500).json({ message: 'Error obteniendo sueños', error: error.message });
    }
}

const getDreamById = async (req,res)=>{
    const { did } = req.params;
    try {
        const dream = await dbClient.query('SELECT * FROM suenos WHERE id_sueno = $1', [did]);
        if (dream.rows.length === 0) {
            throw { status: 404, message: 'Sueño no encontrado' };
        }
        res.status(200).json(dream.rows[0]);
    } catch (error){
        res.status(error.status || 500 ).json({ message: error.message || 'Error obteniendo sueño'});
    }
}

const getPublicDreams = async (req, res)=>{
    try {
        const publicDreams = await dbClient.query('SELECT * FROM suenos WHERE publico = true');
        res.status(200).json(publicDreams.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo sueños públicos', error: error.message });
    }
}

/*
CREATE TABLE suenos (
    id_sueno SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha DATE NOT NULL,
    publico BOOLEAN NOT NULL DEFAULT FALSE,
    interpretacion TEXT,
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);
*/

const createDream = async (req, res) => {
    const { descripcion, fecha, publico, interpretacion, emociones} = req.body;
    const id_usuario = req.user.id;
    const client = await dbClient.connect()

    try {
        await client.query('BEGIN');

        if (!id_usuario) {
            throw { status: 401, message: 'Usuario no autenticado' };
        }
        if (!descripcion || !fecha) {
            throw { status: 400, message: 'Faltan campos requeridos' };
        }
        if (!esEmocionValida(emociones)) {
            throw { status: 400, message: 'Emociones no válidas.' };
        }

        const newDream = await client.query(
            'INSERT INTO suenos (id_usuario, descripcion, fecha, publico, interpretacion) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id_usuario, descripcion, fecha, publico || false, interpretacion || null]
        );
        const dreamId = newDream.rows[0].id_sueno;
        const emotionQueries = emociones.map(emocion => {
            client.query('INSERT INTO suenos_emociones (id_sueno, id_emocion) VALUES ($1, $2)', [dreamId, emocion]);
        });
        await Promise.all(emotionQueries);

        await client.query('COMMIT')
        res.status(201).json(newDream.rows[0]);

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(error.status || 500).json({
            message: error.message || 'Error creando sueño',
        });
    } finally {
        client.release();
    }
};

const updateDream = async (req, res)=>{
    const { did } = req.params;
    const {desctipcion, fecha, publico, interpretacion, emociones} = req.body;
    const id_usuario = req.user.id;
    const client = await dbClient.connect();
    try {
        await client.query('BEGIN');

        if (!id_usuario) {
            throw { status: 401, message: 'Usuario no autenticado' };
        }
        if (!desctipcion || !fecha) {
            throw { status: 400, message: 'Faltan campos requeridos' };
        }
        if (!esEmocionValida(emociones)) {
            throw { status: 400, message: 'Emociones no válidas.' };
        }

        const updatedDream = await client.query(
            'UPDATE suenos SET descripcion = $1, fecha = $2, publico = $3, interpretacion = $4 WHERE id_sueno = $5 AND id_usuario = $6 RETURNING *',
            [desctipcion, fecha, publico || false, interpretacion || null, did, id_usuario]
        );
        if (updatedDream.rowCount === 0) {
            throw { status: 404, message: 'Sueño no encontrado' };
        }
        
        const dreamId = updatedDream.rows[0].id_sueno;
        const emotionDelete = await client.query('DELETE FROM suenos_emociones WHERE id_sueno = $1', [dreamId]);
        if (emotionDelete.rowCount === 0) {
            throw { status: 404, message: 'Sueño no encontrado' };
        }
        const emotionQueries = emociones.map(emocion => {
            client.query('INSERT INTO suenos_emociones (id_sueno, id_emocion) VALUES ($1, $2)', [dreamId, emocion]);
        });
        await Promise.all(emotionQueries);

        await client.query('COMMIT')

        if (updatedDream.rows.length === 0) {
            throw { status: 404, message: 'Sueño no encontrado' };
        }

        res.status(200).json(updatedDream.rows[0]);
    } catch (error){
        await client.query('ROLLBACK');
        res.status(error.status || 500).json({
            message: error.message || 'Error actualizando sueño',
        });
    } finally {
         client.release();
    }
}

const deleteDream = async (req, res)=>{
    const { did } = req.params;
    const id_usuario = req.user.id;
    try {
        const deletedDream = await dbClient.query(
            'DELETE FROM suenos WHERE id_sueno = $1 AND id_usuario = $2 RETURNING *',
            [did, id_usuario]
        );
        if (deletedDream.rowCount === 0) {
            throw { status: 404, message: 'Sueño no encontrado' };
        }
        res.status(200).json({ message: 'Sueño eliminado exitosamente' });
    } catch (error){
        res.status(error.status || 500).json({
            message: error.message || 'Error eliminando sueño',
        });
    }
}

module.exports = {
    getAllDreams,
    getDreamById, 
    getPublicDreams, 
    createDream, 
    updateDream, 
    deleteDream
}