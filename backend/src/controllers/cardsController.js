const dbClient = require('../config/dbClient.js');
const { esElementoValido, esEmocionValida, esPolaridadValida } = require('../utils/validation.js');

const getAllCards = async (req, res)=>{
    try {
        const cards = await dbClient.query('SELECT * FROM cartas');
        res.status(200).json(cards.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo cartas', error: error.message });
    }
}

const getCardById = async (req, res) => {
    const { id } = req.params;
    try {
        const card = await dbClient.query('SELECT * FROM cartas WHERE id_carta = $1', [id]);
        if (card.rows.length === 0) {
            return res.status(404).json({ error: 'Carta no encontrada' });
        }
        res.status(200).json(card.rows[0]);
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
  --request PUT \
  --data '{
    "nombre": "El falso despertar",
    "descripcion": "Una sensación de haber despertado dentro del propio sueño.",
    "imagen": "",
    "elemento": "aire",
    "polaridad": "neutral",
    "emociones": [1, 3, 7]
  }' \
  http://localhost:3000/api/cards/127

*/
const createCard = async (req, res) => {
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

        const newCard = await dbClient.query(
            'INSERT INTO cartas (nombre, descripcion, imagen, elemento, polaridad) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, descripcion, imagen, elemento, polaridad]
        );
        const cardId = newCard.rows[0].id_carta;
        const emotionQueries = emociones.map(emocion => 
            dbClient.query('INSERT INTO cartas_emociones (id_carta, id_emocion) VALUES ($1, $2)', [cardId, emocion])
        );
        await Promise.all(emotionQueries);
        
        res.status(201).json(newCard.rows[0]);
    } catch (error) {
         res.status(500).json({ message: 'Error creando carta', error: error.message });
    }
}

const updateCard = async (req, res) => {
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
        const updatedCard = await dbClient.query(
            'UPDATE cartas SET nombre = $1, descripcion = $2, imagen = $3, elemento = $4, polaridad = $5 WHERE id_carta = $6 RETURNING *',
            [nombre, descripcion, imagen, elemento, polaridad, cid]
        );
        if (updatedCard.rows.length === 0) {
            return res.status(404).json({ error: 'Carta no encontrada' });
        }
        const cardId = updatedCard.rows[0].id_carta;
        const emotionQueries = emociones.map(emocion => 
            dbClient.query('INSERT INTO cartas_emociones (id_carta, id_emocion) VALUES ($1, $2)', [cardId, emocion])
        );
        await Promise.all(emotionQueries);
        res.status(200).json(updatedCard.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando carta', error: error.message });
    }
}

const deleteCard = async (req, res) => {
    const { cid } = req.params;
    try {
        const deletedCard = await dbClient.query('DELETE FROM cartas WHERE id_carta = $1 RETURNING *', [cid]);
        if (deletedCard.rows.length === 0) {
            return res.status(404).json({ error: 'Carta no encontrada' });
        }
        res.status(200).json({ message: 'Carta eliminada con exito' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando carta', error: error.message });
    }
}

module.exports = {
    getAllCards,
    getCardById,
    createCard,
    updateCard,
    deleteCard
};
