const token = localStorage.getItem("token");
const dreamGrid = document.getElementById("dreamGrid");
const searchInput = document.getElementById("searchInput");

const modalCarta = document.getElementById("modalCarta");
const modalEmotions = document.getElementById("modalEmotions");
const modal = document.getElementById("dreamModal");
const closeModal = document.getElementById("closeModal");
const modalUser = document.getElementById("modalUser");
const modalDate = document.getElementById("modalDate");
const modalDream = document.getElementById("modalDream");
const modalInterpretation = document.getElementById("modalInterpretation");

let allDreams = [];

async function fetchPublicDreams() {
    try {
        const response = await fetch("http://localhost:3000/api/suenos/publicos", {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        });

        const data = await response.json();
        allDreams = data;
        renderDreams(data);
    } catch (error) {
        console.error("Error al obtener sueños públicos:", error);
    }
}

function openModal(dream) {
    modalUser.textContent = dream.nombre_usuario;
    modalDate.textContent = new Date(dream.fecha).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    modalDream.textContent = dream.descripcion;
    modalInterpretation.textContent = dream.interpretacion;

    const emociones = dream.emociones || [];
    while (emociones.length < 3) {
        emociones.push({ nombre: "Sin emoción", intensidad: "-", polaridad: "-" });
    }

    const emotionList = emociones.map(e => {
        const imagenFondo = `assets/images/emociones/${e.intensidad}.webp`;
    
        return `
            <div class="emocion" style="background-image: url('${imagenFondo}'); backdrop-filter: blur(10px);">
                <div class="nombre-emocion"><h2>${e.nombre.toUpperCase()}</h2></div>
                <div class="informacion-emocion">
                    <p><u>INTENSIDAD</u>: ${e.intensidad}</p>
                    <p><u>POLARIDAD</u>: ${e.polaridad || '-'}</p>
                </div>
            </div>
        `;
    }).join("");
    modalEmotions.innerHTML = emotionList;
      
    
    const cartas = dream.cartas || [];
    while (cartas.length < 3) {
        cartas.push({
            nombre: "Carta vacía",
            elemento: "-",
            polaridad: "-",
            descripcion: "No hay carta asociada.",
            imagen: null,
        });
    }
    
    modalCarta.innerHTML = `
        ${cartas.map(carta => `
            <div class="carta">
                ${carta.imagen 
                    ? `<img id="imagen-carta" src="assets/images/cartas/${carta.imagen}" alt="${carta.nombre}">` 
                    : `<div id="imagen-carta" style="background-color:#222; width: 200px; height: 300px; border: 10px groove var(--color-lila); border-radius: 25px;"></div>`}
                <div class="nombre-carta"><h2>${carta.nombre}</h2></div>
                <div class="informacion-carta">
                    <p><u>ELEMENTO</u>: ${carta.elemento}</p>
                    <p><u>POLARIDAD</u>: ${carta.polaridad}</p>
                    <p style="border-top: 1px solid white">${carta.descripcion}</p>
                </div>
            </div>
        `).join("")}
    `;

    modal.classList.remove("hidden");
}

function renderDreams(dreams) {
    dreamGrid.innerHTML = "";

    dreams.forEach(dream => {
        const nombre = dream.usuario.nombre || "Usuario desconocido";
        const foto = dream.usuario.foto_perfil || "perfil-default.webp";

        const card = document.createElement("div");
        card.className = "dream-card";

        card.innerHTML = `
        <div class="tweet-header">
            <img src="assets/images/profile-img/${foto}" alt="Foto de perfil" class="profile-pic"> 
            <div class="user-info">
                <span class="user-name">${nombre}</span>
                <span class="user-handle">@${nombre.toLowerCase().replace(/\s+/g, "")}</span>
            </div>
        </div>

        <p>${dream.descripcion.slice(0, 100)}...</p>
        <em>${new Date(dream.fecha).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })}</em>
    `;

        card.onclick = () => openModal({ ...dream, nombre_usuario: nombre, foto_perfil: foto });
        dreamGrid.appendChild(card);
    });
}

closeModal.onclick = () => modal.classList.add("hidden");

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

searchInput.addEventListener("input", e => {
    const value = normalizeText(e.target.value);
    const filtered = allDreams.filter(d => 
        normalizeText(d.descripcion).includes(value)
    );
    renderDreams(filtered);
});

fetchPublicDreams();
mostrarMensajeExpirado();