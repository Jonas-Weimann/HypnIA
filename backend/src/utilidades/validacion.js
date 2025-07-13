const esPolaridadValida = (polaridad) => {
    const validPolarities = ['positiva', 'negativa', 'neutra'];
    if (!polaridad || typeof polaridad !== 'string') {
        return false;
    }
    return validPolarities.includes(polaridad.toLowerCase());
};

const esElementoValido = (elemento) => {
    const validElements = ['fuego', 'agua', 'tierra', 'aire'];
    if (!elemento || typeof elemento !== 'string') {
        return false;
    }
    return validElements.includes(elemento.toLowerCase());
}

const esEmocionValida = (emociones) => {
    if (!Array.isArray(emociones) || emociones.length < 3) {
        return false;
    }
    return emociones.every(emocion => typeof emocion === 'number' && emocion > 0 && emocion <= 30);
};

export { esPolaridadValida, esElementoValido, esEmocionValida };