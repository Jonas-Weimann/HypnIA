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
    modalUser.textContent = dream.usuario?.nombre;
    modalDate.textContent = new Date(dream.fecha).toLocaleDateString();
    modalDream.textContent = dream.descripcion;
    modalInterpretation.textContent = dream.interpretacion || "Sin interpretación aún.";

    // Asegurar que haya siempre 3 emociones
    const emociones = dream.emociones || [];
    while (emociones.length < 3) {
        emociones.push({ nombre: "Sin emoción", intensidad: "-", polaridad: "-" });
    }

    const emotionList = emociones.map(e =>
        `<li>${e.nombre} (intensidad: ${e.intensidad})</li>`
    ).join("");
    modalEmotions.innerHTML = emotionList;

    // Asegurar que haya siempre 3 cartas
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

    // Mostrar las 3 cartas
    modalCarta.innerHTML = cartas.map(carta => `
        <div class="carta-item" style="margin-bottom: 15px;">
        <h4>${carta.nombre}</h4>
        <p><em>${carta.elemento} - ${carta.polaridad}</em></p>
        <p>${carta.descripcion}</p>
        ${carta.imagen ? `<img src="assets/images/${carta.imagen}" alt="${carta.nombre}" style="width: 150px; border-radius: 10px;">` : ""}
        </div>
    `).join("");

    modal.classList.remove("hidden");
}

function renderDreams(dreams) {
    dreamGrid.innerHTML = "";

    dreams.forEach(dream => {
        const card = document.createElement("div");
        card.className = "dream-card";

        card.innerHTML = `
        <div class="tweet-header">
            <img src="assets/images/${dream.usuario?.imagenPerfil || 'perfil-default.webp'}" alt="Foto de perfil" class="profile-pic"> 
            <div class="user-info">
            <span class="user-name">${dream.usuario?.nombre}</span>
            <span class="user-handle">@${dream.usuario?.nombre.toLowerCase()}</span>
            </div>
        </div>

        <p>${dream.descripcion.slice(0, 100)}...</p>
        <em>${new Date(dream.fecha).toLocaleDateString()}</em>
        `;

        card.onclick = () => openModal(dream);
        dreamGrid.appendChild(card);
    });
}

closeModal.onclick = () => modal.classList.add("hidden");

searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();
    const filtered = allDreams.filter(d => d.descripcion.toLowerCase().includes(value));
    renderDreams(filtered);
});

fetchPublicDreams();