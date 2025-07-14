
CREATE TABLE cartas (
    id_carta SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    imagen TEXT,
    elemento VARCHAR(50) NOT NULL,
    polaridad VARCHAR(10) NOT NULL
);

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro DATE NOT NULL
);

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

CREATE TABLE emociones (
    id_emocion SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    intensidad INT NOT NULL,
    polaridad VARCHAR(10)
);

CREATE TABLE suenos_emociones (
    id_sueno INT,
    id_emocion INT,
    PRIMARY KEY (id_sueno, id_emocion),
    FOREIGN KEY (id_sueno) REFERENCES suenos(id_sueno) ON DELETE CASCADE,
    FOREIGN KEY (id_emocion) REFERENCES emociones(id_emocion) ON DELETE CASCADE
);

CREATE TABLE cartas_emociones (
    id_carta INT,
    id_emocion INT,
    PRIMARY KEY (id_carta, id_emocion),
    FOREIGN KEY (id_carta) REFERENCES cartas(id_carta) ON DELETE CASCADE,
    FOREIGN KEY (id_emocion) REFERENCES emociones(id_emocion) ON DELETE CASCADE
);

CREATE TABLE suenos_cartas (
    id_sueno INT,
    id_carta INT,
    PRIMARY KEY (id_sueno, id_carta),
    FOREIGN KEY (id_sueno) REFERENCES suenos(id_sueno) ON DELETE CASCADE,
    FOREIGN KEY (id_carta) REFERENCES cartas(id_carta) ON DELETE CASCADE
)