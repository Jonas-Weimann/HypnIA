const dbClient = require('../config/dbClient.js');
const { esElementoValido, esEmocionValida, esPolaridadValida } = require('../utilidades/validacion.js');

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
        const carta = await dbClient.query('SELECT * FROM cartas WHERE id_carta = $1', [cid]);
        if (carta.rows.length === 0) {
            return res.status(404).json({ error: 'Carta no encontrada' });
        }
        res.status(200).json(carta.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo carta', error: error.message });
    }
}

/*
CREATE TABLE cartas (
    id_carta SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    imagen TEXT,
    elemento VARCHAR(50) NOT NULL,
    polaridad VARCHAR(10) NOT NULL
);
*/
/*
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{
    "nombre": "El falso despertar",
    "descripcion": "Una sensación de haber despertado dentro del propio sueño.",
    "imagen": "",
    "elemento": "aire",
    "polaridad": "neutra",
    "emociones": [1, 3, 7]
  }' \
  http://localhost:3000/api/cartas

*/
const createCarta = async (req, res) => {
    const { nombre, descripcion, imagen, elemento, polaridad, emociones } = req.body;
    try {
        if(!nombre || !descripcion || !elemento || !polaridad || !emociones) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }
        if (!esElementoValido(elemento)) {
            return res.status(400).json({ error: 'Elemento no válido' });
        }
        if (!esPolaridadValida(polaridad)) {
            return res.status(400).json({ error: 'Polaridad no válida' });
        }
        if (!esEmocionValida(emociones)) {
            return res.status(400).json({ error: 'Emociones no válidas' });
        }

        const nuevaCarta = await dbClient.query(
            'INSERT INTO cartas (nombre, descripcion, imagen, elemento, polaridad) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, descripcion, imagen, elemento, polaridad]
        );
        const idCarta = nuevaCarta.rows[0].id_carta;
        const insertarEmociones = emociones.map(emocion => 
            dbClient.query('INSERT INTO cartas_emociones (id_carta, id_emocion) VALUES ($1, $2)', [idCarta, emocion])
        );
        await Promise.all(insertarEmociones);
        
        res.status(201).json(nuevaCarta.rows[0]);
    } catch (error) {
         res.status(500).json({ message: 'Error creando carta', error: error.message });
    }
}

const updateCarta = async (req, res) => {
    const { cid } = req.params;
    const { nombre, descripcion, imagen, elemento, polaridad, emociones } = req.body;
    try {
        if(!nombre || !descripcion || !elemento || !polaridad || !emociones) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }
        if (!esElementoValido(elemento)) {
            return res.status(400).json({ error: 'Elemento no válido' });
        }
        if (!esPolaridadValida(polaridad)) {
            return res.status(400).json({ error: 'Polaridad no válida' });
        }
        if (!esEmocionValida(emociones)) {
            return res.status(400).json({ error: 'Emociones no válidas' });
        }
        const cartaActualizada = await dbClient.query(
            'UPDATE cartas SET nombre = $1, descripcion = $2, imagen = $3, elemento = $4, polaridad = $5 WHERE id_carta = $6 RETURNING *',
            [nombre, descripcion, imagen, elemento, polaridad, cid]
        );
        if (cartaActualizada.rows.length === 0) {
            return res.status(404).json({ error: 'Carta no encontrada' });
        }
        const idCarta = cartaActualizada.rows[0].id_carta;
        const insertarEmociones = emociones.map(emocion => 
            dbClient.query('INSERT INTO cartas_emociones (id_carta, id_emocion) VALUES ($1, $2)', [idCarta, emocion])
        );
        await Promise.all(insertarEmociones);
        res.status(200).json(cartaActualizada.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando carta', error: error.message });
    }
}

const deleteCarta = async (req, res) => {
    const { cid } = req.params;
    try {
        const cartaEliminada = await dbClient.query('DELETE FROM cartas WHERE id_carta = $1 RETURNING *', [cid]);
        if (cartaEliminada.rows.length === 0) {
            return res.status(404).json({ error: 'Carta no encontrada' });
        }
        res.status(200).json({ message: 'Carta eliminada con exito' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando carta', error: error.message });
    }
}

module.exports = {
    getAllCartas,
    getCartaById,
    createCarta,
    updateCarta,
    deleteCarta
};
