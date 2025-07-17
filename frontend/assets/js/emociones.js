const emocionesURL = "http://localhost:3000/api/emociones";
const emocionesBusqueda = document.getElementById("emociones-busqueda");
const contenedorEmociones = document.getElementById("emociones-contenedor");
let emociones = [];

const obtenerEmociones = async () => {
	try {
		const respuesta = await fetch(emocionesURL);
		const data = await respuesta.json();
		emociones = data;
		mostrarEmociones(emociones);
	} catch (error) {
		console.error("Error obteniendo cartas:", error);
	}
};

const mostrarEmociones = (emocionesAMostrar) => {
	contenedorEmociones.innerHTML = "";

	if (emocionesAMostrar.length === 0) {
    	contenedorEmociones.innerHTML = "<p>No se encontraron emociones.</p>";
    	return;
  	}

	emocionesAMostrar.forEach(emocion => {
		const emocionDiv = document.createElement("div");
		emocionDiv.innerHTML = `
			<div class="emocion" style="background-image: url('assets/images/emociones/${emocion.intensidad}.webp'); backdrop-filter: blur(10px);">
				<div class="nombre-emocion"><h2>${emocion.nombre.toUpperCase()}</h2></div>
				<div class="informacion-emocion">
					<p><u>INTENSIDAD</u>: ${emocion.intensidad}</p>
					<p><u>POLARIDAD</u>: ${emocion.polaridad}</p>
				</div>
			</div>
		`;
		contenedorEmociones.appendChild(emocionDiv);
	});
};

const limpiarTexto = (texto) => { 
	return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
}

emocionesBusqueda.addEventListener("input", () => {
	const consulta = limpiarTexto(emocionesBusqueda.value).trim();
	if (!consulta) {
		mostrarEmociones(emociones);
		return;
	}
	const filtradas = emociones.filter(emocion =>
		limpiarTexto(emocion.nombre).includes(consulta) ||
		limpiarTexto(emocion.intensidad.toString()).includes(consulta) ||
		limpiarTexto(emocion.polaridad).includes(consulta)
	);

	mostrarEmociones(filtradas);
});

const modificarLinks = async () => {
	const token = localStorage.getItem("token");
	const sesionActiva = await verificarSesion();

	if (!token || !sesionActiva) return;

	const contenedor = document.querySelector(".cartas-emociones-links");
	if (!contenedor) return;

	contenedor.innerHTML = `
		<a href="cards.html">CARTAS</a>
        <a href="register-dream.html">REGISTRA TU SUEÑO</a>
        <a href="emotions.html">EMOCIONES</a>
	`;
}

obtenerEmociones();
modificarLinks();
mostrarMensajeExpirado();