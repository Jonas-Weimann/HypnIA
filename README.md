# 🔮 HypnIA

**HypnIA** es un sitio web donde los usuarios pueden registrar sus sueños, recibir interpretaciones simbólicas potenciadas por inteligencia artificial y explorar los sueños compartidos por otras personas.

---

### Tabla de contenido

- [Funcionalidades principales](#funcionalidades-principales-en-desarrollo)
- [Estructura del proyecto](#estructura-en-desarrollo)
- [Base de datos](#base-de-datos-en-desarrollo)
- [Tecnologías y librerías](#tecnologías-y-librerías)
- [Créditos](#créditos)

---

### Funcionalidades principales (en desarrollo)

- 🧠 Interpretación emocional de sueños con IA
- 📜 Registro y visualización de sueños personales
- 🌍 Feed público con sueños de otros usuarios
- 🧩 Sistema de cartas simbólicas asociadas a emociones
- 🔒 Opciones de privacidad para cada sueño
- 👤 Gestión de usuarios (registro/login)
- 🐳 Deploy con Docker Compose
- 📦 CRUD completo para todas las entidades

---

### Estructura

`/frontend ` Sitio web desarrollado con HTML, CSS y JavaScript que consume la API del backend y muestra la interfaz al usuario.
`/backend ` API REST construida con Express que expone endpoints para realizar operaciones CRUD sobre sueños, emociones, cartas y usuarios.

---

### Base de datos

La base de datos del proyecto se compone de las siguientes tablas:

#### Sueños

| id_sueno | id_usuario | descripcion | fecha | publico | interpretacion |
| -------- | ---------- | ----------- | ----- | ------- | -------------- |
| SERIAL   | INTEGER    | TEXT        | DATE  | BOOLEAN | TEXT           |

#### Cartas

| id_carta | nombre       | descripcion | imagen | elemento    | polaridad   |
| -------- | ------------ | ----------- | ------ | ----------- | ----------- |
| SERIAL   | VARCHAR(100) | TEXT        | TEXT   | VARCHAR(50) | VARCHAR(10) |

#### Usuarios

| id_usuario | nombre       | email        | contrasena   | fecha_registro |
| ---------- | ------------ | ------------ | ------------ | -------------- |
| SERIAL     | VARCHAR(100) | VARCHAR(100) | VARCHAR(255) | DATE           |

#### Emociones

| id_emocion | nombre      | intensidad | polaridad   |
| ---------- | ----------- | ---------- | ----------- |
| SERIAL     | VARCHAR(50) | INTEGER    | VARCHAR(10) |

#### Sueños-Emociones

| id_sueno | id_emocion |
| -------- | ---------- |
| INTEGER  | INTEGER    |

#### Cartas-Emociones

| id_carta | id_emocion |
| -------- | ---------- |
| INTEGER  | INTEGER    |

---

### Tecnologías y librerías

- HTML
- CSS
- JavaScript
- Express
- JWT
- NodeJS
- Docker
- PostgreSQL
- DeepSeek API
- Dotenv

---

### Créditos

Desarrollado por:

- Jonás Weimann
- Daiana Chavez
- Azul Ninaja
- Avril Mamani
